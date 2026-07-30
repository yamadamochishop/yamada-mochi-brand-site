'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { site } from '@/data/site';
import { trackBaseClick } from '@/lib/analytics';

export function StickyPurchaseBar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [overlapsPurchaseArea, setOverlapsPurchaseArea] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 480);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    const targets = document.querySelectorAll('[data-purchase-area]');
    const observer = new IntersectionObserver(
      (entries) => setOverlapsPurchaseArea(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: '0px 0px 80px' },
    );
    targets.forEach((target) => observer.observe(target));
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
    };
  }, []);

  const visible = hasScrolled && !overlapsPurchaseArea;
  return (
    <aside
      aria-label="購入メニュー"
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-sumi/10 bg-base/95 px-3 pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)] backdrop-blur transition duration-300 lg:hidden ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-[1.35fr_1fr] gap-2">
        <a
          href={site.baseUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBaseClick('sticky_bar')}
          className="inline-flex min-h-12 items-center justify-center bg-green px-3 text-center text-sm tracking-[0.06em] text-white"
          tabIndex={visible ? 0 : -1}
        >
          オンラインショップで購入
        </a>
        <Link
          href="/products"
          className="inline-flex min-h-12 items-center justify-center border border-green px-3 text-sm tracking-[0.08em] text-green"
          tabIndex={visible ? 0 : -1}
        >
          商品を見る
        </Link>
      </div>
    </aside>
  );
}
