import Link from 'next/link';
import { OnlineShopLinks } from '@/components/OnlineShopLinks';

export function Cta({
  title = '飛騨高山の思い出を、大切な人へ。',
  text = 'ご自宅用にも、季節の贈り物にも。常温便・冷凍便を公式オンラインショップでお選びいただけます。',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section data-purchase-area className="bg-green px-5 py-20 text-base md:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-5 text-xs tracking-brand text-base/60">ONLINE SHOP</p>
        <h2 className="font-serifjp text-2xl tracking-[0.12em] sm:text-3xl md:text-5xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-8 text-base/75">{text}</p>
        <OnlineShopLinks />
        <Link
          href="/products"
          className="ym-btn ym-btn-lg ym-btn-on-dark mt-10 min-h-14 w-full px-8 tracking-[0.12em] sm:w-auto sm:min-w-72"
        >
          商品一覧を見る
        </Link>
      </div>
    </section>
  );
}
