import {
  middleware as unifiedMiddleware,
  config,
} from "./src/lib/middleware/unified";

/**
 * Main Middleware
 * Uses unified middleware system for authentication, authorization, and context injection
 */
export const middleware = unifiedMiddleware;
export { config };
