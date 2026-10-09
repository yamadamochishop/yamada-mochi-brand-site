import type { ReactNode } from 'react';
import type { BaseClickPlacement } from '@/lib/analytics';
import { baseItemForUrl } from '@/lib/base-click-items';
import { TrackedBaseAnchor } from '@/components/TrackedBaseAnchor';

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
    <TrackedBaseAnchor
      href={href}
      placement={placement}
      item={baseItemForUrl(href)}
      className={className}
    >
      {children}
    </TrackedBaseAnchor>
  );
}
