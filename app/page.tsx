import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { SectionHeading } from '@/components/SectionHeading';
import { TrackedLink } from '@/components/TrackedLink';
import { RecipeGuideLinks } from '@/components/recipe/RecipeGuideLinks';
import { sixFlavorGift } from '@/data/catalog';
import { site } from '@/data/site';
import { voices } from '@/data/voices';
import { getRecipeGuides } from '@/lib/recipe-page';

// layoutのtitle templateを通すと「｜山田もち店」が二重になるため、absoluteで指定する。
export const metadata: Metadata = {
  title: { absolute: '山田もち店｜飛騨高山・陣屋前朝市の切り餅と通販' },
  description:
    '飛騨高山で自家栽培したもち米「たかやまもち」100％の切り餅。陣屋前朝市と通販でお届けしています。お餅のおいしい焼き方や磯辺焼きなどのレシピもご紹介します。',
  alternates: { canonical: '/' },
};

const primaryCta = 'ym-btn ym-btn-primary';
const quietCta = 'ym-btn ym-btn-quiet';

export default function HomePage() {
  const recipeGuides = getRecipeGuides();

  return (
    <main className="ym-page">
      <section className="relative min-h-[78vh] overflow-hidden bg-green text-base md:min-h-[88vh]">
        <div className="absolute inset-0">
          <HeroSlideshow />
          {/* スマホでは本文が画面幅いっぱいに重なるため、全体を少し沈めて読みやすくする。 */}
          <div className="absolute inset-0 bg-green/35 md:bg-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-green/80 via-green/45 to-green/5" />
        </div>
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 py-24 md:min-h-[88vh] md:px-8">
          <div className="max-w-3xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.42)]">
            <p className="mb-7 text-xs font-semibold tracking-brand text-base/80">
              FROM HIDA TAKAYAMA
            </p>
            <h1 className="font-serifjp text-4xl tracking-[0.14em] sm:text-5xl md:text-7xl">
              思い出に残る
              <br />
              お餅を。
            </h1>
            <p className="mt-7 max-w-2xl leading-9 text-base/90">
              飛騨高山で自家栽培したもち米「たかやまもち」でつくる切り餅。
              <br className="hidden md:block" />
              陣屋前朝市と通販で、ご家庭へお届けしています。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="#popular"
                event="hero_cta_click"
                className="ym-btn ym-btn-on-dark min-w-60 bg-base/10 text-base tracking-[0.12em]"
              >
                人気商品を見る
              </TrackedLink>
              <Link
                href="/brand-story"
                className="ym-btn ym-btn-on-dark min-w-60 text-base tracking-[0.12em]"
              >
                山田もち店について
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="popular" className="bg-kinari py-20 md:py-28">
        <div className="ym-container grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={sixFlavorGift.image}
              alt={sixFlavorGift.name}
              fill
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-brand text-brown/85">POPULAR GIFT</p>
            <h2 className="mt-4 font-serifjp text-3xl leading-relaxed tracking-[0.1em] md:text-5xl">
              {sixFlavorGift.name}
            </h2>
            <p className="mt-6 leading-8 text-sumi/70">
              六つの味を一袋ずつ。飛騨高山で出会った味わいを、ご自宅や贈り物で楽しめるセットです。
            </p>
            <p className="mt-5 text-lg">
              {sixFlavorGift.content} ／ {sixFlavorGift.price}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/gift" className={quietCta}>
                商品を見る
              </Link>
              <TrackedLink
                href={sixFlavorGift.baseUrl}
                event="top_cta_click"
                external
                className={primaryCta}
              >
                オンラインショップ
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="ym-container py-20 text-center md:py-28">
        <p className="text-xs tracking-brand text-brown/85">OUR STORY</p>
        <h2 className="mt-5 font-serifjp text-4xl tracking-[0.14em] md:text-6xl">
          <span className="ym-phrase">思い出に残る</span>
          <span className="ym-phrase">お餅を。</span>
        </h2>
        <p className="mx-auto mt-8 max-w-3xl leading-9 text-sumi/70">
          飛騨高山で自家栽培したもち米を使い、家族でつくる山田もち店。陣屋前朝市で生まれる出会いとともに、お餅を届けています。
        </p>
        <Link href="/brand-story" className={`${quietCta} mt-8`}>
          ブランドストーリー
        </Link>
      </section>

      <section aria-labelledby="home-recipes" className="bg-[#f1ece3] py-20 md:py-28">
        <div className="ym-container">
          <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs tracking-brand text-brown/85">HOW TO ENJOY</p>
              <h2
                id="home-recipes"
                className="mt-4 font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl"
              >
                お餅を、
                <br className="md:hidden" />
                もっとおいしく。
              </h2>
              <p className="mt-6 leading-8 text-sumi/70">
                焼き方を少し変えるだけで、お餅の香ばしさもやわらかさも変わります。まずは基本の焼き方と、定番の磯辺焼きから。
              </p>
            </div>
            <Link
              href="/recipes"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm tracking-[0.1em] text-green underline underline-offset-8 transition hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi md:self-auto"
            >
              レシピをすべて見る
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <RecipeGuideLinks guides={recipeGuides} />
        </div>
      </section>

      <section className="bg-green py-20 text-base md:py-28">
        <div className="ym-container grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src="/images/latest-morning-market.webp"
              alt="人々が行き交う飛騨高山の陣屋前朝市"
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-brand text-base/70">MORNING MARKET</p>
            <h2 className="mt-4 font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl">
              朝市で出会う、
              <br />
              飛騨高山の味。
            </h2>
            <p className="mt-6 leading-8 text-base/80">
              旅の朝に交わす言葉や、手から手へ渡す時間。山田もち店の原点は、陣屋前朝市にあります。
            </p>
            <Link href="/market" className="ym-btn ym-btn-on-dark mt-8">
              朝市について見る
            </Link>
          </div>
        </div>
      </section>

      <section className="ym-container py-20 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-brand text-brown/85">GIFT</p>
            <h2 className="mt-4 font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl">
              大切な人にも、
              <br />
              旅の思い出を。
            </h2>
            <p className="mt-6 leading-8 text-sumi/70">
              ご自宅用、贈り物、お中元、お歳暮、お祝いに。六種類の切り餅をギフトボックスに詰めてお届けします。
            </p>
            <TrackedLink href="/gift" event="gift_cta_click" className={`${primaryCta} mt-8`}>
              ギフトを見る
            </TrackedLink>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/web-sixset-gifting.webp"
              alt="飛騨高山の切り餅ギフトを贈る様子"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-kinari py-20 md:py-28">
        <div className="ym-container">
          <SectionHeading eyebrow="CUSTOMER VOICES" title="お客様からいただいた言葉" />
          <div className="grid gap-5 md:grid-cols-2">
            {voices.map((voice) => (
              <blockquote key={voice.title} className="border border-brown/15 bg-base p-7 md:p-9">
                <p className="font-serifjp text-xl leading-9 tracking-[0.06em]">
                  「{voice.title}」
                </p>
                <p className="mt-5 leading-8 text-sumi/70">{voice.body}</p>
                <footer className="mt-5 text-sm text-sumi/70">— {voice.source}</footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/voices" className={quietCta}>
              お客様の声を見る
            </Link>
          </div>
        </div>
      </section>

      <section data-purchase-area className="bg-green px-5 py-24 text-base md:px-8 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs tracking-brand text-base/70">ONLINE SHOP</p>
          <h2 className="mt-5 font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl">
            飛騨高山から、
            <br />
            思い出に残るお餅をお届けします。
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <TrackedLink
              href="/products"
              event="top_cta_click"
              className="ym-btn ym-btn-on-dark min-w-52 text-base"
            >
              商品一覧
            </TrackedLink>
            <TrackedLink
              href={site.baseUrl}
              event="top_cta_click"
              external
              className="ym-btn ym-btn-on-dark-solid min-w-52 text-base"
            >
              オンラインショップ
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
