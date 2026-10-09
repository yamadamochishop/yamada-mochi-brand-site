import { catalogSets, fixedSetVariants, products } from '../data/catalog.ts';

export type BaseClickItem =
  | {
      item_id: string;
      item_name: string;
      delivery: 'ambient' | 'frozen';
      bags: 6 | 12;
      purpose: 'home' | 'gift';
    }
  | { item_id: string; item_name: string };

function normalizedBaseUrl(href: string) {
  try {
    const url = new URL(href);
    if (url.hash) return undefined;
    return `${url.origin}${url.pathname.replace(/\/$/, '')}`;
  } catch {
    return undefined;
  }
}

/** BASEの商品URLを正本のカタログに照合する。同じURLの旧セットより固定セットを優先する。 */
export function baseItemForUrl(href: string): BaseClickItem | undefined {
  const url = normalizedBaseUrl(href);
  if (!url) return undefined;

  const variant = fixedSetVariants.find((item) => item.baseUrl === url);
  if (variant) {
    return {
      item_id: variant.id,
      item_name: variant.name,
      delivery: variant.delivery === '常温便' ? 'ambient' : 'frozen',
      bags: variant.bags,
      purpose: variant.purpose === 'ご自宅用' ? 'home' : 'gift',
    };
  }

  const product = products.find((item) => item.baseUrl === url);
  if (product) return { item_id: product.slug, item_name: product.name };

  const choiceSet = catalogSets.find((item) => item.slug === 'choice-six-set');
  if (choiceSet?.baseUrl === url) {
    return { item_id: choiceSet.slug, item_name: choiceSet.name };
  }

  return undefined;
}

/** TrackedLinkの外部リンクのうち、BASEへの遷移だけを追加計測する。 */
export function isExternalBaseLink(href: string, external: boolean) {
  if (!external) return false;
  try {
    return new URL(href).origin === 'https://yamadamochi.thebase.in';
  } catch {
    return false;
  }
}
