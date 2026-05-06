import { ETERNL_GEO_COOKIE } from "./geoConstants";

/** ISO country from middleware-set cookie; null if absent (e.g. local dev). */
export function readGeoCookieCountryCode(): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${ETERNL_GEO_COOKIE}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) {
      const raw = part.slice(prefix.length);
      const code = decodeURIComponent(raw).trim().toUpperCase();
      if (code.length === 2) return code;
    }
  }
  return null;
}
