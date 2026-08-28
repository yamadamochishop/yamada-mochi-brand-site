import { products, type Product } from '../data/catalog.ts';
import { recipes } from '../data/recipes.ts';
import type { RecipeRecord } from '../types/content-model.ts';

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

/** 商品詳細ページに置くレシピ。商品固有のレシピを先に、基本の焼き方を後に。 */
export function getRecipesForProduct(productSlug: string): RecipeRecord[] {
  const matched = publishedRecipes.filter((recipe) =>
    recipe.relatedProductIds.includes(productSlug),
  );
  const specific = matched.filter((recipe) => recipe.id !== BASE_TECHNIQUE_RECIPE_ID);
  const base = matched.filter((recipe) => recipe.id === BASE_TECHNIQUE_RECIPE_ID);

  return [...specific, ...base].slice(0, MAX_RECIPES_PER_PRODUCT);
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
