export const PRODUCTION_HOST = 'www.yamadamochi.com';
export const APEX_HOST = 'yamadamochi.com';
export const PRODUCTION_DOMAIN_REDIRECT_OWNER = 'vercel-domain' as const;

export function isCanonicalProductionHost(hostname: string): boolean {
  return hostname === PRODUCTION_HOST;
}

export function shouldApplyNoIndex(hostname: string, indexingEnabled: boolean): boolean {
  return !isCanonicalProductionHost(hostname) || !indexingEnabled;
}

/**
 * Builds the final canonical destination for redirects already owned by the
 * application (legacy paths and trailing slashes). Clean apex requests are
 * redirected by the Vercel production-domain configuration before middleware.
 */
export function getCanonicalRedirectUrl(requestUrl: string, pathname: string): URL {
  const destination = new URL(requestUrl);
  destination.pathname = pathname;

  // Defense in depth for local tests or requests that bypass the Vercel edge.
  if (destination.hostname === APEX_HOST) {
    destination.hostname = PRODUCTION_HOST;
    destination.protocol = 'https:';
  }

  return destination;
}
