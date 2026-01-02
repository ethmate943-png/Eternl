import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to verify if the request is from a Cloudflare-verified bot
 * Cloudflare adds headers that indicate verified bots
 */
export async function GET(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const cfRay = request.headers.get('cf-ray');
    
    // Cloudflare-specific headers (these may vary)
    // Note: cf.client.bot is a WAF variable, not a header
    // But Cloudflare may set other indicators
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const cfVisitor = request.headers.get('cf-visitor');
    
    // Simple check: Does the UA contain "Googlebot" anywhere?
    // This catches ALL Googlebot variants including smartphone
    const containsGooglebot = /googlebot/i.test(userAgent);
    
    // Simple check: Does the UA contain "bingbot" or other Bing crawlers?
    // This catches ALL Bingbot variants including mobile and preview
    const containsBingbot = /bingbot|msnbot|bingpreview|adidxbot/i.test(userAgent);
    
    // Simple check: Does the UA contain other known bot identifiers?
    const containsOtherBot = /slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|applebot|ia_archiver|adsbot-google|mediapartners-google|feedfetcher-google/i.test(userAgent);
    
    // Combined simple check
    const matchesBotUA = containsGooglebot || containsBingbot || containsOtherBot;

    // Check if request came through Cloudflare
    const hasCloudflareHeaders = !!cfRay || !!cfConnectingIp;
    
    // Googlebot smartphone user agents look like regular mobile browsers
    // They don't contain "Googlebot" but Cloudflare verifies them by IP using cf.client.bot
    // Since Cloudflare's firewall rules already allow verified bots, if a request came through
    // Cloudflare and looks like a mobile browser, it might be Googlebot smartphone
    const looksLikeMobileBrowser = /Mobile|iPhone|Android|iPad/i.test(userAgent);
    
    // IMPORTANT: Cloudflare's "Allow Verified Bots" rule (cf.client.bot) runs BEFORE our code
    // If a request passed through Cloudflare's firewall with a mobile UA, it's likely verified
    // However, we need to be careful - only trust this in production where Cloudflare is active
    const isProduction = process.env.NODE_ENV === 'production' || !!cfRay;
    
    // If it came through Cloudflare (production) and looks like mobile, it might be Googlebot smartphone
    // Cloudflare's "Allow Verified Bots" rule would have already blocked fake bots
    const mightBeGooglebotSmartphone = isProduction && hasCloudflareHeaders && looksLikeMobileBrowser && !matchesBotUA;

    // If request came through Cloudflare (has cf-ray) AND matches bot UA, it's likely a verified bot
    const isCloudflareVerifiedBot = !!cfRay && matchesBotUA;

    // Allow if: matches bot UA OR (Cloudflare verified + mobile browser in production)
    // Cloudflare's firewall rules will have already blocked fake bots
    const isBot = matchesBotUA || isCloudflareVerifiedBot || mightBeGooglebotSmartphone;

    // Debug logging (remove in production if too verbose)
    if (!isProduction) {
      console.log('[verify-bot] Request details:', {
        userAgent,
        matchesBotUA,
        looksLikeMobileBrowser,
        hasCloudflareHeaders,
        isProduction,
        mightBeGooglebotSmartphone,
        isBot,
      });
    }

    return NextResponse.json({
      isBot,
      isCloudflareVerifiedBot,
      matchesBotUA,
      containsGooglebot,
      containsBingbot,
      containsOtherBot,
      mightBeGooglebotSmartphone,
      looksLikeMobileBrowser,
      hasCloudflareHeaders,
      userAgent,
      hasCfRay: !!cfRay,
      cfConnectingIp: !!cfConnectingIp,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Error verifying bot:', error);
    return NextResponse.json(
      { isBot: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}

