import Image from 'next/image';
import Link from 'next/link';
import type { MediaAsset } from '@/types/content-model';
import {
  SEASONAL_LISTING_MONTH,
  buildSeasonalPageModel,
  type SeasonalPageProduct,
  type SeasonalStatusLabel,
} from '@/lib/seasonal-page';
import { site } from '@/data/site';

const model = buildSeasonalPageModel();

const buttonClass =
  'inline-flex min-h-11 items-center justify-center border border-sumi px-6 py-3 text-sm tracking-[0.1em] transition hover:bg-sumi hover:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi';

const statusBadgeClasses: Record<SeasonalStatusLabel, string> = {
  販売中: 'bg-green/10 text-green',
  まもなく終了: 'bg-[#f0dfbd] text-[#6f4b0c]',
  販売予定: 'bg-brown/10 text-brown',
  販売終了: 'bg-sumi/[0.06] text-sumi/65',
};

function StatusBadge({ label }: { label: SeasonalStatusLabel }) {
  return (
    <span
      data-seasonal-status={label}
      className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold tracking-[0.08em] ${statusBadgeClasses[label]}`}
    >
      <span aria-hidden="true" className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function ProductImage({ image, name }: { image?: MediaAsset; name: string }) {
  if (!image) return null;
  return (
    <div className="relative aspect-[4/3] overflow-hidden lg:w-[280px] lg:shrink-0">
      <Image
        src={image.src}
        alt={image.alt || name}
        fill
        sizes="(min-width: 1024px) 280px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

const metadataColumnClasses = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
} as const;

/**
 * Human確定済みの項目だけを並べる。未確定の項目は行そのものを描画しない。
 *
 * columns は器の幅に合わせる。全幅の行は3列、「今、店先にあるもの」のカードは2列、
 * さらに狭い通年カード（1024pxで幅230px）は1列。列を詰めすぎると
 * 「1個 250円（税込）」「陣屋前朝市」のような値が2行に折り返す。
 */
function ProductMetadata({
  product,
  columns = 3,
}: {
  product: SeasonalPageProduct;
  columns?: keyof typeof metadataColumnClasses;
}) {
  const items = [
    ...(product.price ? [{ term: '価格', value: product.price.display }] : []),
    { term: '販売時期', value: product.salesPeriod.display },
    { term: '販売場所', value: product.salesLocationLabel },
    ...(product.shelfLife ? [{ term: '賞味期限', value: product.shelfLife }] : []),
    { term: '通販', value: product.commerceLabel },
  ];
  return (
    <dl
      className={`mt-6 grid gap-x-6 gap-y-4 text-sm leading-7 text-sumi/70 ${metadataColumnClasses[columns]}`}
    >
      {items.map((item) => (
        <div key={item.term}>
          <dt className="text-xs tracking-brand text-sumi/65">{item.term}</dt>
          <dd className="mt-1">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductNotes({ product }: { product: SeasonalPageProduct }) {
  const notes = [product.salesPeriod.note, ...(product.notes ?? [])].filter(Boolean);
  if (notes.length === 0) return null;
  return (
    <ul className="mt-5 space-y-1 text-sm leading-7 text-sumi/70">
      {notes.map((note) => (
        <li key={note}>※{note}</li>
      ))}
    </ul>
  );
}

function SeasonalProductCard({ product }: { product: SeasonalPageProduct }) {
  return (
    <article className="flex h-full flex-col border border-sumi/15 bg-base p-6 md:p-7">
      <ProductImage image={product.images[0]} name={product.name} />
      <div className={product.images[0] ? 'mt-6' : ''}>
        <div className="flex min-h-7 items-start justify-between gap-4">
          <p className="text-xs tracking-brand text-brown/85">{product.categoryLabel}</p>
          {product.statusLabel ? <StatusBadge label={product.statusLabel} /> : null}
        </div>
        <h3 className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.1em]">
          {product.name}
        </h3>
        {product.catchcopy ? (
          <p className="mt-3 font-serifjp leading-8 text-sumi/75">{product.catchcopy}</p>
        ) : null}
        <ProductMetadata product={product} columns={2} />
        <ProductNotes product={product} />
      </div>
    </article>
  );
}

function CurrentMonthPanel() {
  return (
    <aside
      aria-labelledby="current-month-title"
      className="border border-sumi/15 bg-[#eee8dc] p-6 md:p-8"
    >
      <p className="text-xs tracking-brand text-brown/85">THIS MONTH</p>
      <h2 id="current-month-title" className="mt-3 font-serifjp text-2xl tracking-[0.12em]">
        {SEASONAL_LISTING_MONTH}月のお品書き
      </h2>
      <ol className="mt-6 divide-y divide-sumi/10 border-y border-sumi/10">
        {model.currentProducts.map((product) => (
          <li key={product.id} className="flex min-h-14 items-center justify-between gap-4 py-3">
            <span className="font-serifjp tracking-[0.06em]">{product.name}</span>
            <span className="shrink-0 text-xs text-sumi/65">{product.currentMonthLabel}</span>
          </li>
        ))}
      </ol>
      <Link href="#now" data-seasonal-cta="current" className={`${buttonClass} mt-7 w-full`}>
        今の商品をくわしく見る
      </Link>
    </aside>
  );
}

function MonthChips() {
  return (
    <nav
      aria-label="月から一年の流れを探す"
      className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0"
    >
      <ol className="flex min-w-max snap-x snap-mandatory gap-2 md:min-w-0 md:flex-wrap">
        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
          <li key={month} className="snap-start">
            <a
              href={`#month-${month}`}
              aria-current={month === SEASONAL_LISTING_MONTH ? 'date' : undefined}
              className={`inline-flex min-h-11 min-w-12 items-center justify-center border px-3 text-sm transition hover:border-green hover:text-green ${
                month === SEASONAL_LISTING_MONTH
                  ? 'border-green bg-green text-base'
                  : 'border-sumi/20 bg-base text-sumi/70'
              }`}
            >
              {month}月
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SeasonalProductRow({ product }: { product: SeasonalPageProduct }) {
  return (
    <article className="border-t border-sumi/15 py-7 last:border-b">
      <div className="flex flex-col gap-5 lg:flex-row">
        <ProductImage image={product.images[0]} name={product.name} />
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-brand text-brown/85">{product.categoryLabel}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h4 className="font-serifjp text-xl tracking-[0.1em] md:text-2xl">{product.name}</h4>
            {product.statusLabel ? <StatusBadge label={product.statusLabel} /> : null}
          </div>
          {product.catchcopy ? (
            <p className="mt-4 font-serifjp text-lg leading-9 text-sumi/85">{product.catchcopy}</p>
          ) : null}
          {product.story ? (
            <p className="mt-3 max-w-3xl leading-8 text-sumi/70">{product.story}</p>
          ) : null}
          {product.commitment ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-sumi/70">{product.commitment}</p>
          ) : null}
          <ProductMetadata product={product} />
          <ProductNotes product={product} />
        </div>
      </div>
    </article>
  );
}

/**
 * 「今 / これから / 終わったもの」を同じ並びで扱うための予告枠。
 * 該当レコードが無い時期はセクションごと描画しない。
 */
function UpcomingProducts() {
  if (model.upcomingProducts.length === 0) return null;
  return (
    <section aria-labelledby="upcoming-title" className="mt-20 md:mt-24">
      <p className="text-xs tracking-brand text-brown/85">COMING SOON</p>
      <h2 id="upcoming-title" className="mt-4 font-serifjp text-3xl tracking-[0.12em] md:text-4xl">
        これから登場するもの
      </h2>
      <p className="mt-6 max-w-2xl leading-8 text-sumi/70">
        いまは準備中の商品です。仕様や販売時期はこれから決まります。
      </p>
      <div className="mt-10">
        {model.upcomingProducts.map((product) => (
          <SeasonalProductRow key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function EndedProducts() {
  if (model.endedProducts.length === 0) return null;
  return (
    <section aria-labelledby="ended-title" className="mt-20 md:mt-24">
      <p className="text-xs tracking-brand text-brown/85">FINISHED</p>
      <h2 id="ended-title" className="mt-4 font-serifjp text-3xl tracking-[0.12em] md:text-4xl">
        今季の販売を終えたもの
      </h2>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm leading-7 text-sumi/70">
        {model.endedProducts.map((product) => (
          <li key={product.id}>
            {product.name}
            <span className="ml-2 text-xs text-sumi/65">{product.salesPeriod.display}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AnnualFlow() {
  return (
    <section aria-labelledby="annual-flow-title" className="ym-container py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-xs tracking-brand text-brown/85">ALL YEAR ROUND</p>
        <h2
          id="annual-flow-title"
          className="mt-4 font-serifjp text-3xl tracking-[0.12em] md:text-5xl"
        >
          一年の流れ
        </h2>
        <p className="mt-6 leading-8 text-sumi/70">
          月を目安に、その時期に店先へ並ぶ予定の商品をご覧ください。
        </p>
      </div>
      <div className="mt-10">
        <MonthChips />
      </div>
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {model.monthlyCalendar.map(({ month, products }) => (
          <section
            key={month}
            id={`month-${month}`}
            data-seasonal-month={month}
            aria-labelledby={`month-${month}-title`}
            className={`scroll-mt-28 border p-5 md:p-6 ${
              month === SEASONAL_LISTING_MONTH
                ? 'border-green bg-green/[0.04]'
                : 'border-sumi/15 bg-base'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 id={`month-${month}-title`} className="font-serifjp text-2xl tracking-[0.12em]">
                {month}月
              </h3>
              {month === SEASONAL_LISTING_MONTH ? (
                <span className="text-xs tracking-[0.08em] text-green">今月</span>
              ) : null}
            </div>
            <ul className="mt-5 space-y-2 border-t border-sumi/10 pt-4 text-sm leading-7 text-sumi/75">
              {products.map((product) => (
                <li key={product.id} className="flex items-baseline justify-between gap-3">
                  <span>{product.name}</span>
                  {product.statusLabel === '販売予定' ? (
                    <span className="shrink-0 text-xs text-brown/85">予定</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section aria-labelledby="seasonal-directory-title" className="mt-20">
        <div className="max-w-2xl">
          <p className="text-xs tracking-brand text-brown/85">SEASONAL PRODUCTS</p>
          <h3
            id="seasonal-directory-title"
            className="mt-3 font-serifjp text-2xl tracking-[0.12em] md:text-3xl"
          >
            商品ごとの販売時期
          </h3>
          <p className="mt-5 leading-8 text-sumi/65">
            販売期間をまたぐ商品も、こちらでまとめてご確認いただけます。
          </p>
        </div>
        <div className="mt-8">
          {model.seasonalDirectory.map((product) => (
            <SeasonalProductRow key={product.id} product={product} />
          ))}
        </div>
      </section>
    </section>
  );
}

function YearRoundProducts() {
  return (
    <section aria-labelledby="standards-title" className="bg-[#eee8dc] py-20 md:py-28">
      <div className="ym-container">
        <p className="text-xs tracking-brand text-brown/85">STANDARDS</p>
        <h2
          id="standards-title"
          className="mt-4 font-serifjp text-3xl tracking-[0.12em] md:text-5xl"
        >
          一年を通して買えるもの
        </h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-[2fr_1fr_1fr]">
          <article className="border border-sumi/15 bg-base p-7 md:p-9">
            <p className="text-xs tracking-brand text-brown/85">いつものお餅</p>
            <h3 className="mt-4 font-serifjp text-2xl tracking-[0.1em]">定番の切り餅 6種類</h3>
            <p className="mt-5 leading-8 text-sumi/70">{model.regularMochiNames.join('・')}</p>
            <p className="mt-5 text-sm leading-7 text-sumi/70">
              ※5月〜6月は、草餅に代わって新草餅を販売します。
            </p>
            <Link href="/products" data-seasonal-cta="standards" className={`${buttonClass} mt-7`}>
              定番のお餅を見る
            </Link>
          </article>
          {model.yearRoundPickles.map((product) => (
            <article key={product.id} className="border border-sumi/15 bg-base p-7 md:p-9">
              <p className="text-xs tracking-brand text-brown/85">{product.categoryLabel}</p>
              <h3 className="mt-4 font-serifjp text-xl leading-relaxed tracking-[0.1em]">
                {product.name}
              </h3>
              <ProductMetadata product={product} columns={1} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketCta() {
  return (
    <section aria-labelledby="market-cta-title" className="bg-green py-20 text-base md:py-28">
      <div className="ym-container grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
        <div>
          <p className="text-xs tracking-brand text-base/60">MORNING MARKET</p>
          <h2
            id="market-cta-title"
            className="mt-4 font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl"
          >
            季節のものは、陣屋前朝市で。
          </h2>
          <p className="mt-6 max-w-2xl leading-8 text-base/75">
            山田もち店は、飛騨高山の陣屋前朝市に出店しています。販売の時期やその日の状況は変わるため、お出かけ前に最新のお知らせもご確認ください。
          </p>
          <p className="mt-5 text-sm text-base/65">{site.market.hours}</p>
        </div>
        <div className="lg:text-right">
          <Link
            href="/market"
            data-seasonal-cta="market"
            className="inline-flex min-h-11 items-center justify-center border border-base px-6 py-3 text-sm tracking-[0.1em] transition hover:bg-base hover:text-green"
          >
            陣屋前朝市について
          </Link>
          <p className="mt-6 text-sm leading-7 text-base/70">
            Instagram
            <br />
            <span className="tracking-[0.05em]">@yamadamochiten_takayama</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export function SeasonalPage() {
  return (
    <main className="ym-page">
      <section
        aria-labelledby="seasonal-page-title"
        className="ym-container py-20 md:py-28 lg:py-32"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <p className="text-xs tracking-brand text-brown/85">SEASONAL</p>
            <h1
              id="seasonal-page-title"
              className="mt-5 font-serifjp text-4xl leading-relaxed tracking-[0.14em] md:text-6xl"
            >
              季節のお品書き
            </h1>
            <p className="mt-8 max-w-2xl leading-9 text-sumi/70">
              山田もち店では、一年を通してお届けする定番の切り餅のほかに、その時期にしか並ばないものを少しずつつくっています。飛騨高山の季節に合わせて、餅・漬物・パイ・大福と、季節ごとに顔ぶれが入れ替わります。
            </p>
          </div>
          <CurrentMonthPanel />
        </div>
        <aside className="mt-12 border-l-2 border-brown/45 bg-[#eee8dc] px-5 py-4 text-sm leading-7 text-sumi/65">
          販売時期はあくまで目安です。天候や原料の状況により、早く終了する場合があります。その日の販売状況はInstagramでもお知らせしています。
        </aside>
      </section>

      <div className="bg-white/45 py-20 md:py-28">
        <div className="ym-container">
          <section id="now" aria-labelledby="now-title" className="scroll-mt-24">
            <p className="text-xs tracking-brand text-brown/85">NOW</p>
            <h2 id="now-title" className="mt-4 font-serifjp text-3xl tracking-[0.12em] md:text-5xl">
              今、店先にあるもの
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {model.currentProducts.map((product) => (
                <SeasonalProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
          <UpcomingProducts />
          <EndedProducts />
        </div>
      </div>

      <AnnualFlow />
      <YearRoundProducts />
      <MarketCta />
    </main>
  );
}
