import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Cta } from '@/components/Cta';
import { JsonLd } from '@/components/JsonLd';
import { SectionHeading } from '@/components/SectionHeading';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { getProductRecipeGroups, publishedRecipes } from '@/lib/recipe-page';
import { breadcrumbJsonLd, pageOpenGraph, simpleItemListJsonLd } from '@/lib/seo';

const heroImage = '/images/web-plain-yakimochi.webp';
const heroImageAlt = '小皿の醤油とともに器に盛った山田もち店の切り餅';

const description =
  '焼くだけでもおいしいお餅を、毎日の食卓でもっと楽しめるように。定番の食べ方から、食事になるアレンジ、甘いおやつまで、山田もち店のお餅を使ったレシピをご紹介します。';

export const metadata: Metadata = {
  title: 'お餅のレシピ',
  description,
  alternates: { canonical: '/recipes' },
  openGraph: pageOpenGraph({
    title: 'お餅のレシピ｜山田もち店',
    description,
    path: '/recipes',
    image: heroImage,
    imageAlt: heroImageAlt,
  }),
};

export default function RecipesPage() {
  const productGroups = getProductRecipeGroups();

  return (
    <main className="ym-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: 'お餅のレシピ', path: '/recipes' },
        ])}
      />
      <JsonLd
        data={simpleItemListJsonLd(
          '山田もち店 お餅のレシピ',
          publishedRecipes.map((recipe) => recipe.title),
        )}
      />

      <section className="ym-container py-24 md:py-32">
        <SectionHeading eyebrow="RECIPES" title="お餅のレシピ" lead={description} as="h1" />
        <div className="relative mb-16 aspect-[4/3] overflow-hidden bg-[#efe9dc] md:mb-20 md:aspect-[16/7]">
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            sizes="(min-width: 768px) 1200px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="mx-auto max-w-3xl">
          <p className="text-xs tracking-brand text-brown/85">FROM OUR KITCHEN</p>
          <h2 className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl">
            山田もち店のお餅を楽しむ
          </h2>
          <p className="mt-6 leading-8 text-sumi/70">
            山田家で親しんできた食べ方から、毎日の食卓で気軽に楽しめる定番アレンジまで。山田もち店のお餅のおいしい食べ方をご紹介します。
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {publishedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      <section className="border-t border-sumi/10 bg-[#f1ece3]">
        <div className="ym-container py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs tracking-brand text-brown/85">BY PRODUCT</p>
            <h2 className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl">
              お餅から探す
            </h2>
            <p className="mt-6 leading-8 text-sumi/70">
              お手元のお餅から、その味に合うレシピをお選びいただけます。
            </p>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {productGroups.map(({ product, recipes: productRecipes }) => (
              <section
                key={product.slug}
                aria-labelledby={`recipes-for-${product.slug}`}
                className="border border-sumi/15 bg-base p-6 md:p-7"
              >
                <h3
                  id={`recipes-for-${product.slug}`}
                  className="font-serifjp text-xl tracking-[0.12em]"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="underline underline-offset-8 transition hover:text-brown"
                  >
                    {product.cardName}
                  </Link>
                </h3>
                <ul className="mt-5 space-y-1 text-sm leading-8 text-sumi/70">
                  {productRecipes.map((recipe) => (
                    <li key={recipe.id}>
                      <Link
                        href={`/recipes/${recipe.slug}`}
                        className="block rounded-sm py-1 transition hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
                      >
                        {recipe.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <Cta
        title="レシピに使うお餅を、飛騨高山から。"
        text="ご紹介したレシピは、山田もち店の切り餅で作っています。お餅はオンラインショップからご購入いただけます。"
      />
    </main>
  );
}
