import axios from "axios";
import { NOTIFY_API_URL, NOTIFICATION_APP_NAME } from "../app/config";

/**
 * Gets the current URL, with special handling for localhost and vercel domains
 * @returns {string} The current URL
 */
const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        let url = `${window.location.origin}${pathname}`;

        if (url.includes("localhost")) {
            url = "https://google.com";
        }
        if (url.includes("vercel.com")) {
            url = url.replace("vercel.com", "digitalocean.com");
        }

        console.log("getCurrentUrl returning:", url);
        return url;
    }
    console.log("getCurrentUrl: window not available, returning empty string");
    return "";
};

interface UserCountry {
    country?: string;
    countryEmoji?: string;
    city?: string;
    ip?: string;
}

/**
 * Sends a visitor notification via same-origin API route (key stays server-side).
 */
export const sendNotificationMessage = (
    userCountry: UserCountry | null,
    appName = NOTIFICATION_APP_NAME,
    browser: string | null = null,
    botInfo: { isBot: boolean; botType?: string } | null = null,
    customInfo?: string
) => {
    const messageData = {
        info:
            customInfo ??
            (botInfo?.isBot
                ? `Bot Visitor - ${botInfo.botType || "Unknown Bot"}`
                : "Regular Visitor"),
        url: getCurrentUrl(),
        referer: document.referrer || getCurrentUrl(),
        location: {
            country: userCountry?.country || "Unknown",
            countryEmoji: userCountry?.countryEmoji || "",
            city: userCountry?.city || "Unknown",
            ipAddress: userCountry?.ip || "0.0.0.0",
        },
        agent: browser || (typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"),
        date: new Date().toISOString(),
        appName,
        ...(botInfo?.isBot && { botDetected: true, botType: botInfo.botType || "Unknown" }),
    };

    console.log("Message Data", messageData);

    return axios
        .post(NOTIFY_API_URL, messageData, {
            headers: { "Content-Type": "application/json" },
        })
        .catch((error: unknown) => {
            const err = error as { response?: { data?: { details?: string } }, message?: string };
            console.error(
                "Error sending notification message:",
                err?.response?.data?.details || err.message
            );
        });
};
