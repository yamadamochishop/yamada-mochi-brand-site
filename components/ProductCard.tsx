import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/catalog';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';

/**
 * 商品カード。
 *
 * 商品写真は無地の背景で撮った正方形なので、枠いっぱいに敷いて写真の背景を
 * そのまま器にする（余白を付けて縮めると枠が二重に見え、商品が小さくなる）。
 * 計測が必要なBASEリンクだけをクライアント部品にし、カード本体はサーバーで描画する。
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f4efe9]">
          <Image
            src={product.cardImage || product.image}
            alt={product.cardImageAlt || product.imageAlt || `${product.name}の商品写真`}
            fill
            sizes="(min-width: 1280px) 384px, (min-width: 768px) 31vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      </Link>
      <div className="mt-6 flex flex-1 flex-col text-center">
        <p className="font-serifjp text-2xl tracking-[0.14em]">{product.cardName}</p>
        <p className="mt-2 text-xs tracking-brand text-sumi/70">{product.english}</p>
        <p className="mt-4 text-sm leading-7 text-sumi/70">{product.short}</p>
        <p className="mt-3 font-medium tracking-[0.06em] text-sumi/80">
          {product.content} ／ {product.price}
        </p>
        <div className="mx-auto mt-auto grid w-full max-w-xs grid-cols-2 gap-3 pt-6">
          <Link href={`/products/${product.slug}`} className="ym-btn ym-btn-quiet min-h-11 px-4">
            詳しく見る
          </Link>
          <TrackedBaseLink
            href={product.baseUrl}
            placement="product_card"
            className="ym-btn ym-btn-primary min-h-11 px-4"
          >
            購入する
          </TrackedBaseLink>
        </div>
      </div>
    </article>
  );
}
