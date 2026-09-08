import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // EchoSoul infrastructure baseline — Stage 0
  // Do not add product features here until the relevant stage is approved.

  // Server-side environment variables must NEVER reach the browser bundle.
  // Use process.env on the server side only. NEXT_PUBLIC_* vars are browser-safe.
  // See docs/ENVIRONMENT.md for the full variable reference.

  // Experimental — opt into React 19 concurrent features
  experimental: {
    // Turbopack is the default dev server in Next.js 16
  },
};

export default nextConfig;
