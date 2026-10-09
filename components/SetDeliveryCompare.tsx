import Link from 'next/link';
import { catalogSets, fixedSetVariants, frozenDispatchNote, setLineup } from '@/data/catalog';

export function SetDeliveryCompare() {
  return (
    <section
      aria-labelledby="set-selection-heading"
      className="border border-sumi/10 bg-white/35 p-6 md:p-8"
    >
      <h3 id="set-selection-heading" className="font-serifjp text-xl tracking-[0.1em]">
        セットの選び方
      </h3>
      <dl className="mt-5 divide-y divide-sumi/10 border-y border-sumi/10 text-sm leading-7 text-sumi/75">
        <div className="py-4 sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt className="font-semibold text-sumi">包装</dt>
          <dd className="mt-2 grid gap-2 sm:mt-0 sm:grid-cols-2 sm:gap-4">
            <span>ご自宅用：{fixedSetVariants[0].packaging}</span>
            <span>贈りもの用：{setLineup[0].gift.packaging}</span>
          </dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt className="font-semibold text-sumi">配送の違い</dt>
          <dd className="mt-2 grid gap-2 sm:mt-0 sm:grid-cols-2 sm:gap-4">
            <span>常温便：{catalogSets[1].shipping.split(' / ')[1]}</span>
            <span>冷凍便：{frozenDispatchNote}</span>
          </dd>
        </div>
        <div className="py-4 sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt className="font-semibold text-sumi">送料</dt>
          <dd className="mt-2 sm:mt-0">
            商品価格は常温便・冷凍便とも同額。送料別。送料はBASEの商品ページ・購入画面でご確認ください。
          </dd>
        </div>
      </dl>
      <Link href="#delivery" className="ym-btn ym-btn-quiet mt-6 w-full px-4 sm:w-auto">
        保存方法・解凍方法を見る
      </Link>
    </section>
  );
}
