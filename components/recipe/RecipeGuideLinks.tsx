import Image from 'next/image';
import Link from 'next/link';
import type { RecipeGuide } from '@/lib/recipe-page';

/**
 * 「磯辺焼きの作り方」「お餅のおいしい焼き方・解凍方法」への大きな入口。
 * トップページとRecipe Hubで同じ見た目・同じ文言を使う。
 *
 * 画像は各レシピの `mainImage` をそのまま使い、生成画像には
 * RecipeCardと同じ「盛り付けイメージ」の注記を付けて実写と区別する。
 */
export function RecipeGuideLinks({
  guides,
  priority = false,
}: {
  guides: RecipeGuide[];
  priority?: boolean;
}) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
      {guides.map((guide, index) => (
        <li key={guide.slug}>
          <Link
            href={guide.href}
            data-recipe-guide={guide.slug}
            className="group flex h-full flex-col border border-sumi/15 bg-base transition hover:border-sumi/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
          >
            {guide.image ? (
              <figure className="relative m-0">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#efe9dc]">
                  <Image
                    src={guide.image.src}
                    alt={guide.image.alt}
                    fill
                    priority={priority && index === 0}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                {guide.image.imageNotice ? (
                  <figcaption className="absolute bottom-2 right-2 bg-base/90 px-2 py-1 text-[11px] tracking-[0.08em] text-sumi/70">
                    {guide.image.imageNotice}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <p className="text-xs tracking-brand text-brown/85">
                GUIDE {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 font-serifjp text-2xl leading-relaxed tracking-[0.1em] md:text-[1.75rem]">
                {guide.label}
              </h3>
              <p className="mt-4 text-sm leading-7 text-sumi/70">{guide.text}</p>
              <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm tracking-[0.1em] text-green">
                <span className="underline underline-offset-8 transition group-hover:text-sumi">
                  {guide.cta}
                </span>
                <span aria-hidden="true" className="transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
