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
import { 
  courseProgressSchema, 
  userProfileSchema,
  type CourseProgress,
  type UserProfile
} from '@/lib/schemas';

/**
 * Custom hooks for API integration with SpecChem Safety Training database
 * Enhanced with Zod validation, error handling, caching, and retry logic
 * 
 * Note: These hooks maintain backward compatibility while using the new
 * standardized patterns internally.
 */

/**
 * Hook for managing user progress data
 */
export function useProgress() {
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get from cache first
      const cacheKey = createCacheKey('/api/progress');
      const cached = enhancedCache.get<CourseProgress[]>(cacheKey);
      if (cached) {
        setProgress(cached);
        setLoading(false);
        return;
      }
      
      const result = await withRetryEnhanced(() => 
        apiGet('/api/progress', courseProgressSchema.array())
      );
      
      if (result.success && result.data) {
        setProgress(result.data);
        enhancedCache.set(cacheKey, result.data, {
          ttl: CACHE_STRATEGY.progressData,
          key: cacheKey,
        });
      } else {
        setError(result.error || 'Failed to fetch progress');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    loading,
    error,
    refetch: fetchProgress,
  };
}

/**
 * Hook for managing course-specific progress
 */
export function useCourseProgress(courseRoute: string) {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchCourseProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coursePath = courseRoute.replace('/', '');
      const url = `/api/courses/${coursePath}/progress`;
      
      // Try cache first
      const cacheKey = createCacheKey(url);
      const cached = enhancedCache.get<CourseProgress>(cacheKey);
      if (cached) {
        setProgress(cached);
        setLoading(false);
        return;
      }
      
      const result = await withRetryEnhanced(() => 
        apiGet(url, courseProgressSchema)
      );
      
      if (result.success && result.data) {
        setProgress(result.data);
        enhancedCache.set(cacheKey, result.data, {
          ttl: CACHE_STRATEGY.progressData,
          key: cacheKey,
        });
      } else {
        setError(result.error || 'Failed to fetch course progress');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [courseRoute]);

  const updateProgress = useCallback(async (
    progressPercent: number,
    currentSection?: string,
    eventType?: 'view_section' | 'start_course' | 'complete_course'
  ) => {
    try {
      setUpdating(true);
      setError(null);
      
      const coursePath = courseRoute.replace('/', '');
      const url = `/api/courses/${coursePath}/progress`;
      
      const result = await withRetryEnhanced(() => 
        apiPost(url, {
          progressPercent,
          currentSection,
          eventType,
        }, courseProgressSchema)
      );
      
      if (result.success && result.data) {
        setProgress(result.data);
        
        // Clear relevant caches
        enhancedCache.clear(createCacheKey(url));
        enhancedCache.clear(createCacheKey('/api/progress'));
        
        return true;
      } else {
        setError(result.error || 'Failed to update progress');
        return false;
      }
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setUpdating(false);
    }
  }, [courseRoute]);

  useEffect(() => {
    fetchCourseProgress();
  }, [fetchCourseProgress]);

  return {
    progress,
    loading,
    updating,
    error,
    updateProgress,
    refetch: fetchCourseProgress,
  };
}

/**
 * Hook for recording question responses
 */
export function useQuestionEvents(courseRoute: string) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordQuestion = useCallback(async (
    sectionKey: string,
    questionKey: string,
    isCorrect: boolean,
    attemptIndex: number = 1,
    responseMeta?: Record<string, string | number | boolean | null>
  ) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const coursePath = courseRoute.replace('/', '');
      const url = `/api/courses/${coursePath}/questions`;
      
      const result = await apiPost(url, {
        sectionKey,
        questionKey,
        isCorrect,
        attemptIndex,
        responseMeta,
      });
      
      if (result.success) {
        return true;
      } else {
        setError(result.error || 'Failed to record question');
        return false;
      }
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [courseRoute]);

  return {
    recordQuestion,
    submitting,
    error,
  };
}

/**
 * Hook for user profile management
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try cache first
      const cacheKey = createCacheKey('/api/user/profile');
      const cached = enhancedCache.get<UserProfile>(cacheKey);
      if (cached) {
        setProfile(cached);
        setLoading(false);
        return;
      }
      
      const result = await withRetryEnhanced(() =>
        apiGet('/api/user/profile', userProfileSchema)
      );
      
      if (result.success && result.data) {
        setProfile(result.data);
        enhancedCache.set(cacheKey, result.data, {
          ttl: CACHE_STRATEGY.userData,
          key: cacheKey,
        });
      } else {
        setError(result.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
  }) => {
    try {
      setUpdating(true);
      setError(null);
      
      const result = await withRetryEnhanced(() =>
        apiPatch('/api/user/profile', updates, userProfileSchema)
      );
      
      if (result.success && result.data) {
        setProfile(result.data);
        
        // Clear profile cache
        enhancedCache.clear(createCacheKey('/api/user/profile'));
        
        return true;
      } else {
        setError(result.error || 'Failed to update profile');
        return false;
      }
    } catch (err) {
      setError(handleApiError(err));
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updating,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}