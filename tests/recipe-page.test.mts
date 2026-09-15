import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FEATURED_RECIPE_COUNT,
  filterRecipeList,
  getComparablePopularitySnapshot,
  getFeaturedRecipes,
  getRecipeFilterProducts,
  getRecipeFilterTags,
  getRecipeInventory,
  getRecipeProductLabels,
  publishedRecipes,
  recipeImageNotice,
  recipeSortOptions,
  sortRecipes,
  toRecipeListItem,
} from '../lib/recipe-page.ts';
import { recipeItemListJsonLd, recipeJsonLd } from '../lib/seo.ts';
import type { RecipeRecord } from '../types/content-model.ts';

function fixture(overrides: Partial<RecipeRecord>): RecipeRecord {
  return {
    id: 'sample',
    slug: 'sample',
    title: '検証用',
    description: '検証用の説明',
    category: 'mochi',
    ingredients: [{ name: 'プレーン', amount: '1枚' }],
    steps: [{ position: 1, instruction: '焼きます。' }],
    relatedProductIds: ['plain'],
    status: 'published',
    ...overrides,
  };
}

const popularitySnapshot = {
  method: 'search_console_clicks' as const,
  version: 'v1',
  periodStart: '2026-08-18',
  periodEnd: '2026-09-14',
  measuredAt: '2026-09-15',
};

test('sortRecipes: popular sorts only a comparable complete snapshot', () => {
  const a = fixture({
    id: 'a',
    slug: 'a',
    popularity: { ...popularitySnapshot, searchConsoleClicks: 2 },
  });
  const b = fixture({
    id: 'b',
    slug: 'b',
    popularity: { ...popularitySnapshot, searchConsoleClicks: 5 },
  });
  const c = fixture({
    id: 'c',
    slug: 'c',
    popularity: { ...popularitySnapshot, searchConsoleClicks: 20 },
  });

  assert.deepEqual(
    sortRecipes([a, b, c], 'popular').map((r) => r.slug),
    ['c', 'b', 'a'],
  );
  assert.deepEqual(
    sortRecipes([a, b, c], 'default').map((r) => r.slug),
    ['a', 'b', 'c'],
  );

  const mixedSnapshot = [
    a,
    {
      ...b,
      popularity: { ...popularitySnapshot, periodEnd: '2026-09-15', searchConsoleClicks: 5 },
    },
  ];
  assert.equal(getComparablePopularitySnapshot(mixedSnapshot), null);
  assert.deepEqual(
    sortRecipes(mixedSnapshot, 'popular').map((recipe) => recipe.slug),
    ['a', 'b'],
  );

  const mixedMeasuredAt = [
    a,
    {
      ...b,
      popularity: { ...popularitySnapshot, measuredAt: '2026-09-16', searchConsoleClicks: 5 },
    },
  ];
  assert.equal(getComparablePopularitySnapshot(mixedMeasuredAt), null);

  const mixedBasis = [a, { ...b, popularity: { ...popularitySnapshot, score: 8 } }];
  assert.equal(getComparablePopularitySnapshot(mixedBasis), null);
});

test('sortRecipes: newest sorts by publishedAt descending with unset dates last', () => {
  const old = fixture({ id: 'old', slug: 'old', publishedAt: '2026-08-28' });
  const fresh = fixture({ id: 'fresh', slug: 'fresh', publishedAt: '2026-09-11' });
  const undated = fixture({ id: 'undated', slug: 'undated' });
  assert.deepEqual(
    sortRecipes([undated, old, fresh], 'newest').map((r) => r.slug),
    ['fresh', 'old', 'undated'],
  );
});

test('getFeaturedRecipes: returns only Human-selected featured recipes', () => {
  assert.deepEqual(getFeaturedRecipes(), []);

  const selected = [
    fixture({ id: 'first', slug: 'first', featured: true }),
    fixture({ id: 'second', slug: 'second' }),
    fixture({ id: 'third', slug: 'third', featured: true }),
  ];
  assert.deepEqual(
    getFeaturedRecipes(FEATURED_RECIPE_COUNT, selected).map((recipe) => recipe.slug),
    ['first', 'third'],
  );
});

test('toRecipeListItem: carries only card fields and a normalized search text', () => {
  const item = toRecipeListItem(publishedRecipes.find((r) => r.slug === 'isobeyaki')!);
  assert.equal(item.slug, 'isobeyaki');
  assert.deepEqual(item.productSlugs, ['plain']);
  assert.deepEqual(item.productLabels, ['プレーン']);
  assert.equal(item.mainImage, undefined);
  assert.match(item.searchText, /磯辺焼き/);
  assert.match(item.searchText, /焼き海苔/);
  assert.match(item.searchText, /プレーン/);
  assert.equal('steps' in item, false);

  const yakikata = toRecipeListItem(publishedRecipes.find((r) => r.slug === 'mochi-yakikata')!);
  assert.deepEqual(yakikata.productLabels, ['すべてのお餅']);
  assert.deepEqual(getRecipeProductLabels(publishedRecipes[0]), ['すべてのお餅']);
});

test('recipe image notice: generated images are marked and original photos are not', () => {
  const generated = {
    src: '/images/recipes/generated.webp',
    alt: '生成された盛り付けイメージ',
    role: 'primary' as const,
    sourceType: 'generated' as const,
  };
  const original = { ...generated, sourceType: 'original_photo' as const };
  assert.equal(recipeImageNotice(generated), '盛り付けイメージ');
  assert.equal(recipeImageNotice(original), undefined);
  assert.equal(
    toRecipeListItem(fixture({ mainImage: generated })).mainImage?.imageNotice,
    '盛り付けイメージ',
  );
});

test('filterRecipeList: query, product, and sort compose and normalize width/case', () => {
  const items = publishedRecipes.map(toRecipeListItem);

  assert.deepEqual(
    filterRecipeList(items, { query: 'チーズ' }).map((i) => i.slug),
    ['ebi-mochi-cheese-pizza', 'mochi-pizza'],
  );
  // 半角カナ・空白入りでも同じ結果。
  assert.deepEqual(
    filterRecipeList(items, { query: 'ﾁｰｽﾞ ' }).map((i) => i.slug),
    ['ebi-mochi-cheese-pizza', 'mochi-pizza'],
  );
  assert.deepEqual(
    filterRecipeList(items, { query: 'チーズ', productSlug: 'ebi' }).map((i) => i.slug),
    ['ebi-mochi-cheese-pizza'],
  );
  // 商品絞り込みは「使うお餅」に基づく。全商品共通の焼き方はどの商品でも出る。
  const kombu = filterRecipeList(items, { productSlug: 'kombu' }).map((i) => i.slug);
  assert.deepEqual(kombu, ['mochi-yakikata', 'kombu-mochi-ozoni-fu']);
  // タグでも引ける。
  assert.deepEqual(
    filterRecipeList(items, { tag: '電子レンジ' }).map((i) => i.slug),
    ['mochi-yakikata', 'dashi-butter-mochi'],
  );
  assert.deepEqual(filterRecipeList(items, { query: '存在しない語' }), []);
  // 並び替えは絞り込み後に効く。
  const newest = filterRecipeList(items, { sort: 'newest' });
  assert.equal(newest[0].publishedAt, '2026-09-11');
  assert.equal(newest[newest.length - 1].publishedAt, '2026-08-28');
  assert.equal(newest.length, items.length);
});

test('filter options: products with recipes and unique tags in appearance order', () => {
  assert.deepEqual(
    getRecipeFilterProducts().map((p) => p.slug),
    ['plain', 'yomogi', 'sansyokumame', 'kombu', 'tamari', 'ebi'],
  );
  const tags = getRecipeFilterTags();
  assert.equal(new Set(tags).size, tags.length);
  assert.equal(tags[0], 'トースター');
  assert.deepEqual(
    recipeSortOptions.map((option) => option.value),
    ['default', 'newest'],
  );
});

test('getRecipeInventory: one row per recipe with image and popularity status', () => {
  const rows = getRecipeInventory();
  assert.equal(rows.length, 13);
  const imageRecipeIds = new Set([
    'garlic-butter-mochi',
    'mentaiko-mayo-mochi',
    'dashi-butter-mochi',
    'mochi-pizza',
    'mochi-ebi-ajillo',
  ]);
  for (const row of rows) {
    assert.equal(row.hasImage, imageRecipeIds.has(row.slug));
    assert.equal(row.featured, false);
    assert.equal(row.popularityScore, undefined);
    assert.ok(row.tags.length > 0);
  }
});

test('recipeItemListJsonLd: every list item carries an absolute recipe URL', () => {
  const list = recipeItemListJsonLd(publishedRecipes);
  assert.equal(list.itemListElement.length, publishedRecipes.length);
  for (const [index, entry] of list.itemListElement.entries()) {
    assert.equal(entry.position, index + 1);
    assert.match(entry.url, /^https:\/\/www\.yamadamochi\.com\/recipes\/[a-z0-9-]+$/);
  }
});

test('recipeJsonLd: optional Human-confirmed fields appear only when set', () => {
  const image = {
    src: '/images/recipes/sample.webp',
    alt: '検証用写真',
    role: 'primary' as const,
    sourceType: 'original_photo' as const,
  };
  const minimal = recipeJsonLd(
    fixture({ mainImage: image, tags: ['トースター'], publishedAt: '2026-09-15' }),
  );
  assert.ok(minimal);
  assert.equal(minimal.keywords, 'トースター');
  assert.equal(minimal.datePublished, '2026-09-15');
  assert.equal('totalTime' in minimal, false);
  assert.equal('recipeYield' in minimal, false);

  const confirmed = recipeJsonLd(
    fixture({ mainImage: image, cookingTimeMinutes: 75, servings: '2人分' }),
  );
  assert.ok(confirmed);
  assert.equal(confirmed.totalTime, 'PT1H15M');
  assert.equal(confirmed.recipeYield, '2人分');
  assert.equal(
    recipeJsonLd(fixture({ cookingTimeMinutes: 5, mainImage: image }))?.totalTime,
    'PT5M',
  );

  // 画像が無ければ従来どおり出力しない。
  assert.equal(recipeJsonLd(fixture({ cookingTimeMinutes: 5 })), null);
});
