import '@testing-library/jest-dom'
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import { cleanup, render, RenderOptions, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement, ReactNode } from 'react'
import React from 'react'
import type { Profile, Course, Plant, Enrollment, Progress } from '@/types/database'

// Extend Vitest's expect with jest-dom matchers
declare module 'vitest' {
  interface Assertion<T = unknown> extends jest.Matchers<void, T> {
    // Custom matchers can be added here
    toBeInTheDocument(): void;
  }
  interface AsymmetricMatchersContaining extends jest.Matchers<void, unknown> {
    // Custom asymmetric matchers can be added here
    toBeInTheDocument(): void;
  }
}

// Global test setup
beforeAll(async () => {
  // Initialize test environment
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
})

afterAll(async () => {
  // Cleanup test environment
  await cleanup()
})

beforeEach(() => {
  // Reset mocks and state
  vi.clearAllMocks()
})

afterEach(() => {
  // Cleanup after each test
  cleanup()
})

// Create test query client
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

// Custom render function with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const queryClient = createTestQueryClient()
  
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
  
  return render(ui, { wrapper: Wrapper, ...options })
}

// Simplified test utilities
export const TestHelpers = {
  // Database utilities
  createTestUser: (overrides: Partial<Profile> = {}) => ({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    plantId: 'test-plant-id',
    email: `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    jobTitle: 'Test Role',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),
  
  createTestCourse: (overrides: Partial<Course> = {}) => ({
    id: `course-${Math.random().toString(36).substr(2, 9)}`,
    slug: `test-course-${Math.random().toString(36).substr(2, 9)}`,
    title: `Test Course ${Math.random().toString(36).substr(2, 9)}`,
    version: '1.0',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),
  
  createTestEnrollment: (overrides: Partial<Enrollment> = {}) => ({
    id: `enrollment-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    courseId: 'test-course-id',
    plantId: 'test-plant-id',
    status: 'enrolled',
    enrolledAt: new Date().toISOString(),
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),

  createTestPlant: (overrides: Partial<Plant> = {}) => ({
    id: `plant-${Math.random().toString(36).substr(2, 9)}`,
    name: `Test Plant ${Math.random().toString(36).substr(2, 9)}`,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),

  createTestProgress: (overrides: Partial<Progress> = {}) => ({
    id: `progress-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    courseId: 'test-course-id',
    plantId: 'test-plant-id',
    progressPercent: 0,
    currentSection: 'section-1',
    lastActiveAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),

  // Authentication utilities
  createTestAuthContext: (role: string = 'user') => ({
    id: 'test-user-id',
    email: 'test@example.com',
    role,
    plantId: 'test-plant-id',
    accessiblePlants: ['test-plant-id'],
    permissions: []
  }),

  // API utilities
  createTestRequest: (method: string = 'GET', body?: unknown) => {
    const request = new Request('http://localhost:3000/api/test', {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return request
  },

  // Component utilities
  renderWithProviders: renderWithProviders
}

// Essential test patterns
export const TestPatterns = {
  // API route testing pattern
  testApiRoute: async (
    handler: (request: Request) => Promise<Response>,
    request: Request,
    expectedStatus: number = 200
  ) => {
    const response = await handler(request, {})
    expect(response.status).toBe(expectedStatus)
    return response
  },
  
  // Database operation testing pattern
  testDatabaseOperation: async (
    operation: () => Promise<unknown>,
    expectedResult?: unknown
  ) => {
    const result = await operation()
    if (expectedResult) {
      expect(result).toEqual(expectedResult)
    }
    return result
  },
  
  // Component testing pattern
  testComponent: (
    component: React.ComponentType<Record<string, unknown>>,
    props: Record<string, unknown> = {},
    testName: string
  ) => {
    test(testName, () => {
      const { container } = TestHelpers.renderWithProviders(
        React.createElement(component, props)
      )
      expect(container).toBeInTheDocument()
    })
  },
  
  // Form testing pattern
  testForm: (
    formComponent: React.ComponentType<Record<string, unknown>>,
    formData: Record<string, unknown>,
    testName: string
  ) => {
    test(testName, async () => {
      const { getByRole, getByLabelText } = TestHelpers.renderWithProviders(
        React.createElement(formComponent)
      )
      
      // Fill form fields
      Object.entries(formData).forEach(([field, value]) => {
        const input = getByLabelText(field)
        fireEvent.change(input, { target: { value } })
      })
      
      // Submit form
      const submitButton = getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)
      
      // Assert form submission
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })
  }
}

// Mock API responses
export const mockApiResponse = (data: unknown, success: boolean = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
  timestamp: new Date().toISOString()
})

// Mock paginated response
export const mockPaginatedResponse = (
  data: unknown[],
  page: number = 1,
  limit: number = 10
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit)
  },
  timestamp: new Date().toISOString()
})

// Mock error response
export const mockErrorResponse = (message: string, code: string = 'ERROR') => ({
  success: false,
  error: {
    message,
    code,
    timestamp: new Date().toISOString()
  }
})

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Import waitFor from testing library to fix missing import
export { waitFor as waitForElement } from '@testing-library/react'