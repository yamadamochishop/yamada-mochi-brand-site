export type LegacyRedirect = {
  source: string;
  destination: string;
  statusCode: 301;
  reason: string;
  confidence: 'high';
};

/**
 * Confirmed legacy URLs with an unambiguous equivalent in the current site.
 *
 * Keep deferred URLs out of this list. This manifest is executable and is
 * shared by middleware and the SEO safety regression tests.
 */
export const legacyRedirects: readonly LegacyRedirect[] = [
  {
    source: '/商品紹介',
    destination: '/products',
    statusCode: 301,
    reason: '旧商品一覧から現行商品一覧への完全対応',
    confidence: 'high',
  },
  {
    source: '/お問い合わせ',
    destination: '/contact',
    statusCode: 301,
    reason: '旧お問い合わせページから現行お問い合わせページへの完全対応',
    confidence: 'high',
  },
  {
    source: '/アレンジレシピ',
    destination: '/recipes',
    statusCode: 301,
    reason: '旧アレンジレシピ一覧から現行レシピ一覧への対応',
    confidence: 'high',
  },
  {
    source: '/アレンジレシピ/餅のアレンジレシピ',
    destination: '/recipes',
    statusCode: 301,
    reason: '旧餅アレンジレシピ一覧から現行レシピ一覧への対応',
    confidence: 'high',
  },
  {
    source: '/2020/06/11/ピザ餅',
    destination: '/recipes/mochi-pizza',
    statusCode: 301,
    reason: '旧ピザ餅記事から現行ピザ餅レシピへの対応',
    confidence: 'high',
  },
  {
    source: '/2020/06/11/明太子マヨ餅',
    destination: '/recipes/mentaiko-mayo-mochi',
    statusCode: 301,
    reason: '旧明太子マヨ餅記事から現行明太子マヨ餅レシピへの対応',
    confidence: 'high',
  },
  {
    source: '/2020/06/11/草もちあんこバター',
    destination: '/recipes/yomogi-an-butter',
    statusCode: 301,
    reason: '旧草もちあんこバター記事から現行草餅のあんバターレシピへの対応',
    confidence: 'high',
  },
  {
    source: '/2020/06/11/餅アヒージョ',
    destination: '/recipes/mochi-ebi-ajillo',
    statusCode: 301,
    reason: '旧餅アヒージョ記事から現行餅と海老のアヒージョレシピへの対応',
    confidence: 'high',
  },
  {
    source: '/2020/09/23/ガーリックバター餅',
    destination: '/recipes/garlic-butter-mochi',
    statusCode: 301,
    reason: '旧ガーリックバター餅記事から現行ガーリックバター餅レシピへの対応',
    confidence: 'high',
  },
  {
    source: '/2021/03/05/チーズゴマ海老餅',
    destination: '/recipes/ebi-mochi-cheese-pizza',
    statusCode: 301,
    reason: '旧チーズゴマ海老餅記事から現行海老餅のチーズピザレシピ（ごま油アレンジ収録）への対応',
    confidence: 'high',
  },
];

function normalizeLegacyPath(pathname: string): string | null {
  try {
    // decodeURI decodes Japanese characters but deliberately leaves encoded
    // path separators such as %2F untouched.
    const decoded = decodeURI(pathname).normalize('NFC');
    return decoded.length > 1 ? decoded.replace(/\/+$/, '') : decoded;
  } catch {
    return null;
  }
}

export function findLegacyRedirect(pathname: string): LegacyRedirect | undefined {
  const normalizedPath = normalizeLegacyPath(pathname);
  if (!normalizedPath) return undefined;

  return legacyRedirects.find(({ source }) => source === normalizedPath);
}
