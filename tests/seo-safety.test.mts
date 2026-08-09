import assert from 'node:assert/strict';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
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
]);
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

  for (const name of ['青朴葉餅', '飛騨桃パイ', '小茄子の漬物', '赤かぶの漬物 長漬け']) {
    assert.match(html, new RegExp(name));
  }
  for (const period of ['1月〜3月', '2月〜4月', '4月〜11月', '7月〜10月', '9月〜5月']) {
    assert.match(html, new RegExp(period));
  }
  assert.match(html, /8月末終了予定/);
  assert.doesNotMatch(html, />8月末まで</);
  assert.match(html, /8月15日ごろまで/);
  assert.equal((html.match(/>販売中</g) ?? []).length, 3);
  assert.equal((html.match(/>まもなく終了</g) ?? []).length, 1);
  assert.equal((html.match(/data-seasonal-cta=/g) ?? []).length, 3);
  assert.equal((html.match(/<img\b/g) ?? []).length, 0);
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
