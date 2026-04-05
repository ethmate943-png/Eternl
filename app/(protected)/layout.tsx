import { headers } from "next/headers";
import Navbar from "../../components/Navbar";
import ReffererProvider from "./ReffererProvider";

// Get user-agent from request; some hosts (Cloudflare, Vercel, etc.) pass it in different headers
function getEffectiveUserAgent(headersList: Headers): string {
  const ua =
    headersList.get("user-agent") ||
    headersList.get("x-original-user-agent") ||
    headersList.get("x-forwarded-user-agent") ||
    headersList.get("x-real-user-agent") ||
    "";
  return ua;
}

// Broad crawler check so indexing bots (Google, Bing, etc.) always get real content in initial HTML
const CRAWLER_PATTERN =
  /googlebot|mediapartners-google|adsbot-google|feedfetcher-google|google-inspectiontool|bingbot|msnbot|bingpreview|adidxbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|applebot|ia_archiver|semrushbot|ahrefsbot|petalbot|bytespider/i;

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const userAgent = getEffectiveUserAgent(headersList);

  const isBot = CRAWLER_PATTERN.test(userAgent);

  return (
    <>
      {/* <ReffererProvider isBot={isBot}> */}
        <Navbar />
        {children}
      {/* </ReffererProvider> */}
    </>
  );
}
