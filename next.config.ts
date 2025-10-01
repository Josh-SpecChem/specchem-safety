import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add any additional TypeScript-specific configurations
  experimental: {
    // Future experimental features can be added here
  },
  // Environment variable validation
  env: {
    // Document required environment variables
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
