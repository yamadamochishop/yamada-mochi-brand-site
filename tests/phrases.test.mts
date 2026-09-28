import assert from 'node:assert/strict';
import test from 'node:test';
import { products } from '../data/catalog.ts';
import { splitPhrases } from '../lib/phrases.ts';

test('splitPhrases: breaks only after 、 and keeps the text unchanged', () => {
  assert.deepEqual(splitPhrases('米のおいしさを、そのまま味わう。'), [
    '米のおいしさを、',
    'そのまま味わう。',
  ]);
  assert.deepEqual(splitPhrases('香ばしさ、重なる。'), ['香ばしさ、', '重なる。']);
  assert.deepEqual(splitPhrases('句読点なし'), ['句読点なし']);
  assert.deepEqual(splitPhrases(''), []);
});

test('splitPhrases: every product catchcopy round-trips and no phrase is too long for a phone', () => {
  for (const product of products) {
    const phrases = splitPhrases(product.catchcopy);
    assert.equal(phrases.join(''), product.catchcopy, product.slug);
    // 390px幅・24pxの明朝で1行に収まるのは約12文字。これを超える句は途中で折り返す。
    for (const phrase of phrases) {
      assert.ok([...phrase].length <= 12, `${product.slug}: ${phrase}`);
    }
  }
});
