import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/Cta";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { products } from "@/data/products";
import { news } from "@/data/news";

export default function HomePage() {
  return (
    <main className="ym-page">
      <section className="relative min-h-[88vh] overflow-hidden bg-green text-base">
        <div className="absolute inset-0">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-r from-green/80 via-green/45 to-green/5 md:from-green/72 md:via-green/28" />
          <div className="absolute inset-0 bg-gradient-to-t from-green/30 via-transparent to-green/10" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-5 py-28 md:px-8">
          <div className="max-w-3xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.42)]">
            <p className="mb-8 text-xs font-semibold tracking-brand text-base/78">FROM HIDA TAKAYAMA</p>
            <h1 className="font-serifjp text-5xl leading-[1.45] tracking-[0.18em] md:text-7xl">
              思い出に残る
              <br />
              お餅を。
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-10 text-base/90">
              飛騨高山の田んぼで育てたもち米を使い、
              <br className="hidden md:block" />
              陣屋前朝市から届ける切り餅です。
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#products"
                className="inline-flex min-w-64 justify-center border border-base px-8 py-4 tracking-[0.14em] transition hover:bg-base hover:text-green"
              >
                商品を選ぶ
              </a>
              <Link
                href="/third-generation"
                className="inline-flex min-w-64 justify-center border border-base/40 px-8 py-4 tracking-[0.14em] text-base/85 transition hover:border-base hover:text-base"
              >
                三代目の想い
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ym-container py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/morning-market-real.webp"
              alt="飛騨高山の陣屋前朝市に並ぶ店々"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover object-top"
            />
          </div>
          <div>
            <p className="mb-5 text-xs tracking-brand text-brown/60">BRAND STORY</p>
            <h2 className="font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl">
              飛騨高山の思い出を、
              <br />
              食卓へ。
            </h2>
            <p className="mt-8 leading-9 text-sumi/70">
              山田もち店は、1975年創業。飛騨高山の陣屋前朝市で、家族で育てたもち米を使い、お餅を届けてきました。
              朝市で出会った味が、ご自宅の食卓や贈り物につながるように。田んぼから始まるものづくりを大切にしています。
            </p>
            <Link href="/brand-story" className="mt-8 inline-block underline underline-offset-8">
              ブランドストーリーを読む
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f1ece3] py-24 md:py-32">
        <div className="ym-container">
          <SectionHeading
            eyebrow="OUR CRAFT"
            title="家族の手仕事から生まれる、やさしいおいしさ。"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["01", "もち米", "千島町・越後町の田んぼで育てた「たかやまもち」を100％使用しています。"],
              ["02", "水と土地", "飛騨高山の澄んだ空気と水。土地の恵みを、そのままお餅へ。"],
              ["03", "家族のものづくり", "栽培から製造・販売までを家族で一貫して行い、もち米本来の風味と粘りを大切にしています。"]
            ].map(([num, title, text]) => (
              <article key={num} className="border border-sumi/10 bg-base p-8">
                <span className="text-xs tracking-brand text-brown/50">{num}</span>
                <h3 className="mt-8 font-serifjp text-2xl tracking-[0.12em]">{title}</h3>
                <p className="mt-5 leading-8 text-sumi/65">{text}</p>
              </article>
            ))}
          </div>
          <div className="relative mt-10 aspect-[4/3] overflow-hidden md:mt-14 md:aspect-[16/7]">
            <Image
              src="/images/latest-craft-rolling.webp"
              alt="家族の手で餅を均一に伸ばして整える製造風景"
              fill
              sizes="(min-width: 768px) 1200px, 100vw"
              className="object-cover object-[58%_center] md:object-center"
            />
          </div>
        </div>
      </section>

      <section id="products" className="ym-container py-24 md:py-32">
        <SectionHeading
          eyebrow="PRODUCTS"
          title="飛騨高山の切り餅 6種類"
          lead="飛騨高山の田んぼで育てたもち米を使った、山田もち店の定番6種類です。"
        />
        <div className="grid gap-x-10 gap-y-20 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="ym-container py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-5 text-xs tracking-brand text-brown/60">GIFT</p>
            <h2 className="font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl">
              飛騨高山で出会った味わいを、
              <br />
              大切な人にも。
            </h2>
            <p className="mt-7 leading-9 text-sumi/70">
              6種類の切り餅を各1袋ずつ、贈り物として一箱に詰めました。4枚入り（200g）×6袋、2,980円（税込・送料別）です。
            </p>
            <Link href="/gift" className="mt-8 inline-block underline underline-offset-8">
              六種詰め合わせを見る
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/latest-sixset-hands.webp"
              alt="飛騨高山から贈る切り餅6種詰め合わせ"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[50%_45%]"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-sumi/10 bg-[#f1ece3] py-20">
        <div className="ym-container">
          <SectionHeading eyebrow="NEWS" title="お知らせ" />
          <div className="mx-auto max-w-3xl divide-y divide-sumi/10">
            {news.map((item) => (
              <article key={item.title} className="py-6">
                <p className="text-xs tracking-brand text-sumi/45">{item.date}</p>
                <h3 className="mt-3 font-serifjp text-xl tracking-[0.08em]">{item.title}</h3>
                <p className="mt-3 leading-7 text-sumi/65">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </main>
  );
}
