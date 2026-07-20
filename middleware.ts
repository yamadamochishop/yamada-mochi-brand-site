import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isIndexable } from "@/lib/indexing";

const PRODUCTION_HOST = "www.yamadamochi.com";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const hostname = request.nextUrl.hostname;

  // Vercel preview and alias URLs must never be indexed. The production
  // domain is indexable only after NEXT_PUBLIC_SITE_INDEXABLE=true is set.
  if (hostname !== PRODUCTION_HOST || !isIndexable) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
