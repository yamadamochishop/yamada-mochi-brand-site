'use client';

import { useEffect } from 'react';
import { trackRecipeView } from '@/lib/analytics';

/** レシピ詳細の表示を `recipe_view` として送る。描画はしない。 */
export function RecipeViewTracker({ recipeSlug }: { recipeSlug: string }) {
  useEffect(() => {
    trackRecipeView(recipeSlug);
  }, [recipeSlug]);

  return null;
}
