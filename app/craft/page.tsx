import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { Cta } from "@/components/Cta";

export const metadata: Metadata = {
  title: "ものづくり",
  description: "自家栽培もち米、飛騨高山の水、家族の手仕事。山田もち店の餅づくり。",
  alternates: {
    canonical: "/craft"
  }
};

export default function CraftPage() {
  return (
    <main className="ym-page">
      <section className="ym-container py-24 md:py-32">
        <SectionHeading
          eyebrow="OUR CRAFT"
          title="山田もち店のものづくり"
          lead="料理人として学んだ、素材を生かすという考え方を、家族で続ける餅づくりに生かしています。"
          as="h1"
        />
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/8]">
          <Image src="/images/latest-craft-rolling.webp" alt="家族の手で餅を均一に伸ばして整える製造風景" fill priority sizes="(min-width: 768px) 1200px, 100vw" className="object-cover object-[58%_center] md:object-center" />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/latest-craft-seiro.webp" alt="朝の光が差し込む製造場のせいろ" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-center" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/rice-field-farmer-wide.jpg" alt="飛騨高山で家族がもち米を育てる田んぼ" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-center" />
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            ["たかやまもち", "千島町・越後町の田んぼで家族が育てるもち米を使用。"],
            ["丁寧に仕上げる", "もち米本来の風味と粘りを大切にしながら、一つひとつ丁寧に仕上げています。"],
            ["添加物不使用", "余計なものを加えず、もち米本来のおいしさを大切にしています。"]
          ].map(([title, text]) => (
            <article key={title} className="border border-sumi/10 p-8">
              <h2 className="font-serifjp text-2xl tracking-[0.12em]">{title}</h2>
              <p className="mt-5 leading-8 text-sumi/65">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <Cta />
    </main>
  );
}
