/**
 * Comprehensive centralized database types for SpecChem Safety Training system
 * Consolidates all scattered type definitions into a single source of truth
 */

import type { z } from 'zod';
import type {
  // Base schemas
  profileSchema,
  courseSchema,
  plantSchema,
  enrollmentSchema,
  progressSchema,
  adminRoleRecordSchema,
  activityEventSchema,
  questionEventSchema,
  
  // CRUD schemas
  createProfileSchema,
  updateProfileSchema,
  createCourseSchema,
  updateCourseSchema,
  createPlantSchema,
  updatePlantSchema,
  createEnrollmentSchema,
  updateEnrollmentSchema,
  createProgressSchema,
  updateProgressSchema,
  
  // Filter schemas
  userFiltersSchema,
  courseFiltersSchema,
  enrollmentFiltersSchema,
  progressFiltersSchema,
  plantFilterSchema,
  
  // Composite schemas
  userWithDetailsSchema,
  courseWithStatsSchema,
  enrollmentWithDetailsSchema,
  analyticsDataSchema,
  dashboardStatsSchema,
  enrollmentStatsSchema,
  courseStatisticsSchema,
} from '@/lib/schemas';

// ========================================
// BASE ENTITY TYPES (from Zod schemas)
// ========================================

export type Profile = z.infer<typeof profileSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Plant = z.infer<typeof plantSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type Progress = z.infer<typeof progressSchema>;
export type AdminRoleRecord = z.infer<typeof adminRoleRecordSchema>;
export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type QuestionEvent = z.infer<typeof questionEventSchema>;

// ========================================
// CRUD OPERATION TYPES
// ========================================

export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;
export type CreatePlant = z.infer<typeof createPlantSchema>;
export type UpdatePlant = z.infer<typeof updatePlantSchema>;
export type CreateEnrollment = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollment = z.infer<typeof updateEnrollmentSchema>;
export type CreateProgress = z.infer<typeof createProgressSchema>;
export type UpdateProgress = z.infer<typeof updateProgressSchema>;

// ========================================
// FILTER TYPES
// ========================================

export type UserFilters = z.infer<typeof userFiltersSchema>;
export type CourseFilters = z.infer<typeof courseFiltersSchema>;
export type EnrollmentFilters = z.infer<typeof enrollmentFiltersSchema>;
export type ProgressFilters = z.infer<typeof progressFiltersSchema>;
export type PlantFilters = z.infer<typeof plantFilterSchema>;

// ========================================
// EXTENDED TYPES WITH RELATIONSHIPS
// ========================================

export interface ProfileWithDetails extends Profile {
  plant: Plant;
  adminRoles: AdminRoleRecord[];
  enrollments: EnrollmentWithDetails[];
}

export interface CourseWithDetails extends Course {
  enrollments: EnrollmentWithDetails[];
  progress: ProgressWithDetails[];
  statistics: CourseStatistics;
}

export interface EnrollmentWithDetails extends Enrollment {
  profile: Profile;
  course: Course;
  plant: Plant;
  progress?: Progress;
}

export interface ProgressWithDetails extends Progress {
  profile: Profile;
  course: Course;
  plant: Plant;
}

export interface PlantWithDetails extends Plant {
  profiles: Profile[];
  enrollments: Enrollment[];
  statistics: PlantStatistics;
}

// ========================================
// STATISTICS TYPES
// ========================================

export interface CourseStatistics {
  totalEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
  completionRate: number;
}

export interface PlantStatistics {
  totalUsers: number;
  activeEnrollments: number;
  completionRate: number;
  averageProgress: number;
}

// ========================================
// PAGINATION TYPES
// ========================================

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ========================================
// DATABASE OPERATION TYPES
// ========================================

export interface DatabaseResult<T> {
  data: T;
  success: true;
}

export interface DatabaseErrorResult {
  success: false;
  error: string;
  code?: string;
}

export type DatabaseResponse<T> = DatabaseResult<T> | DatabaseErrorResult;

// ========================================
// ANALYTICS TYPES
// ========================================

export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  totalEnrollments: number;
  completedCourses: number;
  overallCompletionRate: number;
}

export interface CoursePerformance {
  courseId: string;
  courseName: string;
  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: number;
  averageScore: number;
  averageTimeToComplete: number;
}

export interface PlantPerformance {
  plantId: string;
  plantName: string;
  totalUsers: number;
  activeEnrollments: number;
  completedCourses: number;
  completionRate: number;
}

export interface QuestionStats {
  questionKey: string;
  totalAttempts: number;
  correctAttempts: number;
  uniqueUsers: number;
  successRate: number;
}

// ========================================
// USER CONTEXT TYPES
// ========================================

export interface UserContext {
  userId: string;
  plantId: string;
  accessiblePlants: string[];
  roles: Array<{
    role: 'hr_admin' | 'dev_admin' | 'plant_manager';
    plantId?: string;
  }>;
}

// ========================================
// API REQUEST/RESPONSE TYPES
// ========================================

// Note: API request/response types are defined in api.ts
// This section is kept for backward compatibility only

// ========================================
// HOOK-SPECIFIC TYPES (from schemas)
// ========================================

export type UserWithDetails = z.infer<typeof userWithDetailsSchema>;
export type CourseWithStats = z.infer<typeof courseWithStatsSchema>;
export type EnrollmentWithDetails = z.infer<typeof enrollmentWithDetailsSchema>;
export type AnalyticsData = z.infer<typeof analyticsDataSchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type EnrollmentStats = z.infer<typeof enrollmentStatsSchema>;
export type CourseStatistics = z.infer<typeof courseStatisticsSchema>;

// ========================================
// UTILITY TYPES
// ========================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ========================================
// LEGACY COMPATIBILITY TYPES
// ========================================

// For backward compatibility with existing code
export type UserProfile = Profile;
export type CourseProgress = Progress;
export type UpdateUserProfile = UpdateUserRequest;
export type ProfileWithRoles = ProfileWithDetails;