import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { catalogSets, fixedSetVariants } from '../data/catalog.ts';

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

test('Human-confirmed BASE URLs match all eight delivery, packaging and bag-count combinations', () => {
  // Independent fixture copied from the Human confirmation, not derived from production data.
  const expected = [
    ['常温便', 'ご自宅用', 6, 'セット', '149543143'],
    ['常温便', '贈りもの用', 6, 'ギフト', '160959142'],
    ['常温便', 'ご自宅用', 12, 'セット', '149544078'],
    ['常温便', '贈りもの用', 12, 'ギフト', '160959167'],
    ['冷凍便', 'ご自宅用', 6, 'セット', '160965806'],
    ['冷凍便', 'ご自宅用', 12, 'セット', '160965880'],
    ['冷凍便', '贈りもの用', 6, 'ギフト', '160965827'],
    ['冷凍便', '贈りもの用', 12, 'ギフト', '160965932'],
  ] as const;
  assert.equal(fixedSetVariants.length, expected.length);
  for (const [delivery, purpose, bags, suffix, itemId] of expected) {
    const variant = fixedSetVariants.find(
      (item) => item.delivery === delivery && item.purpose === purpose && item.bags === bags,
    );
    assert.ok(variant, `${delivery}/${purpose}/${bags}`);
    assert.equal(
      variant.name,
      `【${delivery}・${purpose}】飛騨高山の切り餅 6種食べ比べ｜${bags}袋${suffix}`,
    );
    assert.equal(variant.baseUrl, `https://yamadamochi.thebase.in/items/${itemId}`);
  }
  assert.equal(catalogSets[0].baseUrl, 'https://yamadamochi.thebase.in/items/160959142');
  assert.equal(catalogSets[2].baseUrl, 'https://yamadamochi.thebase.in/items/160959167');
  assert.equal(catalogSets[1].baseUrl, 'https://yamadamochi.thebase.in/items/149543351');
  assert.equal(catalogSets[1].price, '2,980円（税込）');
});

test('catalog URL guard accepts the confirmed catalogue', async () => {
  const result = await checkFixture(source);
  assert.equal(result.status, 0, result.output);
});

test('catalog URL guard rejects shop fallback and unsafe variant URLs', async () => {
  for (const url of ['https://yamadamochi.thebase.in/', 'https://example.com/items/123456']) {
    const fixture = source.replace('https://yamadamochi.thebase.in/items/160965806', url);
    assert.notEqual(fixture, source);
    const result = await checkFixture(fixture);
    assert.equal(result.status, 1);
    assert.match(result.output, /Human-confirmed individual BASE URL/);
  }
});

test('catalog URL guard rejects duplicate single-product and fixed-set URLs', async () => {
  const duplicate = await checkFixture(source.replace('/items/42083333', '/items/42083183'));
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.output, /individual catalogue BASE URLs must be unique/);
  const fixture = source.replace('/items/160965806', '/items/160965880');
  assert.notEqual(fixture, source);
  const result = await checkFixture(fixture);
  assert.equal(result.status, 1);
  assert.match(result.output, /resolved fixed-set variant URLs must be unique/);
});
