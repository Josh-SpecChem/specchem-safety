import { useApiList, useApiGet } from './useStandardizedApi';
import { enrollmentWithDetailsSchema, enrollmentStatsSchema } from '@/lib/schemas';
import { CACHE_STRATEGY } from '@/lib/cache-strategy';
import type { EnrollmentFilters } from '@/types/hooks';

export function useEnrollments(filters: EnrollmentFilters = {}) {
  return useApiList(
    '/api/admin/enrollments',
    enrollmentWithDetailsSchema.array(),
    filters,
    {
      cacheKey: 'enrollments',
      cacheTTL: CACHE_STRATEGY.enrollmentData,
      pageSize: 25,
    }
  );
}

export function useEnrollmentStats() {
  return useApiGet(
    '/api/admin/enrollments/stats',
    enrollmentStatsSchema,
    {
      cacheKey: 'enrollment-stats',
      cacheTTL: CACHE_STRATEGY.enrollmentData,
    }
  );
}