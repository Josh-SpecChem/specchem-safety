import type { Config } from 'tailwindcss';
import { getTailwindConfig } from './src/lib/tailwind-config';

/**
 * Tailwind CSS Configuration - Decoupled from centralized config
 * Uses separate Tailwind-specific configuration to avoid circular dependencies
 * and loading issues with Tailwind CSS IntelliSense
 */

const tailwindConfig: Config = getTailwindConfig();

export default tailwindConfig;
