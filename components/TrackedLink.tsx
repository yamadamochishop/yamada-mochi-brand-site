'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { TopPageEvent } from '@/lib/analytics';
import { trackEvent } from '@/lib/analytics';

export function TrackedLink({
  href,
  event,
  className,
  children,
  external = false,
}: {
  href: string;
  event: TopPageEvent;
  className: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => trackEvent(event)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={() => trackEvent(event)}>
      {children}
    </Link>
  );
}
