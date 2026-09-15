export const recipeSearchDebounceMs = 800;

export type RecipeSearchPayload = {
  queryLength: number;
  resultCount: number;
};

/**
 * 検索語の変更だけを計測するdebouncer。
 * 絞り込み・並び替えはこのインスタンスに通知しないため、検索イベントを再送しない。
 */
export function createRecipeSearchDebouncer(
  track: (payload: RecipeSearchPayload) => void,
  delay = recipeSearchDebounceMs,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  function clear() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  return {
    onQueryChange(query: string, getResultCount: () => number) {
      clear();
      const normalizedQuery = query.trim();
      if (!normalizedQuery) return;

      timer = setTimeout(() => {
        timer = null;
        track({ queryLength: normalizedQuery.length, resultCount: getResultCount() });
      }, delay);
    },
    dispose: clear,
  };
}
