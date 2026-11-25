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
import { RecipeSectionNavLink } from '@/components/recipe/RecipeSectionNavLink';
import { TrackedRecipeLink } from '@/components/recipe/TrackedRecipeLink';
import { RecipeViewTracker } from '@/components/recipe/RecipeViewTracker';
import {
  appliesToEveryProduct,
  baseTechniqueRecipePath,
  DEFAULT_PRODUCT_VARIATIONS_TITLE,
  DEFAULT_STEPS_TITLE,
  DEFAULT_VARIATIONS_TITLE,
  difficultyLabels,
  getRecipe,
  getRecipeMethodLinks,
  getRecipeProducts,
  getRelatedRecipes,
  publishedRecipes,
  recipeImageNotice,
  getVariationAnchorId,
  showBaseTechniqueStepsFooter,
  splitRecipeVariations,
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
  const imageNotice = recipeImageNotice(recipe.mainImage);
  // 全商品に共通する基本レシピは、特定の商品ではなく商品一覧へ案内する。
  const forEveryProduct = appliesToEveryProduct(recipe);
  const { general: generalVariations, byProduct: productVariations } =
    splitRecipeVariations(recipe);
  const methodLinks = getRecipeMethodLinks(recipe);

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

  const relatedSection =
    relatedRecipes.length > 0 ? (
      <section className="ym-container border-t border-sumi/10 py-20">
        <h2 className="text-center font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
          ほかのレシピ
        </h2>
        <div
          className={
            recipe.relatedRecipeIds?.length === 4
              ? 'mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4'
              : 'mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8'
          }
        >
          {relatedRecipes.map((related) => (
            <RecipeCard
              key={related.slug}
              recipe={related}
              variant={recipe.relatedRecipeIds?.length === 4 ? 'compact' : 'default'}
              tracking={{
                recipeSlug: recipe.slug,
                linkType: 'related_recipe',
                placement: 'related_recipes',
              }}
            />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link href="/recipes" className="underline underline-offset-8">
            レシピ一覧へ戻る
          </Link>
        </div>
      </section>
    ) : null;
  const ctaSection = forEveryProduct ? (
    <Cta
      title="どのお餅も、まずは焼くところから。"
      text="山田もち店の切り餅は6種類。それぞれの味に合う食べ方を、商品ページでもご紹介しています。"
    />
  ) : (
    <RecipeProductCta products={recipeProducts} recipeSlug={recipe.slug} />
  );

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
          {recipe.intro?.map((paragraph) => (
            <p key={paragraph} className="mt-5 leading-9 text-sumi/70">
              {paragraph}
            </p>
          ))}

          {methodLinks.length > 0 ? (
            <nav aria-labelledby="recipe-method-links" className="mt-10">
              <p id="recipe-method-links" className="text-xs tracking-brand text-brown/85">
                このページで紹介する方法
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {methodLinks.map((link) => (
                  <li key={link.id}>
                    <RecipeSectionNavLink
                      recipeSlug={recipe.slug}
                      sectionId={link.id}
                      className="flex min-h-12 items-center justify-between gap-3 border border-sumi/15 bg-white/40 px-4 py-2 text-sm leading-6 tracking-[0.06em] text-sumi/80 transition hover:border-sumi/40 hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
                    >
                      {link.label}
                      <span aria-hidden="true" className="text-brown/70">
                        ↓
                      </span>
                    </RecipeSectionNavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

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
              {imageNotice ? (
                <figcaption className="mt-2 text-right text-xs tracking-[0.06em] text-sumi/60">
                  ※{imageNotice}です
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

          {recipe.keyPoint ? (
            <section className="mt-10 border-l-2 border-brown/40 bg-white/35 p-7">
              <p className="text-xs tracking-brand text-brown/85">{recipe.keyPoint.label}</p>
              <h2 className="mt-3 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
                {recipe.keyPoint.title}
              </h2>
              <p className="mt-5 leading-8 text-sumi/70">{recipe.keyPoint.text}</p>
            </section>
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

          <section id="recipe-steps" className="mt-14 scroll-mt-28 md:mt-20">
            <p className="text-xs tracking-brand text-brown/85">STEPS</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
              {recipe.stepsTitle ?? DEFAULT_STEPS_TITLE}
            </h2>
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
            {showBaseTechniqueStepsFooter(recipe) ? (
              <p className="mt-8 border-t border-sumi/10 pt-5 text-sm leading-7 text-sumi/65">
                お餅をおいしく焼くコツは、
                <TrackedRecipeLink
                  href={baseTechniqueRecipePath}
                  tracking={{
                    recipeSlug: recipe.slug,
                    linkType: 'technique_guide',
                    placement: 'steps_footer',
                  }}
                  className={productLinkClass}
                >
                  お餅のおいしい焼き方・解凍方法
                </TrackedRecipeLink>
                でご紹介しています。
              </p>
            ) : null}
          </section>

          {recipe.methodGuide ? (
            <section id="method-guide" className="mt-14 scroll-mt-28 md:mt-20">
              <p className="text-xs tracking-brand text-brown/85">HOW TO BAKE</p>
              <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
                {recipe.methodGuide.title}
              </h2>
              {recipe.methodGuide.intro ? (
                <p className="mt-5 leading-8 text-sumi/70">{recipe.methodGuide.intro}</p>
              ) : null}
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {recipe.methodGuide.items.map((item) => (
                  <li key={item.anchorId} className="border border-sumi/10 bg-white/25 p-5">
                    <TrackedRecipeLink
                      href={`${baseTechniqueRecipePath}#${item.anchorId}`}
                      tracking={{
                        recipeSlug: recipe.slug,
                        linkType: 'technique_guide',
                        placement: 'method_guide',
                      }}
                      className={`inline-flex min-h-11 items-center ${productLinkClass}`}
                    >
                      {item.label}
                    </TrackedRecipeLink>
                    <p className="mt-3 text-sm leading-7 text-sumi/65">{item.text}</p>
                  </li>
                ))}
              </ul>
              <TrackedRecipeLink
                href={baseTechniqueRecipePath}
                tracking={{
                  recipeSlug: recipe.slug,
                  linkType: 'technique_guide',
                  placement: 'method_guide',
                }}
                className={`mt-6 inline-flex min-h-11 items-center text-sm ${productLinkClass}`}
              >
                {recipe.methodGuide.linkLabel}
              </TrackedRecipeLink>
            </section>
          ) : null}

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

          {recipe.cautions?.length ? (
            <section id="cautions" className="mt-14 scroll-mt-28 md:mt-20">
              <p className="text-xs tracking-brand text-brown/85">CAUTION</p>
              <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
                調理器具を使うときの注意
              </h2>
              <ul className="mt-6 space-y-3">
                {recipe.cautions.map((caution) => (
                  <li key={caution} className="leading-8 text-sumi/70">
                    {caution}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {recipe.faqs?.length ? (
            <section id="faq" className="mt-14 scroll-mt-28 md:mt-20">
              <p className="text-xs tracking-brand text-brown/85">FAQ</p>
              <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
                よくある質問
              </h2>
              <div className="mt-6 space-y-7">
                {recipe.faqs.map((faq) => (
                  <div key={faq.q}>
                    <h3 className="font-serifjp text-lg leading-8">{faq.q}</h3>
                    <p className="mt-2 leading-8 text-sumi/70">{faq.a}</p>
                    {faq.link ? (
                      <TrackedRecipeLink
                        href={faq.link.href}
                        tracking={{
                          recipeSlug: recipe.slug,
                          linkType: 'technique_guide',
                          placement: 'faq',
                        }}
                        className={`mt-2 inline-flex min-h-11 items-center text-sm ${productLinkClass}`}
                      >
                        {faq.link.label}
                      </TrackedRecipeLink>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {recipe.arrangementSection ? (
            <section id="arrangements" className="mt-14 scroll-mt-28 md:mt-20">
              <p className="text-xs tracking-brand text-brown/85">ARRANGE</p>
              <h2 className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl">
                {recipe.arrangementSection.title}
              </h2>
              {recipe.arrangementSection.intro.map((paragraph) => (
                <p key={paragraph} className="mt-5 leading-8 text-sumi/70">
                  {paragraph}
                </p>
              ))}
              <nav aria-label="調味料を変えるアレンジ" className="mt-8">
                <p className="text-xs tracking-brand text-brown/85">調味料を変える</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {recipe.arrangementSection.items.map((item, index) => (
                    <li key={item.anchorId}>
                      <RecipeSectionNavLink
                        recipeSlug={recipe.slug}
                        sectionId={item.anchorId}
                        className="flex min-h-12 items-center justify-between gap-3 border border-sumi/15 bg-white/40 px-4 py-2 text-sm leading-6 tracking-[0.06em] text-sumi/80 transition hover:border-sumi/40 hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
                      >
                        {index + 1}. {item.title}
                        <span aria-hidden="true" className="text-brown/70">
                          ↓
                        </span>
                      </RecipeSectionNavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-10">
                {recipe.arrangementSection.items.map((item, index) => (
                  <div
                    key={item.anchorId}
                    id={item.anchorId}
                    className="scroll-mt-28 border-t border-sumi/10 py-10"
                  >
                    <h3 className="font-serifjp text-xl leading-relaxed tracking-[0.1em]">
                      {index + 1}. {item.title}
                    </h3>
                    <p className="mt-4 leading-8 text-sumi/70">{item.lead}</p>
                    <h4 className="mt-8 font-serifjp text-lg tracking-[0.1em]">
                      材料（{item.servings}）
                    </h4>
                    <dl className="mt-4 divide-y divide-sumi/10 border-y border-sumi/10">
                      {item.ingredients.map((ingredient) => (
                        <div
                          key={ingredient.name}
                          className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-4 text-sm"
                        >
                          <dt className="leading-7 text-sumi/70">{ingredient.name}</dt>
                          <dd className="text-right leading-7 text-sumi/70">{ingredient.amount}</dd>
                        </div>
                      ))}
                    </dl>
                    <h4 className="mt-8 font-serifjp text-lg tracking-[0.1em]">作り方</h4>
                    <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-sumi/70">
                      {item.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    {item.tips.map((tip) => (
                      <p key={tip} className="mt-5 leading-8 text-sumi/70">
                        {tip}
                      </p>
                    ))}
                    <p className="mt-5 leading-8 text-sumi/70">
                      相性のよいお餅：
                      {item.pairings.map((pairing, pairingIndex) => (
                        <span key={pairing.productId}>
                          {pairingIndex > 0 ? '・' : null}
                          <RecipeProductLink
                            productSlug={pairing.productId}
                            recipeSlug={recipe.slug}
                            placement="recipe_arrangement"
                            className={`inline-flex min-h-11 items-center ${productLinkClass}`}
                          >
                            {pairing.label}
                          </RecipeProductLink>
                        </span>
                      ))}
                    </p>
                    {item.relatedRecipe ? (
                      <TrackedRecipeLink
                        href={`/recipes/${item.relatedRecipe.id}`}
                        tracking={{
                          recipeSlug: recipe.slug,
                          linkType: 'related_recipe',
                          placement: 'arrangement',
                        }}
                        className={`mt-3 inline-flex min-h-11 items-center ${productLinkClass}`}
                      >
                        {item.relatedRecipe.label}
                      </TrackedRecipeLink>
                    ) : null}
                  </div>
                ))}
              </div>
              {recipe.arrangementSection.outro.map((paragraph) => (
                <p key={paragraph} className="mt-5 leading-8 text-sumi/70">
                  {paragraph}
                </p>
              ))}
            </section>
          ) : null}

          {generalVariations.length > 0 ? (
            <section className="mt-14 md:mt-20">
              <p className="text-xs tracking-brand text-brown/85">VARIATION</p>
              <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
                {recipe.variationsTitle ?? DEFAULT_VARIATIONS_TITLE}
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {generalVariations.map((variation, index) => (
                  <div
                    key={variation.title}
                    id={getVariationAnchorId(variation, index)}
                    className={`scroll-mt-28 border border-sumi/10 bg-white/25 p-5 ${variation.steps ? 'sm:col-span-2' : ''}`}
                  >
                    {variation.legacyAnchorIds?.map((id) => (
                      <span key={id} id={id} aria-hidden="true" className="block scroll-mt-28" />
                    ))}
                    <h3 className="font-serifjp text-lg tracking-[0.1em]">{variation.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-sumi/65">{variation.text}</p>
                    {variation.steps ? (
                      <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-sumi/65">
                        {variation.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    ) : null}
                    {variation.afterText ? (
                      <p className="mt-4 text-sm leading-7 text-sumi/65">{variation.afterText}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {productVariations.length > 0 ? (
            <section aria-labelledby="product-variations" className="mt-14 md:mt-20">
              <p className="text-xs tracking-brand text-brown/85">WITH OTHER FLAVORS</p>
              <h2
                id="product-variations"
                className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl"
              >
                {recipe.productVariationsTitle ?? DEFAULT_PRODUCT_VARIATIONS_TITLE}
              </h2>
              <p className="mt-5 text-sm leading-7 text-sumi/65">
                {recipe.productVariationsIntro ??
                  '山田もち店の味付きのお餅でも楽しめます。どれも各商品ページでおすすめしている食べ方です。'}
              </p>
              <ul className="mt-8 divide-y divide-sumi/10 border-y border-sumi/10">
                {productVariations.map(({ variation, product }) => (
                  <li
                    key={variation.title}
                    className="grid grid-cols-[4.5rem_1fr] gap-4 py-6 sm:grid-cols-[6rem_1fr] sm:gap-6"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#efe9dc]">
                      <Image
                        src={product.cardImage || product.image}
                        alt={
                          product.cardImageAlt || product.imageAlt || `${product.name}の商品写真`
                        }
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h3 className="font-serifjp text-lg tracking-[0.1em]">{variation.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-sumi/65">{variation.text}</p>
                      <RecipeProductLink
                        productSlug={product.slug}
                        recipeSlug={recipe.slug}
                        placement="recipe_variation"
                        className="mt-2 inline-flex min-h-11 items-center text-sm tracking-[0.08em] text-green underline underline-offset-8 transition hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
                      >
                        {product.name}を見る
                      </RecipeProductLink>
                    </div>
                  </li>
                ))}
              </ul>
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

      {recipe.brandNote ? relatedSection : ctaSection}
      {recipe.brandNote ? (
        <section
          id="brand-note"
          className="ym-container scroll-mt-28 border-t border-sumi/10 py-16"
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs tracking-brand text-brown/85">ABOUT</p>
            <h2 className="mt-4 font-serifjp text-2xl tracking-[0.12em] md:text-3xl">
              {recipe.brandNote.title}
            </h2>
            <p className="mt-6 leading-9 text-sumi/70">{recipe.brandNote.body}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sumi/70">
              <TrackedRecipeLink
                href="/brand-story"
                tracking={{
                  recipeSlug: recipe.slug,
                  linkType: 'brand_story',
                  placement: 'brand_note',
                }}
                className={`inline-flex min-h-11 items-center ${productLinkClass}`}
              >
                {recipe.brandNote.brandStoryLabel}
              </TrackedRecipeLink>
              {recipeProducts[0] ? (
                <RecipeProductLink
                  productSlug={recipeProducts[0].slug}
                  recipeSlug={recipe.slug}
                  placement="recipe_brand_note"
                  className={`inline-flex min-h-11 items-center ${productLinkClass}`}
                >
                  {recipeProducts[0].name}の商品ページ
                </RecipeProductLink>
              ) : null}
              <TrackedRecipeLink
                href="/products"
                tracking={{
                  recipeSlug: recipe.slug,
                  linkType: 'products_list',
                  placement: 'brand_note',
                }}
                className={`inline-flex min-h-11 items-center ${productLinkClass}`}
              >
                商品一覧
              </TrackedRecipeLink>
            </div>
          </div>
        </section>
      ) : null}
      {recipe.brandNote ? ctaSection : relatedSection}
    </main>
  );
}
