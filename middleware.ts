import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCountryCodeFromEdgeRequest } from "./lib/edgeClientCountry";
import { ETERNL_GEO_COOKIE } from "./lib/geoConstants";
import { isCrawlerUserAgent } from "./utils/botDetection";

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

function isIndiaOrPakistan(countryCode: string): boolean {
  return countryCode === "IN" || countryCode === "PK";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  if (isCrawlerUserAgent(ua)) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
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

  // Hard route for India/Pakistan: always show blog, independent of referrer/source.
  if (isINorPK && !isBlogRoute(pathname)) {
    return withGeoCookie(NextResponse.redirect(new URL("/blog", request.url)));
  }

  if (isBlogRoute(pathname)) {
    if (isUS) {
      return withGeoCookie(NextResponse.redirect(new URL("/", request.url)));
    }
    return withGeoCookie(NextResponse.next());
  }

  if (isUsOnlyRoute(pathname)) {
    if (!isUS) {
      return withGeoCookie(NextResponse.redirect(new URL("/blog", request.url)));
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
