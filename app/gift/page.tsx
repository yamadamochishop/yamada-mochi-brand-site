import type { Metadata } from "next";
import Image from "next/image";
import { Cta } from "@/components/Cta";
import { gift, site } from "@/data/site";

export const metadata: Metadata = {
  title: "ギフト",
  description: "飛騨高山 朝市の切り餅 六種詰め合わせ。6種類の切り餅を各1袋ずつ詰めた、山田もち店のギフト商品です。"
};

export default function GiftPage() {
  return (
    <main className="ym-page">
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
          <a href={site.giftBaseUrl || site.baseUrl} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex bg-green px-8 py-4 text-base tracking-[0.12em]">
            BASEで購入する
          </a>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src="/images/gift-box-sixset-clean.jpg" alt="高山もちギフトボックス" fill className="object-cover" />
        </div>
      </section>
      <section className="bg-[#f1ece3] py-20">
        <div className="ym-container grid gap-6 md:grid-cols-3">
          {[
            ["六種類の詰め合わせ", "プレーン、草、三色豆、昆布、たまり、黒ごま海老を各1袋ずつ詰め合わせています。"],
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
          <a href={site.giftBaseUrl || site.baseUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex w-full justify-center bg-green px-8 py-4 text-base tracking-[0.12em] md:w-auto">
            BASEで購入する
          </a>
        </div>
      </section>
      <Cta title="季節のご挨拶に、高山もちを。" />
    </main>
  );
}
