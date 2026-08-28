import Image from 'next/image';
import Link from 'next/link';
import type { RecipeRecord } from '@/types/content-model';

/**
 * レシピ一覧カード。
 * レシピ写真は未撮影のため、`mainImage` が無い場合は画像枠自体を出さない
 * （季節商品一覧と同じ扱い。プレースホルダー画像は置かない）。
 */
export function RecipeCard({
  recipe,
  productLabels,
}: {
  recipe: RecipeRecord;
  productLabels?: string[];
}) {
  return (
    <article className="flex h-full flex-col border border-sumi/15 bg-base p-6 md:p-7">
      {recipe.mainImage ? (
        <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-[#efe9dc]">
          <Image
            src={recipe.mainImage.src}
            alt={recipe.mainImage.alt || recipe.title}
            fill
            sizes="(min-width: 1024px) 30vw, 90vw"
            className="object-cover"
          />
        </div>
      ) : null}
      {productLabels && productLabels.length > 0 ? (
        <p className="text-xs tracking-brand text-brown/65">{productLabels.join('・')}</p>
      ) : null}
      <h3 className="mt-4 font-serifjp text-2xl leading-relaxed tracking-[0.1em]">
        <Link
          href={`/recipes/${recipe.slug}`}
          className="transition hover:text-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
        >
          {recipe.title}
        </Link>
      </h3>
      <p className="mt-4 text-sm leading-7 text-sumi/65">{recipe.description}</p>
      <Link
        href={`/recipes/${recipe.slug}`}
        aria-label={`${recipe.title}の作り方を見る`}
        className="mt-auto inline-flex min-h-11 items-center pt-6 text-sm underline underline-offset-8"
      >
        作り方を見る
      </Link>
    </article>
  );
}
