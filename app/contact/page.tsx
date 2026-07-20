import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "山田もち店へのお問い合わせページです。商品、ギフト、朝市での販売についてお気軽にご連絡ください。",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-20 md:py-28">
        <SectionHeading eyebrow="CONTACT" title="お問い合わせ" as="h1" />
        <div className="mx-auto mt-14 max-w-3xl border border-sumi/10 bg-white/35 p-8 md:p-12">
          <p className="leading-9 text-sumi/65">
            商品やご注文に関するご質問は、お問い合わせ窓口またはオンラインショップをご利用ください。
            配送・返品・お支払いなどのご注文に関する詳細は、オンラインショップの商品ページおよび特定商取引法に基づく表記をご確認ください。
          </p>
          <dl className="mt-10 divide-y divide-sumi/10 border-y border-sumi/10">
            <div className="grid gap-2 py-5 md:grid-cols-[9rem_1fr]">
              <dt className="text-sm tracking-[0.12em] text-sumi/45">TEL</dt>
              <dd>{site.tel}</dd>
            </div>
            <div className="grid gap-2 py-5 md:grid-cols-[9rem_1fr]">
              <dt className="text-sm tracking-[0.12em] text-sumi/45">MAIL</dt>
              <dd>
                <a className="underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="grid gap-2 py-5 md:grid-cols-[9rem_1fr]">
              <dt className="text-sm tracking-[0.12em] text-sumi/45">ADDRESS</dt>
              <dd>{site.address}</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {site.googleFormUrl ? (
              <a className="inline-flex justify-center bg-green px-8 py-4 text-sm tracking-[0.12em] text-white" href={site.googleFormUrl} target="_blank" rel="noopener noreferrer">
                お問い合わせフォームへ
              </a>
            ) : (
              <p className="border border-dashed border-sumi/20 px-6 py-4 text-sm leading-7 text-sumi/60">
                GoogleフォームURLを環境変数に設定すると、ここにお問い合わせフォームボタンが表示されます。
              </p>
            )}
            <Link className="inline-flex justify-center border border-sumi/20 px-8 py-4 text-sm tracking-[0.12em]" href="/faq">
              よくある質問を見る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
