import {
  setLineup,
  frozenDispatchNote,
  frozenStorageNote,
  frozenCookingNote,
  separateShippingNote,
} from './catalog.ts';
import { nekoposShippingDetail, takkyubinShippingDetail } from '../lib/shipping.ts';

export type Faq = {
  q: string;
  a: string;
  /** 回答の続きを読める内部ページ。FAQPage構造化データには含めない。 */
  link?: { href: string; label: string };
};

export const faqs: Faq[] = [
  {
    q: '6種類食べ比べセットの内容を教えてください。',
    a: 'プレーン、草餅、三色豆餅、たまり餅、昆布餅、黒ごま海老餅を各1袋ずつ詰め合わせています。12袋セットは各2袋です。',
  },
  {
    q: '6袋セットはいくらですか？',
    a: `ご自宅用は${setLineup[0].homePrice}、贈りもの用は${setLineup[0].gift.price}です。常温便・冷凍便とも同じ商品価格で、送料は別途かかります。`,
  },
  {
    q: '内容量を教えてください。',
    a: '1袋200g（4枚入り）で、6袋セットは6種類を各1袋ずつ詰め合わせています。',
  },
  {
    q: '12袋セットはいくらですか？',
    a: `ご自宅用は${setLineup[1].homePrice}、贈りもの用は${setLineup[1].gift.price}です。1袋200g（4枚入り）×12袋。常温便・冷凍便とも同じ商品価格で、送料は別途かかります。`,
  },
  {
    q: 'お餅の送料を教えてください。',
    a: `${nekoposShippingDetail}${takkyubinShippingDetail}冷凍便のセット商品は別の配送方法です。冷凍便の送料はBASEの商品ページ・購入画面でご確認ください。${separateShippingNote}`,
  },
  {
    q: '賞味期限を教えてください。',
    a: '常温のお餅は製造日より8日です。冷凍保存の目安は約3か月です。',
  },
  {
    q: '常温便と冷凍便の違いは？',
    a: `6種類食べ比べセットは常温便・冷凍便をご用意しています。常温便は製造後、常温で発送します。${frozenDispatchNote}用途に応じてお選びください。冷凍便は好きなタイミングで食べたい方や、年末年始のストックにも便利です。`,
  },
  { q: '冷凍保存はできますか？', a: frozenStorageNote },
  {
    q: '常温商品と冷凍商品を一緒に注文できますか？',
    a: `同時にご注文いただけます。${separateShippingNote}`,
  },
  {
    q: '冷凍したお餅は、どのように焼けばよいですか？',
    a: frozenCookingNote,
    link: { href: '/recipes/mochi-yakikata', label: 'お餅のおいしい焼き方・解凍方法を見る' },
  },
];
