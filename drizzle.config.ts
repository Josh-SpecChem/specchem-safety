import { defineConfig } from "drizzle-kit";
import { ConfigurationService } from "./src/lib/configuration";

/**
 * Drizzle Configuration - Standardized to use centralized configuration
 * Uses centralized config service for environment variables and settings
 */

export default defineConfig({
  schema: "./src/contracts/schema.app.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: ConfigurationService.getDatabaseConfig().url,
  },
  verbose: ConfigurationService.getNextJSConfig().isDevelopment,
  strict: true,
});
