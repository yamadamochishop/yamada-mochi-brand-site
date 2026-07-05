import Link from "next/link";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-sumi/10 bg-[#ede7dc]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-serifjp text-2xl tracking-[0.2em]">{site.name}</p>
          <p className="mt-3 text-xs tracking-brand text-sumi/55">{site.enName}</p>
          <p className="mt-8 max-w-md leading-8 text-sumi/70">
            {site.tagline}
            <br />
            飛騨高山の朝市から、家族の手仕事でつくるお餅をお届けします。
          </p>
        </div>
        <div className="text-sm leading-9 text-sumi/70">
          <Link href="/brand-story" className="block hover:text-sumi">
            ブランドストーリー
          </Link>
          <Link href="/products" className="block hover:text-sumi">
            商品一覧
          </Link>
          <Link href="/gift" className="block hover:text-sumi">
            ギフト
          </Link>
          <Link href="/market" className="block hover:text-sumi">
            陣屋前朝市
          </Link>
          <Link href="/third-generation" className="block hover:text-sumi">
            三代目の想い
          </Link>
          <Link href="/voices" className="block hover:text-sumi">
            お客様の声
          </Link>
        </div>
        <div className="text-sm leading-8 text-sumi/70">
          <p>{site.address}</p>
          <p>TEL: {site.tel}</p>
          <Link href="/faq" className="mt-5 block hover:text-sumi">
            よくある質問
          </Link>
          <Link href="/contact" className="block hover:text-sumi">
            お問い合わせ
          </Link>
          <a href={site.baseUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block underline underline-offset-4">
            BASEで購入する
          </a>
        </div>
      </div>
      <div className="border-t border-sumi/10 px-5 py-5 text-center text-xs tracking-[0.12em] text-sumi/50">
        © {site.name} ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
