import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta } from "@/components/Cta";
import { PurchaseGuide } from "@/components/PurchaseGuide";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd, pageOpenGraph, productJsonLd } from "@/lib/seo";
import { getProduct, getRelatedProducts, products } from "@/data/products";
import { faqs } from "@/data/faqs";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.seo.title,
    description: product.seo.description,
    openGraph: pageOpenGraph({
      title: product.seo.title,
      description: product.seo.description,
      path: `/products/${product.slug}`,
      image: product.image,
      imageAlt: product.imageAlt || `${product.name}の商品写真`
    }),
    alternates: {
      canonical: `/products/${product.slug}`
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product.related);

  return (
    <main className="ym-page">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "商品一覧", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` }
        ])}
      />
      <section className="ym-container py-20 md:py-28">
        <article className="mx-auto max-w-5xl">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#efe9dc] md:aspect-[16/10]">
            <Image src={product.image} alt={product.imageAlt || `${product.name}の商品写真`} fill priority sizes="(min-width: 768px) 672px, 100vw" className="object-contain p-8 md:p-16" />
          </div>

          <div className="mx-auto mt-14 max-w-3xl text-center md:mt-20">
            <p className="mb-5 text-xs tracking-brand text-brown/60">{product.english}</p>
            <h1 className="font-serifjp text-4xl tracking-[0.16em] md:text-6xl">{product.name}</h1>
            <p className="mt-8 font-serifjp text-3xl leading-relaxed tracking-[0.1em] md:text-5xl">
              {product.catchcopy}
            </p>
          </div>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <p className="text-xs tracking-brand text-brown/60">ABOUT THIS MOCHI</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">このお餅について</h2>
            <p className="mt-8 leading-9 text-sumi/70">{product.story}</p>
            <p className="mt-6 leading-9 text-sumi/70">家族で育てたもち米を使い、状態を見ながら一つひとつ丁寧に仕上げています。素材ごとの味わいを生かし、日々の食卓でも楽しんでいただける切り餅です。</p>
            <div className="mt-10 border-y border-sumi/10 py-8">
              <p className="text-sm tracking-brand text-sumi/45">PRICE</p>
              <p className="mt-3 text-2xl">{product.price}</p>
              <PurchaseGuide shelfLife={product.shelfLife} shipping={product.shipping} />
              <a
                href={product.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full justify-center bg-green px-8 py-4 text-base tracking-[0.12em] transition hover:bg-sumi md:w-auto"
              >
                BASEで購入する
              </a>
            </div>
          </section>

          <section className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9dc]">
              <Image src="/images/latest-six-flavors-dark.webp" alt="山田もち店の切り餅6種類の形と色" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-center" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9dc]">
              <Image src="/images/latest-craft-rolling.webp" alt="餅を均一に伸ばして整える製造風景" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-[58%_center]" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9dc]">
              <Image src="/images/latest-sixset-hands.webp" alt="家族の手から渡す切り餅6種詰め合わせ" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-center" />
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <p className="text-xs tracking-brand text-brown/60">TASTE</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">味の特徴</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {product.traits.map((trait) => (
                <div key={trait.title} className="border border-sumi/10 bg-[#f1ece3] p-5">
                  <h3 className="font-serifjp text-lg tracking-[0.1em]">{trait.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-sumi/65">{trait.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl border-l-2 border-[color:var(--accent)] bg-white/35 p-7 md:mt-20" style={{ "--accent": product.accent } as CSSProperties}>
            <p className="text-xs tracking-brand text-brown/60">OWNER&apos;S RECOMMENDATION</p>
            <h2 className="mt-3 font-serifjp text-2xl tracking-[0.12em]">店主おすすめ</h2>
            <p className="mt-5 leading-8 text-sumi/70">{product.ownerRecommendation}</p>
          </section>

          <section className="mt-16 overflow-hidden bg-[#efe9dc] md:mt-24">
            <div className="relative aspect-[4/3] md:aspect-[16/9]">
              <Image src="/images/mochi-stretch-texture.webp" alt="焼き上げて柔らかく伸びる白切り餅" fill sizes="(min-width: 768px) 1024px, 100vw" className="object-cover object-[52%_center] sm:object-center" />
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <p className="text-xs tracking-brand text-brown/60">HOW TO ENJOY</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">おすすめの食べ方</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {product.ways.map((way) => (
                <div key={way.title} className="border border-sumi/10 bg-white/25 p-5">
                  <h3 className="font-serifjp text-lg tracking-[0.1em]">{way.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-sumi/65">{way.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <h2 className="font-serifjp text-2xl tracking-[0.12em]">こんな方におすすめ</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {product.recommendedFor.map((item) => (
                <span key={item} className="rounded-full border border-sumi/15 px-4 py-2 text-sm text-sumi/65">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <p className="text-xs tracking-brand text-brown/60">PRODUCT INFORMATION</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">商品情報</h2>
            <dl className="mt-8 divide-y divide-sumi/10 border-y border-sumi/10">
              {[
                ["価格", product.price],
                ["内容量", product.content],
                ["賞味期限", product.shelfLife],
                ["保存方法", product.storage],
                ["配送方法", product.shipping],
                ["アレルギー", product.allergy]
              ].map(([label, value]) => (
                <div key={label} className="grid gap-3 py-4 text-sm md:grid-cols-[9rem_1fr]">
                  <dt className="tracking-[0.12em] text-sumi/45">{label}</dt>
                  <dd className="leading-7 text-sumi/70">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <h2 className="font-serifjp text-2xl tracking-[0.12em]">よくある質問</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="border border-sumi/10 bg-white/25 p-5">
                  <summary className="cursor-pointer font-serifjp tracking-[0.08em]">{faq.q}</summary>
                  <p className="mt-4 leading-8 text-sumi/65">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>
      </section>

      <section className="ym-container border-t border-sumi/10 py-20">
        <h2 className="text-center font-serifjp text-3xl tracking-[0.12em]">この商品に合う他のお餅</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link href="/products" className="underline underline-offset-8">
            商品一覧へ戻る
          </Link>
        </div>
      </section>

      <Cta title={`${product.name}を、飛騨高山から。`} />
    </main>
  );
}
