import assert from 'node:assert/strict';
import test from 'node:test';
import { contentModel, productRecords, seasonalProducts } from '../data/content-model.ts';
import {
  buildSeasonalProductsForMonth,
  getCommerceCtaOffers,
  getSeasonalProductsForMonth,
} from '../lib/content-model/seasonal-calendar.ts';
import { validateContentModel } from '../lib/content-model/validate.ts';

const includedIds = [
  'umezuke',
  'akakabu-maruzuke',
  'takuan',
  'akakabu-nagazuke',
  'konasu-pickles',
  'hida-apple-pie',
  'hida-peach-pie',
  'yonashi-pie',
  'strawberry-daifuku',
  'shine-muscat-daifuku',
  'shin-yomogi-mochi',
  'ao-hoba-mochi',
];

const existingProductIds = ['plain', 'yomogi', 'sansyokumame', 'kombu', 'tamari', 'ebi'];

function cloneContentModel() {
  return structuredClone(contentModel);
}

function idsFor(month: number, group: 'yearRound' | 'seasonal') {
  return getSeasonalProductsForMonth(month)[group].map((entry) => entry.id);
}

test('seasonal data contains exactly the twelve human-confirmed records', () => {
  assert.equal(seasonalProducts.length, 12);
  assert.deepEqual(
    seasonalProducts.map((product) => product.id),
    includedIds,
  );
  assert.equal(
    seasonalProducts.some((product) => product.name === 'その他の餅'),
    false,
  );
  assert.equal(
    seasonalProducts.some((product) => product.id === 'hida-beef-meat-pie'),
    false,
  );
  assert.equal(
    seasonalProducts.some((product) => product.id === 'tsubuan-pie'),
    false,
  );
});

test('シャインマスカット大福 carries only the human-confirmed product facts', () => {
  const daifuku = seasonalProducts.find((product) => product.id === 'shine-muscat-daifuku')!;
  assert.equal(daifuku.name, 'シャインマスカット大福');
  assert.equal(daifuku.slug, 'shine-muscat-daifuku');
  assert.equal(daifuku.category, 'wagashi');
  assert.equal(daifuku.seasonality, 'seasonal');
  assert.equal(daifuku.salesPeriod.display, '9月〜11月');
  assert.deepEqual([daifuku.salesPeriod.startMonth, daifuku.salesPeriod.endMonth], [9, 11]);
  assert.equal(daifuku.availabilityStatus, 'available');
  assert.deepEqual(daifuku.price, {
    amount: 300,
    currency: 'JPY',
    taxIncluded: true,
    display: '1個 300円（税込）',
  });
  assert.deepEqual(daifuku.salesLocationIds, ['jinya-morning-market']);
  assert.equal(daifuku.ingredients, 'シャインマスカット、白玉粉、砂糖、白あん、トレハロース');
  assert.equal(daifuku.storage, '冷蔵庫（10℃以下）保存');
  assert.match(daifuku.story!, /完熟シャインマスカットを丸ごと包みました/u);
  assert.equal(daifuku.commerce.status, 'unavailable');
  assert.equal(daifuku.status, 'draft');
  // 賞味期限・アレルゲン・産地はHuman未確定なので設定してはいけない。
  assert.equal(daifuku.shelfLife, undefined);
  assert.equal(daifuku.allergens, undefined);
  // 実物写真3枚。生成画像・外部写真は使わない。
  assert.deepEqual(
    daifuku.images.map((image) => [image.src, image.role, image.sourceType]),
    [
      ['/images/shine-muscat-daifuku-main.webp', 'primary', 'original_photo'],
      ['/images/shine-muscat-daifuku-making.webp', 'gallery', 'original_photo'],
      ['/images/shine-muscat-daifuku-sales.webp', 'gallery', 'original_photo'],
    ],
  );
  assert.equal(
    daifuku.images.every((image) => image.alt.trim().length > 0),
    true,
  );
});

test('year-round view contains two pickles and references the existing six products', () => {
  const january = idsFor(1, 'yearRound');
  assert.deepEqual(january.slice(0, 2), ['umezuke', 'akakabu-maruzuke']);
  assert.deepEqual(january.slice(2), existingProductIds);
  assert.equal(productRecords.length, 6);
});

test('availability only marks the human-confirmed groups available', () => {
  const availableSeasonalIds = seasonalProducts
    .filter((product) => product.availabilityStatus === 'available')
    .map((product) => product.id);
  assert.deepEqual(availableSeasonalIds, [
    'umezuke',
    'akakabu-maruzuke',
    'akakabu-nagazuke',
    'konasu-pickles',
    'shine-muscat-daifuku',
  ]);
  // 飛騨桃パイ・青朴葉餅はHuman確認済みで2026年の販売を終えている。
  assert.equal(
    seasonalProducts.find((product) => product.id === 'hida-peach-pie')?.availabilityStatus,
    'ended',
  );
  assert.equal(
    seasonalProducts.find((product) => product.id === 'ao-hoba-mochi')?.availabilityStatus,
    'ended',
  );
  assert.equal(
    contentModel.productCalendarReferences.every(
      (reference) => reference.availabilityStatus === 'available',
    ),
    true,
  );
});

test('cross-year apple pie appears from September through May only', () => {
  for (const month of [9, 10, 11, 12, 1, 2, 3, 4, 5]) {
    assert.equal(idsFor(month, 'seasonal').includes('hida-apple-pie'), true);
  }
  for (const month of [6, 7, 8]) {
    assert.equal(idsFor(month, 'seasonal').includes('hida-apple-pie'), false);
  }
});

test('August seasonal view contains the four confirmed calendar products', () => {
  assert.deepEqual(idsFor(8, 'seasonal'), [
    'akakabu-nagazuke',
    'konasu-pickles',
    'hida-peach-pie',
    'ao-hoba-mochi',
  ]);
});

test('May and June replace legacy yomogi with new grass mochi', () => {
  for (const month of [5, 6]) {
    assert.equal(idsFor(month, 'yearRound').includes('yomogi'), false);
    assert.equal(idsFor(month, 'seasonal').includes('shin-yomogi-mochi'), true);
  }
  assert.equal(idsFor(7, 'yearRound').includes('yomogi'), true);
  assert.equal(idsFor(7, 'seasonal').includes('shin-yomogi-mochi'), false);
});

test('calendar periods do not mutate human-managed availability', () => {
  const before = seasonalProducts.map(({ id, availabilityStatus }) => ({ id, availabilityStatus }));
  for (let month = 1; month <= 12; month += 1) getSeasonalProductsForMonth(month);
  assert.deepEqual(
    seasonalProducts.map(({ id, availabilityStatus }) => ({ id, availabilityStatus })),
    before,
  );
});

/** 写真のある商品は実物写真（original_photo）だけ。それ以外の商品は空配列のまま。 */
const productIdsWithPhotos = ['shine-muscat-daifuku'];

test('empty image arrays are valid and no placeholder assets are invented', () => {
  assert.equal(
    seasonalProducts
      .filter((product) => !productIdsWithPhotos.includes(product.id))
      .every((product) => product.images.length === 0),
    true,
  );
  assert.equal(
    seasonalProducts.every((product) =>
      product.images.every((image) => image.sourceType === 'original_photo'),
    ),
    true,
  );
  assert.equal(
    seasonalProducts.every((product) => product.status === 'draft'),
    true,
  );
  assert.deepEqual(validateContentModel(contentModel), []);
});

test('new grass mochi offers are confirmed without invented CTA URLs', () => {
  const product = seasonalProducts.find((candidate) => candidate.id === 'shin-yomogi-mochi');
  assert.ok(product);
  assert.equal(product.commerce.status, 'available');
  assert.deepEqual(
    product.commerce.offers.map((offer) => [offer.channelId, offer.offerLabel, offer.url]),
    [
      ['base', '個別商品', undefined],
      ['tabechoku', '4袋セット', undefined],
      ['pokemaru', '4袋セット', undefined],
    ],
  );
  assert.deepEqual(getCommerceCtaOffers(product), []);
});

test('Mutation A: an endMonth of 13 is rejected', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts[0].seasonality = 'seasonal';
  mutation.seasonalProducts[0].salesPeriod = { display: 'invalid', startMonth: 1, endMonth: 13 };
  assert.match(validateContentModel(mutation).join('\n'), /endMonth/);
});

test('Mutation B: an unknown sales location is rejected', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts[0].salesLocationIds = ['unknown-location'];
  assert.match(validateContentModel(mutation).join('\n'), /unknown salesLocationId/);
});

test('Mutation C: a duplicate seasonal slug is rejected', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts[1].slug = mutation.seasonalProducts[0].slug;
  assert.match(validateContentModel(mutation).join('\n'), /seasonalProducts: duplicate slug/);
});

test('Mutation D: removing the May replacement rule is killed by the calendar expectation', () => {
  const mutation = cloneContentModel();
  mutation.seasonalReplacementRules[0].months = [6];
  const mutatedMay = buildSeasonalProductsForMonth(5, mutation);
  assert.notDeepEqual(
    mutatedMay.yearRound.map((entry) => entry.id),
    idsFor(5, 'yearRound'),
  );
  assert.equal(
    mutatedMay.yearRound.some((entry) => entry.id === 'yomogi'),
    true,
  );
});

test('Image policy regression: empty seasonal image arrays remain valid', () => {
  const mutation = cloneContentModel();
  mutation.seasonalProducts.forEach((product) => {
    product.images = [];
  });
  assert.deepEqual(validateContentModel(mutation), []);
});

test('invalid category and year-round month boundaries are rejected', () => {
  const invalidCategory = cloneContentModel();
  invalidCategory.seasonalProducts[0].category = 'prepared_food' as 'pickles';
  assert.match(validateContentModel(invalidCategory).join('\n'), /invalid category/);

  const invalidYearRound = cloneContentModel();
  invalidYearRound.seasonalProducts[0].salesPeriod.startMonth = 1;
  assert.match(validateContentModel(invalidYearRound).join('\n'), /year_round product/);
});

function seasonalRecord(model: ReturnType<typeof cloneContentModel>, id: string) {
  const record = model.seasonalProducts.find((product) => product.id === id);
  assert.ok(record, `missing seasonal record: ${id}`);
  return record;
}

test('commerce offer validation protects channel references and CTA status', () => {
  const unknownChannel = cloneContentModel();
  seasonalRecord(unknownChannel, 'shin-yomogi-mochi').commerce.offers[0].channelId =
    'unknown-channel';
  assert.match(validateContentModel(unknownChannel).join('\n'), /unknown commerce channelId/);

  const invalidCta = cloneContentModel();
  seasonalRecord(invalidCta, 'hida-apple-pie').commerce.offers = [
    { channelId: 'base', status: 'preparing', url: 'https://example.com/not-confirmed' },
  ];
  assert.match(validateContentModel(invalidCta).join('\n'), /only a confirmed commerce offer/);
});

test('broken yomogi replacement references and months are rejected', () => {
  const missingReplacement = cloneContentModel();
  missingReplacement.seasonalReplacementRules[0].replacementSeasonalProductId = 'missing';
  assert.match(
    validateContentModel(missingReplacement).join('\n'),
    /unknown replacementSeasonalProductId/,
  );

  const outsidePeriod = cloneContentModel();
  outsidePeriod.seasonalReplacementRules[0].months = [7];
  assert.match(validateContentModel(outsidePeriod).join('\n'), /outside replacement salesPeriod/);
});
