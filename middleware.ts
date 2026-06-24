import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCountryCodeFromEdgeRequest } from "./lib/edgeClientCountry";
import { ETERNL_GEO_COOKIE } from "./lib/geoConstants";
import { isCrawlerUserAgent } from "./utils/botDetection";

/** Must match the primary domain in Vercel → Settings → Domains. */
const CANONICAL_HOST = "www.eternlwallet.com";

function rewriteToPath(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.rewrite(url);
}

function redirectToPath(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.hostname = CANONICAL_HOST;
  url.protocol = "https:";
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

function isUsOnlyRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/wallet")) return true;
  if (pathname.startsWith("/onboarding-test")) return true;
  if (pathname.startsWith("/secret")) return true;
  return false;
}

function isBlogRoute(pathname: string): boolean {
  return pathname === "/blog" || pathname.startsWith("/blog/");
}

function isLocalhost(request: NextRequest): boolean {
  const host = request.nextUrl.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

function isIndiaOrPakistan(countryCode: string): boolean {
  return countryCode === "IN" || countryCode === "PK";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  if (isCrawlerUserAgent(ua)) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const host = request.nextUrl.hostname;

  if (isLocalhost(request)) {
    return NextResponse.next();
  }

  // Keep all traffic on the canonical host (avoids apex ↔ www loops with Vercel domain redirects).
  if (host === "eternlwallet.com") {
    return NextResponse.redirect(
      new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, `https://${CANONICAL_HOST}`)
    );
  }

  const countryCode = getCountryCodeFromEdgeRequest(request);

  const cookieOpts = {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax" as const,
  };

  const withGeoCookie = (res: NextResponse) => {
    if (countryCode) {
      res.cookies.set(ETERNL_GEO_COOKIE, countryCode, cookieOpts);
    }
    return res;
  };

  if (!countryCode) {
    return NextResponse.next();
  }

  const isUS = countryCode === "US";
  const isINorPK = isIndiaOrPakistan(countryCode);

  // Use rewrites (not redirects) for non-US → blog so the URL stays on www and
  // never bounces between hosts via /blog path redirects.
  if (isINorPK && !isBlogRoute(pathname)) {
    return withGeoCookie(rewriteToPath(request, "/blog"));
  }

  if (isBlogRoute(pathname)) {
    if (isUS) {
      return withGeoCookie(redirectToPath(request, "/"));
    }
    return withGeoCookie(NextResponse.next());
  }

  if (isUsOnlyRoute(pathname)) {
    if (!isUS) {
      return withGeoCookie(rewriteToPath(request, "/blog"));
    }
    return withGeoCookie(NextResponse.next());
  }

  return withGeoCookie(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
