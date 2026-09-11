'use client';

import type { ReactNode } from 'react';
import {
  trackSalesChannelClick,
  type SalesChannelClickChannel,
  type SalesChannelClickPlacement,
} from '@/lib/analytics';

export function TrackedSalesChannelLink({
  href,
  channel,
  placement,
  className,
  children,
}: {
  href: string;
  channel: SalesChannelClickChannel;
  placement: SalesChannelClickPlacement;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackSalesChannelClick(channel, placement)}
    >
      {children}
    </a>
  );
}
