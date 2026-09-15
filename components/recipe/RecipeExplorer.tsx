'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { trackRecipeFilterUse, trackRecipeSearch } from '@/lib/analytics';
import {
  filterRecipeList,
  recipeSortOptions,
  type RecipeListItem,
  type RecipeSortKey,
} from '@/lib/recipe-page';

const chipBase =
  'inline-flex min-h-10 items-center rounded-full border px-4 text-sm tracking-[0.06em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi';
const chipIdle = `${chipBase} border-sumi/20 bg-base text-sumi/70 hover:border-sumi`;
const chipActive = `${chipBase} border-sumi bg-sumi text-base`;

/**
 * レシピ一覧の検索・絞り込み・並び替え。
 *
 * 初期描画は全件（SSR）で、操作するとクライアント側で絞り込む。照合ロジックは
 * `lib/recipe-page.ts` の `filterRecipeList` に置き、サーバー側と共有する。
 * URLには状態を持たせない（絞り込み結果をインデックスさせない）。
 *
 * 将来の拡張点:
 * - タグ絞り込み: `tags` を受け取って `filter.tag` に渡すだけ。
 * - 人気順: `popularityScore` が入れば `sort: 'popular'` がそのまま効く。
 */
export function RecipeExplorer({
  recipes,
  products,
}: {
  recipes: RecipeListItem[];
  products: { slug: string; label: string }[];
}) {
  const [query, setQuery] = useState('');
  const [productSlug, setProductSlug] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<RecipeSortKey>('default');
  const inputId = useId();
  const sortId = useId();
  const statusId = useId();

  const results = useMemo(
    () => filterRecipeList(recipes, { query, productSlug, sort }),
    [recipes, query, productSlug, sort],
  );

  // 検索イベントは入力が落ち着いてから1回だけ送る（検索語そのものは送らない）。
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!query.trim()) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      trackRecipeSearch({ queryLength: query.trim().length, resultCount: results.length });
    }, 800);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query, results.length]);

  const isFiltered = Boolean(query.trim()) || Boolean(productSlug) || sort !== 'default';

  function selectProduct(slug: string | undefined) {
    setProductSlug(slug);
    const next = filterRecipeList(recipes, { query, productSlug: slug, sort });
    trackRecipeFilterUse({
      filterType: 'product',
      value: slug ?? 'all',
      resultCount: next.length,
    });
  }

  function selectSort(key: RecipeSortKey) {
    setSort(key);
    const next = filterRecipeList(recipes, { query, productSlug, sort: key });
    trackRecipeFilterUse({ filterType: 'sort', value: key, resultCount: next.length });
  }

  function reset() {
    setQuery('');
    setProductSlug(undefined);
    setSort('default');
  }

  return (
    <div data-recipe-explorer>
      <div className="border border-sumi/15 bg-white/35 p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label htmlFor={inputId} className="text-xs tracking-brand text-brown/85">
              レシピを探す
            </label>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="レシピ名・材料・お餅の名前で探す"
              autoComplete="off"
              aria-describedby={statusId}
              className="mt-3 block min-h-12 w-full border border-sumi/20 bg-base px-4 text-base text-sumi placeholder:text-sumi/40 focus:border-sumi focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor={sortId} className="text-xs tracking-brand text-brown/85">
              並び順
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(event) => selectSort(event.target.value as RecipeSortKey)}
              className="mt-3 block min-h-12 w-full border border-sumi/20 bg-base px-4 text-base text-sumi focus:border-sumi focus:outline-none md:w-44"
            >
              {recipeSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs tracking-brand text-brown/85">お餅で絞り込む</p>
          <div role="group" aria-label="お餅で絞り込む" className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={!productSlug}
              onClick={() => selectProduct(undefined)}
              className={productSlug ? chipIdle : chipActive}
            >
              すべて
            </button>
            {products.map((product) => (
              <button
                key={product.slug}
                type="button"
                aria-pressed={productSlug === product.slug}
                onClick={() => selectProduct(product.slug)}
                className={productSlug === product.slug ? chipActive : chipIdle}
              >
                {product.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-sumi/65"
      >
        <span>
          {results.length}件のレシピ
          {isFiltered ? '（絞り込み中）' : null}
        </span>
        {isFiltered ? (
          <button
            type="button"
            onClick={reset}
            className="min-h-11 underline underline-offset-8 transition hover:text-sumi"
          >
            絞り込みを解除
          </button>
        ) : null}
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {results.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-sumi/20 p-8 text-center">
          <p className="leading-8 text-sumi/70">
            この条件に合うレシピはまだありません。
            <br />
            別のことばやお餅で探してみてください。
          </p>
        </div>
      )}
    </div>
  );
}
