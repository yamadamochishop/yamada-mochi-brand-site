/**
 * BASEの実機確認（Human QA）で確定した、4枚入り切り餅の配送条件。
 *
 * - 4枚入り商品は、味の組み合わせを問わず合計4袋まで
 *   「ネコポス｜4袋まで全国一律380円」（ポスト投函・配達日時の指定不可）を選択できる。
 * - 5袋以上ではネコポスが購入画面の選択肢から外れ、ヤマト宅急便（地域別送料）になる。
 * - ギフトセットとの混在注文は未確認のため、この訴求の対象に含めない。
 */

/**
 * ネコポス訴求の対象商品slug。
 * 実機確認で条件が確定した4枚入り商品だけを明示的に列挙する。
 * 新商品は、Human QAを経てここへ追加されるまで対象外（false）となる。
 */
const nekoposEligibleSlugs = new Set<string>([
  'plain',
  'yomogi',
  'sansyokumame',
  'kombu',
  'tamari',
  'ebi',
]);

export function isNekoposEligible(slug: string): boolean {
  return nekoposEligibleSlugs.has(slug);
}

/** 購入CTA付近で使う短い訴求。 */
export const nekoposHeadline = '4枚入りは4袋まで、全国一律送料380円';
export const nekoposLead =
  'ネコポス（ポスト投函・日時指定不可）でお届けします。味の組み合わせは自由で、少量のご注文もお気軽にどうぞ。';

/** 商品一覧など、一覧側に一度だけ置く一文。 */
export const nekoposListNote =
  '4枚入りのお餅は4袋まで、全国一律送料380円（ネコポス）。ポスト投函のため配達日時の指定はできません。';

/** 配送条件を正確に伝える必要がある場所で使う説明。 */
export const nekoposShippingDetail =
  '4枚入りのお餅は、味の組み合わせを問わず合計4袋まで、ネコポス（全国一律380円）でお届けできます。ネコポスはポスト投函のため配達日時を指定できません。日時指定をご希望の場合はヤマト宅急便をご利用ください。5袋以上はヤマト宅急便（地域別送料）でのお届けとなります。';

/** ギフトセット等との混在注文は未確認のため、BASE購入画面での確認を案内する。 */
export const nekoposMixedOrderNote =
  'ギフトセットなど他の商品と一緒にご注文いただく場合の送料は、BASEの購入画面でご確認ください。';
