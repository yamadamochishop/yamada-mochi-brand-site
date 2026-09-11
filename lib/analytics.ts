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

export function trackEvent(event: TopPageEvent) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
