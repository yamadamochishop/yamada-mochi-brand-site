import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { news } from "@/data/news";
import { pageOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "山田もち店からのお知らせを掲載します。",
  openGraph: pageOpenGraph({
    title: "お知らせ｜山田もち店",
    description: "山田もち店からのお知らせを掲載します。",
    path: "/news"
  }),
  alternates: {
    canonical: "/news"
  }
};

export default function NewsPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-20 md:py-28">
        <SectionHeading eyebrow="NEWS" title="お知らせ" as="h1" />
        <div className="mx-auto mt-16 max-w-3xl divide-y divide-sumi/10 border-y border-sumi/10">
          {news.map((item) => (
            <article key={item.title} className="grid gap-3 py-7 md:grid-cols-[8rem_1fr]">
              <time className="text-sm tracking-[0.12em] text-sumi/45">{item.date}</time>
              <div>
                <h2 className="font-serifjp text-xl tracking-[0.08em]">{item.title}</h2>
                <p className="mt-3 leading-8 text-sumi/65">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
