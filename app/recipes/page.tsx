import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Cta } from '@/components/Cta';
import { JsonLd } from '@/components/JsonLd';
import { SectionHeading } from '@/components/SectionHeading';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeExplorer } from '@/components/recipe/RecipeExplorer';
import { RecipeProductLink } from '@/components/recipe/RecipeProductLink';
import {
  getFeaturedRecipes,
  getProductRecipeGroups,
  getRecipeFilterProducts,
  publishedRecipes,
  toRecipeListItem,
} from '@/lib/recipe-page';
import { breadcrumbJsonLd, pageOpenGraph, recipeItemListJsonLd } from '@/lib/seo';

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
  const featured = getFeaturedRecipes().map(toRecipeListItem);
  const listItems = publishedRecipes.map(toRecipeListItem);
  const filterProducts = getRecipeFilterProducts();

  return (
    <main className="ym-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: 'お餅のレシピ', path: '/recipes' },
        ])}
      />
      <JsonLd data={recipeItemListJsonLd(publishedRecipes)} />

      <section className="ym-container pt-20 md:pt-28">
        <SectionHeading eyebrow="RECIPES" title="お餅のレシピ" lead={description} as="h1" />
        <div className="relative aspect-[4/3] overflow-hidden bg-[#efe9dc] md:aspect-[16/7]">
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            sizes="(min-width: 768px) 1200px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="mx-auto mt-14 max-w-3xl md:mt-20">
          <p className="text-xs tracking-brand text-brown/85">FROM OUR KITCHEN</p>
          <h2 className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl">
            山田もち店のお餅を楽しむ
          </h2>
          <p className="mt-6 leading-8 text-sumi/70">
            山田家で親しんできた食べ方から、毎日の食卓で気軽に楽しめる定番アレンジまで。山田もち店のお餅のおいしい食べ方をご紹介します。
          </p>
        </div>
      </section>

      {featured.length > 0 ? (
        <section aria-labelledby="featured-recipes" className="ym-container mt-14 md:mt-20">
          <p className="text-xs tracking-brand text-brown/85">FEATURED</p>
          <h2
            id="featured-recipes"
            className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl"
          >
            注目レシピ
          </h2>
          {/* スマホでは横スクロール、md以上では3列。人気指標が入るとこの並びが人気順に変わる。 */}
          <div className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {featured.map((recipe, index) => (
              <div
                key={recipe.slug}
                className="w-[82vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <RecipeCard recipe={recipe} priority={index === 0} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="all-recipes" className="ym-container mt-16 pb-24 md:mt-24 md:pb-32">
        <p className="text-xs tracking-brand text-brown/85">ALL RECIPES</p>
        <h2
          id="all-recipes"
          className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl"
        >
          すべてのレシピ
        </h2>
        <div className="mt-8">
          <RecipeExplorer recipes={listItems} products={filterProducts} />
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

          <div className="mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-y-10">
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
                  <RecipeProductLink
                    productSlug={product.slug}
                    placement="recipe_hub_product_group"
                    className="underline underline-offset-8 transition hover:text-brown"
                  >
                    {product.cardName}
                  </RecipeProductLink>
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
