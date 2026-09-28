import assert from 'node:assert/strict';
import test from 'node:test';
import { catalogSets, products } from '../data/catalog.ts';
import {
  getShippingWeightGrams,
  isNekoposEligible,
  NEKOPOS_MAX_WEIGHT_GRAMS,
  nekoposHeadline,
  nekoposLead,
  nekoposListNote,
  nekoposShippingDetail,
  setShippingDetail,
  takkyubinShippingDetail,
} from '../lib/shipping.ts';

const copy = [
  nekoposHeadline,
  nekoposLead,
  nekoposListNote,
  nekoposShippingDetail,
  setShippingDetail,
  takkyubinShippingDetail,
];

test('shipping: weights follow the Human-confirmed BASE settings (2026-09-28)', () => {
  assert.equal(NEKOPOS_MAX_WEIGHT_GRAMS, 800);
  for (const product of products) {
    assert.equal(getShippingWeightGrams(product.slug), 200, product.slug);
    assert.equal(isNekoposEligible(product.slug), true, product.slug);
  }
  assert.deepEqual(
    catalogSets.map((set) => [set.slug, getShippingWeightGrams(set.slug)]),
    [
      ['six-flavor-gift', 1200],
      ['choice-six-set', 1200],
      ['twelve-set', 2400],
    ],
  );
  for (const set of catalogSets) assert.equal(isNekoposEligible(set.slug), false, set.slug);
  // 未登録の商品は、Human確認を経て登録されるまでネコポス訴求の対象外。
  assert.equal(isNekoposEligible('unknown-product'), false);
});

test('shipping: copy uses the 800g-equivalent rule and never the retired bag-count rule', () => {
  for (const text of copy) {
    assert.doesNotMatch(text, /4袋まで|5袋以上/u, text);
    // 6枚入り（300g）はBASEで非公開のため案内しない。
    assert.doesNotMatch(text, /6枚入り|300g/u, text);
  }
  assert.match(nekoposShippingDetail, /800g相当まで、全国一律380円のネコポス/u);
  assert.match(nekoposShippingDetail, /配達日時の指定はできません/u);
  assert.match(takkyubinShippingDetail, /800g相当を超える/u);
  assert.match(takkyubinShippingDetail, /セット商品/u);
  assert.match(takkyubinShippingDetail, /ヤマト宅急便（地域別送料）/u);
  assert.match(nekoposHeadline, /380円/u);
});
