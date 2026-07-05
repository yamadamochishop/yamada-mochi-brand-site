import Link from "next/link";

export default function NotFound() {
  return (
    <main className="ym-container py-28 text-center">
      <p className="text-xs tracking-brand text-sumi/45">404</p>
      <h1 className="mt-5 font-serifjp text-4xl tracking-[0.16em]">ページが見つかりません</h1>
      <p className="mx-auto mt-8 max-w-xl leading-8 text-sumi/65">
        お探しのページは移動したか、削除された可能性があります。山田もち店のトップページからご覧ください。
      </p>
      <Link href="/" className="mt-10 inline-flex border border-sumi/20 px-8 py-4 text-sm tracking-[0.12em]">
        トップページへ戻る
      </Link>
    </main>
  );
}
