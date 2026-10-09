'use client';

import type { ReactNode } from 'react';
import { trackBaseClick, type BaseClickPlacement } from '@/lib/analytics';
import type { BaseClickItem } from '@/lib/base-click-items';

export function TrackedBaseAnchor({
  href,
  placement,
  item,
  className,
  children,
}: {
  href: string;
  placement: BaseClickPlacement;
  item?: BaseClickItem;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackBaseClick(placement, item)}
    >
      {children}
    </a>
  );
}
