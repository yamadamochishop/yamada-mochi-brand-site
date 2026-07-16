import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-[#efe9dc] p-8">
        <Image
          src={product.cardImage || product.image}
          alt={product.cardImageAlt || product.imageAlt || `${product.name}の商品写真`}
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="object-contain p-6 transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-7 text-center">
        <p className="font-serifjp text-2xl tracking-[0.14em]">{product.cardName}</p>
        <p className="mt-3 text-xs tracking-brand text-sumi/45">{product.english} / 4枚入り</p>
        <p className="mt-4 text-sm leading-7 text-sumi/65">{product.short}</p>
      </div>
    </Link>
  );
}
