/** Canonical site origin. Vercel dashboard currently redirects apex → www. */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.eternlwallet.com"
).replace(/\/$/, "");

export const siteMetadataBase = new URL(`${SITE_ORIGIN}/`);
