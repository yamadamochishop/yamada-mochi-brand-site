import Link from "next/link";
import { site } from "@/data/site";

const nav = [
  ["ブランド", "/brand-story"],
  ["商品", "/products"],
  ["ものづくり", "/craft"],
  ["三代目の想い", "/third-generation"],
  ["ギフト", "/gift"],
  ["朝市", "/market"],
  ["FAQ", "/faq"]
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sumi/10 bg-base/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="山田もち店トップへ">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-sumi/35 font-serifjp text-xl">
            山
          </span>
          <span>
            <span className="block font-serifjp text-lg tracking-[0.2em]">{site.name}</span>
            <span className="block text-[10px] tracking-brand text-sumi/55">{site.enName}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm tracking-[0.12em] text-sumi/70 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-sumi">
              {label}
            </Link>
          ))}
          <a
            href={site.baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-sumi px-5 py-3 text-sumi transition hover:bg-sumi hover:text-base"
          >
            オンラインショップ
          </a>
        </nav>
      </div>
    </header>
  );
}
