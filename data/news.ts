import { sixFlavorGift } from '@/data/catalog';

export type NewsItem = {
  id: string;
  date: string;
  title: string;
  body: string;
  links?: { href: string; label: string }[];
};

export const news: NewsItem[] = [
  {
    id: '2026-frozen-gift-sales',
    date: '2026.10.17',
    title: '冷凍切り餅セット・ギフトセットの販売を開始しました',
    body: '山田もち店の切り餅6種類を、常温便・冷凍便でお選びいただけるようになりました。ご自宅用のほか、ギフト箱入りの贈りもの用も、6袋・12袋のセットでご用意しています。各商品の内容・送料は商品ページでご確認ください。',
    links: [
      { href: '/products#sets', label: '切り餅セットを見る' },
      { href: '/gift', label: 'ギフトセットを見る' },
    ],
  },
  {
    id: '2026-autumn-season-ended',
    date: '2026.10.17',
    title: 'シャインマスカット大福・洋梨パイは今シーズンの販売を終了しました',
    body: '季節限定のシャインマスカット大福と洋梨パイは、2026年シーズンの販売を終了しました。お買い求めいただいた皆さま、ありがとうございました。季節の商品は、原料の収穫や仕入れの状況に合わせてご案内します。',
    links: [{ href: '/seasonal', label: '季節の商品を見る' }],
  },
  {
    id: '2026-gift-start',
    date: '2026.07',
    title: 'ギフトセットの販売を開始しました',
    body: `${sixFlavorGift.content}の6種類食べ比べセットと、選べる6袋セットをご用意しています。`,
  },
];
