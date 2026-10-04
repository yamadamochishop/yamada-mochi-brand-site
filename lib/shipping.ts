/**
 * BASEの送料設定（2026-09-28 Human確定）に合わせた、公式サイト側の送料案内。
 *
 * BASEは商品ごとの「送料計算用重量」の合計で配送方法を決める。
 * - 合計 1g〜800g相当: ネコポス（全国一律380円・ポスト投函・配達日時の指定不可）
 * - 合計 801g相当以上: ヤマト宅急便（地域別送料・配達日時の指定可）
 *
 * 送料計算用重量（Human確定）:
 * - 4枚入り単品 = 200g
 * - 6袋セット・6袋セレクトセット = 1,200g、12袋セット = 2,400g
 *
 * 6枚入り（300g）はBASEで非公開のため、このサイトでは扱わない。
 * 公開されるまで、重量表にも表示文言にも6枚入りを加えない。
 */

/** ネコポスで送れる送料計算用重量の上限（g相当）。 */
export const NEKOPOS_MAX_WEIGHT_GRAMS = 800;

/** 送料計算用重量（g相当）。単品は公開中の4枚入りだけを明示的に列挙する。 */
const shippingWeightGrams = new Map<string, number>([
  ['plain', 200],
  ['yomogi', 200],
  ['sansyokumame', 200],
  ['kombu', 200],
  ['tamari', 200],
  ['ebi', 200],
  ['six-flavor-gift', 1200],
  ['choice-six-set', 1200],
  ['twelve-set', 2400],
]);

export function getShippingWeightGrams(slug: string): number | undefined {
  return shippingWeightGrams.get(slug);
}

/**
 * 1点だけでネコポスの対象になる商品か。
 * 重量が未登録の商品（新商品など）は、Human確認を経て登録されるまで対象外（false）。
 */
export function isNekoposEligible(slug: string): boolean {
  const weight = shippingWeightGrams.get(slug);
  return weight !== undefined && weight <= NEKOPOS_MAX_WEIGHT_GRAMS;
}

/** 購入CTA付近で使う短い訴求。 */
export const nekoposHeadline = '常温便の単品のお餅は800g相当まで、全国一律送料380円';
export const nekoposLead =
  '4枚入りは1袋200g相当。ネコポス（ポスト投函・日時指定不可）でお届けします。味の組み合わせは自由です。';

/** 商品一覧など、一覧側に一度だけ置く一文。 */
export const nekoposListNote =
  '常温便の単品のお餅は、商品重量の合計が800g相当（4枚入りは1袋200g相当）まで、全国一律送料380円のネコポスでお届けします。ポスト投函のため配達日時の指定はできません。';

/** 配送条件を正確に伝える必要がある場所で使う説明。 */
export const nekoposShippingDetail =
  '常温便の単品のお餅は、商品重量の合計が800g相当まで、全国一律380円のネコポスでお届けできます（4枚入りは1袋200g相当）。ネコポスはポスト投函のため、配達日時の指定はできません。';

/** ヤマト宅急便になる条件。ネコポスの説明と対で使う。 */
export const takkyubinShippingDetail =
  '常温便で800g相当を超えるご注文、セット商品を含むご注文、配達日時の指定をご希望の場合は、ヤマト宅急便（地域別送料）でのお届けとなります。地域別の送料はBASEの購入画面でご確認ください。';

/** セット商品の送料。セットは1点で800g相当を超えるため、ヤマト宅急便になる。 */
export const setShippingDetail =
  '常温便のセット商品はヤマト宅急便（地域別送料）でお届けします。配達日時の指定もできます。送料はBASEの商品ページ・購入画面でご確認ください。';
