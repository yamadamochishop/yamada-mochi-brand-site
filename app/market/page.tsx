import type { Metadata } from "next";
import Image from "next/image";
import { Cta } from "@/components/Cta";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "陣屋前朝市",
  description: "山田もち店が出店する飛騨高山・陣屋前朝市の営業時間、アクセス、通販情報。"
};

export default function MarketPage() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.market.mapQuery)}`;
  return (
    <main className="ym-page">
      <section className="ym-container py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src="/images/story-morning-market-ai.jpg" alt="飛騨高山の陣屋前朝市" fill className="object-cover" />
          </div>
          <div>
            <p className="mb-6 text-xs tracking-brand text-brown/60">MORNING MARKET</p>
            <h1 className="font-serifjp text-4xl leading-relaxed tracking-[0.14em] md:text-6xl">
              飛騨高山を感じる、
              <br />
              朝の場所。
            </h1>
            <p className="mt-8 leading-9 text-sumi/70">
              山田もち店の原点は、飛騨高山・陣屋前朝市です。約50年、旅の途中に立ち寄る方や地域の方を迎えながら、お餅を届けてきました。朝市での出会いや会話は、商品づくりや贈り物を考えるきっかけになっています。
            </p>
          </div>
        </div>
        <dl className="mt-16 grid gap-4 border-y border-sumi/10 py-8 md:grid-cols-2">
          {[
            ["営業時間", site.market.hours],
            ["営業期間", site.market.season],
            ["アクセス", site.market.access],
            ["駐車場", site.market.parking]
          ].map(([label, value]) => (
            <div key={label} className="border-b border-sumi/10 py-5 md:border-b-0">
              <dt className="text-xs tracking-brand text-sumi/45">{label}</dt>
              <dd className="mt-3 leading-8 text-sumi/70">{value}</dd>
            </div>
          ))}
        </dl>
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block underline underline-offset-8">
          Google Mapで見る
        </a>
      </section>
      <Cta title="朝市で出会った味を、ご自宅へ。" />
    </main>
  );
}
