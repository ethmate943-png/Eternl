import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCountryCodeFromEdgeRequest } from "./lib/edgeClientCountry";
import { ETERNL_GEO_COOKIE } from "./lib/geoConstants";
import { isCrawlerUserAgent } from "./utils/botDetection";

function isLocalhost(request: NextRequest): boolean {
  const host = request.nextUrl.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  if (isCrawlerUserAgent(ua)) {
    return NextResponse.next();
  }

  if (isLocalhost(request)) {
    return NextResponse.next();
  }

  const countryCode = getCountryCodeFromEdgeRequest(request);
  if (!countryCode) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(ETERNL_GEO_COOKIE, countryCode, {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
