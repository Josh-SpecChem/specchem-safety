/**
 * Validation Utilities for API Route Standardization
 * Provides common validation schemas and utilities
 */

import { z } from 'zod';

export const CommonSchemas = {
  // Pagination schemas
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10)
  }),

  // ID schema
  id: z.string().uuid(),

  // Search schema
  search: z.object({
    q: z.string().optional(),
    sort: z.enum(['asc', 'desc']).default('desc'),
    sortBy: z.string().optional()
  }),

  // Date range schema
  dateRange: z.object({
    start: z.coerce.date().optional(),
    end: z.coerce.date().optional()
  }),

  // User filters
  userFilters: z.object({
    plantId: z.string().uuid().optional(),
    role: z.enum(['admin', 'instructor', 'user']).optional(),
    status: z.enum(['active', 'suspended']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(50)
  }),

  // Course filters
  courseFilters: z.object({
    plantId: z.string().uuid().optional(),
    isPublished: z.coerce.boolean().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(50)
  }),

  // Enrollment filters
  enrollmentFilters: z.object({
    plantId: z.string().uuid().optional(),
    courseId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    status: z.enum(['enrolled', 'in_progress', 'completed', 'cancelled']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(50)
  }),

  // Analytics filters
  analyticsFilters: z.object({
    plantId: z.string().uuid().optional(),
    courseId: z.string().uuid().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional()
  }),

  // Create user schema
  createUser: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['admin', 'instructor', 'user']),
    plantId: z.string().uuid(),
    department: z.string().optional()
  }),

  // Update user schema
  updateUser: z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.enum(['admin', 'instructor', 'user']).optional(),
    plantId: z.string().uuid().optional(),
    department: z.string().optional(),
    isActive: z.boolean().optional()
  }),

  // Create course schema
  createCourse: z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    version: z.string().default('1.0'),
    isPublished: z.boolean().default(false),
    plantId: z.string().uuid()
  }),

  // Update course schema
  updateCourse: z.object({
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    isPublished: z.boolean().optional()
  }),

  // Create enrollment schema
  createEnrollment: z.object({
    userId: z.string().uuid(),
    courseId: z.string().uuid(),
    enrolledBy: z.string().uuid().optional(),
    dueDate: z.coerce.date().optional()
  }),

  // Update enrollment schema
  updateEnrollment: z.object({
    status: z.enum(['enrolled', 'in_progress', 'completed', 'cancelled']).optional(),
    completedAt: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional()
  })
};

export class ValidationUtils {
  /**
   * Validate pagination parameters
   */
  static validatePagination(params: unknown) {
    return CommonSchemas.pagination.parse(params);
  }

  /**
   * Validate ID parameter
   */
  static validateId(id: string) {
    return CommonSchemas.id.parse(id);
  }

  /**
   * Validate search parameters
   */
  static validateSearch(params: unknown) {
    return CommonSchemas.search.parse(params);
  }

  /**
   * Validate user filters
   */
  static validateUserFilters(params: unknown) {
    return CommonSchemas.userFilters.parse(params);
  }

  /**
   * Validate course filters
   */
  static validateCourseFilters(params: unknown) {
    return CommonSchemas.courseFilters.parse(params);
  }

  /**
   * Validate enrollment filters
   */
  static validateEnrollmentFilters(params: unknown) {
    return CommonSchemas.enrollmentFilters.parse(params);
  }

  /**
   * Validate analytics filters
   */
  static validateAnalyticsFilters(params: unknown) {
    return CommonSchemas.analyticsFilters.parse(params);
  }

  /**
   * Validate date range
   */
  static validateDateRange(params: unknown) {
    return CommonSchemas.dateRange.parse(params);
  }

  /**
   * Validate create user data
   */
  static validateCreateUser(data: unknown) {
    return CommonSchemas.createUser.parse(data);
  }

  /**
   * Validate update user data
   */
  static validateUpdateUser(data: unknown) {
    return CommonSchemas.updateUser.parse(data);
  }

  /**
   * Validate create course data
   */
  static validateCreateCourse(data: unknown) {
    return CommonSchemas.createCourse.parse(data);
  }

  /**
   * Validate update course data
   */
  static validateUpdateCourse(data: unknown) {
    return CommonSchemas.updateCourse.parse(data);
  }

  /**
   * Validate create enrollment data
   */
  static validateCreateEnrollment(data: unknown) {
    return CommonSchemas.createEnrollment.parse(data);
  }

  /**
   * Validate update enrollment data
   */
  static validateUpdateEnrollment(data: unknown) {
    return CommonSchemas.updateEnrollment.parse(data);
  }

  /**
   * Combine multiple schemas
   */
  static combineSchemas<T extends z.ZodRawShape>(schemas: T) {
    return z.object(schemas);
  }

  /**
   * Create optional schema
   */
  static makeOptional<T extends z.ZodTypeAny>(schema: T) {
    return schema.optional();
  }

  /**
   * Create nullable schema
   */
  static makeNullable<T extends z.ZodTypeAny>(schema: T) {
    return schema.nullable();
  }
}
