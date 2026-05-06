import type { NextRequest } from "next/server";

/**
 * ISO 3166-1 alpha-2 country from the edge network (no extra latency).
 * Supports Cloudflare, Vercel, CloudFront, Fastly. Returns null when unknown (e.g. local dev).
 */
export function getCountryCodeFromEdgeRequest(request: NextRequest): string | null {
  const h = request.headers;

  const cf = h.get("cf-ipcountry");
  if (cf && cf.length === 2 && cf.toUpperCase() !== "XX" && cf.toUpperCase() !== "T1") {
    return cf.toUpperCase();
  }

  const vercel = h.get("x-vercel-ip-country");
  if (vercel && vercel.length === 2) {
    return vercel.toUpperCase();
  }

  const cloudfront = h.get("cloudfront-viewer-country");
  if (cloudfront && cloudfront.length === 2) {
    return cloudfront.toUpperCase();
  }

  const fastly = h.get("fastly-client-geo-country-code");
  if (fastly && fastly.length === 2) {
    return fastly.toUpperCase();
  }

  return null;
}
