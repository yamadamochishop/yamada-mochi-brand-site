'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';
import { trackBaseClick } from '@/lib/analytics';

export function StickyPurchaseBar() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [overlapsPurchaseArea, setOverlapsPurchaseArea] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 480);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  // 購入エリアはページごとに入れ替わる。クライアント遷移では前のページの
  // ノードが差し替わるため、pathnameごとに監視対象を取り直さないと
  // 遷移後のページの購入エリアが監視されず、バーが重なってしまう。
  useEffect(() => {
    // 前のページの交差状態を引き継がない。
    setOverlapsPurchaseArea(false);

    // IntersectionObserverのコールバックは変化した要素だけを渡すため、
    // 交差中の要素を保持して全体の状態から判定する。
    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        setOverlapsPurchaseArea(intersecting.size > 0);
      },
      { rootMargin: '0px 0px 80px' },
    );

    document.querySelectorAll('[data-purchase-area]').forEach((target) => {
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const visible = pathname !== '/seasonal' && hasScrolled && !overlapsPurchaseArea;
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
