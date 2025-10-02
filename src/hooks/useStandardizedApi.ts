import { useState, useEffect, useCallback } from 'react';
import { 
  apiGet, 
  apiPost, 
  apiPatch, 
  handleApiError, 
  withRetryEnhanced, 
  enhancedCache, 
  createCacheKey,
  CACHE_STRATEGY
} from '@/lib/api-utils';
import type { ValidationSchema, UnifiedApiOptions, UnifiedApiState } from '@/types/api';
import { 
  courseProgressSchema, 
  userProfileSchema,
  type CourseProgress,
  type UserProfile
} from '@/lib/schemas';

/**
 * Standardized API Hooks - Unified API interaction patterns
 * 
 * These hooks provide consistent patterns for API interactions across the application.
 * They include caching, error handling, retry logic, and loading states.
 */

export interface ApiOptions {
  cacheKey?: string;
  cacheTTL?: number;
  enabled?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for GET requests with caching and error handling
 */
export function useApiGet<T>(
  endpoint: string,
  schema?: ValidationSchema,
  options: ApiOptions = {}
): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    cacheKey = createCacheKey(endpoint),
    cacheTTL = CACHE_STRATEGY.default,
    enabled = true,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = enhancedCache.get(cacheKey);
      if (cachedData) {
        setData(cachedData as T);
        setLoading(false);
        return;
      }

      // Fetch from API with retry logic
      const result = await withRetryEnhanced(
        () => apiGet(endpoint),
        retryCount,
        retryDelay
      );

      if (result.success) {
        const validatedData = schema ? schema.parse(result.data) : result.data;
        setData(validatedData as T);
        enhancedCache.set(cacheKey, validatedData, { ttl: cacheTTL, key: cacheKey });
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`API GET Error (${endpoint}):`, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, schema, cacheKey, cacheTTL, enabled, retryCount, retryDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook for POST requests with error handling
 */
export function useApiPost<T, R>(
  endpoint: string,
  schema?: ValidationSchema,
  options: ApiOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const postData = useCallback(async (payload: T): Promise<R | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await withRetryEnhanced(
        () => apiPost(endpoint, payload),
        retryCount,
        retryDelay
      );

      if (result.success) {
        const validatedData = schema ? schema.parse(result.data) : result.data;
        return validatedData as R;
      } else {
        throw new Error(result.error || 'Failed to post data');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`API POST Error (${endpoint}):`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, schema, retryCount, retryDelay]);

  return {
    postData,
    loading,
    error
  };
}

/**
 * Hook for PATCH requests with error handling
 */
export function useApiPatch<T, R>(
  endpoint: string,
  schema?: ValidationSchema,
  options: ApiOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const patchData = useCallback(async (payload: T): Promise<R | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await withRetryEnhanced(
        () => apiPatch(endpoint, payload),
        retryCount,
        retryDelay
      );

      if (result.success) {
        const validatedData = schema ? schema.parse(result.data) : result.data;
        return validatedData as R;
      } else {
        throw new Error(result.error || 'Failed to patch data');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`API PATCH Error (${endpoint}):`, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, schema, retryCount, retryDelay]);

  return {
    patchData,
    loading,
    error
  };
}

/**
 * Hook for managing user progress data
 */
export function useProgress() {
  return useApiGet<CourseProgress[]>(
    '/api/progress',
    courseProgressSchema.array(),
    {
      cacheKey: 'user-progress',
      cacheTTL: CACHE_STRATEGY.userData
    }
  );
}

/**
 * Hook for managing course progress data
 */
export function useCourseProgress(courseId: string) {
  return useApiGet<CourseProgress>(
    `/api/courses/${courseId}/progress`,
    courseProgressSchema,
    {
      cacheKey: `course-progress-${courseId}`,
      cacheTTL: CACHE_STRATEGY.courseData,
      enabled: !!courseId
    }
  );
}

/**
 * Hook for managing user profile data
 */
export function useUserProfile() {
  return useApiGet<UserProfile>(
    '/api/user/profile',
    userProfileSchema,
    {
      cacheKey: 'user-profile',
      cacheTTL: CACHE_STRATEGY.userData
    }
  );
}

// ========================================
// ADDITIONAL EXPORTS FOR BACKWARD COMPATIBILITY
// ========================================

/**
 * Alias for useApiPost for backward compatibility
 */
export const useApiMutation = useApiPost;

/**
 * Alias for useApiGet for backward compatibility
 */
export const useApiList = useApiGet;
