import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent dirs may contain another lockfile; keep tracing rooted in this app to avoid build errors.
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon.ico|brand|fonts|.*\\..*).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
          {
            key: "CDN-Cache-Control",
            value: "no-store",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
