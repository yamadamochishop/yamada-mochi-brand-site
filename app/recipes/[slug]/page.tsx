import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cta } from '@/components/Cta';
import { JsonLd } from '@/components/JsonLd';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { RecipeProductCta } from '@/components/recipe/RecipeProductCta';
import { RecipeProductLink } from '@/components/recipe/RecipeProductLink';
import { RecipeViewTracker } from '@/components/recipe/RecipeViewTracker';
import {
  appliesToEveryProduct,
  difficultyLabels,
  getRecipe,
  getRecipeProducts,
  getRelatedRecipes,
  publishedRecipes,
  toRecipeListItem,
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

const productLinkClass =
  'underline underline-offset-8 transition hover:text-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi';

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const recipeProducts = getRecipeProducts(recipe);
  const relatedRecipes = getRelatedRecipes(recipe).map(toRecipeListItem);
  const structuredData = recipeJsonLd(recipe);
  // 全商品に共通する基本レシピは、特定の商品ではなく商品一覧へ案内する。
  const forEveryProduct = appliesToEveryProduct(recipe);

  // 基本情報。値があるものだけ行にする（人数・時間・難易度はHuman確認後にだけ入る）。
  const facts: { label: string; value: ReactNode }[] = [];
  if (recipeProducts.length > 0) {
    facts.push({
      label: '使うお餅',
      value: forEveryProduct ? (
        <Link href="/products" className={productLinkClass}>
          山田もち店の切り餅（全種類）
        </Link>
      ) : (
        recipeProducts.map((product, index) => (
          <span key={product.slug}>
            {index > 0 ? '・' : null}
            <RecipeProductLink
              productSlug={product.slug}
              recipeSlug={recipe.slug}
              placement="recipe_hero"
              className={productLinkClass}
            >
              {product.name}
            </RecipeProductLink>
          </span>
        ))
      ),
    });
  }
  if (recipe.cookingTimeMinutes !== undefined) {
    facts.push({ label: '目安時間', value: `約${recipe.cookingTimeMinutes}分` });
  }
  if (recipe.servings) facts.push({ label: '分量', value: recipe.servings });
  if (recipe.difficulty) {
    facts.push({ label: '難易度', value: difficultyLabels[recipe.difficulty] });
  }

  return (
    <main className="ym-page">
      <RecipeViewTracker recipeSlug={recipe.slug} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: 'お餅のレシピ', path: '/recipes' },
          { name: recipe.title, path: `/recipes/${recipe.slug}` },
        ])}
      />
      {structuredData ? <JsonLd data={structuredData} /> : null}

      <section className="ym-container pt-10 pb-20 md:pt-14 md:pb-28">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="パンくずリスト" className="text-xs tracking-[0.06em] text-sumi/60">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="transition hover:text-sumi">
                  ホーム
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/recipes" className="transition hover:text-sumi">
                  お餅のレシピ
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-sumi/80">
                {recipe.title}
              </li>
            </ol>
          </nav>

          <p className="mt-10 text-xs tracking-brand text-brown/85 md:mt-14">RECIPE</p>
          <h1 className="mt-5 font-serifjp text-3xl leading-relaxed tracking-[0.14em] md:text-5xl">
            {recipe.title}
          </h1>
          <p className="mt-8 leading-9 text-sumi/70">{recipe.description}</p>

          {recipe.mainImage ? (
            <figure className="mt-12">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#efe9dc] md:aspect-[16/10]">
                <Image
                  src={recipe.mainImage.src}
                  alt={recipe.mainImage.alt || recipe.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
              </div>
              {recipe.mainImage.sourceType === 'generated' ? (
                <figcaption className="mt-2 text-right text-xs tracking-[0.06em] text-sumi/60">
                  ※盛り付けイメージです
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {facts.length > 0 ? (
            <dl className="mt-10 divide-y divide-sumi/10 border-y border-sumi/10 text-sm">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[6rem_1fr] items-baseline gap-4 py-4 leading-8"
                >
                  <dt className="text-xs tracking-[0.12em] text-brown/85">{fact.label}</dt>
                  <dd className="text-sumi/70">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <section className="mt-14 md:mt-20">
            <p className="text-xs tracking-brand text-brown/85">INGREDIENTS</p>
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
                      <span className="ml-2 text-xs text-sumi/65">（{ingredient.note}）</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 md:mt-20">
            <p className="text-xs tracking-brand text-brown/85">STEPS</p>
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
              <p className="text-xs tracking-brand text-brown/85">POINT</p>
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
              <p className="text-xs tracking-brand text-brown/85">VARIATION</p>
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
              <p className="text-xs tracking-brand text-brown/85">COLUMN</p>
              <h2 className="mt-3 font-serifjp text-2xl leading-relaxed tracking-[0.12em]">
                {recipe.column.title}
              </h2>
              <p className="mt-6 leading-9 text-sumi/70">{recipe.column.body}</p>
            </section>
          ) : null}
        </article>
      </section>

      {forEveryProduct ? (
        <Cta
          title="どのお餅も、まずは焼くところから。"
          text="山田もち店の切り餅は6種類。それぞれの味に合う食べ方を、商品ページでもご紹介しています。"
        />
      ) : (
        <RecipeProductCta products={recipeProducts} recipeSlug={recipe.slug} />
      )}

      {relatedRecipes.length > 0 ? (
        <section className="ym-container border-t border-sumi/10 py-20">
          <h2 className="text-center font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
            ほかのレシピ
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {relatedRecipes.map((related) => (
              <RecipeCard key={related.slug} recipe={related} />
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
