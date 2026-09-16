import assert from 'node:assert/strict';
import test from 'node:test';
import { catalogSets, products } from '../data/catalog.ts';
import {
  compatibleGiftSets,
  compatibleProducts,
  contentModel,
  giftSetRecords,
  productRecords,
} from '../data/content-model.ts';
import { productJsonLd, recipeJsonLd } from '../lib/seo.ts';
import { validateContentModel } from '../lib/content-model/validate.ts';
import type { RecipeRecord, SeasonalProductRecord } from '../types/content-model.ts';

const expectedProducts = [
  ['plain', 440, '440円（税込）', 'https://yamadamochi.thebase.in/items/42083183'],
  ['yomogi', 440, '440円（税込）', 'https://yamadamochi.thebase.in/items/42083333'],
  ['sansyokumame', 440, '440円（税込）', 'https://yamadamochi.thebase.in/items/42083299'],
  ['kombu', 440, '440円（税込）', 'https://yamadamochi.thebase.in/items/42083403'],
  ['tamari', 440, '440円（税込）', 'https://yamadamochi.thebase.in/items/42083448'],
  ['ebi', 440, '440円（税込）', 'https://yamadamochi.thebase.in/items/42083499'],
] as const;

const expectedGiftSets = [
  ['six-flavor-gift', 2980, '2,980円（税込）', 'https://yamadamochi.thebase.in/items/149543143'],
  ['choice-six-set', 2980, '2,980円（税込）', 'https://yamadamochi.thebase.in/items/149543351'],
  ['twelve-set', 5960, '5,960円（税込）', 'https://yamadamochi.thebase.in/items/149544078'],
] as const;

function cloneContentModel() {
  return structuredClone(contentModel);
}

function seasonalFixture(): SeasonalProductRecord {
  return {
    id: 'seasonal-sample',
    slug: 'seasonal-sample',
    name: '検証用季節商品',
    category: 'confectionery',
    seasonality: 'seasonal',
    salesPeriod: {
      display: '8月〜9月中旬',
      startMonth: 8,
      endMonth: 9,
    },
    availabilityStatus: 'upcoming',
    salesLocationIds: ['jinya-morning-market'],
    commerce: { status: 'unavailable', offers: [] },
    images: [],
    status: 'draft',
  };
}

function recipeFixture(): RecipeRecord {
  return {
    id: 'recipe-sample',
    slug: 'recipe-sample',
    title: '検証用レシピ',
    description: 'YM-007で利用するレシピモデルの検証用データです。',
    category: 'mochi',
    ingredients: [{ name: 'プレーン', amount: '1枚' }],
    steps: [{ position: 1, instruction: 'お餅を焼きます。' }],
    servings: '1人分',
    relatedProductIds: ['plain'],
    status: 'draft',
  };
}

test('Product: six existing products retain slugs, prices, and BASE URLs', () => {
  assert.equal(productRecords.length, 6);
  assert.deepEqual(
    productRecords.map((product) => [
      product.slug,
      product.price.amount,
      product.price.display,
      product.commerce.url,
    ]),
    expectedProducts,
  );
  assert.equal(validateContentModel(contentModel).length, 0);
});

test('Gift: three existing gift sets retain prices and resolve included products', () => {
  assert.equal(giftSetRecords.length, 3);
  assert.deepEqual(
    giftSetRecords.map((giftSet) => [
      giftSet.slug,
      giftSet.price.amount,
      giftSet.price.display,
      giftSet.commerce.url,
    ]),
    expectedGiftSets,
  );

  const productIds = new Set(productRecords.map((product) => product.id));
  for (const giftSet of giftSetRecords) {
    assert.equal(giftSet.includedProducts.length, 6);
    for (const item of giftSet.includedProducts) assert.equal(productIds.has(item.productId), true);
  }
});

test('Seasonal: sales period remains independent from manually managed availability', () => {
  const upcoming = cloneContentModel();
  upcoming.seasonalProducts.push(seasonalFixture());

  const soldOut = cloneContentModel();
  soldOut.seasonalProducts.push({ ...seasonalFixture(), availabilityStatus: 'sold_out' });

  assert.equal(validateContentModel(upcoming).length, 0);
  assert.equal(validateContentModel(soldOut).length, 0);
  assert.deepEqual(
    upcoming.seasonalProducts[0].salesPeriod,
    soldOut.seasonalProducts[0].salesPeriod,
  );
});

test('Seasonal: valid, cross-year, partial, and display-only sales periods pass', () => {
  const periods = [
    { display: '8月〜9月中旬', startMonth: 8, endMonth: 9 },
    { display: '11月〜2月', startMonth: 11, endMonth: 2 },
    { display: '販売時期は店頭でご確認ください' },
    { display: '8月〜', startMonth: 8 },
  ];

  for (const salesPeriod of periods) {
    const candidate = cloneContentModel();
    candidate.seasonalProducts.push({ ...seasonalFixture(), salesPeriod });
    assert.deepEqual(validateContentModel(candidate), []);
  }
});

test('Seasonal: out-of-range month and day boundaries fail validation', () => {
  const invalidPeriods = [
    [{ display: 'invalid', startMonth: 0 }, /startMonth/],
    [{ display: 'invalid', startMonth: 13 }, /startMonth/],
    [{ display: 'invalid', endMonth: 0 }, /endMonth/],
    [{ display: 'invalid', endMonth: 14 }, /endMonth/],
    [{ display: 'invalid', startDay: 0 }, /startDay/],
    [{ display: 'invalid', startDay: 40 }, /startDay/],
    [{ display: 'invalid', endDay: -5 }, /endDay/],
    [{ display: 'invalid', endDay: 32 }, /endDay/],
  ] as const;

  for (const [salesPeriod, expectedError] of invalidPeriods) {
    const candidate = cloneContentModel();
    candidate.seasonalProducts.push({ ...seasonalFixture(), salesPeriod });
    assert.match(validateContentModel(candidate).join('\n'), expectedError);
  }
});

test('Recipe: related product IDs resolve', () => {
  const candidate = cloneContentModel();
  candidate.recipes.push(recipeFixture());
  assert.equal(validateContentModel(candidate).length, 0);
});

test('Recipe: an unknown related product ID fails validation', () => {
  const candidate = cloneContentModel();
  candidate.recipes.push({ ...recipeFixture(), relatedProductIds: ['missing-product'] });
  assert.match(validateContentModel(candidate).join('\n'), /unknown relatedProductId/);
});

test('Recipe: required content fields fail validation when empty', () => {
  const cases: [Partial<RecipeRecord>, RegExp][] = [
    [{ description: '   ' }, /missing description/],
    [{ ingredients: [] }, /requires at least one ingredient/],
    [{ ingredients: [{ name: '   ', amount: '1枚' }] }, /missing ingredient name/],
    [{ ingredients: [{ name: 'プレーン', amount: '  ' }] }, /missing amount for "プレーン"/],
    [{ ingredients: [{ name: 'プレーン', amount: '' }] }, /missing amount for "プレーン"/],
    [
      {
        ingredients: [
          { name: 'プレーン', amount: '1枚' },
          { name: 'プレーン', amount: '2枚' },
        ],
      },
      /duplicate ingredient "プレーン"/,
    ],
    [{ steps: [] }, /requires at least one step/],
    [{ steps: [{ position: 1, instruction: '  ' }] }, /step 1 has no instruction/],
    [{ relatedProductIds: [] }, /requires at least one relatedProductId/],
    [{ category: 'dessert' as RecipeRecord['category'] }, /invalid category "dessert"/],
  ];

  for (const [override, expectedError] of cases) {
    const candidate = cloneContentModel();
    candidate.recipes.push({ ...recipeFixture(), ...override });
    assert.match(validateContentModel(candidate).join('\n'), expectedError);
  }
});

test('Recipe: step positions must be a 1-based sequence matching the array order', () => {
  const outOfOrder = cloneContentModel();
  outOfOrder.recipes.push({
    ...recipeFixture(),
    steps: [
      { position: 2, instruction: 'お餅を焼きます。' },
      { position: 1, instruction: '海苔で包みます。' },
    ],
  });
  assert.match(validateContentModel(outOfOrder).join('\n'), /step position "2" must be 1/);

  const gap = cloneContentModel();
  gap.recipes.push({
    ...recipeFixture(),
    steps: [
      { position: 1, instruction: 'お餅を焼きます。' },
      { position: 3, instruction: '海苔で包みます。' },
    ],
  });
  assert.match(validateContentModel(gap).join('\n'), /step position "3" must be 2/);
});

test('Recipe: a registered image without alt text fails validation', () => {
  const mainImage = cloneContentModel();
  mainImage.recipes.push({
    ...recipeFixture(),
    mainImage: {
      src: '/images/recipe-sample.webp',
      alt: '',
      role: 'primary',
      sourceType: 'original_photo',
    },
  });
  assert.match(validateContentModel(mainImage).join('\n'), /missing image alt text/);

  const stepImage = cloneContentModel();
  stepImage.recipes.push({
    ...recipeFixture(),
    steps: [
      {
        position: 1,
        instruction: 'お餅を焼きます。',
        image: {
          src: '/images/recipe-sample-step-1.webp',
          alt: '  ',
          role: 'recipe_step',
          sourceType: 'original_photo',
        },
      },
    ],
  });
  assert.match(validateContentModel(stepImage).join('\n'), /step 1: missing image alt text/);
});

test('Recipe: canonicalPath must match the published route', () => {
  const mismatch = cloneContentModel();
  mismatch.recipes.push({
    ...recipeFixture(),
    seo: {
      title: '検証用レシピ',
      description: '検証用レシピの説明です。',
      canonicalPath: '/recipes/another-slug',
    },
  });
  assert.match(
    validateContentModel(mismatch).join('\n'),
    /canonicalPath must be "\/recipes\/recipe-sample"/,
  );

  const matching = cloneContentModel();
  matching.recipes.push({
    ...recipeFixture(),
    seo: {
      title: '検証用レシピ',
      description: '検証用レシピの説明です。',
      canonicalPath: '/recipes/recipe-sample',
    },
  });
  assert.equal(validateContentModel(matching).length, 0);
});

test('Recipe: cookingTimeMinutes must be a positive integer when present', () => {
  for (const cookingTimeMinutes of [0, -5, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    const candidate = cloneContentModel();
    candidate.recipes.push({ ...recipeFixture(), cookingTimeMinutes });
    assert.match(
      validateContentModel(candidate).join('\n'),
      /cookingTimeMinutes must be a positive integer/,
    );
  }
});

const publishedRecipeIds = [
  'mochi-yakikata',
  'isobeyaki',
  'ebi-mochi-cheese-pizza',
  'kombu-mochi-ozoni-fu',
  'age-mame-mochi',
  'yomogi-mochi-zenzai',
  'tamari-mochi-butter-pepper',
  'garlic-butter-mochi',
  'mentaiko-mayo-mochi',
  'yomogi-an-butter',
  'dashi-butter-mochi',
  'mochi-pizza',
  'mochi-ebi-ajillo',
];

test('Recipe: mochi-yakikata keeps the toaster method as the only structured-data instructions', () => {
  const yakikata = contentModel.recipes.find((recipe) => recipe.id === 'mochi-yakikata');
  assert.ok(yakikata);
  // 主工程はトースターの3手順のみ。フライパン・レンジ・冷凍餅はvariationに置く。
  assert.equal(yakikata.steps.length, 3);
  assert.match(yakikata.steps[1].instruction, /トースター（1000W）で4〜5分/u);
  assert.deepEqual(
    yakikata.variations?.map((variation) => variation.title),
    ['フライパンで焼く', '電子レンジでやわらかく', '冷凍したお餅'],
  );
  assert.equal(yakikata.cookingTimeMinutes, undefined);

  // 写真が登録された時点でも、Recipe構造化データの手順にvariationは混ざらない。
  const withImage = recipeJsonLd({
    ...yakikata,
    mainImage: {
      src: '/images/recipe-sample.webp',
      alt: 'sample',
      role: 'primary',
      sourceType: 'original_photo',
    },
  });
  assert.ok(withImage);
  assert.equal(withImage.recipeInstructions.length, 3);
  const instructionText = withImage.recipeInstructions.map((step) => step.text).join('\n');
  assert.doesNotMatch(instructionText, /フライパン|電子レンジ|冷凍/u);
  assert.equal(
    recipeJsonLd(yakikata)?.image,
    'https://www.yamadamochi.com/images/recipes/mochi-yakikata.webp',
  );
});

test('Recipe: the thirteen existing recipe records stay valid', () => {
  assert.equal(contentModel.recipes.length, 13, 'recipe count changed without updating this test');
  assert.deepEqual(
    contentModel.recipes.map((recipe) => recipe.id),
    publishedRecipeIds,
  );
  for (const recipe of contentModel.recipes) {
    assert.equal(recipe.slug, recipe.id, `recipe "${recipe.id}" slug must match id`);
    assert.equal(recipe.status, 'published');
    assert.equal(recipe.seo?.canonicalPath, `/recipes/${recipe.slug}`);
  }
  assert.deepEqual(validateContentModel(contentModel), []);

  // 1件だけを載せたモデルでも通ることを見て、他レコードに紛れた見逃しを防ぐ。
  for (const recipe of contentModel.recipes) {
    const isolated = cloneContentModel();
    isolated.recipes = [recipe];
    assert.deepEqual(validateContentModel(isolated), [], `recipe "${recipe.id}" is invalid`);
  }
});

test('Recipe: duplicate ingredient detection survives whitespace and ASCII case differences', () => {
  const duplicates: [string, string][] = [
    ['プレーン', ' プレーン '],
    ['Salt', 'salt'],
    ['BUTTER', 'Butter'],
    ['ﾊﾞﾀｰ', 'バター'],
  ];

  for (const [first, second] of duplicates) {
    const candidate = cloneContentModel();
    candidate.recipes.push({
      ...recipeFixture(),
      ingredients: [
        { name: first, amount: '1枚' },
        { name: second, amount: '2枚' },
      ],
    });
    assert.match(
      validateContentModel(candidate).join('\n'),
      /duplicate ingredient/,
      `"${first}" and "${second}" must be detected as the same ingredient`,
    );
  }
});

test('Recipe: ingredient names that only look similar stay distinct', () => {
  // 内部空白は詰めない。日本語の材料名では区切りとして意味を持ちうる。
  const candidate = cloneContentModel();
  candidate.recipes.push({
    ...recipeFixture(),
    ingredients: [
      { name: '黒ごま', amount: '適量' },
      { name: '黒 ごま', amount: '適量' },
      { name: '白ごま', amount: '適量' },
    ],
  });
  assert.equal(validateContentModel(candidate).length, 0);
});

test('Recipe: stepImages entries require alt text', () => {
  const candidate = cloneContentModel();
  candidate.recipes.push({
    ...recipeFixture(),
    stepImages: [
      {
        src: '/images/recipe-sample-step-1.webp',
        alt: 'お餅を焼く',
        role: 'recipe_step',
        sourceType: 'original_photo',
      },
      {
        src: '/images/recipe-sample-step-2.webp',
        alt: '',
        role: 'recipe_step',
        sourceType: 'original_photo',
      },
    ],
  });
  assert.match(validateContentModel(candidate).join('\n'), /missing image alt text/);
});

test('Recipe: a registered image without a src fails validation', () => {
  const candidate = cloneContentModel();
  candidate.recipes.push({
    ...recipeFixture(),
    mainImage: {
      src: '  ',
      alt: '検証用レシピの完成写真',
      role: 'primary',
      sourceType: 'original_photo',
    },
  });
  assert.match(validateContentModel(candidate).join('\n'), /missing image src/);
});

test('Recipe: a registered image requires its sourceType', () => {
  const candidate = cloneContentModel();
  candidate.recipes.push({
    ...recipeFixture(),
    mainImage: {
      src: '/images/recipe-sample.webp',
      alt: '検証用レシピの完成写真',
      role: 'primary',
    },
  });
  assert.match(validateContentModel(candidate).join('\n'), /missing image sourceType/);
});

test('Recipe: a duplicate relatedProductId fails validation', () => {
  const candidate = cloneContentModel();
  candidate.recipes.push({ ...recipeFixture(), relatedProductIds: ['plain', 'plain'] });
  assert.match(validateContentModel(candidate).join('\n'), /duplicate relatedProductId "plain"/);
});

test('SalesChannel: unknown references and duplicate channel IDs fail validation', () => {
  const unknownReference = cloneContentModel();
  unknownReference.products[0].salesChannelIds = ['missing-channel'];
  assert.match(validateContentModel(unknownReference).join('\n'), /unknown salesChannelId/);

  const duplicateChannel = cloneContentModel();
  duplicateChannel.salesChannels.push({ ...duplicateChannel.salesChannels[0] });
  assert.match(validateContentModel(duplicateChannel).join('\n'), /salesChannels: duplicate id/);
});

test('SalesChannel: an empty name fails validation', () => {
  const candidate = cloneContentModel();
  candidate.salesChannels[0].name = '';
  assert.match(validateContentModel(candidate).join('\n'), /missing name/);
});

test('Validation: invalid currency, commerce URL, and duplicate related IDs fail', () => {
  const invalidCurrency = cloneContentModel();
  invalidCurrency.products[0].price.currency = 'USD' as 'JPY';
  assert.match(validateContentModel(invalidCurrency).join('\n'), /invalid currency/);

  const invalidUrl = cloneContentModel();
  invalidUrl.products[0].commerce.url = 'not-a-url';
  assert.match(validateContentModel(invalidUrl).join('\n'), /invalid commerce URL/);

  const duplicateRelated = cloneContentModel();
  duplicateRelated.products[0].relatedProductIds = ['yomogi', 'yomogi'];
  assert.match(validateContentModel(duplicateRelated).join('\n'), /duplicate relatedProductId/);
});

test('Validation: missing product names and invalid availability statuses fail', () => {
  const missingName = cloneContentModel();
  missingName.products[0].name = '';
  assert.match(validateContentModel(missingName).join('\n'), /missing product name/);

  const invalidAvailability = cloneContentModel();
  invalidAvailability.products[0].availability.status = 'in_stock' as 'unknown';
  assert.match(validateContentModel(invalidAvailability).join('\n'), /invalid availabilityStatus/);
});

test('Compatibility: existing product and gift display shapes remain unchanged', () => {
  assert.deepEqual(compatibleProducts, products);
  assert.deepEqual(compatibleGiftSets, catalogSets);
});

test('Compatibility: existing Product JSON-LD remains valid and prices stay numeric', () => {
  for (const [index, product] of products.entries()) {
    const jsonLd = productJsonLd(product);
    assert.equal(jsonLd['@context'], 'https://schema.org');
    assert.equal(jsonLd['@type'], 'Product');
    assert.equal(jsonLd.offers['@type'], 'Offer');
    assert.equal(jsonLd.offers.price, expectedProducts[index][1]);
    assert.equal(jsonLd.offers.priceCurrency, 'JPY');
  }
});

test('Regression mutation: a negative product price is rejected', () => {
  const mutation = cloneContentModel();
  mutation.products[0].price.amount = -1;
  assert.match(validateContentModel(mutation).join('\n'), /price amount must be zero or greater/);
});

test('Regression mutation: a missing relatedProductId is rejected', () => {
  const mutation = cloneContentModel();
  mutation.products[0].relatedProductIds = ['not-a-product'];
  assert.match(validateContentModel(mutation).join('\n'), /unknown relatedProductId/);
});

test('Regression mutation: duplicate product slug and ID are rejected', () => {
  const mutation = cloneContentModel();
  mutation.products.push({ ...mutation.products[0] });
  const errors = validateContentModel(mutation).join('\n');
  assert.match(errors, /products: duplicate id/);
  assert.match(errors, /products: duplicate slug/);
});

test('Mutation A: Seasonal startMonth 13 is rejected', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts.push({
    ...seasonalFixture(),
    salesPeriod: { display: 'invalid', startMonth: 13 },
  });
  assert.match(validateContentModel(mutation).join('\n'), /startMonth/);
});

test('Mutation B: Seasonal startDay 40 is rejected', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts.push({
    ...seasonalFixture(),
    salesPeriod: { display: 'invalid', startDay: 40 },
  });
  assert.match(validateContentModel(mutation).join('\n'), /startDay/);
});

test('Mutation C: November to February cross-year period remains valid', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts.push({
    ...seasonalFixture(),
    salesPeriod: { display: '11月〜2月', startMonth: 11, endMonth: 2 },
  });
  assert.deepEqual(validateContentModel(mutation), []);
});

test('Mutation D: an empty SalesChannel name is rejected', () => {
  const mutation = cloneContentModel();
  mutation.salesChannels[0].name = '';
  assert.match(validateContentModel(mutation).join('\n'), /missing name/);
});

test('Claude mutation: cross-year period with corrupt day boundaries is rejected', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts.push({
    ...seasonalFixture(),
    salesPeriod: {
      display: '11月〜2月',
      startMonth: 11,
      startDay: 40,
      endMonth: 2,
      endDay: -5,
    },
  });
  const errors = validateContentModel(mutation).join('\n');
  assert.match(errors, /startDay/);
  assert.match(errors, /endDay/);
});

test('Recipe: popularity, difficulty, tags, and dates are validated (YM-009)', () => {
  const valid = cloneContentModel();
  valid.recipes.push({
    ...recipeFixture(),
    tags: ['トースター', 'おやつ'],
    difficulty: 'easy',
    featured: true,
    publishedAt: '2026-09-15',
    popularity: {
      method: 'search_console_clicks',
      version: 'v1',
      periodStart: '2026-08-18',
      periodEnd: '2026-09-14',
      searchConsoleClicks: 12,
      searchConsoleImpressions: 340,
      searchConsoleCtr: 0.035,
      searchConsolePosition: 8.4,
      measuredAt: '2026-09-15',
    },
  });
  assert.deepEqual(validateContentModel(valid), []);

  const cases: [Partial<RecipeRecord>, RegExp][] = [
    [{ difficulty: 'expert' as RecipeRecord['difficulty'] }, /invalid difficulty "expert"/],
    [{ tags: ['トースター', ' トースター '] }, /duplicate tag/],
    [{ tags: ['   '] }, /empty tag/],
    [{ publishedAt: '2026/09/15' }, /publishedAt must be YYYY-MM-DD/],
    [
      {
        popularity: {
          method: 'search_console_clicks',
          version: 'v1',
          periodStart: '2026-08-18',
          periodEnd: '2026-09-14',
          measuredAt: '2026-09-15',
          searchConsoleClicks: -1,
        },
      },
      /searchConsoleClicks must be zero or greater/,
    ],
    [
      {
        popularity: {
          method: 'search_console_clicks',
          version: 'v1',
          periodStart: '2026-08-18',
          periodEnd: '2026-09-14',
          measuredAt: '2026-09-15',
          searchConsoleClicks: 1.5,
        },
      },
      /searchConsoleClicks must be an integer/,
    ],
    [
      {
        popularity: {
          method: 'search_console_clicks',
          version: 'v1',
          periodStart: '2026-08-18',
          periodEnd: '2026-09-14',
          measuredAt: '2026-09-15',
          searchConsoleCtr: 3.5,
        },
      },
      /searchConsoleCtr must be a ratio from 0 to 1/,
    ],
    [
      { popularity: { score: 10 } as RecipeRecord['popularity'] },
      /popularity\.periodStart must be YYYY-MM-DD/,
    ],
    [
      {
        popularity: {
          method: 'search_console_clicks',
          version: 'v1',
          periodStart: '2026-09-15',
          periodEnd: '2026-09-14',
          measuredAt: 'yesterday',
          score: 10,
        },
      },
      /periodStart must be on or before periodEnd/,
    ],
    [
      {
        popularity: {
          method: 'search_console_clicks',
          version: ' ',
          periodStart: '2026-08-18',
          periodEnd: '2026-09-14',
          measuredAt: '2026-09-15',
          score: 10,
        },
      },
      /missing popularity\.version/,
    ],
    [
      {
        popularity: {
          method: 'search_console_clicks',
          version: 'v1',
          periodStart: '2026-02-30',
          periodEnd: '2026-09-14',
          measuredAt: '2026-09-15',
          score: 10,
        },
      },
      /periodStart must be YYYY-MM-DD/,
    ],
  ];

  for (const [override, expectedError] of cases) {
    const candidate = cloneContentModel();
    candidate.recipes.push({ ...recipeFixture(), ...override });
    assert.match(validateContentModel(candidate).join('\n'), expectedError);
  }
});

test('Recipe: every published recipe carries tags and publishedAt for search and sorting', () => {
  for (const recipe of contentModel.recipes) {
    assert.ok(recipe.tags && recipe.tags.length > 0, `${recipe.slug}: tags`);
    assert.ok(recipe.publishedAt, `${recipe.slug}: publishedAt`);
    // 未確認の値は入れない（YM-007 / YM-008A の方針を維持）。
    assert.equal(recipe.cookingTimeMinutes, undefined, `${recipe.slug}: cookingTimeMinutes`);
    assert.equal(recipe.servings, undefined, `${recipe.slug}: servings`);
    assert.equal(recipe.difficulty, undefined, `${recipe.slug}: difficulty`);
  }
});
