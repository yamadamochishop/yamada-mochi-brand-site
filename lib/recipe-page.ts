import { products, type Product } from '../data/catalog.ts';
import { recipes } from '../data/recipes.ts';
import type { RecipeDifficulty, RecipePopularity, RecipeRecord } from '../types/content-model.ts';

/**
 * Recipe Hubの表示モデル。
 *
 * 公開対象は `status: 'published'` のレシピだけで、下書きはルート・一覧・
 * サイトマップのいずれにも現れない。商品との関係は `relatedProductIds` から
 * 導出し、レシピ側と商品側に同じ対応表を二重管理しない。
 */

/** 全商品に共通する基本レシピ。商品ページでは各商品固有のレシピの後ろに置く。 */
const BASE_TECHNIQUE_RECIPE_ID = 'mochi-yakikata';

/** 1商品ページに載せるレシピリンクの上限。購入導線を圧迫しないための上限。 */
const MAX_RECIPES_PER_PRODUCT = 2;

/** レシピ詳細で紹介する関連レシピの件数。 */
const MAX_RELATED_RECIPES = 3;

/** 一覧の「注目レシピ」に出す件数。 */
export const FEATURED_RECIPE_COUNT = 3;

export const publishedRecipes: RecipeRecord[] = recipes.filter(
  (recipe) => recipe.status === 'published',
);

export const recipeIndexPaths = publishedRecipes.map((recipe) => `/recipes/${recipe.slug}`);

export function getRecipe(slug: string): RecipeRecord | undefined {
  return publishedRecipes.find((recipe) => recipe.slug === slug);
}

/**
 * レシピが参照している商品。カタログに存在しないIDは
 * `check:content-model` で検出されるため、ここでは静かに落とす。
 */
export function getRecipeProducts(recipe: RecipeRecord): Product[] {
  return recipe.relatedProductIds
    .map((productId) => products.find((product) => product.slug === productId))
    .filter((product): product is Product => Boolean(product));
}

/** 全商品に共通するレシピか。CTAを商品個別ではなく商品一覧へ向ける判定に使う。 */
export function appliesToEveryProduct(recipe: RecipeRecord): boolean {
  return getRecipeProducts(recipe).length === products.length;
}

/**
 * 商品詳細ページに置くレシピ。商品固有のレシピを先に、基本の焼き方を後に。
 * 商品固有のレシピが増えても基本の焼き方の枠は残す（上限内で固有レシピ側を切り詰める）。
 */
export function getRecipesForProduct(productSlug: string): RecipeRecord[] {
  const matched = publishedRecipes.filter((recipe) =>
    recipe.relatedProductIds.includes(productSlug),
  );
  const specific = matched.filter((recipe) => recipe.id !== BASE_TECHNIQUE_RECIPE_ID);
  const base = matched.filter((recipe) => recipe.id === BASE_TECHNIQUE_RECIPE_ID);

  return [...specific.slice(0, MAX_RECIPES_PER_PRODUCT - base.length), ...base];
}

/** 同じ商品を使うレシピを優先し、足りなければ他のレシピで補う。 */
export function getRelatedRecipes(recipe: RecipeRecord): RecipeRecord[] {
  const others = publishedRecipes.filter((candidate) => candidate.id !== recipe.id);
  const sharesProduct = others.filter((candidate) =>
    candidate.relatedProductIds.some((productId) => recipe.relatedProductIds.includes(productId)),
  );
  const rest = others.filter((candidate) => !sharesProduct.includes(candidate));

  return [...sharesProduct, ...rest].slice(0, MAX_RELATED_RECIPES);
}

export type ProductRecipeGroup = {
  product: Product;
  recipes: RecipeRecord[];
};

/** Recipe Hubの「お餅から探す」セクション。レシピがある商品だけを並べる。 */
export function getProductRecipeGroups(): ProductRecipeGroup[] {
  return products
    .map((product) => ({ product, recipes: getRecipesForProduct(product.slug) }))
    .filter((group) => group.recipes.length > 0);
}

// ---------------------------------------------------------------------------
// 表示ラベル
// ---------------------------------------------------------------------------

export const difficultyLabels: Record<RecipeDifficulty, string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  hard: 'じっくり',
};

/**
 * カードに載せる商品名。全商品共通レシピは商品名を並べず「すべてのお餅」とする。
 */
export function getRecipeProductLabels(recipe: RecipeRecord): string[] {
  if (appliesToEveryProduct(recipe)) return ['すべてのお餅'];
  return getRecipeProducts(recipe).map((product) => product.cardName);
}

// ---------------------------------------------------------------------------
// 並び替え・注目レシピ・検索
//
// 人気指標（`popularity`）は画像制作・SEO改善の内部優先度に使う。
// Public UIでは未使用。比較する場合も、同じsnapshotだけに限定する。
// ---------------------------------------------------------------------------

export type RecipeSortKey = 'default' | 'popular' | 'newest';
export type PublicRecipeSortKey = Exclude<RecipeSortKey, 'popular'>;

export const recipeSortOptions: { value: PublicRecipeSortKey; label: string }[] = [
  { value: 'default', label: 'おすすめ順' },
  { value: 'newest', label: '新着順' },
];

export type ComparablePopularitySnapshot = {
  key: string;
  basis: 'score' | 'searchConsoleClicks';
};

function popularitySnapshotKey(popularity: RecipePopularity): string {
  return [
    popularity.method,
    popularity.version,
    popularity.periodStart,
    popularity.periodEnd,
    popularity.measuredAt,
  ].join(':');
}

/**
 * 全件が同一snapshotで同じ基準値を持つ場合だけ、人気値を比較できる。
 * scoreとraw clicksを混在させず、部分的・異期間の転記をランキングに使わない。
 */
export function getComparablePopularitySnapshot(
  list: RecipeRecord[],
): ComparablePopularitySnapshot | null {
  if (list.length === 0 || list.some((recipe) => !recipe.popularity)) return null;

  const popularities = list.map((recipe) => recipe.popularity!);
  const snapshotKey = popularitySnapshotKey(popularities[0]);
  if (popularities.some((popularity) => popularitySnapshotKey(popularity) !== snapshotKey)) {
    return null;
  }
  if (popularities.every((popularity) => popularity.score !== undefined)) {
    return { key: snapshotKey, basis: 'score' };
  }
  if (
    popularities.every((popularity) => popularity.score === undefined) &&
    popularities.every((popularity) => popularity.searchConsoleClicks !== undefined)
  ) {
    return { key: snapshotKey, basis: 'searchConsoleClicks' };
  }
  return null;
}

function popularityScore(
  recipe: RecipeRecord,
  basis: ComparablePopularitySnapshot['basis'],
): number {
  if (basis === 'score') return recipe.popularity!.score!;
  return recipe.popularity!.searchConsoleClicks!;
}

/**
 * 並び替え。`sort` は安定ソートなので、同点はデータ順のまま残る。
 * - popular: 比較可能な同一snapshotがある場合だけ score または clicks 降順。
 * - newest: publishedAt 降順。未設定は末尾。
 * - default: データ順（編集順）。
 */
export function sortRecipes(list: RecipeRecord[], key: RecipeSortKey): RecipeRecord[] {
  const copy = [...list];
  if (key === 'popular') {
    const snapshot = getComparablePopularitySnapshot(copy);
    if (!snapshot) return copy;
    return copy.sort(
      (a, b) => popularityScore(b, snapshot.basis) - popularityScore(a, snapshot.basis),
    );
  }
  if (key === 'newest') {
    return copy.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
  }
  return copy;
}

/**
 * 一覧の「注目レシピ」。
 * Humanが `featured: true` と明示したレシピだけを表示する。
 * 仮のデータ順や人気値で補完しない。
 */
export function getFeaturedRecipes(
  limit = FEATURED_RECIPE_COUNT,
  list: RecipeRecord[] = publishedRecipes,
): RecipeRecord[] {
  return list.filter((recipe) => recipe.featured).slice(0, limit);
}

/** 検索・絞り込みで使う商品の選択肢。レシピが参照している商品だけ。 */
export function getRecipeFilterProducts(): { slug: string; label: string }[] {
  return products
    .filter((product) => publishedRecipes.some((r) => r.relatedProductIds.includes(product.slug)))
    .map((product) => ({ slug: product.slug, label: product.cardName }));
}

/** 検索・絞り込みで使うタグの選択肢。出現順で重複を除く。 */
export function getRecipeFilterTags(): string[] {
  const tags: string[] = [];
  for (const recipe of publishedRecipes) {
    for (const tag of recipe.tags ?? []) {
      if (!tags.includes(tag)) tags.push(tag);
    }
  }
  return tags;
}

/**
 * クライアント側の検索・絞り込みに渡す最小限のレシピ情報。
 * 本文（手順など）は渡さず、一覧カードの表示と検索照合に必要な項目だけを持つ。
 */
export type RecipeListItem = {
  slug: string;
  title: string;
  description: string;
  productSlugs: string[];
  productLabels: string[];
  tags: string[];
  cookingTimeMinutes?: number;
  difficulty?: RecipeDifficulty;
  publishedAt?: string;
  mainImage?: { src: string; alt: string; imageNotice?: string };
  /** 検索照合用。タイトル・説明・材料名・タグ・商品名を正規化して連結したもの。 */
  searchText: string;
};

/** 検索照合の正規化。全角・半角、大小文字、空白の違いを吸収する。 */
export function normalizeSearchText(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/\s+/g, '');
}

export const generatedRecipeImageNotice = '盛り付けイメージ';

/** AI生成画像には、実写と誤認させないための注記を返す。 */
export function recipeImageNotice(image: RecipeRecord['mainImage']): string | undefined {
  return image?.sourceType === 'generated' ? generatedRecipeImageNotice : undefined;
}

export function toRecipeListItem(recipe: RecipeRecord): RecipeListItem {
  const recipeProducts = getRecipeProducts(recipe);
  const productLabels = getRecipeProductLabels(recipe);
  const tags = recipe.tags ?? [];
  const imageNotice = recipeImageNotice(recipe.mainImage);
  const searchSource = [
    recipe.title,
    recipe.description,
    ...recipe.ingredients.map((ingredient) => ingredient.name),
    ...tags,
    ...recipeProducts.map((product) => product.name),
    ...recipeProducts.map((product) => product.cardName),
  ].join(' ');

  return {
    slug: recipe.slug,
    title: recipe.title,
    description: recipe.description,
    productSlugs: recipeProducts.map((product) => product.slug),
    productLabels,
    tags,
    cookingTimeMinutes: recipe.cookingTimeMinutes,
    difficulty: recipe.difficulty,
    publishedAt: recipe.publishedAt,
    ...(recipe.mainImage
      ? {
          mainImage: {
            src: recipe.mainImage.src,
            alt: recipe.mainImage.alt,
            ...(imageNotice ? { imageNotice } : {}),
          },
        }
      : {}),
    searchText: normalizeSearchText(searchSource),
  };
}

export type RecipeFilter = {
  query?: string;
  productSlug?: string;
  tag?: string;
  sort?: PublicRecipeSortKey;
};

/**
 * 一覧の検索・絞り込み・並び替え。サーバー・クライアントの両方から同じ関数を使い、
 * 初期表示（SSR）と操作後の結果がずれないようにする。
 */
export function filterRecipeList(items: RecipeListItem[], filter: RecipeFilter): RecipeListItem[] {
  const query = normalizeSearchText(filter.query ?? '');
  const matched = items.filter((item) => {
    if (query && !item.searchText.includes(query)) return false;
    if (filter.productSlug && !item.productSlugs.includes(filter.productSlug)) return false;
    if (filter.tag && !item.tags.includes(filter.tag)) return false;
    return true;
  });

  const sort = filter.sort ?? 'default';
  if (sort === 'newest') {
    return [...matched].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
  }
  return matched;
}

// ---------------------------------------------------------------------------
// 棚卸し
// ---------------------------------------------------------------------------

export type RecipeInventoryRow = {
  slug: string;
  title: string;
  description: string;
  ingredients: string[];
  stepCount: number;
  cookingTimeMinutes?: number;
  difficulty?: RecipeDifficulty;
  servings?: string;
  relatedProductIds: string[];
  category: RecipeRecord['category'];
  tags: string[];
  hasImage: boolean;
  featured: boolean;
  popularityScore?: number;
  publishedAt?: string;
  status: RecipeRecord['status'];
};

/** 全レシピ（下書き含む）の棚卸し行。`scripts/recipe-inventory.mjs` がMarkdown化する。 */
export function getRecipeInventory(): RecipeInventoryRow[] {
  return recipes.map((recipe) => ({
    slug: recipe.slug,
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients.map((ingredient) => ingredient.name),
    stepCount: recipe.steps.length,
    cookingTimeMinutes: recipe.cookingTimeMinutes,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    relatedProductIds: recipe.relatedProductIds,
    category: recipe.category,
    tags: recipe.tags ?? [],
    hasImage: Boolean(recipe.mainImage),
    featured: Boolean(recipe.featured),
    popularityScore: recipe.popularity?.score,
    publishedAt: recipe.publishedAt,
    status: recipe.status,
  }));
}
