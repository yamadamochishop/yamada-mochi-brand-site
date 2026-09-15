import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/catalog';
import { site } from '@/data/site';
import { RecipeProductLink } from '@/components/recipe/RecipeProductLink';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';
import { TrackedSalesChannelLink } from '@/components/TrackedSalesChannelLink';
import { isNekoposEligible, nekoposHeadline } from '@/lib/shipping';

const secondaryChannelLinkClass =
  'underline underline-offset-4 transition hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi';

/**
 * レシピ詳細の購入導線。
 * 記事共通の `ArticlePurchaseCTA` は食べ比べセット固定のため、レシピでは
 * そのレシピで実際に使うお餅を案内する。価格・送料・BASE URLは
 * カタログと `lib/shipping` の正本をそのまま参照する。
 *
 * 主CTAはBASE。食べチョク・ポケットマルシェは各生産者ページへの副次導線として、
 * 商品カードの下に控えめなテキストリンクで置く（取扱商品は各サイトの掲載に従う）。
 */
export function RecipeProductCta({
  products,
  recipeSlug,
}: {
  products: Product[];
  recipeSlug?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section
      data-purchase-area
      aria-labelledby="recipe-product-title"
      className="bg-[#f1ece3] px-5 py-20 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs tracking-brand text-brown/85">FOR THIS RECIPE</p>
        <h2
          id="recipe-product-title"
          className="mt-4 text-center font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl"
        >
          このレシピに使ったお餅
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-sumi/65">
          飛騨高山の家族で仕上げている切り餅です。商品ページで味の特徴や保存方法をご覧いただけます。
        </p>
        <div
          className={`mt-12 grid gap-8 ${products.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}
        >
          {products.map((product) => (
            <article key={product.slug} className="flex h-full flex-col bg-base p-6 md:p-7">
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-[#efe9dc]">
                  <Image
                    src={product.cardImage || product.image}
                    alt={product.cardImageAlt || product.imageAlt || `${product.name}の商品写真`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-contain p-6"
                  />
                </div>
              </Link>
              <h3 className="mt-6 font-serifjp text-2xl tracking-[0.12em]">{product.cardName}</h3>
              <p className="mt-4 text-sm leading-7 text-sumi/65">{product.short}</p>
              <p className="mt-4 text-sm tracking-[0.06em] text-sumi/80">
                {product.content} ／ {product.price}
              </p>
              {isNekoposEligible(product.slug) ? (
                <p className="mt-3 text-xs leading-6 text-green">{nekoposHeadline}</p>
              ) : null}
              <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
                <RecipeProductLink
                  productSlug={product.slug}
                  recipeSlug={recipeSlug}
                  placement="recipe_product_cta"
                  className="inline-flex min-h-11 flex-1 items-center justify-center border border-sumi/20 px-5 text-sm tracking-[0.1em] transition hover:border-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
                >
                  商品を見る
                </RecipeProductLink>
                <TrackedBaseLink
                  href={product.baseUrl}
                  placement="recipe_product"
                  className="inline-flex min-h-11 flex-1 items-center justify-center bg-green px-5 text-sm tracking-[0.1em] text-white transition hover:bg-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
                >
                  BASEで購入する
                </TrackedBaseLink>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center text-sm tracking-[0.08em] underline underline-offset-8 transition hover:text-brown"
          >
            山田もち店のお餅をすべて見る
          </Link>
        </p>
        <p className="mt-6 text-center text-sm leading-7 text-sumi/65">
          いつもの通販サイトからも購入できます
          <span className="mt-1 block text-xs tracking-[0.06em] text-sumi/60">
            <TrackedSalesChannelLink
              href={site.tabechokuUrl}
              channel="tabechoku"
              placement="recipe_product"
              className={secondaryChannelLinkClass}
            >
              食べチョク
            </TrackedSalesChannelLink>
            <span aria-hidden="true" className="mx-3">
              ｜
            </span>
            <TrackedSalesChannelLink
              href={site.pokeMarcheUrl}
              channel="pokemaru"
              placement="recipe_product"
              className={secondaryChannelLinkClass}
            >
              ポケットマルシェ
            </TrackedSalesChannelLink>
          </span>
        </p>
      </div>
    </section>
  );
}
