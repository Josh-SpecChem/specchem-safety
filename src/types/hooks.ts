import type { 
  Profile,
  Course,
  Enrollment,
  Progress,
  AdminRoleRecord,
  Plant,
  UserWithDetails,
  CourseWithStats,
  EnrollmentWithDetails,
  AnalyticsData,
  DashboardStats,
  EnrollmentStats,
  CourseStatistics,
  UserFilters,
  CourseFilters,
  EnrollmentFilters,
  UseUsersReturn,
  UseCoursesReturn,
  UseCreateCourseReturn,
  CreateCourseData,
  UpdateCourseData,
  CreateEnrollmentData,
  UpdateEnrollmentData,
} from '@/types';

// ========================================
// BASE HOOK TYPES
// ========================================

// Re-export types from centralized types for convenience
export type {
  UserWithDetails,
  CourseWithStats,
  EnrollmentWithDetails,
  AnalyticsData,
  DashboardStats,
  EnrollmentStats,
  CourseStatistics,
  UserFilters,
  CourseFilters,
  EnrollmentFilters,
  UseUsersReturn,
  UseCoursesReturn,
  UseCreateCourseReturn,
  CreateCourseData,
  UpdateCourseData,
  CreateEnrollmentData,
  UpdateEnrollmentData,
};
