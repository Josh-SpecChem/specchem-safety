// src/hooks/useUnifiedAdmin.ts
// Unified admin hooks using the standardized API patterns
import type {
    EnrollmentFilter,
    UserFilter
} from '@/contracts';
import { CACHE_STRATEGY } from '@/lib/cache-strategy';
import {
    analyticsDataSchema,
    courseWithStatsSchema,
    dashboardStatsSchema,
    enrollmentStatsSchema,
    enrollmentWithDetailsSchema,
    userWithDetailsSchema
} from '@/lib/schemas';
import { useApiGet, useApiPatch, useApiPost } from './useStandardizedApi';

// ========================================
// UNIFIED ENROLLMENT HOOKS
// ========================================

/**
 * Unified hook for managing enrollments
 * Replaces: useEnrollments.useEnrollments()
 */
export function useEnrollments(filters: EnrollmentFilter = { page: 1, limit: 50 }) {
  return useApiGet(
    '/api/admin/enrollments',
    enrollmentWithDetailsSchema.array(),
    {
      cacheKey: `enrollments-${JSON.stringify(filters)}`,
      cacheTTL: CACHE_STRATEGY.enrollmentData,
    }
  );
}

/**
 * Unified hook for enrollment statistics
 * Replaces: useEnrollments.useEnrollmentStats()
 */
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

// ========================================
// UNIFIED USER HOOKS
// ========================================

/**
 * Unified hook for managing users
 * Replaces: useUsers.useUsers()
 */
export function useUsers(filters: UserFilter = { page: 1, limit: 50 }) {
  return useApiGet(
    '/api/admin/users',
    userWithDetailsSchema.array(),
    {
      cacheKey: `users-${JSON.stringify(filters)}`,
      cacheTTL: CACHE_STRATEGY.userData,
    }
  );
}

/**
 * Unified hook for individual user
 * Replaces: useUsers.useUser()
 */
export function useUser(userId: string) {
  return useApiGet(
    `/api/admin/users/${userId}`,
    userWithDetailsSchema,
    {
      cacheKey: `user-${userId}`,
      cacheTTL: CACHE_STRATEGY.userData,
      enabled: !!userId,
    }
  );
}

// ========================================
// UNIFIED COURSE HOOKS
// ========================================

/**
 * Unified hook for managing courses
 * Replaces: useCourses.useCourses()
 */
export function useCourses() {
  return useApiGet(
    '/api/admin/courses',
    courseWithStatsSchema.array(),
    {
      cacheKey: 'courses',
      cacheTTL: CACHE_STRATEGY.courseData,
    }
  );
}

/**
 * Unified hook for creating courses
 * Replaces: useCourses.useCreateCourse()
 */
export function useCreateCourse() {
  return useApiPost(
    '/api/admin/courses',
    courseWithStatsSchema,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );
}

/**
 * Unified hook for updating courses
 * Replaces: useCourses.useUpdateCourse()
 */
export function useUpdateCourse(courseId: string) {
  return useApiPatch(
    `/api/admin/courses/${courseId}`,
    courseWithStatsSchema,
    {
      retryCount: 3,
      retryDelay: 1000,
    }
  );
}

// ========================================
// UNIFIED ANALYTICS HOOKS
// ========================================

/**
 * Unified hook for analytics data
 * Replaces: useAnalytics.useAnalytics()
 */
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

/**
 * Unified hook for dashboard statistics
 * Replaces: useAnalytics.useDashboardStats()
 */
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

// ========================================
// HOOK COMPOSITION EXAMPLES
// ========================================

/**
 * Example of composing multiple admin hooks for dashboard
 */
export function useAdminDashboard() {
  const stats = useDashboardStats();
  const users = useUsers({ page: 1, limit: 5 });
  const enrollments = useEnrollments({ page: 1, limit: 5 });
  
  return {
    stats: stats.data,
    users: users.data,
    enrollments: enrollments.data,
    isLoading: stats.loading || users.loading || enrollments.loading,
    hasError: !!(stats.error || users.error || enrollments.error),
    refetch: () => {
      stats.refetch();
      users.refetch();
      enrollments.refetch();
    }
  };
}
