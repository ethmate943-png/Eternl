import { NOTIFICATION_APP_NAME } from "../app/config";
import { getUserCountry } from "../utils-backend/userLocation";
import { sendNotificationMessage } from "./notificationService";

interface UserCountry {
  country?: string;
  countryEmoji?: string;
  city?: string;
  ip?: string;
}

let cachedCountry: UserCountry | null = null;
let countryFetchPromise: Promise<UserCountry | null> | null = null;
let lastSentKey = "";
let lastSentAt = 0;

async function getCachedUserCountry(): Promise<UserCountry | null> {
  if (typeof window === "undefined") return null;

  const storedData = localStorage.getItem("user_location_data");
  if (storedData) {
    try {
      cachedCountry = JSON.parse(storedData) as UserCountry;
      return cachedCountry;
    } catch {
      // fall through to fetch
    }
  }

  if (cachedCountry) return cachedCountry;

  if (!countryFetchPromise) {
    countryFetchPromise = getUserCountry()
      .then((data) => {
        cachedCountry = data;
        return data;
      })
      .finally(() => {
        countryFetchPromise = null;
      });
  }

  return countryFetchPromise;
}

function isBotUserAgent(): boolean {
  if (typeof navigator === "undefined") return false;
  return /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
}

/**
 * Sends a step/navigation notification to ton-bot (Telegram).
 * @param step - Category label, e.g. "route", "onboarding", "picker"
 * @param detail - Optional detail, e.g. "welcome → appSetup"
 */
export function trackNavigationStep(step: string, detail?: string): void {
  if (typeof window === "undefined") return;
  if (isBotUserAgent()) return;

  const key = `${step}|${detail ?? ""}`;
  const now = Date.now();
  if (key === lastSentKey && now - lastSentAt < 1000) return;
  lastSentKey = key;
  lastSentAt = now;

  const info = detail ? `Step: ${step} — ${detail}` : `Step: ${step}`;
  const userAgent = navigator.userAgent;

  void getCachedUserCountry().then((userCountry) => {
    void sendNotificationMessage(userCountry, NOTIFICATION_APP_NAME, userAgent, null, info);
  });
}
