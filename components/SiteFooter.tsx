import Link from 'next/link';
import { site } from '@/data/site';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';

const linkClassName =
  'block rounded-sm py-1 transition hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi';

const productLinks = [
  { label: '商品一覧', href: '/products' },
  { label: 'ギフト・食べ比べセット', href: '/gift' },
];

const brandLinks = [
  { label: 'ブランドストーリー', href: '/brand-story' },
  { label: 'ものづくり', href: '/craft' },
  { label: '三代目の想い', href: '/third-generation' },
  { label: '陣屋前朝市', href: '/market' },
  { label: 'お客様の声', href: '/voices' },
  { label: 'お知らせ', href: '/news' },
];

const supportLinks = [
  { label: 'よくある質問', href: '/faq' },
  { label: 'お問い合わせ', href: '/contact' },
];

export function SiteFooter() {
  const telHref = `tel:${site.tel.replace(/-/g, '')}`;

  return (
    <footer data-purchase-area className="border-t border-sumi/10 bg-[#ede7dc]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:gap-x-8 md:gap-y-14 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serifjp text-2xl tracking-[0.2em]">{site.name}</p>
          <p className="mt-3 text-xs tracking-brand text-sumi/55">{site.enName}</p>
          <p className="mt-8 max-w-md leading-8 text-sumi/70">
            {site.tagline}
            <br />
            飛騨高山で育てたもち米を使い、家族で仕上げるお餅を、陣屋前朝市からお届けしています。
          </p>

          <div className="mt-10 max-w-sm border border-green/25 bg-green px-6 py-6 text-base">
            <p className="text-xs tracking-brand text-base/60">ONLINE SHOP</p>
            <p className="mt-3 leading-7 text-base/80">飛騨高山から全国へお届けします。</p>
            <TrackedBaseLink
              href={site.baseUrl}
              placement="footer_cta"
              className="mt-5 flex min-h-11 w-full items-center justify-center border border-base/80 px-6 text-sm tracking-[0.1em] text-base transition hover:border-sumi hover:bg-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-base"
            >
              オンラインショップを見る
            </TrackedBaseLink>
          </div>
        </div>

        <nav aria-label="商品を選ぶ" className="text-sm leading-9 text-sumi/70">
          <h2 className="text-xs tracking-brand text-sumi/50">商品を選ぶ</h2>
          <ul className="mt-4">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="山田もち店について" className="text-sm leading-9 text-sumi/70">
          <h2 className="text-xs tracking-brand text-sumi/50">山田もち店について</h2>
          <ul className="mt-4">
            {brandLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm leading-9 text-sumi/70">
          <h2 className="text-xs tracking-brand text-sumi/50">店舗・お問い合わせ</h2>
          <address className="mt-4 not-italic leading-9">
            <p>{site.address}</p>
            <a href={telHref} className={linkClassName}>
              TEL {site.tel}
            </a>
          </address>
          <nav aria-label="サポート" className="mt-3">
            <ul>
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-sumi/10 px-5 py-5 text-center text-xs tracking-[0.12em] text-sumi/50">
        © {site.name} ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
