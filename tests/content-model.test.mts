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
import { productJsonLd } from '../lib/seo.ts';
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
