import assert from 'node:assert/strict';
import test from 'node:test';
import { createRecipeSearchDebouncer } from '../lib/recipe-search.ts';

test('recipe search: query change sends one event and a later filter change does not resend it', async () => {
  const events: { queryLength: number; resultCount: number }[] = [];
  let resultCount = 2;
  const debouncer = createRecipeSearchDebouncer((payload) => events.push(payload), 0);

  // 検索入力。
  debouncer.onQueryChange('チーズ', () => resultCount);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.deepEqual(events, [{ queryLength: 3, resultCount: 2 }]);

  // 商品filterで件数だけが変わっても、検索語が変わらなければ再送しない。
  resultCount = 1;
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(events.length, 1);

  debouncer.dispose();
});

test('recipe search: debounce reports the latest result count without sending the query text', async () => {
  const events: { queryLength: number; resultCount: number }[] = [];
  let resultCount = 2;
  const debouncer = createRecipeSearchDebouncer((payload) => events.push(payload), 10);

  debouncer.onQueryChange('チーズ', () => resultCount);
  resultCount = 1;
  await new Promise((resolve) => setTimeout(resolve, 20));

  assert.deepEqual(events, [{ queryLength: 3, resultCount: 1 }]);
  assert.equal('query' in events[0], false);
  debouncer.dispose();
});
