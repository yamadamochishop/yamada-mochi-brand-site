import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { SectionHeading } from "@/components/SectionHeading";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "よくある質問",
  description: "山田もち店の切り餅の保存方法、焼き方、ギフト対応、朝市での購入についてまとめました。",
  alternates: {
    canonical: "/faq"
  }
};

export default function FaqPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-20 md:py-28">
        <SectionHeading eyebrow="FAQ" title="よくある質問" />
        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="border border-sumi/10 bg-white/30 p-6">
              <summary className="cursor-pointer font-serifjp text-xl tracking-[0.08em]">{faq.q}</summary>
              <p className="mt-5 leading-8 text-sumi/65">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
      <Cta title="ご不明点があれば、お気軽にお問い合わせください。" />
    </main>
  );
}
