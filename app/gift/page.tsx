import type { Metadata } from "next";
import Image from "next/image";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { PurchaseGuide } from "@/components/PurchaseGuide";
import { gift, site } from "@/data/site";
import { absoluteUrl, breadcrumbJsonLd, pageOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ギフト",
  description: "飛騨高山 朝市の切り餅 六種詰め合わせ。6種類の切り餅を各1袋ずつ詰めた、山田もち店のギフト商品です。",
  openGraph: pageOpenGraph({
    title: "ギフト｜山田もち店",
    description: "飛騨高山 朝市の切り餅 六種詰め合わせ。6種類の切り餅を各1袋ずつ詰めた、山田もち店のギフト商品です。",
    path: "/gift",
    image: "/images/latest-sixset-field.webp",
    imageAlt: "飛騨高山の田んぼから贈る切り餅6種ギフト"
  }),
  alternates: {
    canonical: "/gift"
  }
};

export default function GiftPage() {
  const giftLineupJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "山田もち店 ギフトセット",
    itemListElement: [
      ["6種類食べ比べセット", "4枚入り（200g）×6袋", "2,980", site.baseItems.sixSet],
      ["選べる6袋セット", "お好きな味を合計6袋", "2,980", site.baseItems.choiceSixSet],
      ["12袋セット", "4枚入り（200g）×12袋", "5,960", site.baseItems.twelveSet]
    ].map(([name, description, price, url], position) => ({
      "@type": "ListItem",
      position: position + 1,
      item: {
        "@type": "Product",
        name,
        description,
        image: absoluteUrl("/images/latest-sixset-field.webp"),
        brand: {
          "@type": "Brand",
          name: site.name
        },
        url,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "JPY",
          availability: "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <main className="ym-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "ギフト", path: "/gift" }
        ])}
      />
      <JsonLd data={giftLineupJsonLd} />
      <section className="ym-container grid gap-12 py-24 md:grid-cols-2 md:py-32">
        <div className="self-center">
          <p className="mb-6 text-xs tracking-brand text-brown/60">GIFT</p>
          <h1 className="font-serifjp text-4xl leading-relaxed tracking-[0.14em] md:text-6xl">
            飛騨高山の思い出を、
            <br />
            大切な人へ。
          </h1>
          <p className="mt-8 leading-9 text-sumi/70">
            飛騨高山・陣屋前朝市で長く親しまれてきた、山田もち店の切り餅を六種類詰め合わせました。
          </p>
          <a href={site.baseItems.sixSet} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex bg-green px-8 py-4 text-base tracking-[0.12em]">
            BASEで購入する
          </a>
        </div>
        <div className="relative aspect-square overflow-hidden md:aspect-[4/5]">
          <Image src="/images/latest-sixset-field.webp" alt="飛騨高山の田んぼから贈る切り餅6種ギフト" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-[55%_center]" />
        </div>
      </section>
      <section className="bg-[#f1ece3] py-20">
        <div className="ym-container grid gap-6 md:grid-cols-3">
          {[
            ["6種類の食べ比べ", "プレーン、草もち、三色豆もち、昆布もち、たまりもち、黒ごま海老もちを各1袋ずつ詰め合わせています。"],
            ["贈り物として", "ギフト箱に入れ、贈り物として丁寧に梱包してお届けします。"],
            ["飛騨高山から", "朝市で親しまれてきた切り餅を、大切な方へお届けします。"]
          ].map(([title, text]) => (
            <article key={title} className="bg-base p-8">
              <h2 className="font-serifjp text-2xl tracking-[0.12em]">{title}</h2>
              <p className="mt-5 leading-8 text-sumi/65">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="ym-container py-20 md:py-24">
        <p className="text-xs tracking-brand text-brown/60">GIFT LINEUP</p>
        <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">用途に合わせて選ぶ</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["6種類食べ比べセット", "4枚入り（200g）×6袋 / 2,980円（税込）", site.baseItems.sixSet],
            ["選べる6袋セット", "お好きな味を合計6袋 / 2,980円（税込）", site.baseItems.choiceSixSet],
            ["12袋セット", "4枚入り（200g）×12袋 / 5,960円（税込）", site.baseItems.twelveSet]
          ].map(([title, detail, href]) => (
            <article key={title} className="border border-sumi/10 bg-white/35 p-7">
              <h3 className="font-serifjp text-xl tracking-[0.1em]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-sumi/65">{detail}</p>
              <a href={href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex bg-green px-5 py-3 text-sm tracking-[0.1em] text-white transition hover:bg-sumi">
                BASEの商品ページへ
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="ym-container py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ["/images/latest-sixset-hero.webp", "箱を開いた6種類の切り餅とギフト包装", "md:aspect-[4/3]"],
            ["/images/latest-six-flavors-light.webp", "6種類の切り餅の色と素材が分かる一覧", "md:aspect-[3/2]"],
            ["/images/latest-sixset-table.webp", "飛騨高山の稲穂と6種類の切り餅ギフト", "md:aspect-[4/3]"],
            ["/images/latest-sixset-hands.webp", "家族の手から渡す切り餅6種詰め合わせ", "md:aspect-[4/3]"]
          ].map(([src, alt, desktopAspect]) => (
            <div key={src} className={`relative aspect-square overflow-hidden bg-[#efe9dc] ${desktopAspect}`}>
              <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-center" />
            </div>
          ))}
        </div>
      </section>
      <section className="ym-container py-20 md:py-24">
        <div className="mx-auto max-w-3xl border-y border-sumi/10 py-8">
          <p className="text-xs tracking-brand text-brown/60">GIFT DETAILS</p>
          <h2 className="mt-4 font-serifjp text-2xl tracking-[0.1em] md:text-3xl">{gift.name}</h2>
          <dl className="mt-8 divide-y divide-sumi/10 border-y border-sumi/10">
            {[
              ["価格", `${gift.price}・${gift.shipping}`],
              ["内容", gift.contents],
              ["内容量", gift.quantity],
              ["賞味期限", gift.shelfLife]
            ].map(([label, value]) => (
              <div key={label} className="grid gap-3 py-4 text-sm md:grid-cols-[8rem_1fr]">
                <dt className="tracking-[0.12em] text-sumi/45">{label}</dt>
                <dd className="leading-7 text-sumi/70">{value}</dd>
              </div>
            ))}
          </dl>
          <PurchaseGuide shelfLife={gift.shelfLife} shipping={gift.shippingMethod} isGift />
          <a href={site.baseItems.sixSet} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex w-full justify-center bg-green px-8 py-4 text-base tracking-[0.12em] md:w-auto">
            BASEで購入する
          </a>
        </div>
      </section>
      <Cta title="季節のご挨拶に、高山もちを。" />
    </main>
  );
}
