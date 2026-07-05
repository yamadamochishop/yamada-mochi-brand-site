import type { Metadata } from "next";
import Image from "next/image";
import { Cta } from "@/components/Cta";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "ギフト",
  description: "お中元、お歳暮、内祝い、高山土産に。山田もち店の高山もちギフトセット。"
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
            定番6種類を詰め合わせたギフトセット。お中元、お歳暮、内祝い、遠方のご家族への贈り物におすすめです。
          </p>
          <a href={site.baseUrl} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex bg-green px-8 py-4 text-base tracking-[0.12em]">
            BASEでギフトを見る
          </a>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src="/images/gift-box-sixset-clean.jpg" alt="高山もちギフトボックス" fill className="object-cover" />
        </div>
      </section>
      <section className="bg-[#f1ece3] py-20">
        <div className="ym-container grid gap-6 md:grid-cols-3">
          {[
            ["熨斗対応", "お中元・お歳暮・内祝いなど用途に合わせて対応予定です。"],
            ["選べるセット", "お好きな味を合計6袋選べるセットをご用意しています。"],
            ["手提げ・包装", "贈り物として渡しやすい形を整えていきます。"]
          ].map(([title, text]) => (
            <article key={title} className="bg-base p-8">
              <h2 className="font-serifjp text-2xl tracking-[0.12em]">{title}</h2>
              <p className="mt-5 leading-8 text-sumi/65">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <Cta title="季節のご挨拶に、高山もちを。" />
    </main>
  );
}
