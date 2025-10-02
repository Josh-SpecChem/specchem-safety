/**
 * Centralized API types for SpecChem Safety Training system
 * Provides type-safe interfaces for all API communication
 */

import type { PaginatedResult } from './database';
import { NextRequest, NextResponse } from 'next/server';

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
// ADMIN API TYPES
// ========================================

export interface AdminFilterOptions {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  plantId?: string;
  courseId?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AdminError {
  message: string;
  code?: string;
  field?: string;
}

export interface AdminApiResponse<T> {
  data: T;
  error?: AdminError;
  loading: boolean;
}

// ========================================
// ROUTE HANDLER TYPES
// ========================================

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface RouteContext {
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

export interface AuthContext {
  profile: import('@/contracts').Profile;
  adminRoles: string[];
  userId: string;
  plantId?: string;
}

export interface ValidationErrorDetails {
  field: string;
  message: string;
  code: string;
}

export type RouteHandler<T = unknown> = (
  request: NextRequest,
  context: RouteContext,
  ...args: unknown[]
) => Promise<NextResponse<T>>;

export type AuthRouteHandler<T = unknown> = (
  request: NextRequest,
  context: RouteContext,
  authContext: AuthContext,
  ...args: unknown[]
) => Promise<NextResponse<T>>;

// ========================================
// CRUD OPERATION INTERFACES
// ========================================

export interface CrudOperations<T, CreateT, UpdateT> {
  list: (params: Record<string, unknown>) => Promise<{ data: T[]; pagination?: import('@/contracts').PaginationParams }>;
  get: (id: string) => Promise<T>;
  create: (data: CreateT) => Promise<T>;
  update: (id: string, data: UpdateT) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

export interface ListOperations<T> {
  list: (params: Record<string, unknown>) => Promise<{ data: T[]; pagination?: import('@/contracts').PaginationParams }>;
}

export interface AnalyticsOperations<T> {
  getAnalytics: (params: Record<string, unknown>) => Promise<T>;
}

// ========================================
// MIDDLEWARE AND AUTHENTICATION TYPES
// ========================================

export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface SupabaseClient {
  auth: {
    getUser: () => Promise<{ data: { user: SupabaseUser | null } }>;
    getSession: () => Promise<{ data: { session: unknown | null } }>;
  };
}

export interface AdminRole {
  id: string;
  userId: string;
  role: 'hr_admin' | 'dev_admin' | 'plant_manager';
  plantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserContext {
  userId: string;
  plantId: string;
  accessiblePlants: string[];
  roles: AdminRole[];
}

export interface DatabaseQuery {
  where?: (column: string, value: unknown) => unknown;
  select?: () => unknown;
  from?: (table: string) => unknown;
}

// ========================================
// VALIDATION SCHEMA TYPES
// ========================================

export interface ValidationSchema {
  parse: (data: unknown) => unknown;
  safeParse: (data: unknown) => { success: boolean; data?: unknown; error?: unknown };
}

export interface UnifiedApiOptions {
  cacheKey?: string;
  cacheTTL?: number;
  enabled?: boolean;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface UnifiedApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ========================================
// IMPORT TYPES FROM DATABASE
// ========================================

import type {
  UserWithDetails,
  CourseWithStats,
  EnrollmentWithDetails,
  AdminUser,
  AdminCourse,
  AdminEnrollment,
  AdminStats,
} from './database';

// Import PaginationParams from contracts
export type { PaginationParams } from '@/contracts';
