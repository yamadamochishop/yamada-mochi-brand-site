import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#efe9dc] p-8">
        <Image
          src={product.cardImage || product.image}
          alt={product.cardImageAlt || product.imageAlt || `${product.name}の商品写真`}
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="object-contain p-6 transition duration-700 group-hover:scale-[1.04]"
        />
        </div>
      </Link>
      <div className="mt-7 text-center">
        <p className="font-serifjp text-2xl tracking-[0.14em]">{product.cardName}</p>
        <p className="mt-3 text-xs tracking-brand text-sumi/45">{product.english} / 4枚入り</p>
        <p className="mt-4 text-sm leading-7 text-sumi/65">{product.short}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={`/products/${product.slug}`} className="text-sm underline underline-offset-4">
            詳しく見る
          </Link>
          <a
            href={product.baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center bg-green px-5 py-3 text-sm tracking-[0.1em] text-white transition hover:bg-sumi"
          >
            BASEで購入する
          </a>
        </div>
      </div>
    </article>
  );
}
