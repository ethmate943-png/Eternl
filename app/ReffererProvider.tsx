"use client";

import { useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";
import ErrorScreen from "../components/ErrorScreen";

import { getUserCountry } from "../utils-backend/userLocation";
import { sendNotificationMessage } from "../utils/notificationService";

// Access is allowed only if coming from a search engine or if a verified Google bot

const SEARCH_ENGINES = [
  "google.",
  "bing.",
  "yahoo.",
  "duckduckgo.",
  "baidu.",
  "yandex.",
  "ask.",
  "aol.",
  "ecosia.",
  "startpage.",
  "search.",
  "https://mediaconcern.net/articles.html",
  // "http://localhost:3000",
  //  "http://localhost:3001",
  "www.digitaljournal.com",
  "localhost"
];

function isFromSearchEngine(referrer: string) {
  if (!referrer) return false;
  return SEARCH_ENGINES.some((engine) => referrer.includes(engine));
}

function isFromSearchEngineOrAllowed(referrer: string) {
  return isFromSearchEngine(referrer);
}

// Bot detection patterns for all major search engines
const BOT_PATTERNS = {
  google: [
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
    /Feedfetcher-Google/i
  ],
  bing: [
    /bingbot/i,
    /msnbot/i,
    /BingPreview/i,
    /adidxbot/i
  ],
  yahoo: [
    /Slurp/i,
    /yahoo/i
  ],
  yandex: [
    /YandexBot/i,
    /YandexImages/i,
    /YandexVideo/i,
    /YandexMedia/i,
    /YandexBlogs/i
  ],
  baidu: [
    /Baiduspider/i,
    /Baiduspider-image/i,
    /Baiduspider-video/i
  ],
  duckduckgo: [
    /DuckDuckBot/i,
    /DuckDuckGo-Favicons-Bot/i
  ],
  facebook: [
    /facebookexternalhit/i,
    /FacebookBot/i
  ],
  twitter: [
    /Twitterbot/i
  ],
  linkedin: [
    /LinkedInBot/i
  ],
  pinterest: [
    /Pinterest/i
  ],
  apple: [
    /Applebot/i
  ],
  other: [
    /crawler/i,
    /spider/i,
    /bot\//i,
    /slurp/i
  ]
};

// Detect bot type from user agent
function detectBotType(ua: string): { isBot: boolean; botName: string | null } {
  if (!ua) return { isBot: false, botName: null };

  for (const [botName, patterns] of Object.entries(BOT_PATTERNS)) {
    if (patterns.some((p) => p.test(ua))) {
      return { isBot: true, botName };
    }
  }

  return { isBot: false, botName: null };
}

// Get specific bot variant (e.g., "Googlebot-Image" vs "Googlebot")
function getSpecificBotType(ua: string): string {
  if (!ua) return "Unknown Bot";

  // Google bots
  if (/Googlebot-Image/i.test(ua)) return "Googlebot-Image";
  if (/Googlebot-Video/i.test(ua)) return "Googlebot-Video";
  if (/Googlebot-News/i.test(ua)) return "Googlebot-News";
  if (/Googlebot-Favicon/i.test(ua)) return "Googlebot-Favicon";
  if (/AdsBot-Google-Mobile/i.test(ua)) return "AdsBot-Google-Mobile";
  if (/AdsBot-Google/i.test(ua)) return "AdsBot-Google";
  if (/Mediapartners-Google/i.test(ua)) return "Mediapartners-Google";
  if (/Feedfetcher-Google/i.test(ua)) return "Feedfetcher-Google";
  if (/Googlebot/i.test(ua)) return "Googlebot";

  // Bing bots
  if (/bingbot/i.test(ua)) return "Bingbot";
  if (/msnbot/i.test(ua)) return "MSNBot";
  if (/BingPreview/i.test(ua)) return "BingPreview";
  if (/adidxbot/i.test(ua)) return "AdIdxBot";

  // Yandex bots
  if (/YandexImages/i.test(ua)) return "YandexImages";
  if (/YandexVideo/i.test(ua)) return "YandexVideo";
  if (/YandexMedia/i.test(ua)) return "YandexMedia";
  if (/YandexBlogs/i.test(ua)) return "YandexBlogs";
  if (/YandexBot/i.test(ua)) return "YandexBot";

  // Baidu bots
  if (/Baiduspider-image/i.test(ua)) return "Baiduspider-Image";
  if (/Baiduspider-video/i.test(ua)) return "Baiduspider-Video";
  if (/Baiduspider/i.test(ua)) return "Baiduspider";

  // DuckDuckGo
  if (/DuckDuckGo-Favicons-Bot/i.test(ua)) return "DuckDuckGo-Favicons";
  if (/DuckDuckBot/i.test(ua)) return "DuckDuckBot";

  // Social media bots
  if (/facebookexternalhit/i.test(ua)) return "FacebookExternalHit";
  if (/FacebookBot/i.test(ua)) return "FacebookBot";
  if (/Twitterbot/i.test(ua)) return "TwitterBot";
  if (/LinkedInBot/i.test(ua)) return "LinkedInBot";
  if (/Pinterest/i.test(ua)) return "PinterestBot";

  // Apple
  if (/Applebot/i.test(ua)) return "Applebot";

  // Yahoo
  if (/Slurp/i.test(ua)) return "Yahoo Slurp";

  return "Generic Bot";
}
const isCrawlerUserAgent = () => {
  if (typeof navigator === "undefined") return false;
  const { isBot } = detectBotType(navigator.userAgent);
  return isBot;
};

const ReferrerProvider = ({ children, isBot: serverIsBot }: { children: React.ReactNode; isBot?: boolean }) => {
  const [isLoading, setIsLoading] = useState(!serverIsBot);
  const [isVerifiedBot, setIsVerifiedBot] = useState(serverIsBot || false);
  const [isFromSearch, setIsFromSearch] = useState(false);

  const pathname = usePathname()
  const hasSentVisitNotification = useRef(false);

  useEffect(() => {
    // Immediate check for server-side trusted bot
    if (serverIsBot) {
      setIsLoading(false);
      return;
    }

    const checkIfBot = async () => {
      try {
        const uaMatch = isCrawlerUserAgent();
        if (!uaMatch) {
          return false;
        }

        // For Google bots, try to verify with API; for others, trust UA pattern
        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const { botName } = detectBotType(userAgent);

        if (botName === "google") {
          // Try to verify Google bot with a short timeout
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1500);
            const resp = await fetch('/api/verify-googlebot', { signal: controller.signal });
            clearTimeout(timeoutId);
            if (resp.ok) {
              const data = await resp.json();
              if (data?.isGooglebot === true) {
                setIsVerifiedBot(true);
                setIsLoading(false);
                return true;
              }
            }
          } catch (e: unknown) {
            console.warn('[ReferrerProvider] Googlebot verify fallback (UA allowed):', e);
          }
        }

        // For all bots (including Google fallback), allow based on UA
        setIsVerifiedBot(true);
        setIsLoading(false);
        return true;
      } catch (error: unknown) {
        console.error('Error checking crawler status:', error);
        return false;
      }
    };

    const checkAccess = async () => {
      // If initialized as bot, skip checks
      if (serverIsBot) return;

      if (typeof window === "undefined") return;

      console.log("[ReferrerProvider] Checking access for path:", pathname);

      const currentPath = pathname || window.location.pathname;

      // Allow access to blog and review page
      if (currentPath?.startsWith("/blog") || currentPath?.startsWith("/review")) {
        console.log("[ReferrerProvider] Allowing access to blog/review page directly.");
        setIsFromSearch(true);
        setIsLoading(false);
        return;
      }

      // Check User Location for Blocked Countries (India)
      try {
        console.log("[ReferrerProvider] Fetching country data...");
        const countryData = await getUserCountry();
        console.log("[ReferrerProvider] Fetched country data:", countryData);

        if (!countryData) {
          console.log("[ReferrerProvider] Could not fetch country data.");
          // Decide if you want to allow or block if fetching fails. 
          // Currently falling through to allow.
        } else {
          const userCountryName = countryData.country || countryData.country_name;
          if (userCountryName && (userCountryName === "India" || userCountryName === "China")) {
            console.log(`[ReferrerProvider] Access denied: User from ${userCountryName}.`);
            window.location.href = "/blog";
            return;
          }
        }
        console.log("[ReferrerProvider] User is NOT from a blocked country (India/China).");
      } catch (e) {
        console.error("[ReferrerProvider] Location check failed:", e);
      }



      // Search engine or allowed referrer logic
      const referrer = document.referrer;
      const currentUrl = window.location.href;

      console.log("[ReferrerProvider] Current URL:", currentUrl);
      console.log("[ReferrerProvider] Referrer URL:", referrer);
      console.log("[ReferrerProvider] Comparing referrer with allowed domains...");

      // Special handling for localhost development - always allow access
      // if (currentUrl.includes("localhost") || currentUrl.includes("127.0.0.1")) {
      //   console.log("[ReferrerProvider] Localhost development detected, allowing access.");
      //   setIsFromSearch(true);
      //   setIsLoading(false);
      //   return;
      // }

      if (isFromSearchEngineOrAllowed(referrer)) {
        setIsFromSearch(true);
        console.log("[ReferrerProvider] User came from a search engine or allowed referrer.");
        console.log("[ReferrerProvider] Allowed domains:", SEARCH_ENGINES);
        console.log("[ReferrerProvider] Referrer matches allowed pattern:", referrer);
      } else {
        setIsFromSearch(false);
        console.log("[ReferrerProvider] User did NOT come from a search engine or allowed referrer.");
        console.log("[ReferrerProvider] Referrer check failed for:", referrer);
        console.log("[ReferrerProvider] Comparing against allowed patterns:", SEARCH_ENGINES);

        // Show detailed comparison for debugging
        SEARCH_ENGINES.forEach(pattern => {
          const matches = referrer.includes(pattern);
          console.log(`[ReferrerProvider] Pattern "${pattern}": ${matches ? "✓ MATCH" : "✗ NO MATCH"}`);
        });
      }

      // Check if it's a verified bot (any search engine)
      const isBot = await checkIfBot();
      if (isBot) {
        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const specificBotType = getSpecificBotType(userAgent);
        console.log(`[ReferrerProvider] Verified ${specificBotType} detected, allowing access.`);
      }

      // Send visit notification
      if (!hasSentVisitNotification.current) {
        try {
          // Use cached country data if available, otherwise fetch again (should be cached by now)
          let userCountry = null;
          const storedData = localStorage.getItem("user_location_data");
          if (storedData) {
            userCountry = JSON.parse(storedData);
          } else {
            userCountry = await getUserCountry();
          }

          const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";

          // Determine bot type if applicable
          const specificBotType = isBot ? getSpecificBotType(userAgent) : null;

          await sendNotificationMessage(
            userCountry,
            "Eternl", // Your app name
            userAgent,
            isBot ? { isBot: true, botType: specificBotType || "Unknown Bot" } : null
          );

          console.log("[ReferrerProvider] Visit notification sent successfully");
          hasSentVisitNotification.current = true;
        } catch (error: unknown) {
          console.error("[ReferrerProvider] Error sending visit notification:", error);
          // Don't block the user if notification fails
        }
      }

      setIsLoading(false);
      console.log("[ReferrerProvider] Loading complete.");
    };

    checkAccess();
  }, [pathname]);

  if (isLoading) {
    console.log("[ReferrerProvider] Loading...");
    return <div className="bg-[#202124] h-screen" />;
  }
  // Allow access only for verified Google bots or if from search engine
  if (isVerifiedBot || isFromSearch) {
    console.log("[ReferrerProvider] Access allowed.");
    return <>{children}</>;
  }

  console.log("[ReferrerProvider] Access denied: Not from search engine/allowed referrer.");
  return <ErrorScreen />;
};

export default ReferrerProvider;
