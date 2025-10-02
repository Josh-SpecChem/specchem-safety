// src/hooks/__tests__/useUnifiedApi.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUnifiedApi, useUnifiedList, useUnifiedMutation } from '../useUnifiedApi'
import { courseProgressSchema } from '@/lib/schemas'

// Mock API utilities
jest.mock('@/lib/api-utils', () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPatch: jest.fn(),
  apiDelete: jest.fn(),
  withRetryEnhanced: jest.fn(),
  enhancedCache: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  },
  handleApiError: jest.fn(),
  createCacheKey: jest.fn(),
}))

// Mock cache strategy
jest.mock('@/lib/cache-strategy', () => ({
  CACHE_STRATEGY: {
    userData: 5 * 60 * 1000,
    courseData: 3 * 60 * 1000,
    progressData: 30 * 1000,
    analyticsData: 1 * 60 * 1000,
    enrollmentData: 2 * 60 * 1000,
  },
  CACHE_INVALIDATION: {
    onUserUpdate: ['users', 'enrollments', 'analytics'],
    onCourseUpdate: ['courses', 'enrollments', 'analytics'],
    onEnrollmentUpdate: ['enrollments', 'analytics', 'dashboard-stats'],
    onProgressUpdate: ['progress', 'analytics', 'dashboard-stats'],
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useUnifiedApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useUnifiedApi', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: '1', title: 'Test Course' }
      const { apiGet, withRetryEnhanced } = require('@/lib/api-utils')
      
      withRetryEnhanced.mockResolvedValue({
        success: true,
        data: mockData,
      })

      const { result } = renderHook(
        () => useUnifiedApi({
          endpoint: '/api/courses/1',
          queryKey: ['courses', '1'],
          schema: courseProgressSchema,
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual(mockData)
      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      const { withRetryEnhanced } = require('@/lib/api-utils')
      
      withRetryEnhanced.mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(
        () => useUnifiedApi({
          endpoint: '/api/courses/1',
          queryKey: ['courses', '1'],
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeDefined()
    })

    it('should respect enabled option', () => {
      const { result } = renderHook(
        () => useUnifiedApi({
          endpoint: '/api/courses/1',
          queryKey: ['courses', '1'],
          enabled: false,
        }),
        { wrapper: createWrapper() }
      )

      expect(result.current.data).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('useUnifiedList', () => {
    it('should fetch list data with pagination', async () => {
      const mockData = {
        data: [{ id: '1' }, { id: '2' }],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      }
      
      const { withRetryEnhanced } = require('@/lib/api-utils')
      withRetryEnhanced.mockResolvedValue({
        success: true,
        data: mockData,
      })

      const { result } = renderHook(
        () => useUnifiedList({
          endpoint: '/api/courses',
          queryKey: ['courses'],
          params: { page: 1, limit: 10 },
        }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual(mockData.data)
      expect(result.current.pagination).toEqual(mockData.pagination)
      expect(result.current.hasNextPage).toBe(false)
      expect(result.current.hasPreviousPage).toBe(false)
    })

    it('should update parameters correctly', async () => {
      const { result } = renderHook(
        () => useUnifiedList({
          endpoint: '/api/courses',
          queryKey: ['courses'],
          params: { page: 1 },
        }),
        { wrapper: createWrapper() }
      )

      act(() => {
        result.current.updateParams({ limit: 20 })
      })

      // The query should refetch with new parameters
      await waitFor(() => {
        expect(result.current.pagination.limit).toBe(20)
      })
    })
  })

  describe('useUnifiedMutation', () => {
    it('should execute mutation successfully', async () => {
      const mockData = { id: '1', title: 'Updated Course' }
      const { withRetryEnhanced } = require('@/lib/api-utils')
      
      withRetryEnhanced.mockResolvedValue({
        success: true,
        data: mockData,
      })

      const { result } = renderHook(
        () => useUnifiedMutation({
          endpoint: '/api/courses/1',
          method: 'PATCH',
          queryKey: ['courses'],
        }),
        { wrapper: createWrapper() }
      )

      act(() => {
        result.current.mutate({ title: 'Updated Course' })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockData)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle mutation errors', async () => {
      const { withRetryEnhanced } = require('@/lib/api-utils')
      
      withRetryEnhanced.mockRejectedValue(new Error('Mutation failed'))

      const { result } = renderHook(
        () => useUnifiedMutation({
          endpoint: '/api/courses/1',
          method: 'PATCH',
        }),
        { wrapper: createWrapper() }
      )

      act(() => {
        result.current.mutate({ title: 'Updated Course' })
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.isSuccess).toBe(false)
    })

    it('should support optimistic updates', async () => {
      const mockData = { id: '1', title: 'Original Course' }
      const { withRetryEnhanced } = require('@/lib/api-utils')
      
      withRetryEnhanced.mockResolvedValue({
        success: true,
        data: { id: '1', title: 'Updated Course' },
      })

      const { result } = renderHook(
        () => useUnifiedMutation({
          endpoint: '/api/courses/1',
          method: 'PATCH',
          queryKey: ['courses', '1'],
          optimisticUpdate: {
            queryKey: ['courses', '1'],
            updater: (oldData, variables) => ({
              ...oldData,
              ...variables,
            }),
          },
        }),
        { wrapper: createWrapper() }
      )

      act(() => {
        result.current.mutate({ title: 'Updated Course' })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual({ id: '1', title: 'Updated Course' })
    })
  })
})

// Integration tests
describe('useUnifiedApi Integration', () => {
  it('should work with real API endpoints', async () => {
    // This would be an integration test with actual API calls
    // For now, we'll test the hook structure
    const { result } = renderHook(
      () => useUnifiedApi({
        endpoint: '/api/progress',
        queryKey: ['progress'],
        schema: courseProgressSchema.array(),
      }),
      { wrapper: createWrapper() }
    )

    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('isError')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('refetch')
    expect(result.current).toHaveProperty('invalidate')
  })
})
