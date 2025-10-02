// src/hooks/useStandardizedProgress.ts
import { useApiList, useApiMutation, useApiGet } from './useStandardizedApi';
import { courseProgressSchema, userProfileSchema } from '@/lib/schemas';
import { CACHE_STRATEGY } from '@/lib/cache-strategy';
import type { CourseProgress, UserProfile } from '@/lib/schemas';

// ========================================
// STANDARDIZED PROGRESS HOOKS
// ========================================

export function useProgress() {
  return useApiList(
    '/api/progress',
    courseProgressSchema.array(),
    {
      cacheKey: 'progress',
      cacheTTL: CACHE_STRATEGY.progressData,
    }
  );
}

export function useCourseProgress(courseRoute: string) {
  const coursePath = courseRoute.replace('/', '');
  
  const progressQuery = useApiGet(
    `/api/courses/${coursePath}/progress`,
    courseProgressSchema,
    {
      cacheKey: `course-progress-${coursePath}`,
      cacheTTL: CACHE_STRATEGY.progressData,
      enabled: !!coursePath,
    }
  );

  const updateProgressMutation = useApiMutation(
    `/api/courses/${coursePath}/progress`,
    courseProgressSchema
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

export function useQuestionEvents(courseRoute: string) {
  const coursePath = courseRoute.replace('/', '');
  
  const recordQuestionMutation = useApiMutation(
    `/api/courses/${coursePath}/questions`,
    courseProgressSchema
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

export function useUserProfile() {
  const profileQuery = useApiGet(
    '/api/user/profile',
    userProfileSchema,
    {
      cacheKey: 'user-profile',
      cacheTTL: CACHE_STRATEGY.userData,
    }
  );

  const updateProfileMutation = useApiMutation(
    '/api/user/profile',
    userProfileSchema
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
