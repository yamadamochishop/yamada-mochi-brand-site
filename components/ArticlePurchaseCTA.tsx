import Image from 'next/image';
import Link from 'next/link';
import { sixFlavorGift } from '@/data/catalog';
import { TrackedBaseLink } from '@/components/TrackedBaseLink';

export function ArticlePurchaseCTA({ message }: { message: string }) {
  return (
    <section
      data-purchase-area
      aria-labelledby="article-purchase-title"
      className="bg-[#f1ece3] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-5xl overflow-hidden bg-base md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative aspect-[4/3] min-w-0 md:aspect-auto md:min-h-[30rem]">
          <Image
            src={sixFlavorGift.image}
            alt={`${sixFlavorGift.name}の商品写真`}
            fill
            sizes="(min-width: 768px) 52vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-7 py-12 sm:px-10 md:px-12 md:py-16">
          <p className="text-xs tracking-brand text-brown/60">FROM HIDA TAKAYAMA</p>
          <h2
            id="article-purchase-title"
            className="mt-5 font-serifjp text-2xl leading-relaxed tracking-[0.12em] md:text-3xl"
          >
            {sixFlavorGift.cardName}
          </h2>
          <p className="mt-6 leading-8 text-sumi/70">{message}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex min-h-11 flex-1 items-center justify-center border border-sumi/20 px-6 text-sm tracking-[0.1em] transition hover:border-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sumi"
            >
              商品を見る
            </Link>
            <TrackedBaseLink
              href={sixFlavorGift.baseUrl}
              placement="article_cta"
              className="inline-flex min-h-11 flex-1 items-center justify-center bg-green px-6 text-sm tracking-[0.1em] text-white transition hover:bg-sumi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
            >
              オンラインショップ
            </TrackedBaseLink>
          </div>
        </div>
      </div>
    </section>
  );
}
