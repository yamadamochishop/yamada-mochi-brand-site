import Link from 'next/link';
import { frozenDispatchNote, frozenStorageNote, separateShippingNote } from '@/data/catalog';

export function SetDeliveryGuide() {
  return (
    <div className="mt-10 border-y border-sumi/10 bg-[#f1ece3] p-6 text-sm leading-8 text-sumi/75">
      <h3 className="font-serifjp text-xl text-sumi">常温便・冷凍便について</h3>
      <p className="mt-4">
        常温便は製造後、常温で発送します。冷凍便は、好きなタイミングで楽しみたい方や長期保存、年末年始のストックにも便利です。
      </p>
      <p>{frozenDispatchNote}</p>
      <p>{frozenStorageNote}</p>
      <p className="mt-3">
        冷凍したお餅は500Wの電子レンジで約30秒、軽く温めて半解凍してから、トースターで焼き色がつくまで焼きます。機種・餅の大きさにより時間を調整してください。
      </p>
      <Link
        href="/recipes/mochi-yakikata"
        className="inline-flex min-h-11 items-center text-green underline underline-offset-4"
      >
        お餅のおいしい焼き方・解凍方法を見る
      </Link>
      <p className="mt-3">{separateShippingNote}</p>
      <p>常温便・冷凍便の送料は、BASEの商品ページ・購入画面でご確認ください。</p>
    </div>
  );
}
