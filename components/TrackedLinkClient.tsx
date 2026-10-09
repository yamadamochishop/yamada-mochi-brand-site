'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { trackTrackedLinkClick, type TopPageEvent } from '@/lib/analytics';
import type { BaseClickItem } from '@/lib/base-click-items';

export function TrackedLinkClient({
  href,
  event,
  className,
  children,
  external,
  baseClick,
}: {
  href: string;
  event: TopPageEvent;
  className: string;
  children: ReactNode;
  external: boolean;
  baseClick?: { item?: BaseClickItem };
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => trackTrackedLinkClick(event, baseClick)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={() => trackTrackedLinkClick(event)}>
      {children}
    </Link>
  );
}
