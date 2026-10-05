import Link from 'next/link';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';
import { fixedSetVariants, setLineup, products } from '@/data/catalog';

export function SetLineup({ giftOnly = false }: { giftOnly?: boolean }) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {setLineup.map((set) => (
        <article
          key={set.bags}
          id={`set-${set.bags}`}
          className="border border-sumi/10 bg-white/35 p-6 md:p-8"
        >
          <h3 className="font-serifjp text-2xl tracking-[0.1em]">
            {set.bags}袋{giftOnly ? 'ギフト' : 'セット'}
          </h3>
          <p className="mt-4 text-sm leading-7 text-sumi/70">
            6種類 × 各{set.quantityPerFlavor}袋 ／ 1袋200g（4枚入り）
          </p>
          <p className="mt-3 text-sm leading-7 text-sumi/70">
            {products.map((product, index) => (
              <span key={product.slug}>
                {index > 0 ? '、' : ''}
                <Link href={`/products/${product.slug}`} className="underline underline-offset-4">
                  {product.name}
                </Link>
              </span>
            ))}
          </p>
          {(giftOnly ? (['贈りもの用'] as const) : (['ご自宅用', '贈りもの用'] as const)).map(
            (purpose) => {
              const variants = fixedSetVariants.filter(
                (variant) => variant.bags === set.bags && variant.purpose === purpose,
              );
              return (
                <div key={purpose} className="mt-6 border-t border-sumi/10 pt-5">
                  <h4 className="font-serifjp text-lg">
                    {purpose}　{purpose === 'ご自宅用' ? set.homePrice : set.gift.price}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-sumi/70">
                    {purpose === 'ご自宅用' ? 'ギフト箱なし・配送用段ボール' : set.gift.packaging}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-sumi/70">
                    {variants.map((variant, index) => (
                      <span key={variant.id} id={variant.id}>
                        {index > 0 ? '・' : ''}
                        {variant.delivery}
                      </span>
                    ))}
                    （同額）
                  </p>
                  <div className="mt-4 flex flex-col gap-3 lg:flex-row">
                    {variants.map((variant) => (
                      <TrackedBaseLink
                        key={variant.id}
                        href={variant.baseUrl}
                        placement="set_card"
                        className="ym-btn ym-btn-primary flex-1 px-4"
                      >
                        {variant.delivery}をBASEで見る
                      </TrackedBaseLink>
                    ))}
                  </div>
                </div>
              );
            },
          )}
          <p className="mt-5 text-sm leading-7 text-sumi/65">
            商品価格は常温便・冷凍便とも同額。送料別。
            <br />
            アレルゲン：{set.gift.allergy}
          </p>
        </article>
      ))}
    </div>
  );
}
