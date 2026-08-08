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
