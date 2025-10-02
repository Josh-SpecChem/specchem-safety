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
  UserFilter,
  CourseFilter,
  EnrollmentFilter,
  UseUsersReturn,
  UseCoursesReturn,
  UseCreateCourseReturn,
  CreateCourseData,
  UpdateCourseData,
  CreateEnrollmentData,
  UpdateEnrollmentData,
} from '@/types';
import { z } from 'zod';

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
  UserFilter,
  CourseFilter,
  EnrollmentFilter,
  UseUsersReturn,
  UseCoursesReturn,
  UseCreateCourseReturn,
  CreateCourseData,
  UpdateCourseData,
  CreateEnrollmentData,
  UpdateEnrollmentData,
};

// ========================================
// FORM HOOK TYPES
// ========================================

export interface FormConfig<T> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
  onError?: (error: Error) => void;
}

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export interface FormActions<T> {
  updateField: (field: keyof T, value: T[keyof T]) => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
  clearErrors: () => void;
  setFieldError: (field: keyof T, error: string) => void;
}

// ========================================
// API HOOK TYPES
// ========================================

export interface BaseHookOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: boolean | number;
}

export interface ApiHookOptions<T> extends BaseHookOptions {
  endpoint: string;
  queryKey: string[];
  params?: Record<string, unknown>;
  schema?: z.ZodType<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface MutationHookOptions<TData, TVariables> extends BaseHookOptions {
  endpoint: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  queryKey?: string[];
  schema?: z.ZodType<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  optimisticUpdate?: {
    queryKey: string[];
    updater: (oldData: TData, variables: TVariables) => TData;
  };
}
