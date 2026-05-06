import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent dirs may contain another lockfile; keep tracing rooted in this app to avoid build errors.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
