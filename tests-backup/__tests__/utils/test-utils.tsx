import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import type { Profile, Course, Plant, Enrollment, Progress } from '@/types/database'

// Custom render function (simplified without QueryClient)
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, options)
}

// Test data generators
export const testDataGenerators = {
  generateUser: (overrides: Partial<Profile> = {}) => ({
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    email: `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    department: 'operations',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }),
  
  generateCourse: (overrides: Partial<Course> = {}) => ({
    id: `course-${Math.random().toString(36).substr(2, 9)}`,
    title: `Test Course ${Math.random().toString(36).substr(2, 9)}`,
    description: 'Test course description',
    modules: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }),
  
  generateEnrollment: (overrides: Partial<Enrollment> = {}) => ({
    id: `enrollment-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    courseId: 'test-course-id',
    status: 'enrolled',
    progress: 0,
    startedAt: new Date(),
    completedAt: null,
    ...overrides
  }),

  generatePlant: (overrides: Partial<Plant> = {}) => ({
    id: `plant-${Math.random().toString(36).substr(2, 9)}`,
    name: `Test Plant ${Math.random().toString(36).substr(2, 9)}`,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }),

  generateProgress: (overrides: Partial<Progress> = {}) => ({
    id: `progress-${Math.random().toString(36).substr(2, 9)}`,
    userId: 'test-user-id',
    courseId: 'test-course-id',
    progressPercent: 0,
    currentSection: 'section-1',
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  })
}

// Mock API helpers
export const mockApiHelpers = {
  success: function<T>(data: T) {
    return {
      success: true,
      data,
      message: 'Success',
      timestamp: new Date().toISOString()
    }
  },

  error: (message: string, code: string = 'ERROR') => ({
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString()
    }
  }),

  paginated: function<T>(data: T[], page: number = 1, limit: number = 10) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit)
      },
      timestamp: new Date().toISOString()
    }
  }
}

// Test environment helpers
export const testEnvHelpers = {
  setupTestEnv: () => {
    process.env.NODE_ENV = 'test'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
  },

  cleanupTestEnv: () => {
    // Cleanup test environment if needed
  },

  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
}
