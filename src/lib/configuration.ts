import { z } from 'zod';

/**
 * Unified Configuration Service
 * Single source of truth for all environment variables and application settings
 * Consolidates validation, error handling, and configuration management
 */

// ========================================
// CONFIGURATION ERROR CLASS
// ========================================

export class ConfigurationError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

// ========================================
// ENHANCED CONFIGURATION SCHEMA
// ========================================

const configurationSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL').refine(
    (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
    'DATABASE_URL must be a PostgreSQL connection string'
  ),
  DATABASE_HOST: z.string().optional(),
  DATABASE_PORT: z.coerce.number().optional(),
  DATABASE_NAME: z.string().optional(),
  DATABASE_USER: z.string().optional(),
  DATABASE_PASSWORD: z.string().optional(),
  
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL').refine(
    (url) => url.includes('supabase.co'),
    'NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL'
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20, 'NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (too short)'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20, 'SUPABASE_SERVICE_ROLE_KEY appears to be invalid (too short)'),
  
  // Next.js Configuration
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    message: 'NODE_ENV must be development, production, or test'
  }).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Authentication Configuration
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters long').optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // External Services Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().min(1).max(65535, 'SMTP_PORT must be a valid port number (1-65535)').optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // Feature Flags
  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  ENABLE_DEBUG: z.coerce.boolean().default(false),
  ENABLE_TESTING: z.coerce.boolean().default(false),
  ENABLE_LMS: z.string().optional(),
  
  // API Keys
  OPENAI_API_KEY: z.string().refine(
    (key) => !key || key.startsWith('sk-'),
    'OPENAI_API_KEY must start with "sk-"'
  ).optional(),
  STRIPE_SECRET_KEY: z.string().refine(
    (key) => !key || key.startsWith('sk_'),
    'STRIPE_SECRET_KEY must start with "sk_"'
  ).optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().refine(
    (key) => !key || key.startsWith('pk_'),
    'STRIPE_PUBLISHABLE_KEY must start with "pk_"'
  ).optional(),
  
  // Custom Configuration
  CUSTOM_KEY: z.string().optional(),
});

// ========================================
// UNIFIED CONFIGURATION SERVICE
// ========================================

export class ConfigurationService {
  private static config: ValidatedConfiguration | null = null;
  
  /**
   * Initialize the configuration service
   * Must be called before any other methods
   */
  static initialize(): void {
    if (this.config) {
      return; // Already initialized
    }
    
    this.config = this.validateAndParse();
  }
  
  /**
   * Get the validated configuration
   * Automatically initializes if not already done
   */
  static getConfig(): ValidatedConfiguration {
    if (!this.config) {
      this.initialize();
    }
    return this.config!;
  }
  
  /**
   * Get database configuration
   */
  static getDatabaseConfig() {
    const config = this.getConfig();
    return {
      url: config.DATABASE_URL,
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      name: config.DATABASE_NAME,
      user: config.DATABASE_USER,
      password: config.DATABASE_PASSWORD,
      ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }
  
  /**
   * Get Supabase configuration
   */
  static getSupabaseConfig() {
    const config = this.getConfig();
    return {
      url: config.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: config.SUPABASE_SERVICE_ROLE_KEY,
    };
  }
  
  /**
   * Get Next.js configuration
   */
  static getNextJSConfig() {
    const config = this.getConfig();
    return {
      env: config.NODE_ENV,
      appUrl: config.NEXT_PUBLIC_APP_URL,
      isDevelopment: config.NODE_ENV === 'development',
      isProduction: config.NODE_ENV === 'production',
      isTest: config.NODE_ENV === 'test',
    };
  }
  
  /**
   * Get authentication configuration
   */
  static getAuthConfig() {
    const config = this.getConfig();
    return {
      secret: config.NEXTAUTH_SECRET,
      url: config.NEXTAUTH_URL,
    };
  }
  
  /**
   * Get external services configuration
   */
  static getServicesConfig() {
    const config = this.getConfig();
    return {
      smtp: {
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        user: config.SMTP_USER,
        password: config.SMTP_PASSWORD,
      },
    };
  }
  
  /**
   * Get feature flags
   */
  static getFeatureFlags() {
    const config = this.getConfig();
    return {
      analytics: config.ENABLE_ANALYTICS,
      debug: config.ENABLE_DEBUG,
      testing: config.ENABLE_TESTING,
      lms: config.NODE_ENV === 'development' || config.ENABLE_LMS === 'true' || true,
    };
  }
  
  /**
   * Get API keys
   */
  static getApiKeys() {
    const config = this.getConfig();
    return {
      openai: config.OPENAI_API_KEY,
      stripe: {
        secret: config.STRIPE_SECRET_KEY,
        publishable: config.STRIPE_PUBLISHABLE_KEY,
      },
    };
  }
  
  /**
   * Get custom configuration
   */
  static getCustomConfig() {
    const config = this.getConfig();
    return {
      key: config.CUSTOM_KEY,
    };
  }
  
  /**
   * Check if a feature is enabled
   */
  static isFeatureEnabled(feature: keyof ReturnType<typeof ConfigurationService.getFeatureFlags>): boolean {
    const features = this.getFeatureFlags();
    return features[feature];
  }
  
  /**
   * Validate configuration for specific environment
   */
  static validateForEnvironment(environment: 'development' | 'production' | 'test'): boolean {
    try {
      const envVars = { ...process.env, NODE_ENV: environment };
      configurationSchema.parse(envVars);
      return true;
    } catch (error) {
      console.error(`Configuration validation failed for ${environment}:`, error);
      return false;
    }
  }
  
  /**
   * Get configuration health status
   */
  static getHealthStatus(): {
    status: 'healthy' | 'warning' | 'error';
    issues: string[];
    warnings: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    try {
      this.getConfig();
    } catch (error) {
      issues.push(error instanceof Error ? error.message : 'Unknown configuration error');
    }
    
    // Check for warnings
    const config = this.getConfig();
    if (config.NODE_ENV === 'production') {
      if (!config.NEXTAUTH_SECRET) {
        warnings.push('NEXTAUTH_SECRET is recommended in production');
      }
      if (!config.NEXTAUTH_URL) {
        warnings.push('NEXTAUTH_URL is recommended in production');
      }
      if (config.ENABLE_DEBUG) {
        warnings.push('Debug mode is enabled in production');
      }
    }
    
    // Validate SMTP configuration completeness
    const services = this.getServicesConfig();
    const smtpFields = [services.smtp.host, services.smtp.user, services.smtp.password];
    const smtpFieldsSet = smtpFields.filter(Boolean).length;
    if (smtpFieldsSet > 0 && smtpFieldsSet < 3) {
      warnings.push('SMTP configuration is incomplete - all fields should be set together');
    }
    
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    if (issues.length > 0) {
      status = 'error';
    } else if (warnings.length > 0) {
      status = 'warning';
    }
    
    return {
      status,
      issues,
      warnings,
    };
  }
  
  /**
   * Get configuration summary for debugging
   */
  static getConfigSummary(): Record<string, any> {
    const config = this.getConfig();
    return {
      database: {
        url: config.DATABASE_URL ? '✓ Set' : '✗ Missing',
        host: config.DATABASE_HOST || 'Not set',
        port: config.DATABASE_PORT || 'Not set',
        ssl: config.NODE_ENV === 'production' ? 'Enabled' : 'Disabled',
      },
      supabase: {
        url: config.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
        anonKey: config.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
        serviceRoleKey: config.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing',
      },
      nextjs: {
        env: config.NODE_ENV,
        appUrl: config.NEXT_PUBLIC_APP_URL || 'Not set',
        isDevelopment: config.NODE_ENV === 'development',
        isProduction: config.NODE_ENV === 'production',
        isTest: config.NODE_ENV === 'test',
      },
      auth: {
        secret: config.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing',
        url: config.NEXTAUTH_URL || 'Not set',
      },
      services: {
        smtp: {
          host: config.SMTP_HOST || 'Not set',
          port: config.SMTP_PORT || 'Not set',
          user: config.SMTP_USER || 'Not set',
          password: config.SMTP_PASSWORD ? '✓ Set' : '✗ Missing',
        },
      },
      features: {
        analytics: config.ENABLE_ANALYTICS,
        debug: config.ENABLE_DEBUG,
        testing: config.ENABLE_TESTING,
        lms: config.NODE_ENV === 'development' || config.ENABLE_LMS === 'true' || true,
      },
      apiKeys: {
        openai: config.OPENAI_API_KEY ? '✓ Set' : '✗ Missing',
        stripe: {
          secret: config.STRIPE_SECRET_KEY ? '✓ Set' : '✗ Missing',
          publishable: config.STRIPE_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing',
        },
      },
      custom: {
        key: config.CUSTOM_KEY || 'Not set',
      },
    };
  }
  
  /**
   * Private method to validate and parse environment variables
   */
  private static validateAndParse(): ValidatedConfiguration {
    try {
      return configurationSchema.parse(process.env);
    } catch (error) {
      this.handleValidationError(error);
    }
  }
  
  /**
   * Private method to handle validation errors
   */
  private static handleValidationError(error: unknown): never {
    if (error instanceof z.ZodError && error.issues) {
      const missingVars = error.issues
        .filter(err => err.code === 'invalid_type' && 'received' in err && err.received === 'undefined')
        .map(err => err.path.join('.'));
      
      const invalidVars = error.issues
        .filter(err => err.code !== 'invalid_type')
        .map(err => `${err.path.join('.')}: ${err.message}`);
      
      if (missingVars.length > 0) {
        throw new ConfigurationError(`Missing required environment variables: ${missingVars.join(', ')}`);
      }
      
      if (invalidVars.length > 0) {
        throw new ConfigurationError(`Invalid environment variables: ${invalidVars.join(', ')}`);
      }
    }
    
    // Fallback for malformed errors
    console.warn('Configuration validation failed:', error);
    throw new ConfigurationError('Environment configuration validation failed');
  }
}

// ========================================
// TYPE EXPORTS
// ========================================

export type ValidatedConfiguration = z.infer<typeof configurationSchema>;

// Legacy type aliases for backward compatibility
export type Config = {
  database: ReturnType<typeof ConfigurationService.getDatabaseConfig>;
  supabase: ReturnType<typeof ConfigurationService.getSupabaseConfig>;
  nextjs: ReturnType<typeof ConfigurationService.getNextJSConfig>;
  auth: ReturnType<typeof ConfigurationService.getAuthConfig>;
  services: ReturnType<typeof ConfigurationService.getServicesConfig>;
  features: ReturnType<typeof ConfigurationService.getFeatureFlags>;
  apiKeys: ReturnType<typeof ConfigurationService.getApiKeys>;
  custom: ReturnType<typeof ConfigurationService.getCustomConfig>;
};

export type DatabaseConfig = ReturnType<typeof ConfigurationService.getDatabaseConfig>;
export type SupabaseConfig = ReturnType<typeof ConfigurationService.getSupabaseConfig>;
export type NextJSConfig = ReturnType<typeof ConfigurationService.getNextJSConfig>;
export type AuthConfig = ReturnType<typeof ConfigurationService.getAuthConfig>;
export type ServicesConfig = ReturnType<typeof ConfigurationService.getServicesConfig>;
export type FeaturesConfig = ReturnType<typeof ConfigurationService.getFeatureFlags>;
export type ApiKeysConfig = ReturnType<typeof ConfigurationService.getApiKeys>;
export type CustomConfig = ReturnType<typeof ConfigurationService.getCustomConfig>;

// ========================================
// LEGACY COMPATIBILITY EXPORTS
// ========================================

/**
 * Legacy configuration object for backward compatibility
 * @deprecated Use ConfigurationService methods instead
 */
export const config: Config = {
  get database() { return ConfigurationService.getDatabaseConfig(); },
  get supabase() { return ConfigurationService.getSupabaseConfig(); },
  get nextjs() { return ConfigurationService.getNextJSConfig(); },
  get auth() { return ConfigurationService.getAuthConfig(); },
  get services() { return ConfigurationService.getServicesConfig(); },
  get features() { return ConfigurationService.getFeatureFlags(); },
  get apiKeys() { return ConfigurationService.getApiKeys(); },
  get custom() { return ConfigurationService.getCustomConfig(); },
};

/**
 * Legacy helper functions for backward compatibility
 * @deprecated Use ConfigurationService methods instead
 */
export const isDevelopment = (): boolean => ConfigurationService.getNextJSConfig().isDevelopment;
export const isProduction = (): boolean => ConfigurationService.getNextJSConfig().isProduction;
export const isTest = (): boolean => ConfigurationService.getNextJSConfig().isTest;
export const isLmsEnabled = (): boolean => ConfigurationService.getFeatureFlags().lms;

export const getDatabaseConfig = () => ConfigurationService.getDatabaseConfig();
export const getSupabaseConfig = () => ConfigurationService.getSupabaseConfig();

// ========================================
// INITIALIZATION
// ========================================

// Initialize configuration service on module load only if environment variables are available
// This prevents initialization errors in test environments and during build
if (process.env.NODE_ENV !== 'test' && process.env.DATABASE_URL && typeof window === 'undefined') {
  try {
    ConfigurationService.initialize();
  } catch (error) {
    console.warn('Configuration initialization failed during build:', error);
  }
}
