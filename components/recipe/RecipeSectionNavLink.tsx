'use client';

import type { ReactNode } from 'react';
import { trackRecipeSectionNav } from '@/lib/analytics';

export function RecipeSectionNavLink({
  recipeSlug,
  sectionId,
  className,
  children,
}: {
  recipeSlug: string;
  sectionId: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${sectionId}`}
      className={className}
      onClick={() => trackRecipeSectionNav(recipeSlug, sectionId)}
    >
      {children}
    </a>
  );
}
