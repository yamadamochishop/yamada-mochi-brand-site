'use client';

import type { ReactNode } from 'react';
import { trackBaseClick, type BaseClickPlacement } from '@/lib/analytics';

export function TrackedBaseLink({
  href,
  placement,
  className,
  children,
}: {
  href: string;
  placement: BaseClickPlacement;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackBaseClick(placement)}
    >
      {children}
    </a>
  );
}
