import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const source = await readFile(new URL('../data/catalog.ts', import.meta.url), 'utf8');
const checker = new URL('../scripts/check-catalog.mjs', import.meta.url).pathname;

async function checkFixture(catalog: string) {
  const root = await mkdtemp(join(tmpdir(), 'yamada-catalog-url-'));
  try {
    for (const directory of ['app', 'components', 'data', 'lib', 'scripts'])
      await mkdir(join(root, directory));
    await writeFile(join(root, 'data/catalog.ts'), catalog);
    const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('catalog URL guard: fallback and a verified individual variant URL are accepted', async () => {
  const fallback = await checkFixture(source);
  assert.equal(fallback.status, 0, fallback.output);
  // Test fixture only: not a guessed production URL.
  const resolved = await checkFixture(
    source.replace(
      "baseUrl: 'https://yamadamochi.thebase.in/',\n      // 在庫",
      "baseUrl: set.bags === 6 && purpose === 'ご自宅用' && delivery === '常温便' ? 'https://yamadamochi.thebase.in/items/123456' : 'https://yamadamochi.thebase.in/',\n      // 在庫",
    ),
  );
  assert.equal(resolved.status, 0, resolved.output);
});

test('catalog URL guard: replacing a legacy fixed gift fallback with an individual URL is accepted', async () => {
  const resolved = await checkFixture(
    source.replace(
      "baseUrl: 'https://yamadamochi.thebase.in/'",
      "baseUrl: 'https://yamadamochi.thebase.in/items/123456'",
    ),
  );
  assert.equal(resolved.status, 0, resolved.output);
});

test('catalog URL guard: duplicate individual catalogue URLs and unsafe variant URLs fail', async () => {
  const duplicate = await checkFixture(source.replace('/items/42083333', '/items/42083183'));
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.output, /individual catalogue BASE URLs must be unique/);
  const unsafe = await checkFixture(
    source.replace(
      "baseUrl: 'https://yamadamochi.thebase.in/',\n      // 在庫",
      "baseUrl: 'https://example.com/items/123456',\n      // 在庫",
    ),
  );
  assert.equal(unsafe.status, 1);
  assert.match(unsafe.output, /verified individual BASE URL/);
});

test('catalog URL guard: resolved variants cannot share an individual product URL', async () => {
  const duplicate = await checkFixture(
    source.replace(
      "baseUrl: 'https://yamadamochi.thebase.in/',\n      // 在庫",
      "baseUrl: 'https://yamadamochi.thebase.in/items/123456',\n      // 在庫",
    ),
  );
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.output, /resolved fixed-set variant URLs must be unique/);
});
