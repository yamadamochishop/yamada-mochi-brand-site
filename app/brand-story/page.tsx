import type { Metadata } from "next";
import Image from "next/image";
import { Cta } from "@/components/Cta";

export const metadata: Metadata = {
  title: "ブランドストーリー",
  description: "飛騨高山の思い出を食卓へ。山田もち店が大切にする、朝市・家族の手仕事・もち米づくりの物語。"
};

export default function BrandStoryPage() {
  return (
    <main className="ym-page">
      <section className="ym-container grid gap-12 py-24 md:grid-cols-[0.9fr_1.1fr] md:py-32">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src="/images/story-morning-market-ai.jpg" alt="陣屋前朝市の朝の風景" fill className="object-cover" />
        </div>
        <article className="self-center">
          <p className="mb-6 text-xs tracking-brand text-brown/60">BRAND STORY</p>
          <h1 className="font-serifjp text-4xl leading-relaxed tracking-[0.14em] md:text-6xl">
            飛騨高山の思い出を、
            <br />
            食卓へ。
          </h1>
          <div className="mt-10 space-y-7 leading-9 text-sumi/70">
            <p>
              山田もち店は1975年創業。飛騨高山の陣屋前朝市で、家族で育てたもち米を使い、昔ながらの製法で餅づくりを続けています。
            </p>
            <p>
              私たちが届けたいのは、ただの保存食ではありません。旅先で出会った味が、家に帰ってからも食卓で思い出になること。贈り物として届いたお餅が、誰かの暮らしに高山の景色を連れてくること。
            </p>
            <p>
              焼いた時の香り、ひと口目のやわらかさ、家族で囲む時間。そんな記憶に残る食体験を、飛騨高山からお届けします。
            </p>
          </div>
        </article>
      </section>
      <Cta />
    </main>
  );
}
