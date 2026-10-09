import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { catalogSets, fixedSetVariants, products } from '../data/catalog.ts';
import { trackBaseClick, trackTrackedLinkClick } from '../lib/analytics.ts';
import { baseItemForUrl, isExternalBaseLink } from '../lib/base-click-items.ts';

test('baseItemForUrl: 固定セット8商品のIDと配送・袋数・用途を対応付ける', () => {
  const expected = [
    ['6-ambient-home', 'ambient', 6, 'home'],
    ['6-ambient-gift', 'ambient', 6, 'gift'],
    ['6-frozen-home', 'frozen', 6, 'home'],
    ['6-frozen-gift', 'frozen', 6, 'gift'],
    ['12-ambient-home', 'ambient', 12, 'home'],
    ['12-ambient-gift', 'ambient', 12, 'gift'],
    ['12-frozen-home', 'frozen', 12, 'home'],
    ['12-frozen-gift', 'frozen', 12, 'gift'],
  ] as const;

  assert.equal(fixedSetVariants.length, expected.length);
  for (const [id, delivery, bags, purpose] of expected) {
    const variant = fixedSetVariants.find((item) => item.id === id);
    assert.ok(variant, id);
    assert.deepEqual(baseItemForUrl(variant.baseUrl), {
      item_id: id,
      item_name: variant.name,
      delivery,
      bags,
      purpose,
    });
  }
  assert.equal(new Set(expected.map(([id]) => id)).size, 8);
  assert.equal(new Set(fixedSetVariants.map((item) => item.baseUrl)).size, 8);

  // 旧セットとURLが重なる場合も固定セットのIDを送る。
  assert.equal(baseItemForUrl(catalogSets[0].baseUrl)?.item_id, '6-ambient-gift');
  assert.equal(baseItemForUrl(catalogSets[2].baseUrl)?.item_id, '12-ambient-gift');
});

test('baseItemForUrl: 単品6商品と選べる6袋は商品名とIDだけを返す', () => {
  assert.equal(products.length, 6);
  for (const product of products) {
    assert.deepEqual(baseItemForUrl(product.baseUrl), {
      item_id: product.slug,
      item_name: product.name,
    });
  }
  const choiceSet = catalogSets.find((item) => item.slug === 'choice-six-set');
  assert.ok(choiceSet);
  assert.deepEqual(baseItemForUrl(choiceSet.baseUrl), {
    item_id: choiceSet.slug,
    item_name: choiceSet.name,
  });
});

test('baseItemForUrl: 末尾スラッシュとクエリを無視し、ショップトップと未知URLは照合しない', () => {
  const variant = fixedSetVariants[0];
  const expected = baseItemForUrl(variant.baseUrl);
  assert.deepEqual(baseItemForUrl(`${variant.baseUrl}/`), expected);
  assert.deepEqual(baseItemForUrl(`${variant.baseUrl}/?email=private`), expected);
  assert.deepEqual(baseItemForUrl(`${variant.baseUrl}?utm_source=top`), expected);
  for (const href of [
    'https://yamadamochi.thebase.in/',
    'https://yamadamochi.thebase.in/?email=private',
    'https://yamadamochi.thebase.in/items/unknown',
    `${variant.baseUrl}-extra`,
    `${variant.baseUrl}#other`,
    'https://yamadamochi.thebase.in.evil.example/items/149543143',
    'not-a-url',
  ]) {
    assert.equal(baseItemForUrl(href), undefined, href);
  }
});

test('trackBaseClick: 1回の呼び出しで1イベントだけ送り、定義済みのキーに限る', () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const events: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { gtag: (...args: unknown[]) => events.push(args) },
  });

  try {
    const variant = fixedSetVariants[0];
    trackBaseClick('set_card', baseItemForUrl(`${variant.baseUrl}?email=private`));
    assert.deepEqual(events, [
      [
        'event',
        'base_click',
        {
          placement: 'set_card',
          item_id: variant.id,
          item_name: variant.name,
          delivery: 'ambient',
          bags: 6,
          purpose: 'home',
        },
      ],
    ]);

    events.length = 0;
    trackBaseClick('sticky_bar');
    assert.deepEqual(events, [['event', 'base_click', { placement: 'sticky_bar' }]]);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('TrackedLinkの1クリックで既存イベントとBASEクリックをそれぞれ1回送る', () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const events: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { gtag: (...args: unknown[]) => events.push(args) },
  });

  try {
    const item = baseItemForUrl(fixedSetVariants[0].baseUrl);
    trackTrackedLinkClick('top_cta_click', { item });
    assert.deepEqual(events, [
      ['event', 'top_cta_click'],
      ['event', 'base_click', { placement: 'top_cta', ...item }],
    ]);

    events.length = 0;
    trackTrackedLinkClick('hero_cta_click', { item: undefined });
    assert.deepEqual(events, [
      ['event', 'hero_cta_click'],
      ['event', 'base_click', { placement: 'top_cta' }],
    ]);

    events.length = 0;
    trackTrackedLinkClick('gift_cta_click');
    assert.deepEqual(events, [['event', 'gift_cta_click']]);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('クライアントから使うanalyticsにカタログへの値importを含めない', () => {
  const source = readFileSync(new URL('../lib/analytics.ts', import.meta.url), 'utf8');
  const valueImportsOnly = source.replace(/^import\s+type\b[^;]*;/gm, '');
  assert.doesNotMatch(
    valueImportsOnly,
    /(?:from\s*['"]|import\(\s*['"])[^'"]*(?:data\/catalog|base-click-items)(?:\.ts)?['"]/,
  );
});

test('isExternalBaseLink: BASEの外部URLだけを追加計測の対象にする', () => {
  assert.equal(isExternalBaseLink('https://yamadamochi.thebase.in/', true), true);
  assert.equal(isExternalBaseLink(products[0].baseUrl, true), true);
  assert.equal(isExternalBaseLink(products[0].baseUrl, false), false);
  assert.equal(isExternalBaseLink('/products', false), false);
  assert.equal(isExternalBaseLink('https://example.com/', true), false);
  assert.equal(isExternalBaseLink('https://yamadamochi.thebase.in.evil.example/', true), false);
  assert.equal(isExternalBaseLink('http://yamadamochi.thebase.in/', true), false);
  assert.equal(isExternalBaseLink('not-a-url', true), false);
});
