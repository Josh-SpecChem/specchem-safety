/**
 * Centralized API types for SpecChem Safety Training system
 * Provides type-safe interfaces for all API communication
 */

import type { PaginatedResult } from './database';

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedResult<T>> {}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  statusCode?: number;
  field?: string;
}

// ========================================
// API REQUEST TYPES
// ========================================

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  role?: string;
  plantId: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  role?: string;
  isActive?: boolean;
  plantId?: string;
}

export interface CreateEnrollmentRequest {
  userId: string;
  courseId: string;
}

export interface UpdateEnrollmentRequest {
  status?: 'enrolled' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface UpdateProgressRequest {
  progressPercent: number;
  currentSection?: string;
  eventType?: 'view_section' | 'start_course' | 'complete_course';
}

// ========================================
// QUERY PARAMETER TYPES
// ========================================

export interface UserQueryParams {
  search?: string;
  plantId?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CourseQueryParams {
  isPublished?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EnrollmentQueryParams {
  plantId?: string;
  courseId?: string;
  userId?: string;
  status?: 'enrolled' | 'in_progress' | 'completed';
  page?: number;
  limit?: number;
}

// ========================================
// ANALYTICS TYPES
// ========================================

export interface AnalyticsRequest {
  plantId?: string;
  courseId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsResponse {
  plantStats?: PlantAnalytics;
  courseStats?: CourseAnalytics;
  userStats?: UserAnalytics;
}

export interface PlantAnalytics {
  plantId: string;
  plantName: string;
  totalUsers: number;
  activeEnrollments: number;
  completionRate: number;
  averageProgress: number;
  overdueCount: number;
}

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  totalEnrollments: number;
  completions: number;
  averageScore: number;
  averageTimeSpent: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  completionRate: number;
}

// ========================================
// HOOK RETURN TYPES
// ========================================

export interface UseUsersReturn {
  data: UserWithDetails[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  setPage: (page: number) => void;
}

export interface UseCoursesReturn {
  data: CourseWithStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseCreateCourseReturn {
  data: CourseWithStats | null;
  loading: boolean;
  mutating: boolean;
  error: string | null;
  mutate: (data: CreateCourseData) => Promise<boolean>;
}

// ========================================
// MUTATION DATA TYPES
// ========================================

export interface CreateCourseData {
  title: string;
  slug: string;
  version?: string;
  isPublished?: boolean;
}

export interface UpdateCourseData {
  title?: string;
  slug?: string;
  version?: string;
  isPublished?: boolean;
}

export interface CreateEnrollmentData {
  userId: string;
  courseId: string;
}

export interface UpdateEnrollmentData {
  status?: 'enrolled' | 'in_progress' | 'completed';
  completedAt?: string;
}

// ========================================
// IMPORT TYPES FROM DATABASE
// ========================================

import type {
  UserWithDetails,
  CourseWithStats,
  EnrollmentWithDetails,
} from './database';
