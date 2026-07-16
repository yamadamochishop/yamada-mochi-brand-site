import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd, absoluteUrl } from "@/lib/seo";
import { getProduct, getRelatedProducts, products } from "@/data/products";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";

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
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      images: [{ url: product.image, alt: product.imageAlt || `${product.name}の商品写真` }]
    },
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} 高山もち`,
    image: absoluteUrl(product.image),
    description: product.seo.description,
    brand: {
      "@type": "Brand",
      name: site.name
    },
  };

  return (
    <main className="ym-page">
      <JsonLd data={productJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "商品一覧", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` }
        ])}
      />
      <section className="ym-container py-20 md:py-28">
        <article className="mx-auto max-w-5xl">
          <div className={`relative overflow-hidden bg-[#efe9dc] ${product.slug === "plain" ? "aspect-square md:mx-auto md:aspect-[4/5] md:max-w-2xl" : "aspect-[4/3] md:aspect-[16/10]"}`}>
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
              <a
                href={site.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full justify-center bg-green px-8 py-4 text-base tracking-[0.12em] transition hover:bg-sumi md:w-auto"
              >
                BASEで購入する
              </a>
            </div>
          </section>

          <section className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3">
            <div className={`relative overflow-hidden bg-[#efe9dc] ${product.slug === "plain" ? "aspect-square md:aspect-[4/5]" : "aspect-[4/5]"}`}>
              <Image src={product.slug === "plain" ? "/images/web-plain-front.webp" : "/images/product-lineup-six-flavors-wide.jpg"} alt={product.slug === "plain" ? "山田もち店 白切り餅 200gの正面パッケージ" : "高山もち6種類の写真"} fill sizes="(min-width: 768px) 33vw, 100vw" className={product.slug === "plain" ? "object-contain p-4" : "object-cover"} />
            </div>
            <div className={`relative overflow-hidden bg-[#efe9dc] ${product.slug === "plain" ? "aspect-square md:aspect-[4/5]" : "aspect-[4/5]"}`}>
              <Image src="/images/hero-seiro-ai-landscape.jpg" alt="餅づくりのせいろ" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
            <div className={`relative overflow-hidden bg-[#efe9dc] ${product.slug === "plain" ? "aspect-square md:aspect-[4/5]" : "aspect-[4/5]"}`}>
              <Image src={product.slug === "plain" ? "/images/web-plain-yakimochi.webp" : "/images/web-sixset-gift.webp"} alt={product.slug === "plain" ? "香ばしく焼いた山田もち店の白切り餅" : "山田もち店 切り餅6種詰め合わせの帯付きギフト箱"} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-center" />
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
            <div className={`relative ${product.slug === "plain" ? "aspect-square md:aspect-[3/2]" : "aspect-[16/9]"}`}>
              <Image src={product.slug === "plain" ? "/images/web-plain-yakimochi.webp" : "/images/hero-yakimochi-ai.jpg"} alt={product.slug === "plain" ? "香ばしく焼いた山田もち店の白切り餅" : "焼いたお餅のイメージ"} fill sizes="(min-width: 768px) 1024px, 100vw" className="object-cover object-center" />
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
                ["内容量", product.content]
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
