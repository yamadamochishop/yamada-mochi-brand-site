export type BaseClickPlacement =
  | 'sticky_bar'
  | 'product_card'
  | 'article_cta'
  | 'footer_cta'
  | 'product_detail'
  | 'gift_hero'
  | 'gift_set_card'
  | 'gift_details'
  | 'recipe_product';

export function trackBaseClick(placement: BaseClickPlacement) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'base_click', { placement });
}

export type SalesChannelClickChannel = 'tabechoku' | 'pokemaru';
export type SalesChannelClickPlacement = 'recipe_product';

/** BASE以外の通販導線。`base_click` とは別イベントとして計測する。 */
export function trackSalesChannelClick(
  channel: SalesChannelClickChannel,
  placement: SalesChannelClickPlacement,
) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'sales_channel_click', { channel, placement });
}

export type TopPageEvent = 'top_cta_click' | 'hero_cta_click' | 'gift_cta_click';

// ---------------------------------------------------------------------------
// レシピ導線の計測（YM-009）
//
// recipe → product → BASE の各段を追えるようにする。
// BASE遷移そのものは既存の `trackBaseClick('recipe_product')` のままで、
// ここではその手前（レシピ閲覧・レシピから商品ページ・検索/絞り込み）を計測する。
// 検索語そのものは送らず、件数と有無だけを送る。
// ---------------------------------------------------------------------------

/** レシピ内で商品ページへ向かうリンクの置き場所。 */
export type RecipeProductClickPlacement =
  | 'recipe_hero' // 詳細ページ冒頭「使うお餅」
  | 'recipe_product_cta' // 詳細ページ末尾「このレシピにおすすめのお餅」の「商品を見る」
  | 'recipe_hub_product_group'; // 一覧ページ「お餅から探す」の商品名

export function trackRecipeView(recipeSlug: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'recipe_view', { recipe_slug: recipeSlug });
}

export function trackRecipeProductClick({
  recipeSlug,
  productSlug,
  placement,
}: {
  recipeSlug?: string;
  productSlug: string;
  placement: RecipeProductClickPlacement;
}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'recipe_to_product_click', {
    ...(recipeSlug ? { recipe_slug: recipeSlug } : {}),
    product_slug: productSlug,
    placement,
  });
}

export function trackRecipeSearch({
  queryLength,
  resultCount,
}: {
  queryLength: number;
  resultCount: number;
}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'recipe_search', {
    query_length: queryLength,
    result_count: resultCount,
  });
}

export type RecipeFilterType = 'product' | 'tag' | 'sort';

export function trackRecipeFilterUse({
  filterType,
  value,
  resultCount,
}: {
  filterType: RecipeFilterType;
  value: string;
  resultCount: number;
}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'recipe_filter_use', {
    filter_type: filterType,
    value,
    result_count: resultCount,
  });
}

export function trackEvent(event: TopPageEvent) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
