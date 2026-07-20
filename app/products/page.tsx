import type { Metadata } from "next";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";
import { products } from "@/data/products";
import { breadcrumbJsonLd, pageOpenGraph, productListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "商品一覧",
  description: "山田もち店の定番切り餅6種類。プレーン、草もち、三色豆もち、昆布もち、たまりもち、黒ごま海老もち。",
  openGraph: pageOpenGraph({
    title: "商品一覧｜山田もち店",
    description: "山田もち店の定番切り餅6種類。プレーン、草もち、三色豆もち、昆布もち、たまりもち、黒ごま海老もち。",
    path: "/products",
    image: "/images/latest-six-flavors-light.webp",
    imageAlt: "山田もち店の切り餅6種類を一列に並べた商品一覧"
  }),
  alternates: {
    canonical: "/products"
  }
};

export default function ProductsPage() {
  return (
    <main className="ym-page">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "ホーム", path: "/" },
          { name: "商品一覧", path: "/products" }
        ])}
      />
      <JsonLd data={productListJsonLd(products)} />
      <section className="ym-container py-24 md:py-32">
        <SectionHeading
          eyebrow="PRODUCTS"
          title="飛騨高山の切り餅 6種類"
          lead="飛騨高山の田んぼで育てたもち米を使った、山田もち店の定番6種類です。"
          as="h1"
        />
        <div className="relative mb-16 aspect-[4/3] overflow-hidden bg-[#efe9dc] md:mb-20 md:aspect-[16/7]">
          <Image src="/images/latest-six-flavors-light.webp" alt="山田もち店の切り餅6種類を一列に並べた商品一覧" fill priority sizes="(min-width: 768px) 1200px, 100vw" className="object-cover object-center" />
        </div>
        <div className="grid gap-x-10 gap-y-20 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
      <Cta />
    </main>
  );
}
