import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { SectionHeading } from "@/components/SectionHeading";
import { pageOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "朝市とオンラインショップでいただく声",
  description: "山田もち店が朝市やオンラインショップでいただく声についてご案内します。",
  openGraph: pageOpenGraph({
    title: "朝市とオンラインショップでいただく声｜山田もち店",
    description: "山田もち店が朝市やオンラインショップでいただく声についてご案内します。",
    path: "/voices"
  }),
  alternates: {
    canonical: "/voices"
  }
};

export default function VoicesPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-20 md:py-28">
        <SectionHeading eyebrow="CUSTOMER VOICES" title="朝市とオンラインショップでいただく声" as="h1" />
        <p className="mx-auto mt-10 max-w-3xl text-center leading-9 text-sumi/65">
          朝市やオンラインショップでいただく言葉は、山田もち店の励みです。掲載許可をいただいた声から、順にご紹介していきます。
        </p>
      </section>
      <Cta title="飛騨高山の思い出を、ご自宅へ。" />
    </main>
  );
}
