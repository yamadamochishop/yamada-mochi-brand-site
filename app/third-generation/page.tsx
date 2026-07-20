import type { Metadata } from "next";
import Image from "next/image";
import { Cta } from "@/components/Cta";
import { pageOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "三代目の想い",
  description:
    "料理人として学んだ経験を、家族が守ってきた餅づくりへ。山田もち店三代目・山田裕紀の想い。",
  openGraph: pageOpenGraph({
    title: "三代目の想い｜山田もち店",
    description: "料理人として学んだ経験を、家族が守ってきた餅づくりへ。山田もち店三代目・山田裕紀の想い。",
    path: "/third-generation",
    image: "/images/yamada-yuki-portrait.jpg",
    imageAlt: "山田もち店三代目 山田裕紀"
  }),
  alternates: {
    canonical: "/third-generation"
  }
};

const chapters = [
  {
    title: "料理が好きになった原点",
    body: "山田もち店は1975年創業。私は三代目です。子どもの頃、両親は田んぼと朝市の仕事で毎日忙しく、決まった休みもありませんでした。学校から帰ると家にある食材で料理を作ることが多く、小学2年生の頃に初めてチャーハンを作りました。帰宅した家族が「おいしい」と喜んで食べてくれたことが嬉しく、それが料理人を目指すきっかけになりました。"
  },
  {
    title: "名古屋で学んだ12年間",
    body: "18歳で料理の専門学校へ進学。イタリア料理店で働きながら料理を学び、その後ダイニングバーやフレンチビストロで料理長を経験しました。料理だけではなく、商品開発、接客、店舗運営、ブランドづくり、お客様へ価値を届ける考え方など、多くのことを学びました。この経験は今の山田もち店の土台になっています。"
  },
  {
    title: "飛騨高山へ戻る",
    body: "2020年、新型コロナウイルスの影響で飲食店の先行きが見えなくなった頃、父が手術を受けることになり、田んぼを続けることが難しくなるかもしれないという連絡を受けました。以前から家族に「いつか帰ってきてほしい」と言われていたこともあり、高山へ戻ることを決意しました。"
  },
  {
    title: "家業を継ぐ決断",
    body: "最初は家業を手伝いながら、再び料理人として働くことも考えていました。しかし久しぶりに家族と仕事をする中で、親が年齢を重ねていること、そして料理人として外の世界で学んだからこそ、もっと山田もち店の魅力を伝えられる。もっとブランドとして成長できる。そんな想いが強くなり、家業を継ぐことを決めました。"
  },
  {
    title: "もう一度、外の世界で学んだこと",
    body: "家業に携わった後も、地域の飲食事業において店舗の立ち上げや運営、商品開発、ブランドづくりなどに携わる機会がありました。飲食店経営を通して、「商品を作ること」と「ブランドを育てること」は違うということを改めて学びました。また、自分自身の未熟さや実力不足を痛感する経験もありました。その経験を経て、人生をかけて挑戦するなら、自分の家業をもっと魅力あるブランドに育てたい、という想いがより強くなりました。"
  },
  {
    title: "山田もち店の未来",
    body: "私が目指しているのは、家族が受け継いできた餅づくりを、これからの暮らしへつないでいくことです。祖父や父が守ってきたものを大切にしながら、今の時代だからこそ届けられる価値を加え、飛騨高山を代表する餅ブランドへ育てていきたいと考えています。旅先で食べたお餅が、家に帰ってからも旅の思い出として残る。贈り物として届いたお餅が、人と人をつなぐきっかけになる。そんな存在になれるよう、これからも家族で餅づくりを続けていきます。"
  }
];

export default function ThirdGenerationPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="mb-6 text-xs tracking-brand text-brown/60">THIRD GENERATION</p>
            <h1 className="font-serifjp text-4xl leading-relaxed tracking-[0.14em] md:text-6xl">
              三代目の想い
            </h1>
            <p className="mt-8 max-w-2xl leading-9 text-sumi/70">
              陣屋前朝市で始まった餅づくりを、家族が受け継いできました。現在は三代目として、山田裕紀が店に立ち、田んぼと朝市、そしてお餅づくりに向き合っています。
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/yamada-yuki-portrait.jpg" alt="山田もち店三代目 山田裕紀" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="ym-container pb-24">
        <div className="mx-auto max-w-4xl space-y-16">
          {chapters.map((chapter, index) => (
            <article key={chapter.title} className="grid gap-6 border-t border-sumi/10 pt-10 md:grid-cols-[8rem_1fr]">
              <p className="text-xs tracking-brand text-brown/50">CHAPTER {String(index + 1).padStart(2, "0")}</p>
              <div>
                <h2 className="font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl">
                  {chapter.title}
                </h2>
                <p className="mt-6 leading-9 text-sumi/70">{chapter.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f1ece3] py-20">
        <div className="ym-container grid gap-8 md:grid-cols-3">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/chef-era-yamada-yuki.jpg" alt="料理人時代の山田裕紀" fill className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/latest-craft-rolling.webp" alt="山田もち店で餅を均一に伸ばして整える手仕事" fill className="object-cover object-[58%_center]" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/yamada-yuki-working-applepie.jpg" alt="アップルパイを作る山田裕紀" fill className="object-cover" />
          </div>
        </div>
      </section>
      <Cta title="思い出に残るお餅を。" text="この仕事に込めた想いを、ひとつひとつのお餅にのせてお届けします。" />
    </main>
  );
}
