import type { NextConfig } from "next";
import { ConfigurationService } from "./src/lib/configuration";

/**
 * Next.js Configuration - Standardized to use centralized configuration
 * Uses centralized config service for environment variables and settings
 */

const nextConfig: NextConfig = {
  env: {
    // Ensure environment variables are available at build time
    NEXT_PUBLIC_SUPABASE_URL: ConfigurationService.getSupabaseConfig().url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      ConfigurationService.getSupabaseConfig().anonKey,
    NEXT_PUBLIC_APP_URL: ConfigurationService.getNextJSConfig().appUrl,
    CUSTOM_KEY: ConfigurationService.getCustomConfig().key,
  },

  serverExternalPackages: ["@supabase/supabase-js", "pg"],

  images: {
    domains: ["supabase.co"],
  },

  // Turbopack configuration (updated format for Next.js 15+)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // SWC configuration
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Development-specific configuration
  ...(ConfigurationService.getNextJSConfig().isDevelopment && {
    typescript: {
      ignoreBuildErrors: false,
    },
    eslint: {
      ignoreDuringBuilds: true, // Temporarily disabled for Turbopack testing
    },
  }),

  // Production-specific configuration
  ...(ConfigurationService.getNextJSConfig().isProduction && {
    typescript: {
      ignoreBuildErrors: false,
    },
    eslint: {
      ignoreDuringBuilds: true, // Temporarily disabled for Turbopack testing
    },
    compress: true,
    poweredByHeader: false,
  }),

  // Test-specific configuration
  ...(ConfigurationService.getNextJSConfig().isTest && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
};

export default nextConfig;
