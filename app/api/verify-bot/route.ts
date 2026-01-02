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
    
    // Comprehensive bot user agent patterns
    const botPatterns = [
      // Google bots
      /Mozilla\/5\.0 \(compatible; Googlebot\/2\.1; \+http:\/\/www\.google\.com\/bot\.html\)/i,
      /Mozilla\/5\.0 \(Linux; Android .*\) AppleWebKit\/.* \(KHTML, like Gecko\) Chrome\/41\.0\.2272\.96 .* \(compatible; Googlebot\/2\.1; \+http:\/\/www\.google\.com\/bot\.html\)/i,
      /Googlebot-Image\/1\.0/i,
      /Googlebot-Video\/1\.0/i,
      /Googlebot-News/i,
      /Googlebot-Favicon/i,
      /Mozilla\/5\.0 \(Linux; Android .*\) AppleWebKit\/.* \(KHTML, like Gecko\) Chrome\/41\.0\.2272\.96 .* \(compatible; Google-AMPHTML\/1\.0; \+https:\/\/www\.google\.com\/bot\.html\)/i,
      /AMP Googlebot/i,
      /AdsBot-Google(\-Mobile)?/i,
      /Mediapartners-Google/i,
      /Feedfetcher-Google/i,
      // Other search engines
      /bingbot/i,
      /Slurp/i, // Yahoo
      /DuckDuckBot/i,
      /Baiduspider/i,
      /YandexBot/i,
      /facebookexternalhit/i,
      /Twitterbot/i,
      /LinkedInBot/i,
      /Applebot/i,
      /ia_archiver/i, // Internet Archive
    ];

    const matchesBotUA = botPatterns.some((pattern) => pattern.test(userAgent));

    // If request came through Cloudflare (has cf-ray) AND matches bot UA, it's likely a verified bot
    // Cloudflare's firewall rules already filter fake bots, so if it got through, it's likely real
    const isCloudflareVerifiedBot = !!cfRay && matchesBotUA;

    // If user agent matches bot patterns, consider it a bot
    // Cloudflare's firewall rules will have already blocked fake bots
    const isBot = matchesBotUA || isCloudflareVerifiedBot;

    return NextResponse.json({
      isBot,
      isCloudflareVerifiedBot,
      matchesBotUA,
      userAgent,
      hasCfRay: !!cfRay,
      cfConnectingIp: !!cfConnectingIp,
    });
  } catch (error) {
    console.error('Error verifying bot:', error);
    return NextResponse.json(
      { isBot: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}

