import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { StickyPurchaseBar } from '@/components/StickyPurchaseBar';
import { siteJsonLd } from '@/lib/seo';
import { resolveGaMeasurementId } from '@/lib/analytics-config';
import { site } from '@/data/site';

// GA4は Vercel の Production デプロイだけで読み込む（ローカル・Previewから本番GA4へ送らない）。
// 判定と既定の測定IDは lib/analytics-config.ts を参照。
const gaMeasurementId = resolveGaMeasurementId({
  vercelEnv: process.env.VERCEL_ENV,
  configuredId: process.env.NEXT_PUBLIC_GA_ID,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: '山田もち店｜飛騨高山の思い出を贈る餅ブランド',
    template: '%s｜山田もち店',
  },
  description: site.description,
  robots: {
    index: site.isIndexable,
    follow: site.isIndexable,
  },
  openGraph: {
    title: '山田もち店｜思い出に残るお餅を。',
    description: site.description,
    url: site.siteUrl,
    siteName: site.name,
    images: [
      {
        url: '/images/og-yamada-mochi.webp',
        width: 1200,
        height: 630,
        alt: '山田もち店の高山もちギフトボックス',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '山田もち店｜思い出に残るお餅を。',
    description: site.description,
    images: ['/images/og-yamada-mochi.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>{!site.isIndexable ? <meta name="robots" content="noindex, nofollow" /> : null}</head>
      <body>
        <GoogleAnalytics measurementId={gaMeasurementId} />
        <JsonLd data={siteJsonLd()} />
        <SiteHeader />
        {children}
        <SiteFooter />
        <StickyPurchaseBar />
      </body>
    </html>
  );
}
