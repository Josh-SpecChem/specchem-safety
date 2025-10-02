import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigurationService, ConfigurationError, config, isDevelopment, isProduction, isTest, isLmsEnabled, getDatabaseConfig, getSupabaseConfig } from '../configuration';

// Mock process.env
const originalEnv = process.env;

describe('ConfigurationService', () => {
  beforeEach(() => {
    // Reset the configuration service
    (ConfigurationService as any).config = null;
    
    // Set up minimal required environment variables
    process.env = {
      ...originalEnv,
      DATABASE_URL: 'postgresql://user:password@localhost:5432/testdb',
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service',
      NODE_ENV: 'test',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Initialization', () => {
    it('should initialize successfully with valid environment variables', () => {
      expect(() => ConfigurationService.initialize()).not.toThrow();
    });

    it('should throw ConfigurationError for missing required variables', () => {
      delete process.env.DATABASE_URL;
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });

    it('should throw ConfigurationError for invalid database URL', () => {
      process.env.DATABASE_URL = 'invalid-url';
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });

    it('should throw ConfigurationError for invalid Supabase URL', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://invalid.com';
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });

    it('should throw ConfigurationError for short Supabase keys', () => {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'short';
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });
  });

  describe('Configuration Access', () => {
    beforeEach(() => {
      ConfigurationService.initialize();
    });

    it('should return database configuration', () => {
      const dbConfig = ConfigurationService.getDatabaseConfig();
      
      expect(dbConfig.url).toBe('postgresql://user:password@localhost:5432/testdb');
      expect(dbConfig.ssl).toBe(false); // test environment
    });

    it('should return Supabase configuration', () => {
      const supabaseConfig = ConfigurationService.getSupabaseConfig();
      
      expect(supabaseConfig.url).toBe('https://test.supabase.co');
      expect(supabaseConfig.anonKey).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test');
      expect(supabaseConfig.serviceRoleKey).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service');
    });

    it('should return Next.js configuration', () => {
      const nextjsConfig = ConfigurationService.getNextJSConfig();
      
      expect(nextjsConfig.env).toBe('test');
      expect(nextjsConfig.isTest).toBe(true);
      expect(nextjsConfig.isDevelopment).toBe(false);
      expect(nextjsConfig.isProduction).toBe(false);
    });

    it('should return feature flags', () => {
      const features = ConfigurationService.getFeatureFlags();
      
      expect(features.analytics).toBe(false);
      expect(features.debug).toBe(false);
      expect(features.testing).toBe(false);
      expect(features.lms).toBe(true); // Always true in test/dev
    });

    it('should check if feature is enabled', () => {
      expect(ConfigurationService.isFeatureEnabled('analytics')).toBe(false);
      expect(ConfigurationService.isFeatureEnabled('lms')).toBe(true);
    });
  });

  describe('Environment-specific Validation', () => {
    it('should validate for development environment', () => {
      const isValid = ConfigurationService.validateForEnvironment('development');
      expect(isValid).toBe(true);
    });

    it('should validate for production environment', () => {
      const isValid = ConfigurationService.validateForEnvironment('production');
      expect(isValid).toBe(true);
    });

    it('should validate for test environment', () => {
      const isValid = ConfigurationService.validateForEnvironment('test');
      expect(isValid).toBe(true);
    });
  });

  describe('Health Status', () => {
    beforeEach(() => {
      ConfigurationService.initialize();
    });

    it('should return healthy status with valid configuration', () => {
      const health = ConfigurationService.getHealthStatus();
      
      expect(health.status).toBe('healthy');
      expect(health.issues).toHaveLength(0);
    });

    it('should return warning status for production without auth config', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.NEXTAUTH_SECRET;
      delete process.env.NEXTAUTH_URL;
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      ConfigurationService.initialize();
      
      const health = ConfigurationService.getHealthStatus();
      
      expect(health.status).toBe('warning');
      expect(health.warnings).toContain('NEXTAUTH_SECRET is recommended in production');
      expect(health.warnings).toContain('NEXTAUTH_URL is recommended in production');
    });

    it('should return warning status for debug mode in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.ENABLE_DEBUG = 'true';
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      ConfigurationService.initialize();
      
      const health = ConfigurationService.getHealthStatus();
      
      expect(health.status).toBe('warning');
      expect(health.warnings).toContain('Debug mode is enabled in production');
    });

    it('should return warning for incomplete SMTP configuration', () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_USER = 'user';
      // Missing SMTP_PASSWORD
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      ConfigurationService.initialize();
      
      const health = ConfigurationService.getHealthStatus();
      
      expect(health.status).toBe('warning');
      expect(health.warnings).toContain('SMTP configuration is incomplete - all fields should be set together');
    });
  });

  describe('Configuration Summary', () => {
    beforeEach(() => {
      ConfigurationService.initialize();
    });

    it('should return configuration summary', () => {
      const summary = ConfigurationService.getConfigSummary();
      
      expect(summary.database.url).toBe('✓ Set');
      expect(summary.supabase.url).toBe('✓ Set');
      expect(summary.nextjs.env).toBe('test');
      expect(summary.features.analytics).toBe(false);
    });
  });

  describe('API Key Validation', () => {
    beforeEach(() => {
      ConfigurationService.initialize();
    });

    it('should validate OpenAI API key format', () => {
      process.env.OPENAI_API_KEY = 'invalid-key';
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });

    it('should validate Stripe secret key format', () => {
      process.env.STRIPE_SECRET_KEY = 'invalid-key';
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });

    it('should validate Stripe publishable key format', () => {
      process.env.STRIPE_PUBLISHABLE_KEY = 'invalid-key';
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });

    it('should allow optional API keys to be undefined', () => {
      delete process.env.OPENAI_API_KEY;
      delete process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_PUBLISHABLE_KEY;
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      
      expect(() => ConfigurationService.initialize()).not.toThrow();
    });
  });

  describe('SMTP Configuration', () => {
    beforeEach(() => {
      ConfigurationService.initialize();
    });

    it('should validate SMTP port range', () => {
      process.env.SMTP_PORT = '99999'; // Invalid port
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      
      expect(() => ConfigurationService.initialize()).toThrow(ConfigurationError);
    });

    it('should allow valid SMTP configuration', () => {
      process.env.SMTP_HOST = 'smtp.example.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user';
      process.env.SMTP_PASSWORD = 'password';
      
      // Reinitialize with new environment
      (ConfigurationService as any).config = null;
      
      expect(() => ConfigurationService.initialize()).not.toThrow();
    });
  });

  describe('Legacy Compatibility', () => {
    beforeEach(() => {
      ConfigurationService.initialize();
    });

    it('should provide legacy config object', () => {
      expect(config.database.url).toBe('postgresql://user:password@localhost:5432/testdb');
      expect(config.supabase.url).toBe('https://test.supabase.co');
      expect(config.nextjs.isTest).toBe(true);
    });

    it('should provide legacy helper functions', () => {
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(true);
      expect(isLmsEnabled()).toBe(true);
    });

    it('should provide legacy getter functions', () => {
      const dbConfig = getDatabaseConfig();
      const supabaseConfig = getSupabaseConfig();
      
      expect(dbConfig.url).toBe('postgresql://user:password@localhost:5432/testdb');
      expect(supabaseConfig.url).toBe('https://test.supabase.co');
    });
  });

  describe('Error Handling', () => {
    it('should provide detailed error messages for missing variables', () => {
      delete process.env.DATABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      try {
        ConfigurationService.initialize();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigurationError);
        expect(error.message).toContain('Environment configuration validation failed');
      }
    });

    it('should provide detailed error messages for invalid variables', () => {
      process.env.DATABASE_URL = 'invalid-url';
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://invalid.com';
      
      try {
        ConfigurationService.initialize();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigurationError);
        expect(error.message).toContain('Environment configuration validation failed');
      }
    });
  });
});
