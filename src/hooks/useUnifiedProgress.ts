// src/hooks/useUnifiedProgress.ts
import { useApiGet, useApiPost } from './useStandardizedApi';
import { courseProgressSchema, userProfileSchema } from '@/lib/schemas';
import { CACHE_STRATEGY } from '@/lib/cache-strategy';
import type { CourseProgress, UserProfile } from '@/lib/schemas';

// ========================================
// UNIFIED PROGRESS HOOKS
// ========================================

/**
 * Unified hook for managing user progress data
 * Replaces: useApi.useProgress() and useStandardizedProgress.useProgress()
 */
export function useProgress() {
  return useApiGet(
    '/api/progress',
    courseProgressSchema.array(),
    {
      cacheKey: 'user-progress',
      cacheTTL: CACHE_STRATEGY.userData,
    }
  );
}

/**
 * Unified hook for managing course-specific progress
 * Replaces: useApi.useCourseProgress() and useStandardizedProgress.useCourseProgress()
 */
export function useCourseProgress(courseRoute: string) {
  const coursePath = courseRoute.replace('/', '');
  
  const progressQuery = useApiGet(
    `/api/courses/${coursePath}/progress`,
    courseProgressSchema,
    {
      cacheKey: `course-progress-${coursePath}`,
      cacheTTL: CACHE_STRATEGY.courseData,
      enabled: !!coursePath,
    }
  );

  const updateProgressMutation = useApiPost(
    `/api/courses/${coursePath}/progress`,
    courseProgressSchema,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );

  const updateProgress = async (
    progressPercent: number,
    currentSection?: string,
    eventType?: 'view_section' | 'start_course' | 'complete_course'
  ) => {
    return updateProgressMutation.postData({
      progressPercent,
      currentSection,
      eventType,
    });
  };

  return {
    progress: progressQuery.data,
    loading: progressQuery.loading,
    updating: updateProgressMutation.loading,
    error: progressQuery.error || updateProgressMutation.error,
    updateProgress,
    refetch: progressQuery.refetch,
  };
}

/**
 * Unified hook for recording question responses
 * Replaces: useApi.useQuestionEvents() and useStandardizedProgress.useQuestionEvents()
 */
export function useQuestionEvents(courseRoute: string) {
  const coursePath = courseRoute.replace('/', '');
  
  const recordQuestionMutation = useApiPost(
    `/api/courses/${coursePath}/questions`,
    undefined,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );

  const recordQuestion = async (
    sectionKey: string,
    questionKey: string,
    isCorrect: boolean,
    attemptIndex: number = 1,
    responseMeta?: Record<string, string | number | boolean | null>
  ) => {
    return recordQuestionMutation.postData({
      sectionKey,
      questionKey,
      isCorrect,
      attemptIndex,
      responseMeta,
    });
  };

  return {
    recordQuestion,
    submitting: recordQuestionMutation.loading,
    error: recordQuestionMutation.error,
  };
}

/**
 * Unified hook for user profile management
 * Replaces: useApi.useUserProfile() and useStandardizedProgress.useUserProfile()
 */
export function useUserProfile() {
  const profileQuery = useApiGet(
    '/api/user/profile',
    userProfileSchema,
    {
      cacheKey: 'user-profile',
      cacheTTL: CACHE_STRATEGY.userData,
    }
  );

  const updateProfileMutation = useApiPost(
    '/api/user/profile',
    userProfileSchema,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );

  const updateProfile = async (updates: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
  }) => {
    return updateProfileMutation.postData(updates);
  };

  return {
    profile: profileQuery.data,
    loading: profileQuery.loading,
    updating: updateProfileMutation.loading,
    error: profileQuery.error || updateProfileMutation.error,
    updateProfile,
    refetch: profileQuery.refetch,
  };
}

// ========================================
// HOOK COMPOSITION EXAMPLES
// ========================================

/**
 * Example of composing multiple hooks for complex functionality
 */
export function useCourseProgressWithAnalytics(courseRoute: string) {
  const progress = useCourseProgress(courseRoute);
  const questionEvents = useQuestionEvents(courseRoute);
  
  return {
    ...progress,
    ...questionEvents,
    // Combined loading state
    isLoading: progress.loading || questionEvents.submitting,
    // Combined error state
    hasError: !!(progress.error || questionEvents.error),
  };
}
