import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { SectionHeading } from '@/components/SectionHeading';
import { Cta } from '@/components/Cta';
import { JsonLd } from '@/components/JsonLd';
import { SetLineup } from '@/components/SetLineup';
import { SetDeliveryCompare } from '@/components/SetDeliveryCompare';
import { SetDeliveryGuide } from '@/components/SetDeliveryGuide';
import { products, fixedSetVariants } from '@/data/catalog';
import { nekoposListNote } from '@/lib/shipping';
import { breadcrumbJsonLd, pageOpenGraph, productListJsonLd, setListJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: '商品一覧｜飛騨高山の切り餅・通販',
  description:
    '飛騨高山の定番切り餅6種類と6袋・12袋の食べ比べセット。ご自宅用・贈りもの用、常温便・冷凍便をお選びいただけます。',
  openGraph: pageOpenGraph({
    title: '商品一覧｜飛騨高山の切り餅・通販｜山田もち店',
    description:
      '飛騨高山の定番切り餅6種類と6袋・12袋の食べ比べセット。ご自宅用・贈りもの用、常温便・冷凍便をお選びいただけます。',
    path: '/products',
    image: '/images/latest-six-flavors-light.webp',
    imageAlt: '山田もち店の切り餅6種類を一列に並べた商品一覧',
  }),
  alternates: {
    canonical: '/products',
  },
};

export default function ProductsPage() {
  return (
    <main className="ym-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: '商品一覧', path: '/products' },
        ])}
      />
      <JsonLd data={productListJsonLd(products)} />
      <section className="ym-container py-24 md:py-32">
        <SectionHeading
          eyebrow="PRODUCTS"
          title="飛騨高山の切り餅 6種類"
          lead="飛騨高山の田んぼで育てたもち米を使った、山田もち店の定番6種類です。"
          as="h1"
        />
        <nav
          aria-label="商品一覧のページ内ナビ"
          className="mx-auto -mt-4 mb-10 grid max-w-3xl gap-2 sm:grid-cols-3"
        >
          <Link href="#sets" className="ym-btn ym-btn-quiet px-3">
            セット（6袋・12袋）
          </Link>
          <Link href="#singles" className="ym-btn ym-btn-quiet px-3">
            単品（4枚入り）
          </Link>
          <Link href="#delivery" className="ym-btn ym-btn-quiet px-3">
            常温便と冷凍便の違い
          </Link>
        </nav>
        <p className="mx-auto -mt-4 mb-14 max-w-2xl border border-green/25 bg-white/50 px-5 py-3 text-center text-sm leading-7 text-sumi/75">
          {nekoposListNote}
        </p>
        <div className="relative mb-16 aspect-[4/3] overflow-hidden bg-[#efe9dc] md:mb-20 md:aspect-[16/7]">
          <Image
            src="/images/latest-six-flavors-light.webp"
            alt="山田もち店の切り餅6種類を一列に並べた商品一覧"
            fill
            priority
            sizes="(min-width: 768px) 1200px, 100vw"
            className="object-cover object-center"
          />
        </div>
        <section
          id="singles"
          aria-label="単品（4枚入り）"
          className="grid gap-x-10 gap-y-20 md:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </section>
      </section>
      <section id="sets" className="ym-container pb-20 md:pb-28">
        <JsonLd data={setListJsonLd(fixedSetVariants, '/products')} />
        <SectionHeading
          eyebrow="SETS"
          title="6種類を楽しむセット商品"
          lead="ご自宅の食卓にも、大切な方への贈りものにも。包装と配送方法をお選びいただけます。"
        />
        <SetDeliveryCompare />
        <SetLineup />
        <div id="delivery">
          <SetDeliveryGuide />
        </div>
      </section>
      <Cta />
    </main>
  );
}
