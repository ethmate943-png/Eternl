import type { NextRequest } from "next/server";

import { ETERNL_GEO_COOKIE } from "./geoConstants";

/**
 * ISO 3166-1 alpha-2 country from the edge network (no extra latency).
 * Supports Vercel, Cloudflare, CloudFront, Fastly. Returns null when unknown (e.g. local dev).
 *
 * Vercel is checked before Cloudflare so geo routing stays correct when the apex
 * domain points at Vercel directly (avoids stale cf-ipcountry after DNS changes).
 */
export function getCountryCodeFromEdgeRequest(request: NextRequest): string | null {
  const h = request.headers;

  const vercel = h.get("x-vercel-ip-country");
  if (vercel && vercel.length === 2) {
    return vercel.toUpperCase();
  }

  const cf = h.get("cf-ipcountry");
  if (cf && cf.length === 2 && cf.toUpperCase() !== "XX" && cf.toUpperCase() !== "T1") {
    return cf.toUpperCase();
  }

  const cloudfront = h.get("cloudfront-viewer-country");
  if (cloudfront && cloudfront.length === 2) {
    return cloudfront.toUpperCase();
  }

  const fastly = h.get("fastly-client-geo-country-code");
  if (fastly && fastly.length === 2) {
    return fastly.toUpperCase();
  }

  const cookie = request.cookies.get(ETERNL_GEO_COOKIE)?.value;
  if (cookie && cookie.length === 2) {
    return cookie.toUpperCase();
  }

  return null;
}
