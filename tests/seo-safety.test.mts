import assert from 'node:assert/strict';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { after, before, test } from 'node:test';

import {
  APEX_HOST,
  getCanonicalRedirectUrl,
  isCanonicalProductionHost,
  PRODUCTION_DOMAIN_REDIRECT_OWNER,
  PRODUCTION_HOST,
  shouldApplyNoIndex,
} from '../lib/canonical-host.ts';
import { findLegacyRedirect, legacyRedirects } from '../lib/legacy-redirects.ts';
import { confirmedLegacyUrls, unverifiedLegacyUrls } from '../lib/legacy-url-inventory.ts';

const productionOrigin = 'https://www.yamadamochi.com';
// This independent contract catches accidental route, catalog, or sitemap loss.
const currentIndexablePaths = [
  '/',
  '/products',
  '/products/plain',
  '/products/yomogi',
  '/products/sansyokumame',
  '/products/kombu',
  '/products/tamari',
  '/products/ebi',
  '/seasonal',
  '/gift',
  '/recipes',
  '/recipes/mochi-yakikata',
  '/recipes/isobeyaki',
  '/recipes/ebi-mochi-cheese-pizza',
  '/recipes/kombu-mochi-ozoni-fu',
  '/recipes/age-mame-mochi',
  '/recipes/yomogi-mochi-zenzai',
  '/recipes/tamari-mochi-butter-pepper',
  '/recipes/garlic-butter-mochi',
  '/recipes/mentaiko-mayo-mochi',
  '/recipes/yomogi-an-butter',
  '/recipes/dashi-butter-mochi',
  '/recipes/mochi-pizza',
  '/recipes/mochi-ebi-ajillo',
  '/brand-story',
  '/craft',
  '/third-generation',
  '/market',
  '/faq',
  '/contact',
  '/voices',
  '/news',
] as const;
const expectedLegacyRedirects = new Map([
  ['/商品紹介', '/products'],
  ['/お問い合わせ', '/contact'],
  ['/アレンジレシピ', '/recipes'],
  ['/アレンジレシピ/餅のアレンジレシピ', '/recipes'],
  ['/2020/06/11/ピザ餅', '/recipes/mochi-pizza'],
  ['/2020/06/11/明太子マヨ餅', '/recipes/mentaiko-mayo-mochi'],
  ['/2020/06/11/草もちあんこバター', '/recipes/yomogi-an-butter'],
  ['/2020/06/11/餅アヒージョ', '/recipes/mochi-ebi-ajillo'],
  ['/2020/09/23/ガーリックバター餅', '/recipes/garlic-butter-mochi'],
  ['/2021/03/05/チーズゴマ海老餅', '/recipes/ebi-mochi-cheese-pizza'],
]);
// 同等コンテンツが未作成の旧レシピURLは defer のまま残す。
const deferredLegacyRecipePaths = ['/2020/06/05/カプレーゼ餅', '/2020/06/05/ゴルゴンゾーラ餅'];
let server: ChildProcess | undefined;
let localOrigin = '';
let localPort = 0;

function availablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const socket = createServer();
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', () => {
      const address = socket.address();
      if (!address || typeof address === 'string') {
        socket.close();
        reject(new Error('Unable to allocate an HTTP test port'));
        return;
      }
      socket.close(() => resolve(address.port));
    });
  });
}

async function waitForServer(url: string, process: ChildProcess): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (process.exitCode !== null) {
      throw new Error(`Next.js server exited with code ${process.exitCode}`);
    }
    try {
      const response = await fetch(url);
      if (response.status === 200) return;
    } catch {
      // The production server has not started listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('Timed out waiting for the Next.js production server');
}

function productionHeaders(): HeadersInit {
  return {
    host: 'www.yamadamochi.com',
    'x-forwarded-host': 'www.yamadamochi.com',
    'x-forwarded-proto': 'https',
  };
}

function canonicalFrom(html: string): string | undefined {
  const linkTags = html.match(/<link\b[^>]*>/g) ?? [];
  const canonicalTag = linkTags.find((tag) => /\brel=["']canonical["']/.test(tag));
  return canonicalTag?.match(/\bhref=["']([^"']+)["']/)?.[1];
}

before(async () => {
  if (process.env.SEO_TEST_SKIP_BUILD === 'true') return;

  const env = {
    ...process.env,
    NEXT_PUBLIC_SITE_INDEXABLE: 'true',
    NEXT_PUBLIC_SITE_URL: productionOrigin,
  };
  const build = spawnSync('pnpm', ['run', 'build'], {
    cwd: process.cwd(),
    env,
    encoding: 'utf8',
  });
  assert.equal(build.status, 0, `Production build failed:\n${build.stdout}\n${build.stderr}`);

  localPort = await availablePort();
  localOrigin = `http://127.0.0.1:${localPort}`;
  server = spawn('pnpm', ['start', '--hostname', '127.0.0.1', '--port', String(localPort)], {
    cwd: process.cwd(),
    env,
    stdio: 'pipe',
  });
  await waitForServer(localOrigin, server);
});

after(() => {
  if (server && server.exitCode === null) server.kill('SIGTERM');
});

test('A/B: every implemented legacy URL is a permanent redirect to its expected destination', async () => {
  assert.equal(legacyRedirects.length, expectedLegacyRedirects.size);
  for (const redirect of legacyRedirects) {
    assert.equal(redirect.statusCode, 301);
    assert.equal(redirect.destination, expectedLegacyRedirects.get(redirect.source));
    assert.equal(findLegacyRedirect(redirect.source), redirect);
    assert.equal(findLegacyRedirect(`${redirect.source}/`), redirect);
    assert.equal(findLegacyRedirect(encodeURI(redirect.source)), redirect);

    if (!localOrigin) continue;
    for (const source of [encodeURI(redirect.source), `${encodeURI(redirect.source)}/`]) {
      const response = await fetch(`${localOrigin}${source}?utm_source=seo-test`, {
        redirect: 'manual',
      });
      assert.equal(response.status, 301, source);

      const location = new URL(assertCanonicalHeader(response.headers.get('location')));
      assert.equal(location.pathname, redirect.destination);
      assert.equal(location.search, '?utm_source=seo-test');

      const destination = await fetch(`${localOrigin}${location.pathname}${location.search}`, {
        redirect: 'manual',
      });
      assert.equal(destination.status, 200);
      assert.equal(destination.headers.get('location'), null);
    }
  }
});

test('C: redirect manifest has no self redirects, duplicate sources, chains, or loops', () => {
  const sources = new Set<string>();
  for (const redirect of legacyRedirects) {
    assert.notEqual(redirect.source, redirect.destination);
    assert.equal(sources.has(redirect.source), false, `Duplicate source: ${redirect.source}`);
    assert.equal(
      legacyRedirects.some(({ source }) => source === redirect.destination),
      false,
      `Redirect chain starts at ${redirect.destination}`,
    );
    sources.add(redirect.source);
  }
});

test('Host A/B/C: canonical host and combined redirect destinations are deterministic', () => {
  assert.equal(PRODUCTION_DOMAIN_REDIRECT_OWNER, 'vercel-domain');
  assert.equal(isCanonicalProductionHost(APEX_HOST), false);
  assert.equal(isCanonicalProductionHost(PRODUCTION_HOST), true);

  const apexCurrent = getCanonicalRedirectUrl(`https://${APEX_HOST}/products`, '/products');
  assert.equal(apexCurrent.href, `${productionOrigin}/products`);

  const wwwCurrent = getCanonicalRedirectUrl(`${productionOrigin}/products`, '/products');
  assert.equal(wwwCurrent.href, `${productionOrigin}/products`);

  const legacyApex = getCanonicalRedirectUrl(
    `http://${APEX_HOST}/${encodeURI('商品紹介')}/?utm_source=test`,
    '/products',
  );
  assert.equal(legacyApex.href, `${productionOrigin}/products?utm_source=test`);
});

test('Inventory: confirmed and unverified legacy URLs remain disjoint and redirects are evidenced', () => {
  assert.equal(confirmedLegacyUrls.length, 24);
  assert.equal(unverifiedLegacyUrls.length, 0);

  const confirmedPaths = new Set(confirmedLegacyUrls.map(({ path }) => path));
  assert.equal(confirmedPaths.size, confirmedLegacyUrls.length);

  for (const path of deferredLegacyRecipePaths) {
    const entry = confirmedLegacyUrls.find((candidate) => candidate.path === path);
    assert.equal(entry?.disposition, 'defer', path);
    assert.equal(
      legacyRedirects.some(({ source }) => source === path),
      false,
      path,
    );
  }

  for (const redirect of legacyRedirects) {
    const inventoryEntry = confirmedLegacyUrls.find(({ path }) => path === redirect.source);
    assert.ok(inventoryEntry, `Missing evidence for redirect source ${redirect.source}`);
    assert.equal(inventoryEntry.disposition, 'redirect');
    assert.equal(inventoryEntry.destination, redirect.destination);
  }

  for (const entry of unverifiedLegacyUrls) {
    assert.equal(confirmedPaths.has(entry.candidate), false);
    assert.equal(
      legacyRedirects.some(({ source }) => source === entry.candidate),
      false,
    );
  }
});

test('D: all current indexable URLs return HTTP 200', async (context) => {
  if (!localOrigin) return context.skip('HTTP checks are disabled for the mutation unit run');
  for (const path of currentIndexablePaths) {
    const response = await fetch(`${localOrigin}${path}`, { headers: productionHeaders() });
    assert.equal(response.status, 200, path);

    if (path !== '/') {
      const trailingSlashResponse = await fetch(`${localOrigin}${path}/`, { redirect: 'manual' });
      assert.equal(trailingSlashResponse.status, 301, `${path}/`);
      const location = new URL(
        assertCanonicalHeader(trailingSlashResponse.headers.get('location')),
      );
      assert.equal(location.pathname, path);
    }
  }
});

test('E: all current indexable URLs have a self-referencing production canonical', async (context) => {
  if (!localOrigin) return context.skip('HTTP checks are disabled for the mutation unit run');
  for (const path of currentIndexablePaths) {
    const response = await fetch(`${localOrigin}${path}`, { headers: productionHeaders() });
    const canonical = canonicalFrom(await response.text());
    const expected = `${productionOrigin}${path === '/' ? '' : path}`;
    assert.equal(canonical, expected, path);
  }
});

test('Seasonal list: confirmed content and conservative schema are rendered safely', async (context) => {
  if (!localOrigin) return context.skip('HTTP checks are disabled for the mutation unit run');
  const response = await fetch(`${localOrigin}/seasonal`, { headers: productionHeaders() });
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const name of [
    '青朴葉餅',
    '飛騨桃パイ',
    '洋梨パイ',
    '小茄子の漬物',
    '赤かぶの漬物 長漬け',
  ]) {
    assert.match(html, new RegExp(name));
  }
  for (const period of ['1月〜3月', '2月〜4月', '4月〜11月', '7月〜10月', '9月〜5月']) {
    assert.match(html, new RegExp(period));
  }
  assert.doesNotMatch(html, />8月末まで</);
  assert.match(html, /8月15日ごろまで/);

  // 飛騨桃パイ: Human確定の事実だけが出ていること。
  assert.match(html, /桃のみずみずしさを残して。/);
  assert.match(html, /1個 250円（税込）/);
  assert.match(html, /8月〜9月上旬頃/);
  assert.match(html, /白桃：8月上旬〜8月下旬（状況により9月上旬頃まで）/);
  assert.match(html, /黄桃：8月下旬〜9月上旬頃/);
  assert.match(html, /レモンとバターで仕上げています/);
  assert.doesNotMatch(html, /無添加|保存料|品種|糖度|毎日販売/u);

  // 洋梨パイ: 予告のみ。桃パイの確定値を流用していないこと。
  assert.match(html, /9月〜10月頃/);
  assert.doesNotMatch(html, /洋梨パイ[\s\S]{0,400}?1個 250円（税込）/u);
  const statusBadges = (label: string) =>
    (html.match(new RegExp(`data-seasonal-status="${label}"`, 'g')) ?? []).length;
  assert.equal(statusBadges('販売中'), 3);
  assert.equal(statusBadges('まもなく終了'), 0);
  assert.equal(statusBadges('販売予定'), 2);
  assert.equal(statusBadges('販売終了'), 2);
  // 状態バッジと項目名で「販売予定」が二重の意味を持たないこと。
  assert.match(html, /<dt[^>]*>販売時期<\/dt>/);
  assert.doesNotMatch(html, /<dt[^>]*>販売予定<\/dt>/);
  // 販売を終えた商品は「今、店先にあるもの」ではなく終えたものの枠にだけ出る。
  assert.match(html, /今季の販売を終えたもの/);
  assert.match(html, /2026年の販売は8月中旬で終了しました/);
  assert.equal((html.match(/data-seasonal-cta=/g) ?? []).length, 3);

  // シャインマスカット大福: 9月の店先に出るHuman確定の事実だけ。
  assert.match(html, /9(<!-- -->)?月のお品書き/);
  assert.match(html, /シャインマスカット大福/);
  assert.match(html, /1個 300円（税込）/);
  assert.match(html, /9月〜11月/);
  assert.doesNotMatch(html, /シャインマスカット大福[\s\S]{0,600}?(賞味期限|アレルギー|産地)/u);
  // 画像はシャインマスカット大福の実物写真だけ（今の商品カード＋商品ごとの販売時期の行）。
  const images = html.match(/<img\b[^>]*>/g) ?? [];
  assert.equal(images.length, 2);
  assert.equal(
    images.every((image) => image.includes('shine-muscat-daifuku-main')),
    true,
  );
  assert.doesNotMatch(html, /placeholder|写真が届いたら|写真なし|仮画像/u);
  assert.doesNotMatch(html, /data-seasonal-commerce-cta/);
  assert.match(html, /通販[^<]*準備中|<dd[^>]*>準備中<\/dd>/);
  assert.match(html, /あり（BASE・食べチョク・ポケマル）/);
  for (let month = 1; month <= 12; month += 1) {
    assert.match(html, new RegExp(`href=["']#month-${month}["']`));
    assert.match(html, new RegExp(`id=["']month-${month}["']`));
  }

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(
    (match) => JSON.parse(match[1]),
  );
  assert.equal(
    jsonLd.some((entry) => entry['@type'] === 'BreadcrumbList'),
    true,
  );
  assert.equal(
    jsonLd.some((entry) => entry['@type'] === 'ItemList'),
    true,
  );
  assert.equal(
    jsonLd.some((entry) => entry['@type'] === 'Product'),
    false,
  );
  assert.equal(
    jsonLd.some((entry) => entry['@type'] === 'Offer'),
    false,
  );
});

test('Recipe Hub: confirmed content is rendered and unverified values stay out', async (context) => {
  if (!localOrigin) return context.skip('HTTP checks are disabled for the mutation unit run');

  const hub = await fetch(`${localOrigin}/recipes`, { headers: productionHeaders() });
  assert.equal(hub.status, 200);
  const hubHtml = await hub.text();
  for (const title of [
    'お餅のおいしい焼き方',
    '山田家の磯辺焼き',
    '海老餅の簡単チーズピザ',
    '昆布餅のお雑煮風',
    'カリッと揚げ豆餅',
    '焼き草餅のぜんざい',
    'たまり餅のバター黒胡椒',
    'ガーリックバター餅',
    '明太子マヨ餅',
    '草餅のあんバター',
    'レンジで簡単 だしバター餅',
    'トースターで簡単 ピザ餅',
    '餅と海老のアヒージョ',
  ]) {
    assert.match(hubHtml, new RegExp(title));
  }
  const visibleHub = hubHtml.replace(/<script[\s\S]*?<\/script>/g, '');
  assert.match(visibleHub, /山田家で親しんできた食べ方から/u);
  assert.doesNotMatch(visibleHub, /山田家で実際に食べている食べ方を、そのままご紹介します/u);

  // YM-009: 注目レシピ・検索/絞り込み・カードが初期HTML（SSR）に含まれること。
  assert.match(visibleHub, /注目レシピ/u);
  assert.match(visibleHub, /data-recipe-explorer/);
  assert.match(visibleHub, /お餅で絞り込む/u);
  assert.match(visibleHub, /13(<!-- -->)?件のレシピ/u);
  // 注目3件 + 全件13件 = 16カード。写真が無い間は文字だけのプレースホルダ枠。
  assert.equal((visibleHub.match(/data-recipe-card=/g) ?? []).length, 16);
  assert.equal((visibleHub.match(/data-recipe-image="placeholder"/g) ?? []).length, 16);
  assert.equal((visibleHub.match(/<img\b[^>]*>/g) ?? []).length, 1, 'only the hero image');
  assert.match(visibleHub, /レシピを見る/u);
  const hubJsonLd = [
    ...hubHtml.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
  const itemList = hubJsonLd.find((entry) => entry['@type'] === 'ItemList');
  assert.ok(itemList);
  assert.equal(itemList.itemListElement.length, 13);
  assert.equal(
    itemList.itemListElement.every((item: { url?: string }) =>
      item.url?.startsWith(`${productionOrigin}/recipes/`),
    ),
    true,
  );

  const detail = await fetch(`${localOrigin}/recipes/isobeyaki`, { headers: productionHeaders() });
  assert.equal(detail.status, 200);
  const detailHtml = await detail.text();
  // Human確認済みの分量がそのまま表示されていること。
  assert.match(detailHtml, /大さじ1/);
  assert.match(detailHtml, /大さじ2/);
  // 商品詳細への内部リンク（Recipe → Product）。
  assert.match(detailHtml, /href="\/products\/plain"/);
  // YM-009: 可視パンくず・基本情報・購入導線の見出し・商品一覧への導線。
  assert.match(detailHtml, /aria-label="パンくずリスト"/u);
  assert.match(detailHtml, /使うお餅/u);
  assert.match(detailHtml, /このレシピに使ったお餅/u);
  assert.match(detailHtml, /山田もち店のお餅をすべて見る/u);
  assert.match(detailHtml, /href="\/products"/);
  // 購入導線: BASEが主CTA、食べチョク・ポケマルは副次リンク（URLは data/site の正本）。
  assert.match(detailHtml, /BASEで購入する/u);
  assert.match(detailHtml, /いつもの通販サイトからも購入できます/u);
  assert.match(detailHtml, /href="https:\/\/www\.tabechoku\.com\/producers\/23313"/);
  assert.match(detailHtml, /href="https:\/\/poke-m\.com\/producers\/297308"/);

  // 未確認の数値をSEO目的で生成していないこと。
  for (const html of [hubHtml, detailHtml]) {
    assert.doesNotMatch(html, /人分|カロリー|kcal|調理時間/u);
  }

  // Independent Reviewで削除したHuman未確定の工程・エピソード・補足が戻らないこと。
  const visible = (html: string) => html.replace(/<script[\s\S]*?<\/script>/g, '');
  assert.doesNotMatch(visible(detailHtml), /山田家でいちばんよく食べている/u);
  assert.doesNotMatch(visible(detailHtml), /基本の目安/u);
  assert.doesNotMatch(visible(detailHtml), /甘さを調整/u);
  // 磯辺焼き・お雑煮風・バター黒胡椒は「水で濡らす」工程がHuman未確定。
  for (const slug of ['isobeyaki', 'kombu-mochi-ozoni-fu', 'tamari-mochi-butter-pepper']) {
    const response = await fetch(`${localOrigin}/recipes/${slug}`, {
      headers: productionHeaders(),
    });
    assert.equal(response.status, 200, slug);
    assert.doesNotMatch(visible(await response.text()), /水で濡ら/u, slug);
  }

  // アレンジ文言はHuman確定内容そのままで固定する。意味を広げる表現を許さない。
  assert.match(visible(detailHtml), /九州地方の甘い醤油/u);
  assert.doesNotMatch(visible(detailHtml), /九州地方などの甘い醤油/u);

  const zenzai = await fetch(`${localOrigin}/recipes/yomogi-mochi-zenzai`, {
    headers: productionHeaders(),
  });
  assert.equal(zenzai.status, 200);
  const zenzaiHtml = visible(await zenzai.text());
  assert.match(zenzaiHtml, /お湯の代わりに甘酒/u);
  assert.doesNotMatch(zenzaiHtml, /水の代わりに甘酒/u);

  const detailJsonLd = [
    ...detailHtml.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
  assert.equal(
    detailJsonLd.some((entry) => entry['@type'] === 'BreadcrumbList'),
    true,
  );
  // レシピ写真が未撮影の間はRecipe構造化データを出力しない。
  assert.equal(
    detailJsonLd.some((entry) => entry['@type'] === 'Recipe'),
    false,
  );
  for (const entry of detailJsonLd) {
    for (const forbidden of ['prepTime', 'cookTime', 'totalTime', 'nutrition', 'recipeYield']) {
      assert.equal(forbidden in entry, false, `${forbidden} must not be published`);
    }
  }
});

test('StickyPurchaseBar: every purchase area stays observable on the pages it guards', async (context) => {
  if (!localOrigin) return context.skip('HTTP checks are disabled for the mutation unit run');

  // StickyPurchaseBarはpathnameごとに[data-purchase-area]を取り直して監視する。
  // このマーカーが落ちると、クライアント遷移後にバーが購入エリアへ重なる。
  const expectedAreas = new Map([
    ['/recipes', 2], // ページ末尾のCta + footer
    ['/recipes/isobeyaki', 2], // RecipeProductCta + footer
    ['/recipes/mochi-yakikata', 2], // 全商品向けCta + footer
    ['/products/kombu', 2], // 商品末尾のCta + footer
    ['/gift', 2],
    ['/seasonal', 1], // footerのみ
  ]);

  for (const [path, expected] of expectedAreas) {
    const response = await fetch(`${localOrigin}${path}`, { headers: productionHeaders() });
    assert.equal(response.status, 200, path);
    // RSCペイロードのscriptにも属性名が現れるため、要素だけを数える。
    const html = (await response.text()).replace(/<script[\s\S]*?<\/script>/g, '');
    assert.equal((html.match(/data-purchase-area/g) ?? []).length, expected, path);
  }

  // レシピ詳細の購入CTA自体がマーカーを持っていること。
  const detail = await fetch(`${localOrigin}/recipes/isobeyaki`, { headers: productionHeaders() });
  const detailHtml = (await detail.text()).replace(/<script[\s\S]*?<\/script>/g, '');
  assert.match(
    detailHtml,
    /<section[^>]*data-purchase-area[^>]*aria-labelledby="recipe-product-title"/,
  );
});

test('StickyPurchaseBar: the purchase-area observer is re-registered per route', async () => {
  // 依存配列が [] に戻ると、クライアント遷移後の購入エリアが監視されなくなる。
  // 実ブラウザのroute transitionはこのテストランナーでは再現できないため、
  // 根本原因となる購読の張り直しをソース契約として固定する。
  const source = await readFile(
    new URL('../components/StickyPurchaseBar.tsx', import.meta.url),
    'utf8',
  );
  const observerEffect = source.slice(source.indexOf('new IntersectionObserver'));
  const dependencies = observerEffect.match(/\}, \[([^\]]*)\]\);/)?.[1];
  assert.equal(dependencies, 'pathname');
  assert.match(observerEffect, /observer\.disconnect\(\)/);
  assert.match(source, /setOverlapsPurchaseArea\(false\)/);
});

test('Product → Recipe: every product detail page links to its recipes', async (context) => {
  if (!localOrigin) return context.skip('HTTP checks are disabled for the mutation unit run');
  const expected = new Map([
    ['plain', 'isobeyaki'],
    ['yomogi', 'yomogi-mochi-zenzai'],
    ['sansyokumame', 'age-mame-mochi'],
    ['kombu', 'kombu-mochi-ozoni-fu'],
    ['tamari', 'tamari-mochi-butter-pepper'],
    ['ebi', 'ebi-mochi-cheese-pizza'],
  ]);

  for (const [productSlug, recipeSlug] of expected) {
    const response = await fetch(`${localOrigin}/products/${productSlug}`, {
      headers: productionHeaders(),
    });
    assert.equal(response.status, 200, productSlug);
    const html = await response.text();
    assert.match(html, new RegExp(`href="/recipes/${recipeSlug}"`), productSlug);
    assert.match(html, new RegExp('href="/recipes/mochi-yakikata"'), productSlug);
    // 購入導線を圧迫しないよう、商品ページのレシピリンクは2件までとする。
    const recipeLinks = html.match(/href="\/recipes\/[a-z-]+"/g) ?? [];
    assert.equal(new Set(recipeLinks).size, 2, productSlug);
  }
});

test('F: sitemap contains every current URL once and no legacy URL', async () => {
  if (!localOrigin) {
    for (const redirect of legacyRedirects) {
      assert.equal(currentIndexablePaths.includes(redirect.source), false);
    }
    return;
  }

  const response = await fetch(`${localOrigin}/sitemap.xml`, { headers: productionHeaders() });
  assert.equal(response.status, 200);
  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(locations.length, new Set(locations).size, 'Duplicate sitemap URL');
  assert.deepEqual(
    new Set(locations),
    new Set(currentIndexablePaths.map((path) => `${productionOrigin}${path === '/' ? '' : path}`)),
  );
  for (const redirect of legacyRedirects) {
    assert.equal(locations.includes(`${productionOrigin}${redirect.source}`), false);
  }
});

test('G: production robots policy allows crawling and declares the canonical sitemap', async (context) => {
  if (!localOrigin) return context.skip('HTTP checks are disabled for the mutation unit run');
  const response = spawnSync(
    'curl',
    [
      '--silent',
      '--show-error',
      '--noproxy',
      '*',
      '--resolve',
      `www.yamadamochi.com:${localPort}:127.0.0.1`,
      '--dump-header',
      '-',
      `http://www.yamadamochi.com:${localPort}/robots.txt`,
    ],
    { encoding: 'utf8' },
  );
  assert.equal(response.status, 0, response.stderr);
  assert.match(response.stdout, /^HTTP\/1\.1 200/m);
  assert.equal(shouldApplyNoIndex(PRODUCTION_HOST, true), false);
  assert.equal(shouldApplyNoIndex(PRODUCTION_HOST, false), true);
  assert.equal(shouldApplyNoIndex('yamadamochi.com', true), true);
  const robots = response.stdout.slice(response.stdout.search(/User-Agent:/i));
  assert.match(robots, /(?:^|\n)Allow: \/(?:\n|$)/);
  assert.doesNotMatch(robots, /(?:^|\n)Disallow: \/(?:\n|$)/);
  assert.match(robots, new RegExp(`Sitemap: ${productionOrigin}/sitemap\\.xml`));
});

function assertCanonicalHeader(value: string | null): string {
  assert.ok(value, 'Redirect response must include Location');
  return value;
}
