'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { site } from '@/data/site';

const nav = [
  ['ブランド', '/brand-story'],
  ['商品', '/products'],
  ['季節', '/seasonal'],
  ['レシピ', '/recipes'],
  ['ものづくり', '/craft'],
  ['三代目の想い', '/third-generation'],
  ['ギフト', '/gift'],
  ['朝市', '/market'],
  ['FAQ', '/faq'],
];

/** 今いるページ（または配下のページ）がそのナビ項目に属するか。 */
function isCurrentSection(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ariaCurrent(pathname: string | null, href: string) {
  if (pathname === href) return 'page' as const;
  return isCurrentSection(pathname, href) ? ('true' as const) : undefined;
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const hasOpenedMenuRef = useRef(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const closeMenuOnDesktop = () => {
      if (mediaQuery.matches) {
        setIsOpen(false);
      }
    };

    closeMenuOnDesktop();
    mediaQuery.addEventListener('change', closeMenuOnDesktop);

    return () => {
      mediaQuery.removeEventListener('change', closeMenuOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    hasOpenedMenuRef.current = true;
    const previousOverflow = document.body.style.overflow;
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeMenuOnEscape);
    mobileNavigationRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeMenuOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && hasOpenedMenuRef.current) {
      menuButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-sumi/10 bg-base/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-sumi/35 font-serifjp text-xl">
            山
          </span>
          <span>
            <span className="block font-serifjp text-lg tracking-[0.2em]">{site.name}</span>
            <span className="block text-xs tracking-brand text-sumi/65">{site.enName}</span>
          </span>
        </Link>
        <nav
          aria-label="メインナビゲーション"
          className="hidden items-center gap-4 text-sm tracking-[0.04em] text-sumi/70 lg:flex xl:gap-7 xl:tracking-[0.12em]"
        >
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={ariaCurrent(pathname, href)}
              className={`whitespace-nowrap py-2 underline-offset-[10px] transition-colors hover:text-sumi ${
                isCurrentSection(pathname, href) ? 'text-sumi underline decoration-brown/60' : ''
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/products"
            className="whitespace-nowrap border border-sumi px-4 py-3 text-sumi transition-colors hover:bg-sumi hover:text-base xl:px-5"
          >
            商品を選ぶ
          </Link>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className="grid h-11 w-11 place-items-center border border-sumi/25 text-sumi lg:hidden"
          aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </div>
      <nav
        ref={mobileNavigationRef}
        id="mobile-navigation"
        aria-label="スマートフォン用ナビゲーション"
        className={`${isOpen ? 'block' : 'hidden'} max-h-[calc(100dvh-4.8125rem)] overflow-y-auto overscroll-contain border-t border-sumi/10 bg-base px-5 pb-6 pt-3 lg:hidden`}
      >
        <div className="mx-auto flex max-w-7xl flex-col">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={ariaCurrent(pathname, href)}
              className={`flex items-center justify-between border-b border-sumi/10 py-4 text-sm tracking-[0.12em] ${
                isCurrentSection(pathname, href) ? 'text-sumi' : 'text-sumi/75'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {label}
              {isCurrentSection(pathname, href) ? (
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brown/70" />
              ) : null}
            </Link>
          ))}
          <Link
            href="/products"
            className="mt-5 bg-sumi px-5 py-4 text-center text-sm tracking-[0.12em] text-base"
            onClick={() => setIsOpen(false)}
          >
            商品を選ぶ
          </Link>
        </div>
      </nav>
    </header>
  );
}
