import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { testEnvHelpers } from '../../__tests__/utils/test-utils'

describe('Configuration Management', () => {
  beforeEach(() => {
    testEnvHelpers.setupTestEnv()
  })

  afterEach(() => {
    testEnvHelpers.cleanupTestEnv()
  })

  describe('Environment Variable Validation', () => {
    it('should validate required environment variables', () => {
      // Set up valid environment variables
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
      process.env.NODE_ENV = 'test'

      // Import config after setting environment variables
      const { config } = require('../config')
      
      expect(config.DATABASE_URL).toBe('postgresql://test:test@localhost:5432/test')
      expect(config.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co')
      expect(config.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('test-anon-key')
      expect(config.SUPABASE_SERVICE_ROLE_KEY).toBe('test-service-key')
      expect(config.NODE_ENV).toBe('test')
    })

    it('should throw error for missing required variables', () => {
      // Clear required environment variables
      delete process.env.DATABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      delete process.env.NODE_ENV

      expect(() => {
        require('../config')
      }).toThrow('Environment configuration validation failed')
    })

    it('should validate NODE_ENV enum values', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
      process.env.NODE_ENV = 'invalid'

      expect(() => {
        require('../config')
      }).toThrow('NODE_ENV must be development, production, or test')
    })

    it('should validate URL formats', () => {
      process.env.DATABASE_URL = 'invalid-url'
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
      process.env.NODE_ENV = 'test'

      expect(() => {
        require('../config')
      }).toThrow('DATABASE_URL must be a valid URL')
    })
  })

  describe('Helper Functions', () => {
    beforeEach(() => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
      process.env.NODE_ENV = 'development'
    })

    it('should correctly identify development environment', () => {
      const { isDevelopment } = require('../config')
      expect(isDevelopment()).toBe(true)
    })

    it('should correctly identify production environment', () => {
      process.env.NODE_ENV = 'production'
      const { isProduction } = require('../config')
      expect(isProduction()).toBe(true)
    })

    it('should correctly identify test environment', () => {
      process.env.NODE_ENV = 'test'
      const { isTest } = require('../config')
      expect(isTest()).toBe(true)
    })

    it('should handle LMS feature flag', () => {
      const { isLmsEnabled } = require('../config')
      expect(isLmsEnabled()).toBe(true)
    })
  })

  describe('Configuration Helpers', () => {
    beforeEach(() => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
      process.env.NODE_ENV = 'production'
    })

    it('should provide database configuration', () => {
      const { getDatabaseConfig } = require('../config')
      const dbConfig = getDatabaseConfig()
      
      expect(dbConfig.url).toBe('postgresql://test:test@localhost:5432/test')
      expect(dbConfig.ssl).toEqual({ rejectUnauthorized: false })
    })

    it('should provide Supabase configuration', () => {
      const { getSupabaseConfig } = require('../config')
      const supabaseConfig = getSupabaseConfig()
      
      expect(supabaseConfig.url).toBe('https://test.supabase.co')
      expect(supabaseConfig.anonKey).toBe('test-anon-key')
      expect(supabaseConfig.serviceRoleKey).toBe('test-service-key')
    })
  })
})
