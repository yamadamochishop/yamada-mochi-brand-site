import { sixFlavorGift } from '@/data/catalog';
import { nekoposShippingDetail, takkyubinShippingDetail } from '@/lib/shipping';

export type Faq = {
  q: string;
  a: string;
  /** 回答の続きを読める内部ページ。FAQPage構造化データには含めない。 */
  link?: { href: string; label: string };
};

export const faqs: Faq[] = [
  {
    q: '6種類食べ比べセットの内容を教えてください。',
    a: 'プレーン、草餅、三色豆餅、たまり餅、昆布餅、黒ごま海老餅を各1袋ずつ詰め合わせています。',
  },
  {
    q: 'ギフトの価格を教えてください。',
    a: `${sixFlavorGift.name}は、${sixFlavorGift.price}です。送料は別途かかります。`,
  },
  {
    q: '内容量を教えてください。',
    a: `${sixFlavorGift.content}です。`,
  },
  {
    q: '12袋セットの価格と内容量を教えてください。',
    a: '12袋セットは5,960円（税込）、4枚入り（200g）×12袋です。',
  },
  {
    q: 'お餅の送料を教えてください。',
    a: `${nekoposShippingDetail}${takkyubinShippingDetail}`,
  },
  {
    q: '賞味期限を教えてください。',
    a: '製造日より8日です。',
  },
  {
    q: '冷凍したお餅は、どのように焼けばよいですか？',
    a: '長期保存する場合は、1枚ずつ包んで冷凍してください。冷凍したお餅を香ばしく焼きたい場合は、ラップを外す前に500Wの電子レンジで約30秒加熱して半解凍し、その後トースターで焼き色がつくまで焼きます。餅の大きさによって加熱時間を調整してください。',
    link: { href: '/recipes/mochi-yakikata', label: 'お餅のおいしい焼き方・解凍方法を見る' },
  },
];
