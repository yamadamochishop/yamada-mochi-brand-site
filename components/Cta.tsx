import { site } from "@/data/site";

export function Cta({
  title = "飛騨高山の思い出を、大切な人へ。",
  text = "ご自宅用にも、季節の贈り物にも。山田もち店のお餅はBASEからご購入いただけます。"
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-green px-5 py-20 text-base md:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-5 text-xs tracking-brand text-base/60">ONLINE SHOP</p>
        <h2 className="font-serifjp text-3xl leading-relaxed tracking-[0.12em] md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl leading-8 text-base/75">{text}</p>
        <a
          href={site.baseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex min-w-72 items-center justify-center border border-base px-8 py-4 tracking-[0.12em] transition hover:bg-base hover:text-green"
        >
          オンラインショップで見る
        </a>
      </div>
    </section>
  );
}
