// src/hooks/__tests__/useUnifiedProgress.test.ts
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProgress, useCourseProgress, useQuestionEvents, useUserProfile } from '../useUnifiedProgress'
import { courseProgressSchema, userProfileSchema } from '@/lib/schemas'

// Mock the unified API hooks
jest.mock('../useUnifiedApi', () => ({
  useUnifiedApi: jest.fn(),
  useUnifiedList: jest.fn(),
  useUnifiedMutation: jest.fn(),
  UNIFIED_CACHE_CONFIG: {
    userData: 5 * 60 * 1000,
    courseData: 3 * 60 * 1000,
    progressData: 30 * 1000,
    analyticsData: 1 * 60 * 1000,
    enrollmentData: 2 * 60 * 1000,
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

describe('useUnifiedProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useProgress', () => {
    it('should return progress data from unified list hook', () => {
      const mockProgressData = [
        { id: '1', courseId: 'course1', progressPercent: 50 },
        { id: '2', courseId: 'course2', progressPercent: 75 },
      ]

      const { useUnifiedList } = require('../useUnifiedApi')
      useUnifiedList.mockReturnValue({
        data: mockProgressData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
        invalidate: jest.fn(),
        updateParams: jest.fn(),
        hasNextPage: false,
        hasPreviousPage: false,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      })

      const { result } = renderHook(() => useProgress(), {
        wrapper: createWrapper(),
      })

      expect(result.current.data).toEqual(mockProgressData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(useUnifiedList).toHaveBeenCalledWith({
        endpoint: '/api/progress',
        queryKey: ['progress'],
        params: {},
        schema: courseProgressSchema.array(),
        staleTime: 30 * 1000, // progressData
        cacheTime: 60 * 1000, // progressData * 2
      })
    })
  })

  describe('useCourseProgress', () => {
    it('should return course progress data and update function', () => {
      const mockProgressData = {
        id: '1',
        courseId: 'course1',
        progressPercent: 50,
        currentSection: 'section1',
      }

      const mockUpdateMutation = {
        mutateAsync: jest.fn(),
        isLoading: false,
        error: null,
      }

      const { useUnifiedApi, useUnifiedMutation } = require('../useUnifiedApi')
      useUnifiedApi.mockReturnValue({
        data: mockProgressData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
        invalidate: jest.fn(),
      })

      useUnifiedMutation.mockReturnValue(mockUpdateMutation)

      const { result } = renderHook(() => useCourseProgress('/test-course'), {
        wrapper: createWrapper(),
      })

      expect(result.current.progress).toEqual(mockProgressData)
      expect(result.current.loading).toBe(false)
      expect(result.current.updating).toBe(false)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.updateProgress).toBe('function')
      expect(typeof result.current.refetch).toBe('function')

      // Test updateProgress function
      act(() => {
        result.current.updateProgress(75, 'section2', 'view_section')
      })

      expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith({
        progressPercent: 75,
        currentSection: 'section2',
        eventType: 'view_section',
      })
    })

    it('should handle course route formatting correctly', () => {
      const { useUnifiedApi, useUnifiedMutation } = require('../useUnifiedApi')
      useUnifiedApi.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
        invalidate: jest.fn(),
      })

      useUnifiedMutation.mockReturnValue({
        mutateAsync: jest.fn(),
        isLoading: false,
        error: null,
      })

      renderHook(() => useCourseProgress('/test-course'), {
        wrapper: createWrapper(),
      })

      expect(useUnifiedApi).toHaveBeenCalledWith({
        endpoint: '/api/courses/test-course/progress',
        queryKey: ['course-progress', 'test-course'],
        schema: courseProgressSchema,
        staleTime: 30 * 1000,
        cacheTime: 60 * 1000,
        enabled: true,
      })
    })
  })

  describe('useQuestionEvents', () => {
    it('should return question recording function', () => {
      const mockMutation = {
        mutateAsync: jest.fn(),
        isLoading: false,
        error: null,
      }

      const { useUnifiedMutation } = require('../useUnifiedApi')
      useUnifiedMutation.mockReturnValue(mockMutation)

      const { result } = renderHook(() => useQuestionEvents('/test-course'), {
        wrapper: createWrapper(),
      })

      expect(typeof result.current.recordQuestion).toBe('function')
      expect(result.current.submitting).toBe(false)
      expect(result.current.error).toBeNull()

      // Test recordQuestion function
      act(() => {
        result.current.recordQuestion(
          'section1',
          'question1',
          true,
          1,
          { timeSpent: 30 }
        )
      })

      expect(mockMutation.mutateAsync).toHaveBeenCalledWith({
        sectionKey: 'section1',
        questionKey: 'question1',
        isCorrect: true,
        attemptIndex: 1,
        responseMeta: { timeSpent: 30 },
      })
    })
  })

  describe('useUserProfile', () => {
    it('should return user profile data and update function', () => {
      const mockProfileData = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Engineer',
      }

      const mockUpdateMutation = {
        mutateAsync: jest.fn(),
        isLoading: false,
        error: null,
      }

      const { useUnifiedApi, useUnifiedMutation } = require('../useUnifiedApi')
      useUnifiedApi.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
        invalidate: jest.fn(),
      })

      useUnifiedMutation.mockReturnValue(mockUpdateMutation)

      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      })

      expect(result.current.profile).toEqual(mockProfileData)
      expect(result.current.loading).toBe(false)
      expect(result.current.updating).toBe(false)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.updateProfile).toBe('function')
      expect(typeof result.current.refetch).toBe('function')

      // Test updateProfile function
      act(() => {
        result.current.updateProfile({
          firstName: 'Jane',
          jobTitle: 'Senior Engineer',
        })
      })

      expect(mockUpdateMutation.mutateAsync).toHaveBeenCalledWith({
        firstName: 'Jane',
        jobTitle: 'Senior Engineer',
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors in useCourseProgress', () => {
      const { useUnifiedApi, useUnifiedMutation } = require('../useUnifiedApi')
      useUnifiedApi.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('API Error'),
        refetch: jest.fn(),
        invalidate: jest.fn(),
      })

      useUnifiedMutation.mockReturnValue({
        mutateAsync: jest.fn(),
        isLoading: false,
        error: null,
      })

      const { result } = renderHook(() => useCourseProgress('/test-course'), {
        wrapper: createWrapper(),
      })

      expect(result.current.error).toBe('API Error')
      expect(result.current.progress).toBeNull()
    })

    it('should handle mutation errors in useQuestionEvents', () => {
      const { useUnifiedMutation } = require('../useUnifiedApi')
      useUnifiedMutation.mockReturnValue({
        mutateAsync: jest.fn(),
        isLoading: false,
        error: new Error('Mutation Error'),
      })

      const { result } = renderHook(() => useQuestionEvents('/test-course'), {
        wrapper: createWrapper(),
      })

      expect(result.current.error).toBe('Mutation Error')
    })
  })
})
