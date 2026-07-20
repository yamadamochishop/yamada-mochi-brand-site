import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/data/site";

// GA4 measurement IDs are public identifiers. Keep this production value as a
// safe default so every deployment sends data even when the hosting variable
// has not yet been configured. It can still be overridden per environment.
const DEFAULT_GA_MEASUREMENT_ID = "G-G4QWYR6EH4";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: "山田もち店｜飛騨高山の思い出を贈る餅ブランド",
    template: "%s｜山田もち店"
  },
  description: site.description,
  alternates: {
    canonical: "/"
  },
  robots: {
    index: site.isIndexable,
    follow: site.isIndexable
  },
  openGraph: {
    title: "山田もち店｜思い出に残るお餅を。",
    description: site.description,
    url: site.siteUrl,
    siteName: site.name,
    images: [
      {
        url: "/images/og-yamada-mochi.webp",
        width: 1200,
        height: 630,
        alt: "山田もち店の高山もちギフトボックス"
      }
    ],
    locale: "ja_JP",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "山田もち店｜思い出に残るお餅を。",
    description: site.description,
    images: ["/images/og-yamada-mochi.webp"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {!site.isIndexable ? <meta name="robots" content="noindex, nofollow" /> : null}
      </head>
      <body>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_MEASUREMENT_ID} />
        <JsonLd data={organizationJsonLd()} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
