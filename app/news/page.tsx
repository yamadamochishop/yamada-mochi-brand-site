import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/SectionHeading';
import { news } from '@/data/news';
import { pageOpenGraph } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'お知らせ',
  description: '山田もち店からのお知らせを掲載します。',
  openGraph: pageOpenGraph({
    title: 'お知らせ｜山田もち店',
    description: '山田もち店からのお知らせを掲載します。',
    path: '/news',
  }),
  alternates: {
    canonical: '/news',
  },
};

export default function NewsPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-20 md:py-28">
        <SectionHeading eyebrow="NEWS" title="お知らせ" as="h1" />
        <div className="mx-auto mt-16 max-w-3xl divide-y divide-sumi/10 border-y border-sumi/10">
          {news.map((item) => (
            <article id={item.id} key={item.id} className="grid scroll-mt-28 gap-3 py-7 md:grid-cols-[8rem_1fr]">
              <time
                dateTime={item.date.replaceAll('.', '-')}
                className="text-sm tracking-[0.12em] text-sumi/65"
              >
                {item.date}
              </time>
              <div>
                <h2 className="font-serifjp text-xl tracking-[0.08em]">{item.title}</h2>
                <p className="mt-3 leading-8 text-sumi/65">{item.body}</p>
                {item.links?.length ? (
                  <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex min-h-11 items-center gap-2 text-sm text-green underline underline-offset-8 transition-colors hover:text-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
                      >
                        {link.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
