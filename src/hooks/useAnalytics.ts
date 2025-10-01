import { useApiGet } from './useStandardizedApi';
import { analyticsDataSchema, dashboardStatsSchema } from '@/lib/schemas';
import { CACHE_STRATEGY } from '@/lib/cache-strategy';

export function useAnalytics(plantId?: string, courseId?: string) {
  return useApiGet(
    '/api/admin/analytics',
    analyticsDataSchema,
    {
      cacheKey: `analytics-${plantId || 'all'}-${courseId || 'all'}`,
      cacheTTL: CACHE_STRATEGY.analyticsData,
      enabled: !!(plantId || courseId),
    }
  );
}

export function useDashboardStats() {
  return useApiGet(
    '/api/admin/dashboard/stats',
    dashboardStatsSchema,
    {
      cacheKey: 'dashboard-stats',
      cacheTTL: CACHE_STRATEGY.analyticsData,
    }
  );
}