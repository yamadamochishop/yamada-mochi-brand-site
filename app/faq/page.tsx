import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta } from '@/components/Cta';
import { SectionHeading } from '@/components/SectionHeading';
import { JsonLd } from '@/components/JsonLd';
import { faqs } from '@/data/faqs';
import { faqPageJsonLd, pageOpenGraph } from '@/lib/seo';

const description =
  '山田もち店の切り餅とギフトセットについて、内容・価格・送料・賞味期限、冷凍したお餅の焼き方をご案内します。';

export const metadata: Metadata = {
  title: 'よくある質問',
  description,
  openGraph: pageOpenGraph({
    title: 'よくある質問｜山田もち店',
    description,
    path: '/faq',
  }),
  alternates: {
    canonical: '/faq',
  },
};

export default function FaqPage() {
  return (
    <main className="ym-page">
      <JsonLd data={faqPageJsonLd(faqs)} />
      <section className="ym-container py-20 md:py-28">
        <SectionHeading eyebrow="FAQ" title="よくあるご質問" as="h1" />
        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="border border-sumi/10 bg-white/30 p-6">
              <summary className="cursor-pointer font-serifjp text-xl tracking-[0.08em]">
                {faq.q}
              </summary>
              <p className="mt-5 leading-8 text-sumi/65">{faq.a}</p>
              {faq.link ? (
                <p className="mt-4">
                  <Link
                    href={faq.link.href}
                    className="inline-flex min-h-11 items-center text-sm tracking-[0.08em] text-green underline underline-offset-8 transition hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
                  >
                    {faq.link.label}
                  </Link>
                </p>
              ) : null}
            </details>
          ))}
        </div>
      </section>
      <Cta title="ご不明点があれば、お気軽にお問い合わせください。" />
    </main>
  );
}
