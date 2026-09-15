'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { trackRecipeProductClick, type RecipeProductClickPlacement } from '@/lib/analytics';

/**
 * レシピから商品ページへ向かう内部リンク。
 * `recipe_to_product_click` を送り、recipe → product → BASE の途中段を計測する。
 */
export function RecipeProductLink({
  productSlug,
  recipeSlug,
  placement,
  className,
  children,
}: {
  productSlug: string;
  recipeSlug?: string;
  placement: RecipeProductClickPlacement;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/products/${productSlug}`}
      className={className}
      onClick={() => trackRecipeProductClick({ recipeSlug, productSlug, placement })}
    >
      {children}
    </Link>
  );
}
