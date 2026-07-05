import type { Metadata } from "next";
import { Cta } from "@/components/Cta";
import { SectionHeading } from "@/components/SectionHeading";
import { voices } from "@/data/voices";

export const metadata: Metadata = {
  title: "お客様の声",
  description: "山田もち店のお餅を通販や飛騨高山の陣屋前朝市でお選びいただいたお客様の声をご紹介します。",
  alternates: {
    canonical: "/voices"
  }
};

export default function VoicesPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-20 md:py-28">
        <SectionHeading eyebrow="CUSTOMER VOICES" title="お客様の声" />
        <p className="mx-auto mt-10 max-w-3xl text-center leading-9 text-sumi/65">
          旅先で出会った味が、ご自宅の食卓へ。山田もち店に届いた言葉の一部をご紹介します。
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {voices.map((voice) => (
            <article key={voice.title} className="border border-sumi/10 bg-white/35 p-8 md:p-10">
              <p className="text-xs tracking-brand text-brown/50">{voice.source}</p>
              <h2 className="mt-5 font-serifjp text-2xl leading-relaxed tracking-[0.1em]">{voice.title}</h2>
              <p className="mt-6 leading-8 text-sumi/65">{voice.body}</p>
            </article>
          ))}
        </div>
      </section>
      <Cta title="飛騨高山の思い出を、ご自宅へ。" />
    </main>
  );
}
