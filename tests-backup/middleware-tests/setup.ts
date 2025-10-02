import { beforeAll, beforeEach, vi } from 'vitest'

// Global test setup
beforeAll(async () => {
  // Initialize test environment
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
})

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()
})
