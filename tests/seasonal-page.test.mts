import assert from 'node:assert/strict';
import test from 'node:test';
import { seasonalProducts } from '../data/seasonal-products.ts';
import {
  SEASONAL_LISTING_MONTH,
  buildSeasonalPageModel,
  currentSeasonalProductIds,
  getSeasonalCalendarWarnings,
  getSeasonalListingConsistencyErrors,
  getSeasonalListingWarnings,
} from '../lib/seasonal-page.ts';
import { getCommerceCtaOffers } from '../lib/content-model/seasonal-calendar.ts';

function cloneRecords() {
  return structuredClone(seasonalProducts);
}

const expectedSeasonalIdsByMonth: Record<number, string[]> = {
  1: ['takuan', 'hida-apple-pie'],
  2: ['takuan', 'hida-apple-pie', 'strawberry-daifuku'],
  3: ['takuan', 'hida-apple-pie', 'strawberry-daifuku'],
  4: ['akakabu-nagazuke', 'hida-apple-pie', 'strawberry-daifuku'],
  5: ['akakabu-nagazuke', 'hida-apple-pie', 'shin-yomogi-mochi'],
  6: ['akakabu-nagazuke', 'shin-yomogi-mochi'],
  7: ['akakabu-nagazuke', 'konasu-pickles', 'ao-hoba-mochi'],
  8: ['akakabu-nagazuke', 'konasu-pickles', 'hida-peach-pie', 'ao-hoba-mochi'],
  9: ['akakabu-nagazuke', 'konasu-pickles', 'hida-apple-pie', 'hida-peach-pie', 'yonashi-pie'],
  10: ['akakabu-nagazuke', 'konasu-pickles', 'hida-apple-pie', 'yonashi-pie'],
  11: ['akakabu-nagazuke', 'hida-apple-pie'],
  12: ['hida-apple-pie'],
};

function seasonalIdsForMonth(month: number, records = seasonalProducts) {
  return buildSeasonalPageModel(records).monthlyCalendar[month - 1].products.map(
    (product) => product.id,
  );
}

test('seasonal list model publishes eleven draft records without creating detail routes', () => {
  const model = buildSeasonalPageModel();
  assert.deepEqual(
    model.currentProducts.map((product) => product.id),
    [...currentSeasonalProductIds],
  );
  assert.equal(model.seasonalDirectory.length, 9);
  assert.equal(new Set(model.seasonalDirectory.map((product) => product.id)).size, 9);
  assert.equal(model.yearRoundPickles.length, 2);
  assert.equal(model.regularMochiNames.length, 6);
  assert.equal(
    seasonalProducts.every((product) => product.status === 'draft'),
    true,
  );
});

test('current status labels are human-managed and unknown products receive no badge', () => {
  const model = buildSeasonalPageModel();
  assert.deepEqual(
    model.currentProducts.map((product) => product.statusLabel),
    ['販売中', '販売中', '販売中'],
  );
  assert.deepEqual(
    model.currentProducts.map((product) => product.currentMonthLabel),
    ['8月〜9月上旬頃', '7月〜10月', '4月〜11月'],
  );
  const unknownIds = seasonalProducts
    .filter((product) => product.availabilityStatus === 'unknown')
    .map((product) => product.id);
  const annualProducts = model.seasonalDirectory;
  assert.equal(
    annualProducts
      .filter((product) => unknownIds.includes(product.id))
      .every((product) => !product.statusLabel),
    true,
  );
});

test('human-confirmed sales periods and copy overrides remain intact', () => {
  const byId = new Map(seasonalProducts.map((product) => [product.id, product]));
  assert.equal(byId.get('takuan')?.salesPeriod.display, '1月〜3月');
  assert.equal(byId.get('strawberry-daifuku')?.salesPeriod.display, '2月〜4月');
  assert.equal(byId.get('akakabu-nagazuke')?.salesPeriod.display, '4月〜11月');
  assert.equal(byId.get('konasu-pickles')?.salesPeriod.display, '7月〜10月');
  assert.equal(byId.get('hida-apple-pie')?.salesPeriod.display, '9月〜5月');
  assert.equal(byId.get('ao-hoba-mochi')?.salesPeriod.note, '8月15日ごろまで');
});

test('飛騨桃パイ renders only the human-confirmed product facts', () => {
  const peach = seasonalProducts.find((product) => product.id === 'hida-peach-pie')!;
  assert.equal(peach.salesPeriod.display, '8月〜9月上旬頃');
  assert.deepEqual([peach.salesPeriod.startMonth, peach.salesPeriod.endMonth], [8, 9]);
  assert.equal(peach.catchcopy, '桃のみずみずしさを残して。');
  assert.equal(peach.price?.display, '1個 250円（税込）');
  assert.equal(peach.price?.taxIncluded, true);
  assert.equal(peach.price?.amount, 250);
  assert.equal(peach.shelfLife, '当日');
  assert.deepEqual(peach.salesLocationIds, ['jinya-morning-market']);
  assert.deepEqual(peach.notes, [
    '白桃：8月上旬〜8月下旬（状況により9月上旬頃まで）',
    '黄桃：8月下旬〜9月上旬頃',
  ]);
  assert.match(peach.story!, /余計なものを加えずシンプルに仕上げました。$/u);
  assert.match(peach.commitment!, /レモンとバターで仕上げています/u);
  // 産地・品種・保存方法・原材料・アレルゲンはHuman未確定なので設定してはいけない。
  assert.equal(peach.ingredients, undefined);
  assert.equal(peach.allergens, undefined);
  assert.equal(peach.storage, undefined);
  assert.equal(peach.images.length, 0);
  assert.equal(peach.commerce.status, 'unavailable');
});

test('洋梨パイ is announced as upcoming and copies nothing from the peach pie', () => {
  const model = buildSeasonalPageModel();
  const pear = seasonalProducts.find((product) => product.id === 'yonashi-pie')!;
  assert.equal(pear.availabilityStatus, 'upcoming');
  assert.equal(pear.salesPeriod.display, '9月〜10月頃');
  assert.equal(pear.status, 'draft');
  for (const field of [
    pear.price,
    pear.shelfLife,
    pear.ingredients,
    pear.allergens,
    pear.commitment,
    pear.catchcopy,
  ]) {
    assert.equal(field, undefined);
  }
  assert.equal(pear.images.length, 0);
  assert.equal(pear.commerce.status, 'undecided');
  assert.deepEqual(pear.salesLocationIds, []);

  const pageProduct = model.upcomingProducts.find((product) => product.id === 'yonashi-pie');
  assert.deepEqual(
    model.upcomingProducts.map((product) => product.id),
    ['yonashi-pie'],
  );
  assert.equal(pageProduct?.statusLabel, '販売予定');
  assert.equal(pageProduct?.salesLocationLabel, '未定');
  assert.equal(pageProduct?.commerceLabel, '未定');
});

test('青朴葉餅 is finished for 2026 and only appears in the ended group', () => {
  const model = buildSeasonalPageModel();
  const record = seasonalProducts.find((product) => product.id === 'ao-hoba-mochi')!;
  assert.equal(record.availabilityStatus, 'ended');
  assert.equal(record.availabilityNote, undefined);
  assert.deepEqual(record.notes, ['2026年の販売は8月中旬で終了しました']);
  // 販売時期の目安（7月〜8月中旬）はカレンダーの事実なので残す。
  assert.equal(record.salesPeriod.display, '7月〜8月中旬');
  assert.equal(record.salesPeriod.note, '8月15日ごろまで');

  assert.deepEqual(
    model.endedProducts.map((product) => product.id),
    ['ao-hoba-mochi'],
  );
  assert.equal(model.endedProducts[0].statusLabel, '販売終了');
  // 「今、店先にあるもの」と「8月のお品書き」は同じ currentProducts を読む。
  assert.equal(
    model.currentProducts.some((product) => product.id === 'ao-hoba-mochi'),
    false,
  );
  assert.equal(
    model.currentProducts.some((product) => product.statusLabel === 'まもなく終了'),
    false,
  );
  // 一年の流れでは7月・8月の欄に残る（毎年の販売時期の目安）。
  assert.deepEqual(
    Array.from({ length: 12 }, (_, index) => index + 1).filter((month) =>
      seasonalIdsForMonth(month).includes('ao-hoba-mochi'),
    ),
    [7, 8],
  );
});

test('Mutation F: copying the peach pie price onto the pear pie is detectable', () => {
  const mutation = cloneRecords();
  const pear = mutation.find((product) => product.id === 'yonashi-pie')!;
  pear.price = { amount: 250, currency: 'JPY', taxIncluded: true, display: '1個 250円（税込）' };
  assert.notDeepEqual(
    buildSeasonalPageModel(mutation).upcomingProducts[0].price,
    buildSeasonalPageModel().upcomingProducts[0].price,
  );
});

test('Mutation G: promoting the pear pie to available would create a forbidden 販売中 badge', () => {
  const mutation = cloneRecords();
  mutation.find((product) => product.id === 'yonashi-pie')!.availabilityStatus = 'available';
  assert.equal(buildSeasonalPageModel(mutation).upcomingProducts.length, 0);
  assert.equal(buildSeasonalPageModel().upcomingProducts[0].statusLabel, '販売予定');
});

test('commerce copy exposes facts but never invents a listing CTA URL', () => {
  const model = buildSeasonalPageModel();
  const products = [...model.seasonalDirectory, ...model.yearRoundPickles];
  assert.equal(
    products.find((product) => product.id === 'hida-apple-pie')?.commerceLabel,
    '準備中',
  );
  assert.equal(
    products.find((product) => product.id === 'shin-yomogi-mochi')?.commerceLabel,
    'あり（BASE・食べチョク・ポケマル）',
  );
  assert.deepEqual(
    getCommerceCtaOffers(seasonalProducts.find((product) => product.id === 'shin-yomogi-mochi')!),
    [],
  );
});

test('all twelve months exactly match the human-confirmed seasonal product IDs', () => {
  for (let month = 1; month <= 12; month += 1) {
    assert.deepEqual(seasonalIdsForMonth(month), expectedSeasonalIdsByMonth[month], `${month}月`);
  }
});

test('cross-boundary periods remain correct in the monthly listing', () => {
  assert.deepEqual(
    buildSeasonalPageModel().monthlyCalendar.map(({ month }) => month),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  );
  for (const month of [9, 10, 11, 12, 1, 2, 3, 4, 5]) {
    assert.equal(seasonalIdsForMonth(month).includes('hida-apple-pie'), true, `${month}月 apple`);
  }
  for (const month of [4, 5, 6, 7, 8, 9, 10, 11]) {
    assert.equal(
      seasonalIdsForMonth(month).includes('akakabu-nagazuke'),
      true,
      `${month}月 akakabu`,
    );
  }
  for (const month of [7, 8, 9, 10]) {
    assert.equal(seasonalIdsForMonth(month).includes('konasu-pickles'), true, `${month}月 konasu`);
  }
  assert.deepEqual(
    [7, 8].map((month) => seasonalIdsForMonth(month).includes('ao-hoba-mochi')),
    [true, true],
  );
  assert.deepEqual(
    [5, 6].map((month) => seasonalIdsForMonth(month).includes('shin-yomogi-mochi')),
    [true, true],
  );
  assert.deepEqual(
    Array.from({ length: 12 }, (_, index) => index + 1).filter((month) =>
      seasonalIdsForMonth(month).includes('hida-peach-pie'),
    ),
    [8, 9],
  );
  assert.deepEqual(
    Array.from({ length: 12 }, (_, index) => index + 1).filter((month) =>
      seasonalIdsForMonth(month).includes('yonashi-pie'),
    ),
    [9, 10],
  );
});

test('seasonal month-boundary warnings remain non-blocking and are testable', () => {
  assert.deepEqual(getSeasonalCalendarWarnings(), []);
  const mutation = cloneRecords();
  const takuan = mutation.find((product) => product.id === 'takuan')!;
  delete takuan.salesPeriod.endMonth;
  assert.match(getSeasonalCalendarWarnings(mutation).join('\n'), /takuan.*month boundary/);
});

test('the listing month agrees with every product shown as currently on the shelf', () => {
  assert.deepEqual(getSeasonalListingConsistencyErrors(), []);
  assert.equal(SEASONAL_LISTING_MONTH, 8);
});

test('Listing Mutation A: keeping a finished product in the current list is rejected', () => {
  const mutation = cloneRecords();
  // 青朴葉餅を ended にしたのに ID リストへ残す、という今日踏んだ事故の型。
  mutation.find((product) => product.id === 'hida-peach-pie')!.availabilityStatus = 'ended';
  assert.match(
    getSeasonalListingConsistencyErrors(mutation).join('\n'),
    /hida-peach-pie.*availabilityStatus is "ended"/u,
  );
});

test('Listing Mutation B: a product outside the listing month is rejected', () => {
  const mutation = cloneRecords();
  // 月を進めてリストを直し忘れる型（ここでは商品側を月から外して同じ食い違いを作る）。
  const konasu = mutation.find((product) => product.id === 'konasu-pickles')!;
  konasu.salesPeriod.startMonth = 9;
  konasu.salesPeriod.endMonth = 10;
  assert.match(
    getSeasonalListingConsistencyErrors(mutation).join('\n'),
    /konasu-pickles.*does not include month 8/u,
  );
});

test('human-managed listing month has a non-blocking Asia/Tokyo staleness guard', () => {
  assert.deepEqual(getSeasonalListingWarnings(new Date('2026-08-09T00:00:00Z')), []);
  assert.match(
    getSeasonalListingWarnings(new Date('2026-09-01T00:00:00Z')).join('\n'),
    /listing month is 8.*Asia\/Tokyo month is 9/,
  );
});

test('Month Mutation A: moving peach pie to December breaks the monthly contract', () => {
  const mutation = cloneRecords();
  const product = mutation.find((candidate) => candidate.id === 'hida-peach-pie')!;
  product.salesPeriod.startMonth = 12;
  product.salesPeriod.endMonth = 12;
  assert.throws(() =>
    assert.deepEqual(seasonalIdsForMonth(12, mutation), expectedSeasonalIdsByMonth[12]),
  );
});

test('Month Mutation B: extending takuan through June breaks the monthly contract', () => {
  const mutation = cloneRecords();
  mutation.find((product) => product.id === 'takuan')!.salesPeriod.endMonth = 6;
  assert.throws(() =>
    assert.deepEqual(seasonalIdsForMonth(6, mutation), expectedSeasonalIdsByMonth[6]),
  );
});

test('Month Mutation C: dropping konasu from September breaks the monthly contract', () => {
  const mutation = cloneRecords();
  mutation.find((product) => product.id === 'konasu-pickles')!.salesPeriod.endMonth = 8;
  assert.throws(() =>
    assert.deepEqual(seasonalIdsForMonth(9, mutation), expectedSeasonalIdsByMonth[9]),
  );
});

test('Month Mutation D: dropping apple pie from January breaks the monthly contract', () => {
  const mutation = cloneRecords();
  const product = mutation.find((candidate) => candidate.id === 'hida-apple-pie')!;
  product.salesPeriod.startMonth = 2;
  product.salesPeriod.endMonth = 5;
  assert.throws(() =>
    assert.deepEqual(seasonalIdsForMonth(1, mutation), expectedSeasonalIdsByMonth[1]),
  );
});

test('Month Mutation E: extending new grass mochi into July breaks the monthly contract', () => {
  const mutation = cloneRecords();
  mutation.find((product) => product.id === 'shin-yomogi-mochi')!.salesPeriod.endMonth = 7;
  assert.throws(() =>
    assert.deepEqual(seasonalIdsForMonth(7, mutation), expectedSeasonalIdsByMonth[7]),
  );
});

test('Mutation A: reviving blue hoba as available breaks the finished-sales contract', () => {
  const mutation = cloneRecords();
  const product = mutation.find((candidate) => candidate.id === 'ao-hoba-mochi')!;
  product.availabilityStatus = 'available';
  assert.deepEqual(buildSeasonalPageModel(mutation).endedProducts, []);
  assert.deepEqual(
    buildSeasonalPageModel().endedProducts.map((candidate) => candidate.id),
    ['ao-hoba-mochi'],
  );
});

test('Mutation B: restoring the old peach copy breaks the confirmed display contract', () => {
  const mutation = cloneRecords();
  mutation.find((product) => product.id === 'hida-peach-pie')!.notes = ['8月末終了予定'];
  assert.notDeepEqual(
    buildSeasonalPageModel(mutation).currentProducts.find(
      (product) => product.id === 'hida-peach-pie',
    )?.notes,
    buildSeasonalPageModel().currentProducts.find((product) => product.id === 'hida-peach-pie')
      ?.notes,
  );
});

test('Mutation C: adding a placeholder image breaks the zero-image policy', () => {
  const mutation = cloneRecords();
  mutation[0].images.push({
    src: '/images/placeholder.svg',
    alt: 'placeholder',
    role: 'card',
    sourceType: 'generated',
  });
  assert.equal(
    mutation.every((product) => product.images.length === 0),
    false,
  );
  assert.equal(
    seasonalProducts.every((product) => product.images.length === 0),
    true,
  );
});

test('Mutation D: a fabricated new-grass URL becomes detectable as an unsafe CTA offer', () => {
  const mutation = cloneRecords();
  const product = mutation.find((candidate) => candidate.id === 'shin-yomogi-mochi')!;
  product.commerce.offers[0].url = 'https://example.com/fabricated';
  assert.equal(getCommerceCtaOffers(product).length, 1);
  assert.equal(
    getCommerceCtaOffers(
      seasonalProducts.find((candidate) => candidate.id === 'shin-yomogi-mochi')!,
    ).length,
    0,
  );
});

test('Mutation E: marking an unknown current record available would create a forbidden badge', () => {
  const mutation = cloneRecords();
  const peach = mutation.find((product) => product.id === 'hida-peach-pie')!;
  peach.availabilityStatus = 'unknown';
  assert.notDeepEqual(
    buildSeasonalPageModel(mutation).currentProducts.map((product) => product.statusLabel),
    buildSeasonalPageModel().currentProducts.map((product) => product.statusLabel),
  );
});
