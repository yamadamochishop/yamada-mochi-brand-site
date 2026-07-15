import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Cta } from "@/components/Cta";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "商品一覧",
  description: "山田もち店の定番切り餅6種類。プレーン、草もち、三色豆もち、昆布もち、たまりもち、黒ごま海老もち。"
};

export default function ProductsPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-24 md:py-32">
        <SectionHeading
          eyebrow="PRODUCTS"
          title="飛騨高山の切り餅 6種類"
          lead="飛騨高山の田んぼで育てたもち米を使った、山田もち店の定番6種類です。"
          as="h1"
        />
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
