import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cn } from '@/lib/utils'
import {
  ApiError,
  validateApiResponse,
  apiRequest,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
  buildQueryString,
  handleApiError,
  withRetry,
  debounce,
  cache,
  createCacheKey,
  withRetryEnhanced,
  requestDeduplication,
  apiGetDeduplicated,
} from '@/lib/api-utils'
import { z } from 'zod'

// Mock fetch globally
global.fetch = vi.fn()

describe('Utility Functions Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear localStorage before each test
    localStorage.clear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', { 'conditional': true, 'hidden': false })
      expect(result).toContain('base')
      expect(result).toContain('conditional')
      expect(result).not.toContain('hidden')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toBe('base valid')
    })
  })

  describe('ApiError', () => {
    it('should create ApiError with message and status', () => {
      const error = new ApiError('Test error', 400, 'VALIDATION_ERROR')
      expect(error.message).toBe('Test error')
      expect(error.status).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.name).toBe('ApiError')
    })

    it('should create ApiError without code', () => {
      const error = new ApiError('Test error', 500)
      expect(error.message).toBe('Test error')
      expect(error.status).toBe(500)
      expect(error.code).toBeUndefined()
    })
  })

  describe('validateApiResponse', () => {
    const testSchema = z.object({
      success: z.boolean(),
      data: z.string().optional(),
      error: z.string().optional(),
    })

    it('should validate valid API response', () => {
      const validResponse = {
        success: true,
        data: 'test data',
      }

      const result = validateApiResponse(validResponse, testSchema)
      expect(result.success).toBe(true)
      expect(result.data).toBe('test data')
    })

    it('should throw ApiError for invalid response', () => {
      const invalidResponse = {
        success: 'not-boolean',
        data: 123,
      }

      expect(() => {
        validateApiResponse(invalidResponse, testSchema)
      }).toThrow(ApiError)
    })

    it('should handle ZodError and convert to ApiError', () => {
      const invalidResponse = {
        success: 'not-boolean',
      }

      expect(() => {
        validateApiResponse(invalidResponse, testSchema)
      }).toThrow('Invalid API response')
    })
  })

  describe('apiRequest', () => {
    it('should make successful API request', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data: 'test' }),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response)

      const result = await apiRequest('/test')

      expect(fetch).toHaveBeenCalledWith('/test', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual({ success: true, data: 'test' })
    })

    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: vi.fn().mockResolvedValue({ error: 'Resource not found' }),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response)

      await expect(apiRequest('/test')).rejects.toThrow(ApiError)
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new TypeError('Network error'))

      await expect(apiRequest('/test')).rejects.toThrow(ApiError)
    })

    it('should handle unknown errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Unknown error'))

      await expect(apiRequest('/test')).rejects.toThrow(ApiError)
    })
  })

  describe('HTTP method helpers', () => {
    beforeEach(() => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response)
    })

    it('should make GET request', async () => {
      await apiGet('/test')
      expect(fetch).toHaveBeenCalledWith('/test', { method: 'GET' })
    })

    it('should make POST request', async () => {
      const data = { name: 'test' }
      await apiPost('/test', data)
      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    })

    it('should make PATCH request', async () => {
      const data = { name: 'updated' }
      await apiPatch('/test', data)
      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    })

    it('should make DELETE request', async () => {
      await apiDelete('/test')
      expect(fetch).toHaveBeenCalledWith('/test', { method: 'DELETE' })
    })
  })

  describe('buildQueryString', () => {
    it('should build query string from object', () => {
      const params = {
        page: 1,
        limit: 20,
        search: 'test',
        active: true,
      }
      const result = buildQueryString(params)
      expect(result).toBe('?page=1&limit=20&search=test&active=true')
    })

    it('should handle undefined values', () => {
      const params = {
        page: 1,
        limit: undefined,
        search: 'test',
      }
      const result = buildQueryString(params)
      expect(result).toBe('?page=1&search=test')
    })

    it('should return empty string for empty object', () => {
      const result = buildQueryString({})
      expect(result).toBe('')
    })

    it('should handle null values', () => {
      const params = {
        page: 1,
        limit: null,
        search: 'test',
      }
      const result = buildQueryString(params)
      expect(result).toBe('?page=1&search=test')
    })
  })

  describe('handleApiError', () => {
    it('should handle ApiError with specific codes', () => {
      const networkError = new ApiError('Network error', 0, 'NETWORK_ERROR')
      expect(handleApiError(networkError)).toBe('Unable to connect to the server. Please check your internet connection and try again.')

      const validationError = new ApiError('Validation error', 400, 'VALIDATION_ERROR')
      expect(handleApiError(validationError)).toBe('The data provided was invalid. Please check your input and try again.')

      const unauthorizedError = new ApiError('Unauthorized', 401, 'UNAUTHORIZED')
      expect(handleApiError(unauthorizedError)).toBe('You are not authorized to perform this action. Please log in and try again.')

      const forbiddenError = new ApiError('Forbidden', 403, 'FORBIDDEN')
      expect(handleApiError(forbiddenError)).toBe('You do not have permission to perform this action.')
    })

    it('should handle ApiError without specific code', () => {
      const error = new ApiError('Custom error', 500)
      expect(handleApiError(error)).toBe('Custom error')
    })

    it('should handle regular Error', () => {
      const error = new Error('Regular error')
      expect(handleApiError(error)).toBe('Regular error')
    })

    it('should handle unknown error types', () => {
      expect(handleApiError('string error')).toBe('An unexpected error occurred. Please try again.')
      expect(handleApiError(null)).toBe('An unexpected error occurred. Please try again.')
    })
  })

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success')
      const result = await withRetry(operation)
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockRejectedValueOnce(new Error('Second failure'))
        .mockResolvedValue('success')

      const result = await withRetry(operation, 3, 10)
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(3)
    })

    it('should not retry on client errors', async () => {
      const operation = vi.fn().mockRejectedValue(new ApiError('Bad request', 400))
      
      await expect(withRetry(operation)).rejects.toThrow(ApiError)
      expect(operation).toHaveBeenCalledTimes(1)
    })

    it('should fail after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Always fails'))
      
      await expect(withRetry(operation, 2, 10)).rejects.toThrow('Always fails')
      expect(operation).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      expect(mockFn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg3')
    })

    it('should handle multiple debounced calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn('first')
      await new Promise(resolve => setTimeout(resolve, 60))
      debouncedFn('second')
      await new Promise(resolve => setTimeout(resolve, 60))

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, 'first')
      expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
    })
  })

  describe('cache', () => {
    it('should set and get cached data', () => {
      const testData = { name: 'test', value: 123 }
      cache.set('test-key', testData, 1000)

      const retrieved = cache.get('test-key')
      expect(retrieved).toEqual(testData)
    })

    it('should return null for expired cache', () => {
      const testData = { name: 'test' }
      cache.set('test-key', testData, 1) // 1ms TTL

      // Wait for expiration
      setTimeout(() => {
        const retrieved = cache.get('test-key')
        expect(retrieved).toBeNull()
      }, 10)
    })

    it('should return null for non-existent key', () => {
      const retrieved = cache.get('non-existent')
      expect(retrieved).toBeNull()
    })

    it('should clear specific cache key', () => {
      cache.set('key1', 'data1')
      cache.set('key2', 'data2')
      
      cache.clear('key1')
      
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBe('data2')
    })

    it('should clear all cache', () => {
      cache.set('key1', 'data1')
      cache.set('key2', 'data2')
      
      cache.clear()
      
      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeNull()
    })

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      cache.set('test-key', 'test-data')
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to cache data:', expect.any(Error))
      
      // Restore
      localStorage.setItem = originalSetItem
      consoleSpy.mockRestore()
    })
  })

  describe('createCacheKey', () => {
    it('should create cache key from URL only', () => {
      const key = createCacheKey('/api/users')
      expect(key).toBe('/api/users')
    })

    it('should create cache key from URL and params', () => {
      const params = { page: 1, limit: 20 }
      const key = createCacheKey('/api/users', params)
      expect(key).toBe('/api/users_{"page":1,"limit":20}')
    })

    it('should sanitize special characters', () => {
      const key = createCacheKey('/api/users?search=test&filter=active')
      expect(key).toBe('/api/users_search_test_filter_active')
    })
  })

  describe('EnhancedCache', () => {
    let enhancedCache: EnhancedCache

    beforeEach(() => {
      enhancedCache = new EnhancedCache()
    })

    it('should set and get data', () => {
      const config = { ttl: 1000, key: 'test' }
      enhancedCache.set('test-key', 'test-data', config)

      const retrieved = enhancedCache.get('test-key')
      expect(retrieved).toBe('test-data')
    })

    it('should return null for expired data', () => {
      const config = { ttl: 1, key: 'test' }
      enhancedCache.set('test-key', 'test-data', config)

      setTimeout(() => {
        const retrieved = enhancedCache.get('test-key')
        expect(retrieved).toBeNull()
      }, 10)
    })

    it('should clear data by pattern', () => {
      enhancedCache.set('user-1', 'data1', { ttl: 1000, key: 'user' })
      enhancedCache.set('user-2', 'data2', { ttl: 1000, key: 'user' })
      enhancedCache.set('course-1', 'data3', { ttl: 1000, key: 'course' })

      enhancedCache.clear('user')

      expect(enhancedCache.get('user-1')).toBeNull()
      expect(enhancedCache.get('user-2')).toBeNull()
      expect(enhancedCache.get('course-1')).toBe('data3')
    })

    it('should invalidate multiple keys', () => {
      enhancedCache.set('key1', 'data1', { ttl: 1000, key: 'test' })
      enhancedCache.set('key2', 'data2', { ttl: 1000, key: 'test' })

      enhancedCache.invalidate(['key1', 'key2'])

      expect(enhancedCache.get('key1')).toBeNull()
      expect(enhancedCache.get('key2')).toBeNull()
    })
  })

  describe('withRetryEnhanced', () => {
    it('should succeed on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success')
      const result = await withRetryEnhanced(operation)
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(1)
    })

    it('should use exponential backoff with jitter', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValue('success')

      const startTime = Date.now()
      const result = await withRetryEnhanced(operation, 2, 100)
      const endTime = Date.now()

      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(2)
      // Should have waited at least 100ms (base delay)
      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })

    it('should not retry on client errors', async () => {
      const operation = vi.fn().mockRejectedValue(new ApiError('Bad request', 400))
      
      await expect(withRetryEnhanced(operation)).rejects.toThrow(ApiError)
      expect(operation).toHaveBeenCalledTimes(1)
    })
  })

  describe('RequestDeduplication', () => {
    it('should deduplicate identical requests', async () => {
      const mockRequest = vi.fn().mockResolvedValue('response')
      
      const promise1 = requestDeduplication.deduplicate('test-key', mockRequest)
      const promise2 = requestDeduplication.deduplicate('test-key', mockRequest)
      
      const [result1, result2] = await Promise.all([promise1, promise2])
      
      expect(result1).toBe('response')
      expect(result2).toBe('response')
      expect(mockRequest).toHaveBeenCalledTimes(1)
    })

    it('should handle different keys separately', async () => {
      const mockRequest1 = vi.fn().mockResolvedValue('response1')
      const mockRequest2 = vi.fn().mockResolvedValue('response2')
      
      const promise1 = requestDeduplication.deduplicate('key1', mockRequest1)
      const promise2 = requestDeduplication.deduplicate('key2', mockRequest2)
      
      const [result1, result2] = await Promise.all([promise1, promise2])
      
      expect(result1).toBe('response1')
      expect(result2).toBe('response2')
      expect(mockRequest1).toHaveBeenCalledTimes(1)
      expect(mockRequest2).toHaveBeenCalledTimes(1)
    })

    it('should clean up completed requests', async () => {
      const mockRequest = vi.fn().mockResolvedValue('response')
      
      await requestDeduplication.deduplicate('test-key', mockRequest)
      
      // Second request with same key should not be deduplicated
      const mockRequest2 = vi.fn().mockResolvedValue('response2')
      const result = await requestDeduplication.deduplicate('test-key', mockRequest2)
      
      expect(result).toBe('response2')
      expect(mockRequest2).toHaveBeenCalledTimes(1)
    })
  })

  describe('apiGetDeduplicated', () => {
    beforeEach(() => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, data: 'test' }),
      }
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response)
    })

    it('should deduplicate GET requests', async () => {
      const schema = z.object({ success: z.boolean(), data: z.string() })
      
      const promise1 = apiGetDeduplicated('/test', schema)
      const promise2 = apiGetDeduplicated('/test', schema)
      
      const [result1, result2] = await Promise.all([promise1, promise2])
      
      expect(result1).toEqual({ success: true, data: 'test' })
      expect(result2).toEqual({ success: true, data: 'test' })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
