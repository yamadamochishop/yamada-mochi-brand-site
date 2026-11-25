'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  trackRecipeInternalClick,
  type RecipeInternalLinkType,
  type RecipeInternalPlacement,
} from '@/lib/analytics';

export type RecipeLinkTracking = {
  recipeSlug: string;
  linkType: RecipeInternalLinkType;
  placement: RecipeInternalPlacement;
};

export function TrackedRecipeLink({
  href,
  tracking,
  className,
  children,
  'aria-label': ariaLabel,
}: {
  href: string;
  tracking: RecipeLinkTracking;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackRecipeInternalClick({ ...tracking, targetPath: href })}
    >
      {children}
    </Link>
  );
}
