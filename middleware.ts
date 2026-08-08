import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCanonicalRedirectUrl, shouldApplyNoIndex } from '@/lib/canonical-host';
import { isIndexable } from '@/lib/indexing';
import { findLegacyRedirect } from '@/lib/legacy-redirects';

export function middleware(request: NextRequest) {
  const legacyRedirect = findLegacyRedirect(request.nextUrl.pathname);

  if (legacyRedirect) {
    return NextResponse.redirect(
      getCanonicalRedirectUrl(request.url, legacyRedirect.destination),
      legacyRedirect.statusCode,
    );
  }

  if (request.nextUrl.pathname.length > 1 && request.nextUrl.pathname.endsWith('/')) {
    return NextResponse.redirect(
      getCanonicalRedirectUrl(request.url, request.nextUrl.pathname.replace(/\/+$/, '')),
      301,
    );
  }

  const response = NextResponse.next();
  const hostname = request.nextUrl.hostname;

  // Vercel preview and alias URLs must never be indexed. The production
  // domain is indexable only after NEXT_PUBLIC_SITE_INDEXABLE=true is set.
  if (shouldApplyNoIndex(hostname, isIndexable)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
