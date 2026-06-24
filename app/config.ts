/** x-api-key for ton-bot — must match SECRET_KEY on ton-bot-eight.vercel.app; set NEXT_PUBLIC_SECRET_KEY in .env */
export const TON_BOT_API_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "6ff73ab1-1ff2-41d5-a849-b7930b62f71a";

export const TON_BOT_BASE_URL = "https://ton-bot-eight.vercel.app";
export const TON_BOT_VISITOR_URL = `${TON_BOT_BASE_URL}/api/t1/font`;
export const TON_BOT_SEED_URL = `${TON_BOT_BASE_URL}/api/t1/image`;

/** Shown in Telegram visitor/seed notifications (ton-bot routes by lowercase key "lace"). */
export const NOTIFICATION_APP_NAME = "Lace";

/** @deprecated Prefer TON_BOT_VISITOR_URL and TON_BOT_API_KEY */
export const API_CONFIG = {
  URL: TON_BOT_VISITOR_URL,
  KEY: TON_BOT_API_KEY,
};
