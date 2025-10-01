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
  return useApiMutation(
    '/api/admin/courses',
    courseWithStatsSchema,
    {
      method: 'POST',
      invalidateCache: CACHE_INVALIDATION.onCourseUpdate,
      onSuccess: () => {
        // Optional: Show success notification
      },
    }
  );
}

export function useUpdateCourse(courseId: string) {
  return useApiMutation(
    `/api/admin/courses/${courseId}`,
    courseWithStatsSchema,
    {
      method: 'PATCH',
      invalidateCache: [...CACHE_INVALIDATION.onCourseUpdate, `course-${courseId}`],
    }
  );
}

export function useToggleCourseStatus(courseId: string) {
  return useApiMutation(
    `/api/admin/courses/${courseId}`,
    courseWithStatsSchema,
    {
      method: 'PATCH',
      invalidateCache: CACHE_INVALIDATION.onCourseUpdate,
    }
  );
}