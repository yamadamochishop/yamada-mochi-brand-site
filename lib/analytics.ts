export type BaseClickPlacement = 'sticky_bar' | 'product_card' | 'article_cta' | 'footer_cta';

export function trackBaseClick(placement: BaseClickPlacement) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'base_click', { placement });
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
