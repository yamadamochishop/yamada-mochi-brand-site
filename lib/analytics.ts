export type BaseClickPlacement = 'sticky_bar' | 'product_card' | 'article_cta' | 'footer_cta';

export function trackBaseClick(placement: BaseClickPlacement) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'base_click', placement });
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
