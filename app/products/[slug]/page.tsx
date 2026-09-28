import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cta } from '@/components/Cta';
import { PurchaseGuide } from '@/components/PurchaseGuide';
import { JsonLd } from '@/components/JsonLd';
import { PhraseText } from '@/components/PhraseText';
import { ProductCard } from '@/components/ProductCard';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';
import { breadcrumbJsonLd, pageOpenGraph, productJsonLd } from '@/lib/seo';
import { getProduct, getRelatedProducts, products } from '@/data/catalog';
import { getRecipesForProduct } from '@/lib/recipe-page';
import { isNekoposEligible, nekoposHeadline, nekoposLead } from '@/lib/shipping';
import { faqs } from '@/data/faqs';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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
      imageAlt: product.imageAlt || `${product.name}の商品写真`,
    }),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product.related);
  const recipes = getRecipesForProduct(product.slug);
  const nekopos = isNekoposEligible(product.slug);

  return (
    <main className="ym-page">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: '商品一覧', path: '/products' },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />
      <section className="ym-container pb-20 pt-8 md:pb-28 md:pt-12">
        <article className="mx-auto max-w-6xl">
          <nav aria-label="パンくずリスト" className="text-xs tracking-[0.06em] text-sumi/60">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-8 items-center transition hover:text-sumi"
                >
                  ホーム
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/products"
                  className="inline-flex min-h-8 items-center transition hover:text-sumi"
                >
                  商品一覧
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-sumi/80">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* 最初の画面で「何の商品か・いくらか・どこで買えるか」が分かるよう、写真と購入情報を並べる。 */}
          <div className="mt-6 grid gap-10 md:mt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden bg-[#f4efe9] lg:max-w-none">
              <Image
                src={product.image}
                alt={product.imageAlt || `${product.name}の商品写真`}
                fill
                priority
                sizes="(min-width: 1280px) 620px, (min-width: 1024px) 52vw, (min-width: 640px) 512px, 100vw"
                className="object-cover"
              />
            </div>

            <div data-purchase-area className="text-center lg:text-left">
              <p className="text-xs tracking-brand text-brown/85">{product.english}</p>
              <h1 className="mt-4 font-serifjp text-4xl tracking-[0.16em] md:text-5xl xl:text-6xl">
                {product.name}
              </h1>
              <p className="mt-6 font-serifjp text-2xl tracking-[0.1em] text-sumi/85 md:text-3xl">
                <PhraseText text={product.catchcopy} />
              </p>
              <p className="mt-8 border-t border-sumi/10 pt-6 text-xl tracking-[0.06em]">
                {product.content}
                <span aria-hidden="true" className="mx-3 text-sumi/40">
                  ／
                </span>
                {product.price}
              </p>
              {nekopos ? (
                <p className="mt-3 text-sm leading-7 text-green">{nekoposHeadline}</p>
              ) : null}
              <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:gap-6">
                <TrackedBaseLink
                  href={product.baseUrl}
                  placement="product_hero"
                  className="ym-btn ym-btn-lg ym-btn-primary min-h-14 px-10"
                >
                  BASEで購入する
                </TrackedBaseLink>
                <a
                  href="#purchase-info"
                  className="inline-flex min-h-11 items-center justify-center text-sm tracking-[0.08em] text-sumi/70 underline underline-offset-8 transition hover:text-sumi"
                >
                  送料・お届けについて
                </a>
              </div>
            </div>
          </div>

          <section className="mx-auto mt-16 max-w-3xl md:mt-24">
            <p className="text-xs tracking-brand text-brown/85">ABOUT THIS MOCHI</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
              このお餅について
            </h2>
            <p className="mt-8 leading-9 text-sumi/70">{product.story}</p>
            <p className="mt-6 leading-9 text-sumi/70">
              家族で育てたもち米を使い、状態を見ながら一つひとつ丁寧に仕上げています。素材ごとの味わいを生かし、日々の食卓でも楽しんでいただける切り餅です。
            </p>
            <div id="purchase-info" className="mt-10 border-y border-sumi/10 py-8">
              <p className="text-sm tracking-brand text-sumi/65">PRICE</p>
              <p className="mt-3 text-2xl">{product.price}</p>
              {nekopos ? (
                <p className="mt-6 border border-green/25 bg-white/50 px-5 py-4 text-sm leading-7 text-sumi/75">
                  <span className="block font-serifjp text-lg leading-8 tracking-[0.08em] text-green">
                    {nekoposHeadline}
                  </span>
                  {nekoposLead}
                </p>
              ) : null}
              <PurchaseGuide
                shelfLife={product.shelfLife}
                shipping={product.shipping}
                nekopos={nekopos}
              />
              <TrackedBaseLink
                href={product.baseUrl}
                placement="product_detail"
                className="ym-btn ym-btn-lg ym-btn-primary mt-6 w-full px-8 tracking-[0.12em] md:w-auto"
              >
                BASEで購入する
              </TrackedBaseLink>
            </div>
          </section>

          <section className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9dc]">
              <Image
                src="/images/latest-six-flavors-dark.webp"
                alt="山田もち店の切り餅6種類の形と色"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9dc]">
              <Image
                src="/images/latest-craft-rolling.webp"
                alt="餅を均一に伸ばして整える製造風景"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-[58%_center]"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe9dc]">
              <Image
                src="/images/latest-sixset-hands.webp"
                alt="家族の手から渡す切り餅6種詰め合わせ"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <p className="text-xs tracking-brand text-brown/85">TASTE</p>
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

          <section
            className="mx-auto mt-14 max-w-3xl border-l-2 border-[color:var(--accent)] bg-white/35 p-7 md:mt-20"
            style={{ '--accent': product.accent } as CSSProperties}
          >
            <p className="text-xs tracking-brand text-brown/85">OWNER&apos;S RECOMMENDATION</p>
            <h2 className="mt-3 font-serifjp text-2xl tracking-[0.12em]">店主おすすめ</h2>
            <p className="mt-5 leading-8 text-sumi/70">{product.ownerRecommendation}</p>
          </section>

          <section className="mt-16 overflow-hidden bg-[#efe9dc] md:mt-24">
            <div className="relative aspect-[4/3] md:aspect-[16/9]">
              <Image
                src="/images/mochi-stretch-texture.webp"
                alt="焼き上げて柔らかく伸びる白切り餅"
                fill
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover object-[52%_center] sm:object-center"
              />
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <p className="text-xs tracking-brand text-brown/85">HOW TO ENJOY</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
              おすすめの食べ方
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {product.ways.map((way) => (
                <div key={way.title} className="border border-sumi/10 bg-white/25 p-5">
                  <h3 className="font-serifjp text-lg tracking-[0.1em]">{way.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-sumi/65">{way.text}</p>
                </div>
              ))}
            </div>
          </section>

          {recipes.length > 0 ? (
            <section className="mx-auto mt-14 max-w-3xl border border-sumi/15 bg-white/35 p-7 md:mt-20">
              <p className="text-xs tracking-brand text-brown/85">RECIPES</p>
              <h2 className="mt-3 font-serifjp text-2xl tracking-[0.12em]">
                {product.name}をもっと楽しむ
              </h2>
              <ul className="mt-6 divide-y divide-sumi/10 border-y border-sumi/10">
                {recipes.map((recipe) => (
                  <li key={recipe.id}>
                    <Link
                      href={`/recipes/${recipe.slug}`}
                      className="flex min-h-14 items-center py-3 leading-8 text-sumi/70 underline underline-offset-8 transition hover:text-sumi"
                    >
                      {recipe.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/recipes"
                className="mt-4 inline-flex min-h-11 items-center text-sm text-sumi/70 underline underline-offset-8 transition hover:text-sumi"
              >
                お餅のレシピ一覧を見る
              </Link>
            </section>
          ) : null}

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <h2 className="font-serifjp text-2xl tracking-[0.12em]">こんな方におすすめ</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {product.recommendedFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-sumi/15 px-4 py-2 text-sm text-sumi/65"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <p className="text-xs tracking-brand text-brown/85">PRODUCT INFORMATION</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">商品情報</h2>
            <dl className="mt-8 divide-y divide-sumi/10 border-y border-sumi/10">
              {[
                ['価格', product.price],
                ['内容量', product.content],
                ['原材料名', product.ingredients],
                ['賞味期限', product.shelfLife],
                ['保存方法', product.storage],
                ['開封後', product.afterOpening],
                ['冷凍保存', product.frozenStorage],
                ['配送方法', product.shipping],
                ['アレルギー', product.allergy],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-3 py-4 text-sm md:grid-cols-[9rem_1fr]">
                  <dt className="tracking-[0.12em] text-sumi/65">{label}</dt>
                  <dd className="leading-7 text-sumi/70">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mx-auto mt-14 max-w-3xl md:mt-20">
            <h2 className="font-serifjp text-2xl tracking-[0.12em]">よくある質問</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="border border-sumi/10 bg-white/25">
                  <summary className="cursor-pointer p-5 font-serifjp tracking-[0.08em]">
                    {faq.q}
                  </summary>
                  <p className="px-5 pb-5 leading-8 text-sumi/70">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </article>
      </section>

      <section className="ym-container border-t border-sumi/10 py-20">
        <h2 className="text-center font-serifjp text-3xl tracking-[0.12em]">
          この商品に合う他のお餅
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center underline underline-offset-8 transition hover:text-brown"
          >
            商品一覧へ戻る
          </Link>
        </div>
      </section>

      <Cta title={`${product.name}を、飛騨高山から。`} />
    </main>
  );
}
