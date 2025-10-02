import { useApiGet, useApiMutation } from './useStandardizedApi';
import { courseWithStatsSchema } from '@/lib/schemas';
import { CACHE_STRATEGY, CACHE_INVALIDATION } from '@/lib/cache-strategy';
import type { 
  CourseWithStats, 
  CourseStatistics, 
  CreateCourseData, 
  UpdateCourseData,
  UseCoursesReturn,
  UseCreateCourseReturn
} from '@/types/hooks';

export function useCourses(): UseCoursesReturn {
  return useApiGet(
    '/api/admin/courses',
    courseWithStatsSchema,
    {
      cacheKey: 'courses-with-stats',
      cacheTTL: CACHE_STRATEGY.courseData,
    }
  );
}

export function useCreateCourse(): UseCreateCourseReturn {
  const mutation = useApiMutation(
    '/api/admin/courses',
    courseWithStatsSchema,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );

  return {
    data: null, // Mutation doesn't return data immediately
    loading: mutation.loading,
    mutating: mutation.loading,
    error: mutation.error,
    mutate: async (data: CreateCourseData) => {
      const result = await mutation.postData(data);
      return !!result;
    }
  };
}

export function useUpdateCourse(courseId: string) {
  return useApiMutation(
    `/api/admin/courses/${courseId}`,
    courseWithStatsSchema,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );
}

export function useToggleCourseStatus(courseId: string) {
  return useApiMutation(
    `/api/admin/courses/${courseId}`,
    courseWithStatsSchema,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );
}