import type { Metadata } from 'next';
import Image from 'next/image';
import { Cta } from '@/components/Cta';
import { JsonLd } from '@/components/JsonLd';
import { PurchaseGuide } from '@/components/PurchaseGuide';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';
import { catalogSets, sixFlavorGift, fixedSetVariants } from '@/data/catalog';
import { SetLineup } from '@/components/SetLineup';
import { SetDeliveryGuide } from '@/components/SetDeliveryGuide';
import { breadcrumbJsonLd, pageOpenGraph, setListJsonLd, catalogSetSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'ギフト',
  description:
    '飛騨高山の切り餅6種類を贈る6袋・12袋ギフト。ギフト箱・熨斗対応。常温便・冷凍便をお選びいただけます。',
  openGraph: pageOpenGraph({
    title: 'ギフト｜山田もち店',
    description:
      '飛騨高山の切り餅6種類を贈る6袋・12袋ギフト。ギフト箱・熨斗対応。常温便・冷凍便をお選びいただけます。',
    path: '/gift',
    image: '/images/latest-sixset-field.webp',
    imageAlt: '飛騨高山の田んぼから贈る切り餅6種ギフト',
  }),
  alternates: {
    canonical: '/gift',
  },
};

export default function GiftPage() {
  const giftLineupJsonLd = setListJsonLd(
    fixedSetVariants.filter((variant) => variant.purpose === '贈りもの用'),
    '/gift',
  );
  giftLineupJsonLd.itemListElement.push({
    '@type': 'ListItem',
    position: giftLineupJsonLd.itemListElement.length + 1,
    item: catalogSetSchema(catalogSets[1]),
  });

  return (
    <main className="ym-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: 'ギフト', path: '/gift' },
        ])}
      />
      <JsonLd data={giftLineupJsonLd} />
      <section className="ym-container grid gap-12 py-24 md:grid-cols-2 md:py-32">
        <div className="self-center">
          <p className="mb-6 text-xs tracking-brand text-brown/85">GIFT</p>
          <h1 className="font-serifjp text-4xl tracking-[0.14em] md:text-5xl xl:text-6xl">
            <span className="ym-phrase">飛騨高山の</span>
            <span className="ym-phrase">思い出を、</span>
            <br />
            <span className="ym-phrase">大切な人へ。</span>
          </h1>
          <p className="mt-8 leading-9 text-sumi/70">
            飛騨高山・陣屋前朝市で長く親しまれてきた、山田もち店の切り餅を六種類詰め合わせました。
          </p>
          <TrackedBaseLink
            href={sixFlavorGift.baseUrl}
            placement="gift_hero"
            className="ym-btn ym-btn-lg ym-btn-primary mt-9 min-h-14 px-10 tracking-[0.12em]"
          >
            常温6袋ギフトを購入
          </TrackedBaseLink>
        </div>
        <div className="relative aspect-square overflow-hidden md:aspect-[4/5]">
          <Image
            src="/images/latest-sixset-field.webp"
            alt="飛騨高山の田んぼから贈る切り餅6種ギフト"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-[55%_center]"
          />
        </div>
      </section>
      <section className="bg-[#f1ece3] py-20">
        <div className="ym-container grid gap-6 md:grid-cols-3">
          {[
            [
              '6種類の食べ比べ',
              'プレーン、草餅、三色豆餅、たまり餅、昆布餅、黒ごま海老餅を各1袋ずつ詰め合わせています。',
            ],
            ['贈り物として', `${sixFlavorGift.packaging}。丁寧に梱包してお届けします。`],
            ['飛騨高山から', '朝市で親しまれてきた切り餅を、大切な方へお届けします。'],
          ].map(([title, text]) => (
            <article key={title} className="bg-base p-8">
              <h2 className="font-serifjp text-2xl tracking-[0.12em]">{title}</h2>
              <p className="mt-5 leading-8 text-sumi/65">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="ym-container py-20 md:py-24">
        <p className="text-xs tracking-brand text-brown/85">GIFT LINEUP</p>
        <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
          用途に合わせて選ぶ
        </h2>
        <SetLineup giftOnly />
        <article className="mt-6 border border-sumi/10 bg-white/35 p-7">
          <h3 className="font-serifjp text-xl tracking-[0.1em]">{catalogSets[1].cardName}</h3>
          <p className="mt-4 text-sm leading-7 text-sumi/65">
            {catalogSets[1].content} / {catalogSets[1].price}・送料別
          </p>
          <p className="mt-2 text-sm leading-7 text-sumi/65">
            6種類からお好きな味を合計6袋。{catalogSets[1].packaging}。配送は
            {catalogSets[1].shipping.split(' / ')[0]}です。
          </p>
          <p className="mt-2 text-sm leading-7 text-sumi/65">
            アレルゲン：{catalogSets[1].allergy}
          </p>
          <TrackedBaseLink
            href={catalogSets[1].baseUrl}
            placement="gift_set_card"
            className="ym-btn ym-btn-primary mt-5"
          >
            選べる6袋セットをBASEで見る
          </TrackedBaseLink>
        </article>
        <SetDeliveryGuide />
      </section>
      <section className="ym-container py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            [
              '/images/latest-sixset-hero.webp',
              '箱を開いた6種類の切り餅とギフト包装',
              'md:aspect-[4/3]',
            ],
            [
              '/images/latest-six-flavors-light.webp',
              '6種類の切り餅の色と素材が分かる一覧',
              'md:aspect-[3/2]',
            ],
            [
              '/images/latest-sixset-table.webp',
              '飛騨高山の稲穂と6種類の切り餅ギフト',
              'md:aspect-[4/3]',
            ],
            [
              '/images/latest-sixset-hands.webp',
              '家族の手から渡す切り餅6種詰め合わせ',
              'md:aspect-[4/3]',
            ],
          ].map(([src, alt, desktopAspect]) => (
            <div
              key={src}
              className={`relative aspect-square overflow-hidden bg-[#efe9dc] ${desktopAspect}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </section>
      <section className="ym-container py-20 md:py-24">
        <div className="mx-auto max-w-3xl border-y border-sumi/10 py-8">
          <p className="text-xs tracking-brand text-brown/85">GIFT DETAILS</p>
          <h2 className="mt-4 font-serifjp text-2xl tracking-[0.1em] md:text-3xl">
            6袋ギフト（6種類食べ比べ）
          </h2>
          <dl className="mt-8 divide-y divide-sumi/10 border-y border-sumi/10">
            {[
              ['価格', `${sixFlavorGift.price}・送料別`],
              ['内容', sixFlavorGift.ingredients],
              ['内容量', sixFlavorGift.content],
              ['梱包', sixFlavorGift.packaging],
            ].map(([label, value]) => (
              <div key={label} className="grid gap-3 py-4 text-sm md:grid-cols-[8rem_1fr]">
                <dt className="tracking-[0.12em] text-sumi/65">{label}</dt>
                <dd className="leading-7 text-sumi/70">{value}</dd>
              </div>
            ))}
          </dl>
          <PurchaseGuide
            shelfLife={sixFlavorGift.shelfLife}
            shipping={sixFlavorGift.shipping}
            isGift
          />
          <TrackedBaseLink
            href={sixFlavorGift.baseUrl}
            placement="gift_details"
            className="ym-btn ym-btn-lg ym-btn-primary mt-8 min-h-14 w-full px-10 tracking-[0.12em] md:w-auto"
          >
            常温6袋ギフトを購入
          </TrackedBaseLink>
        </div>
      </section>
      <Cta title="季節のご挨拶に、高山もちを。" />
    </main>
  );
}
