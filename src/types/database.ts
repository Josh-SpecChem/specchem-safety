/**
 * Comprehensive centralized database types for SpecChem Safety Training system
 * Consolidates all scattered type definitions into a single source of truth
 */

import type {
    ActivityEvent,
    AdminRoleRecord,
    AnalyticsData,
    Course,
    CourseFilter,
    CourseStatistics,
    CreateCourse,
    CreateEnrollment,
    CreatePlant,
    CreateProfile,
    CreateProgress,
    DashboardStats,
    DeepPartial,
    Enrollment,
    EnrollmentFilter,
    EnrollmentStats,
    EnrollmentWithRelations,
    Optional,
    PaginatedResult,
    PaginationParams,
    Plant,
    PlantFilter,
    PlantStatistics,
    Profile,
    ProfileWithPlant,
    Progress,
    ProgressFilter,
    QuestionEvent,
    RequiredFields,
    UpdateCourse,
    UpdateEnrollment,
    UpdatePlant,
    UpdateProfile,
    UpdateProgress,
    UserFilter
} from '@/contracts';

// ========================================
// RE-EXPORTED TYPES (from contracts)
// ========================================

// Re-export base entity types for components
export { ActivityEvent, AdminRoleRecord, Course, Enrollment, Plant, Profile, Progress, QuestionEvent };

// Re-export CRUD operation types for components  
    export { CreateCourse, CreateEnrollment, CreatePlant, CreateProfile, CreateProgress, UpdateCourse, UpdateEnrollment, UpdatePlant, UpdateProfile, UpdateProgress };

// Re-export filter types for components
    export { CourseFilter, EnrollmentFilter, PaginationParams, PlantFilter, ProgressFilter, UserFilter };

// Re-export utility types
    export { DeepPartial, Optional, PaginatedResult, RequiredFields };

// Re-export statistics types
    export { AnalyticsData, CourseStatistics, DashboardStats, EnrollmentStats, PlantStatistics };

// Additional type aliases for backward compatibility
export type UserFilters = UserFilter;
export type EnrollmentFilters = EnrollmentFilter;
export type ProgressFilters = ProgressFilter;
export type CourseFilters = CourseFilter;
export type PlantFilters = PlantFilter;

// ========================================
// EXTENDED TYPES WITH RELATIONSHIPS
// ========================================

// ProfileWithDetails is imported from contracts as ProfileWithPlant
export type ProfileWithDetails = ProfileWithPlant;

export interface CourseWithDetails extends Course {
  enrollments: EnrollmentWithRelations[];
  progresses: ProgressWithDetails[];
  statistics: CourseStatistics;
}

// EnrollmentWithDetails is imported from contracts as EnrollmentWithRelations
export type EnrollmentWithDetails = EnrollmentWithRelations;

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
// STATISTICS TYPES (Extended from contracts)
// ========================================

// CourseStatistics and PlantStatistics are imported from contracts
// Additional statistics interfaces for extended functionality

// ========================================
// PAGINATION TYPES
// ========================================

// PaginationParams and PaginatedResult are imported from contracts
// (already available as PaginationParams and PaginatedResult)

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

// UserContext is imported from contracts
// Re-export for backward compatibility
export type { UserContext } from '@/contracts';

// ========================================
// API REQUEST/RESPONSE TYPES
// ========================================

// Note: API request/response types are defined in api.ts
// This section is kept for backward compatibility only

// ========================================
// HOOK-SPECIFIC TYPES
// ========================================

// Hook-specific types are defined above or imported from contracts
// Additional aliases for backward compatibility
export type UserWithDetails = ProfileWithDetails;
export type CourseWithStats = CourseWithDetails;

// ========================================
// UTILITY TYPES
// ========================================

// Utility types are imported from contracts
// (already available as Optional, RequiredFields, DeepPartial)

// ========================================
// ADMIN-SPECIFIC TYPES
// ========================================

export interface AdminUser extends Profile {
  department?: string;
  phone?: string;
  enrollments?: AdminEnrollment[];
  plant?: {
    id: string;
    name: string;
    location?: string;
  };
}

export interface AdminEnrollment extends Enrollment {
  progress: number;
  user?: AdminUser;
  course?: AdminCourse;
}

export interface AdminCourse extends Course {
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  isActive: boolean;
  modules?: AdminModule[];
  enrollments?: AdminEnrollment[];
}

export interface AdminModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isActive: boolean;
  sections?: AdminSection[];
}

export interface AdminSection {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'video' | 'quiz' | 'interactive';
  duration: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalModules: number;
  totalSections: number;
}

// ========================================
// LEGACY COMPATIBILITY TYPES
// ========================================

// For backward compatibility with existing code
export type UserProfile = Profile;
export type CourseProgress = Progress;
export type UpdateUserProfile = UpdateProfile;
export type ProfileWithRoles = ProfileWithDetails;