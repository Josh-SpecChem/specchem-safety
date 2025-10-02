import { useApiList, useApiGet } from './useStandardizedApi';
import { enrollmentWithDetailsSchema, enrollmentStatsSchema } from '@/lib/schemas';
import { CACHE_STRATEGY } from '@/lib/cache-strategy';
import type { EnrollmentFilter as EnrollmentFilters } from '@/types/hooks';

export function useEnrollments(filters: EnrollmentFilters = { page: 1, limit: 20 }) {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  const queryString = queryParams.toString();
  const endpoint = `/api/admin/enrollments${queryString ? `?${queryString}` : ''}`;

  return useApiList(
    endpoint,
    enrollmentWithDetailsSchema.array(),
    {
      cacheKey: `enrollments-${queryString}`,
      cacheTTL: CACHE_STRATEGY.enrollmentData,
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