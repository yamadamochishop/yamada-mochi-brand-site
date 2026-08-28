import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cta } from '@/components/Cta';
import { JsonLd } from '@/components/JsonLd';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeProductCta } from '@/components/recipe/RecipeProductCta';
import { products } from '@/data/catalog';
import {
  getRecipe,
  getRecipeProducts,
  getRelatedRecipes,
  publishedRecipes,
} from '@/lib/recipe-page';
import { breadcrumbJsonLd, pageOpenGraph, recipeJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return publishedRecipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};

  const title = recipe.seo?.title || recipe.title;
  const description = recipe.seo?.description || recipe.description;

  return {
    title,
    description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: pageOpenGraph({
      title: `${title}｜山田もち店`,
      description,
      path: `/recipes/${recipe.slug}`,
      ...(recipe.mainImage ? { image: recipe.mainImage.src, imageAlt: recipe.mainImage.alt } : {}),
    }),
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const recipeProducts = getRecipeProducts(recipe);
  const relatedRecipes = getRelatedRecipes(recipe);
  const structuredData = recipeJsonLd(recipe);
  // 全商品に共通する基本レシピは、特定の商品ではなく商品一覧へ案内する。
  const appliesToEveryProduct = recipeProducts.length === products.length;

  return (
    <main className="ym-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: 'お餅のレシピ', path: '/recipes' },
          { name: recipe.title, path: `/recipes/${recipe.slug}` },
        ])}
      />
      {structuredData ? <JsonLd data={structuredData} /> : null}

      <section className="ym-container py-20 md:py-28">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs tracking-brand text-brown/60">RECIPE</p>
          <h1 className="mt-5 font-serifjp text-3xl leading-relaxed tracking-[0.14em] md:text-5xl">
            {recipe.title}
          </h1>
          <p className="mt-8 leading-9 text-sumi/70">{recipe.description}</p>

          {recipe.mainImage ? (
            <div className="relative mt-12 aspect-[4/3] overflow-hidden bg-[#efe9dc] md:aspect-[16/10]">
              <Image
                src={recipe.mainImage.src}
                alt={recipe.mainImage.alt || recipe.title}
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          {recipeProducts.length > 0 && !appliesToEveryProduct ? (
            <p className="mt-10 border-y border-sumi/10 py-5 text-sm leading-8 text-sumi/70">
              使うお餅：
              {recipeProducts.map((product, index) => (
                <span key={product.slug}>
                  {index > 0 ? '・' : null}
                  <Link
                    href={`/products/${product.slug}`}
                    className="underline underline-offset-8 transition hover:text-brown"
                  >
                    {product.name}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}

          <section className="mt-14 md:mt-20">
            <p className="text-xs tracking-brand text-brown/60">INGREDIENTS</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">材料</h2>
            <dl className="mt-8 divide-y divide-sumi/10 border-y border-sumi/10">
              {recipe.ingredients.map((ingredient) => (
                <div
                  key={ingredient.name}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 text-sm"
                >
                  <dt className="leading-7 text-sumi/70">{ingredient.name}</dt>
                  <dd className="text-right leading-7 text-sumi/70">
                    {ingredient.amount}
                    {ingredient.note ? (
                      <span className="ml-2 text-xs text-sumi/55">（{ingredient.note}）</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 md:mt-20">
            <p className="text-xs tracking-brand text-brown/60">STEPS</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">作り方</h2>
            <ol className="mt-8 space-y-6">
              {recipe.steps.map((step) => (
                <li key={step.position} className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 place-items-center rounded-full border border-sumi/20 font-serifjp text-lg text-sumi/70"
                  >
                    {step.position}
                  </span>
                  <p className="pt-2 leading-9 text-sumi/70">{step.instruction}</p>
                </li>
              ))}
            </ol>
          </section>

          {recipe.notes && recipe.notes.length > 0 ? (
            <section className="mt-14 border-l-2 border-brown/40 bg-white/35 p-7 md:mt-20">
              <p className="text-xs tracking-brand text-brown/60">POINT</p>
              <h2 className="mt-3 font-serifjp text-2xl tracking-[0.12em]">おいしく作るポイント</h2>
              <ul className="mt-5 space-y-3">
                {recipe.notes.map((note) => (
                  <li key={note} className="leading-8 text-sumi/70">
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {recipe.variations && recipe.variations.length > 0 ? (
            <section className="mt-14 md:mt-20">
              <p className="text-xs tracking-brand text-brown/60">VARIATION</p>
              <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">アレンジ</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {recipe.variations.map((variation) => (
                  <div key={variation.title} className="border border-sumi/10 bg-white/25 p-5">
                    <h3 className="font-serifjp text-lg tracking-[0.1em]">{variation.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-sumi/65">{variation.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {recipe.column ? (
            <section className="mt-14 bg-[#eee8dc] p-7 md:mt-20 md:p-10">
              <p className="text-xs tracking-brand text-brown/60">COLUMN</p>
              <h2 className="mt-3 font-serifjp text-2xl leading-relaxed tracking-[0.12em]">
                {recipe.column.title}
              </h2>
              <p className="mt-6 leading-9 text-sumi/70">{recipe.column.body}</p>
            </section>
          ) : null}
        </article>
      </section>

      {appliesToEveryProduct ? (
        <Cta
          title="どのお餅も、まずは焼くところから。"
          text="山田もち店の切り餅は6種類。それぞれの味に合う食べ方を、商品ページでもご紹介しています。"
        />
      ) : (
        <RecipeProductCta products={recipeProducts} />
      )}

      {relatedRecipes.length > 0 ? (
        <section className="ym-container border-t border-sumi/10 py-20">
          <h2 className="text-center font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
            ほかのレシピ
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {relatedRecipes.map((related) => (
              <RecipeCard key={related.id} recipe={related} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/recipes" className="underline underline-offset-8">
              レシピ一覧へ戻る
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
