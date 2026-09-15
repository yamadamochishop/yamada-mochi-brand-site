import Image from 'next/image';
import Link from 'next/link';
import { difficultyLabels, type RecipeListItem } from '@/lib/recipe-page';

/**
 * レシピ一覧カード。
 *
 * 写真が未撮影のレシピは画像枠を出さず、コンパクトなテキストカードにする。
 * `mainImage` を登録すれば写真付きカードに切り替わり、
 * `sourceType: 'generated'` の画像には「盛り付けイメージ」の注記を添えて
 * 実写と区別する。
 *
 * 調理時間・難易度はHuman確認済みのレシピにだけ値が入るため、
 * 未設定の間は行ごと出さない。
 */
export function RecipeCard({
  recipe,
  priority = false,
}: {
  recipe: RecipeListItem;
  priority?: boolean;
}) {
  const href = `/recipes/${recipe.slug}`;
  const meta: string[] = [];
  if (recipe.cookingTimeMinutes !== undefined) meta.push(`目安 約${recipe.cookingTimeMinutes}分`);
  if (recipe.difficulty) meta.push(difficultyLabels[recipe.difficulty]);

  return (
    <article
      data-recipe-card={recipe.slug}
      className="flex h-full flex-col border border-sumi/15 bg-base"
    >
      {recipe.mainImage ? (
        <Link href={href} aria-label={`${recipe.title}のレシピを見る`} className="block">
          <figure className="relative m-0">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#efe9dc]">
              <Image
                src={recipe.mainImage.src}
                alt={recipe.mainImage.alt || recipe.title}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            {recipe.mainImage.imageNotice ? (
              <figcaption className="absolute bottom-2 right-2 bg-base/90 px-2 py-1 text-[11px] tracking-[0.08em] text-sumi/70">
                {recipe.mainImage.imageNotice}
              </figcaption>
            ) : null}
          </figure>
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {recipe.productLabels.length > 0 ? (
          <p className="text-xs tracking-brand text-brown/85">{recipe.productLabels.join('・')}</p>
        ) : null}
        <h3 className="mt-3 font-serifjp text-xl leading-relaxed tracking-[0.1em] md:text-2xl">
          <Link
            href={href}
            className="transition hover:text-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
          >
            {recipe.title}
          </Link>
        </h3>
        {meta.length > 0 ? (
          <p className="mt-3 text-xs tracking-[0.08em] text-sumi/60">{meta.join('　')}</p>
        ) : null}
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-sumi/65">{recipe.description}</p>
        <div className="mt-auto pt-6">
          <Link
            href={href}
            aria-label={`${recipe.title}のレシピを見る`}
            className="inline-flex min-h-11 w-full items-center justify-center border border-sumi/20 px-5 text-sm tracking-[0.1em] transition hover:border-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi sm:w-auto"
          >
            レシピを見る
          </Link>
        </div>
      </div>
    </article>
  );
}
