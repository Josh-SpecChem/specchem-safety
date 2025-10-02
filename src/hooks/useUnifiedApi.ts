import {
    CACHE_STRATEGY,
    apiGet,
    apiPatch,
    apiPost,
    createCacheKey,
    enhancedCache,
    handleApiError,
    withRetryEnhanced
} from '@/lib/api-utils';
import {
    courseProgressSchema,
    userProfileSchema,
    type CourseProgress,
    type UserProfile
} from '@/lib/schemas';
import type { UnifiedApiOptions, UnifiedApiState, ValidationSchema } from '@/types/api';
import { useCallback, useEffect, useState } from 'react';

/**
 * Unified API Hooks - Centralized API interaction patterns
 * 
 * These hooks provide the unified patterns for API interactions across the application.
 * They are the primary hooks used by the unified hook system.
 */

// UnifiedApiOptions and UnifiedApiState are imported from @/types/api

/**
 * Unified hook for GET requests with caching and error handling
 */
export function useUnifiedApiGet<T>(
  endpoint: string,
  schema?: ValidationSchema,
  options: UnifiedApiOptions = {}
): UnifiedApiState<T> {
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
      const cachedData = enhancedCache.get(cacheKey) as T | null;
      if (cachedData) {
        setData(cachedData);
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
        const validatedData: T = schema ? schema.parse(result.data) as T : result.data as T;
        setData(validatedData);
        enhancedCache.set(cacheKey, validatedData, { key: cacheKey, ttl: cacheTTL });
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`Unified API GET Error (${endpoint}):`, errorMessage);
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
 * Unified hook for POST requests with error handling
 */
export function useUnifiedApiPost<T, R>(
  endpoint: string,
  schema?: ValidationSchema,
  options: UnifiedApiOptions = {}
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
        const validatedData: R = schema ? schema.parse(result.data) as R : result.data as R;
        return validatedData;
      } else {
        throw new Error(result.error || 'Failed to post data');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`Unified API POST Error (${endpoint}):`, errorMessage);
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
 * Unified hook for PATCH requests with error handling
 */
export function useUnifiedApiPatch<T, R>(
  endpoint: string,
  schema?: ValidationSchema,
  options: UnifiedApiOptions = {}
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
        const validatedData: R = schema ? schema.parse(result.data) as R : result.data as R;
        return validatedData;
      } else {
        throw new Error(result.error || 'Failed to patch data');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`Unified API PATCH Error (${endpoint}):`, errorMessage);
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
 * Unified hook for managing user progress data
 */
export function useUnifiedProgress() {
  return useUnifiedApiGet<CourseProgress[]>(
    '/api/progress',
    courseProgressSchema.array(),
    {
      cacheKey: 'unified-user-progress',
      cacheTTL: CACHE_STRATEGY.userData
    }
  );
}

/**
 * Unified hook for managing course progress data
 */
export function useUnifiedCourseProgress(courseId: string) {
  return useUnifiedApiGet<CourseProgress>(
    `/api/courses/${courseId}/progress`,
    courseProgressSchema,
    {
      cacheKey: `unified-course-progress-${courseId}`,
      cacheTTL: CACHE_STRATEGY.courseData,
      enabled: !!courseId
    }
  );
}

/**
 * Unified hook for managing user profile data
 */
export function useUnifiedUserProfile() {
  return useUnifiedApiGet<UserProfile>(
    '/api/user/profile',
    userProfileSchema,
    {
      cacheKey: 'unified-user-profile',
      cacheTTL: CACHE_STRATEGY.userData
    }
  );
}

// ========================================
// ADDITIONAL EXPORTS FOR BACKWARD COMPATIBILITY
// ========================================

/**
 * Alias for useUnifiedApiPost for backward compatibility
 */
export const useUnifiedMutation = useUnifiedApiPost;

/**
 * Alias for useUnifiedApiGet for backward compatibility
 */
export const useUnifiedList = useUnifiedApiGet;

/**
 * Alias for useUnifiedApiGet for backward compatibility
 */
export const useUnifiedApi = useUnifiedApiGet;

/**
 * Unified cache configuration for backward compatibility
 */
export const UNIFIED_CACHE_CONFIG = {
  default: CACHE_STRATEGY.default,
  userData: CACHE_STRATEGY.userData,
  courseData: CACHE_STRATEGY.courseData,
  shortTerm: 5 * 60 * 1000, // 5 minutes
  longTerm: 30 * 60 * 1000, // 30 minutes
};

/**
 * Unified mutation hook for POST/PATCH/DELETE operations (alternative implementation)
 */
export function useUnifiedMutationAlt<T>(endpoint: string, options: UnifiedApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postData = useCallback(async (payload: unknown): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiPost(endpoint, payload);
      return response as T;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { postData, loading, error };
}

/**
 * Placeholder for optimistic update hook - to be implemented
 */
export function useUnifiedOptimisticUpdate<T>(options: UnifiedApiOptions = {}): UnifiedApiState<T> {
  // TODO: Implement optimistic updates
  // For now, return a basic state structure
  return {
    data: null,
    loading: false,
    error: 'useUnifiedOptimisticUpdate not yet implemented',
    refetch: async () => {}
  };
}
