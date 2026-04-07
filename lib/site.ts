/** Canonical site origin (https, non-www). Keep in sync with vercel.json host redirects. */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://eternlwallet.com"
).replace(/\/$/, "");

export const siteMetadataBase = new URL(`${SITE_ORIGIN}/`);
