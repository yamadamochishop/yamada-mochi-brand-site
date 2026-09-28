import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/catalog';
import { site } from '@/data/site';
import { RecipeProductLink } from '@/components/recipe/RecipeProductLink';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';
import { TrackedSalesChannelLink } from '@/components/TrackedSalesChannelLink';
import { isNekoposEligible, nekoposHeadline } from '@/lib/shipping';

const secondaryChannelLinkClass =
  'inline-flex min-h-11 items-center underline underline-offset-4 transition hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi';

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
  // 1商品だけのときは横並びにする（縦積みのままだと写真が全幅の正方形になり大きすぎる）。
  const single = products.length === 1;

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
          className={`mt-12 grid gap-8 ${single ? 'mx-auto max-w-4xl' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
        >
          {products.map((product) => (
            <article
              key={product.slug}
              className={`flex h-full flex-col bg-base p-6 md:p-7 ${
                single
                  ? 'md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center md:gap-10'
                  : ''
              }`}
            >
              <RecipeProductLink
                productSlug={product.slug}
                recipeSlug={recipeSlug}
                placement="recipe_product_cta"
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden bg-[#f4efe9]">
                  <Image
                    src={product.cardImage || product.image}
                    alt={product.cardImageAlt || product.imageAlt || `${product.name}の商品写真`}
                    fill
                    sizes={
                      single
                        ? '(min-width: 1024px) 380px, (min-width: 768px) 40vw, 100vw'
                        : '(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw'
                    }
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
              </RecipeProductLink>
              <div className="flex flex-1 flex-col">
                <h3 className="mt-6 font-serifjp text-2xl tracking-[0.12em] md:mt-0">
                  {product.cardName}
                </h3>
                <p className="mt-4 text-sm leading-7 text-sumi/70">{product.short}</p>
                <p className="mt-4 text-sm tracking-[0.06em] text-sumi/80">
                  {product.content} ／ {product.price}
                </p>
                {isNekoposEligible(product.slug) ? (
                  <p className="mt-3 text-xs leading-6 text-green">{nekoposHeadline}</p>
                ) : null}
                <div
                  className={`mt-auto flex flex-col gap-3 pt-7 sm:flex-row ${single ? 'md:mt-0' : ''}`}
                >
                  <RecipeProductLink
                    productSlug={product.slug}
                    recipeSlug={recipeSlug}
                    placement="recipe_product_cta"
                    className="ym-btn ym-btn-quiet min-h-11 flex-1 px-5"
                  >
                    商品を見る
                  </RecipeProductLink>
                  <TrackedBaseLink
                    href={product.baseUrl}
                    placement="recipe_product"
                    className="ym-btn ym-btn-primary min-h-11 flex-1 px-5"
                  >
                    BASEで購入する
                  </TrackedBaseLink>
                </div>
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
