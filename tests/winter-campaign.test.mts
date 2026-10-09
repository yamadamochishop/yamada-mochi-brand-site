import assert from 'node:assert/strict';
import test from 'node:test';
import { winterCampaign, type WinterCampaign } from '../data/winter-campaign.ts';
import { isCampaignActive, nextBoundary, winterNoticeRows } from '../lib/campaign.ts';

const campaign: WinterCampaign = {
  ...winterCampaign,
  heading: '年末年始のお届け案内',
  confirmedAt: '2026-10-15T12:00:00+09:00',
  displayFrom: '2026-12-20T00:00:00+09:00',
  displayUntil: '2027-01-05T00:00:00+09:00',
  ambientOrderDeadline: '2026-12-25T23:59:59+09:00',
  frozenOrderDeadline: '2026-12-23T23:59:59+09:00',
  lastShipDate: '2026-12-29T00:00:00+09:00',
  newYearShipStart: '2027-01-04T00:00:00+09:00',
};

const at = (value: string) => new Date(value);

test('winter campaign stays unpublished while all configured values are null', () => {
  assert.equal(
    Object.values(winterCampaign).every((value) => value === null),
    true,
  );
  assert.equal(isCampaignActive(winterCampaign, at('2026-12-25T12:00:00+09:00')), false);
  assert.deepEqual(winterNoticeRows(winterCampaign, at('2026-12-25T12:00:00+09:00')), []);
  assert.equal(nextBoundary(winterCampaign, at('2026-12-25T12:00:00+09:00')), null);
});

test('campaign uses inclusive start, exclusive end, and Tokyo midnight as an instant', () => {
  assert.equal(isCampaignActive(campaign, at('2026-12-19T23:59:59.999+09:00')), false);
  assert.equal(isCampaignActive(campaign, at('2026-12-20T00:00:00+09:00')), true);
  assert.equal(isCampaignActive(campaign, at('2026-12-19T15:00:00Z')), true);
  assert.equal(isCampaignActive(campaign, at('2027-01-04T23:59:59.999+09:00')), true);
  assert.equal(isCampaignActive(campaign, at('2027-01-05T00:00:00+09:00')), false);
  assert.deepEqual(winterNoticeRows(campaign, at('2027-01-05T00:00:00+09:00')), []);
});

test('unconfirmed, incomplete, reversed, or offset-free periods stay inactive', () => {
  const now = at('2026-12-21T00:00:00+09:00');
  for (const changes of [
    { confirmedAt: null },
    { displayFrom: null },
    { displayUntil: null },
    { displayFrom: campaign.displayUntil, displayUntil: campaign.displayFrom },
    { displayFrom: campaign.displayUntil },
    { displayFrom: '2026-12-20T00:00:00' },
  ]) {
    const incomplete = { ...campaign, ...changes };
    assert.equal(isCampaignActive(incomplete, now), false);
    assert.deepEqual(winterNoticeRows(incomplete, now), []);
    assert.equal(nextBoundary(incomplete, now), null);
  }
});

test('notice omits null rows and formats dates in Asia/Tokyo', () => {
  const partial = {
    ...campaign,
    ambientOrderDeadline: null,
    lastShipDate: null,
    frozenOrderDeadline: '2026-12-23T14:59:59Z',
  };
  assert.deepEqual(winterNoticeRows(partial, at('2026-12-22T00:00:00+09:00')), [
    '年内お届けの受付締切：冷凍便 12月23日（水）',
    '年始の発送開始：1月4日（月）',
  ]);
});

test('each order deadline switches to ended wording at its exact instant', () => {
  const beforeFrozen = winterNoticeRows(campaign, at('2026-12-23T23:59:58.999+09:00'));
  assert.equal(beforeFrozen[0], '年内お届けの受付締切：常温便 12月25日（金）');
  assert.equal(beforeFrozen[1], '年内お届けの受付締切：冷凍便 12月23日（水）');

  const atFrozen = winterNoticeRows(campaign, at('2026-12-23T23:59:59+09:00'));
  assert.equal(atFrozen[0], beforeFrozen[0]);
  assert.equal(atFrozen[1], '冷凍便の年内お届けの受付は終了しました');

  const beforeAmbient = winterNoticeRows(campaign, at('2026-12-25T23:59:58.999+09:00'));
  assert.equal(beforeAmbient[0], beforeFrozen[0]);
  const atAmbient = winterNoticeRows(campaign, at('2026-12-25T23:59:59+09:00'));
  assert.equal(atAmbient[0], '常温便の年内お届けの受付は終了しました');
  assert.deepEqual(atAmbient.slice(2), [
    '年内の最終発送日：12月29日（火）',
    '年始の発送開始：1月4日（月）',
  ]);
});

test('nextBoundary selects the closest future display or deadline instant', () => {
  assert.equal(
    nextBoundary(campaign, at('2026-12-19T00:00:00+09:00'))?.toISOString(),
    '2026-12-19T15:00:00.000Z',
  );
  assert.equal(
    nextBoundary(campaign, at('2026-12-20T00:00:00+09:00'))?.toISOString(),
    '2026-12-23T14:59:59.000Z',
  );
  assert.equal(
    nextBoundary(campaign, at('2026-12-23T23:59:59+09:00'))?.toISOString(),
    '2026-12-25T14:59:59.000Z',
  );
  assert.equal(
    nextBoundary(campaign, at('2026-12-25T23:59:59+09:00'))?.toISOString(),
    '2027-01-04T15:00:00.000Z',
  );
  assert.equal(nextBoundary(campaign, at('2027-01-05T00:00:00+09:00')), null);
});
