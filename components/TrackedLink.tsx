import type { ReactNode } from 'react';
import type { TopPageEvent } from '@/lib/analytics';
import { baseItemForUrl, isExternalBaseLink } from '@/lib/base-click-items';
import { TrackedLinkClient } from '@/components/TrackedLinkClient';

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
  const baseClick = isExternalBaseLink(href, external) ? { item: baseItemForUrl(href) } : undefined;

  return (
    <TrackedLinkClient
      href={href}
      event={event}
      className={className}
      external={external}
      baseClick={baseClick}
    >
      {children}
    </TrackedLinkClient>
  );
}
