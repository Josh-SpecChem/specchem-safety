/**
 * Contracts Barrel Export - Single Source of Truth
 * 
 * This file exports all contract definitions for use throughout the application.
 * Import from here instead of individual contract files to ensure consistency.
 * 
 * Usage:
 * ```typescript
 * import { ProfileSchema, Profile, CreateProfile } from '@/contracts';
 * ```
 */

// ========================================
// DATABASE SCHEMA EXPORTS
// ========================================

export * from './schema.app';
export * from './relations';

// Re-export specific table definitions for database operations
export {
  plants,
  courses,
  profiles,
  adminRoles,
  enrollments,
  progress,
  activityEvents,
  questionEvents,
  // Enums
  adminRoleEnum,
  enrollmentStatus,
  eventType,
  userStatus
} from './schema.app';

// ========================================
// ZOD CONTRACT EXPORTS
// ========================================

export * from './base';

// ========================================
// MAPPING UTILITIES
// ========================================

export * from './mappers';

// ========================================
// VALIDATION UTILITIES
// ========================================

export * from './validation';

// ========================================
// RE-EXPORTS FOR CONVENIENCE
// ========================================

// Common validation patterns
export { z } from 'zod';

// Drizzle utilities
export { eq, and, or, desc, asc, count, sql } from 'drizzle-orm';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// ========================================
// TYPE UTILITIES
// ========================================

/**
 * Utility type for tenant-scoped operations
 */
export type TenantScoped<T> = T & { plantId: string };

/**
 * Utility type for optional tenant context
 */
export type WithTenantContext<T> = T & { tenantId?: string };

/**
 * Utility type for paginated results
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Standard API response wrapper
 */
export interface StandardResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Database operation result
 */
export type DbResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  code?: string;
};

/**
 * Database response wrapper (alias for DbResult for compatibility)
 */
export type DatabaseResponse<T> = DbResult<T>;

/**
 * User context for authorization and tenant isolation
 */
export interface UserContext {
  userId: string;
  plantId: string;
  accessiblePlants: string[];
  roles: Array<{
    role: import('./base').AdminRole;
    plantId?: string;
  }>;
}

/**
 * Utility types for optional and required fields
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ========================================
// COMMON VALIDATION HELPERS
// ========================================

/**
 * Validates if a string is a valid UUID
 */
export const isValidUuid = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Validates if a string is a valid email
 */
export const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Validates if a number is a valid progress percentage
 */
export const isValidProgress = (value: number): boolean => {
  return Number.isInteger(value) && value >= 0 && value <= 100;
};

// ========================================
// TENANT ISOLATION HELPERS
// ========================================

/**
 * Ensures a query includes tenant isolation
 */
export const withTenantIsolation = <T extends Record<string, any>>(
  query: T,
  plantId: string
): T & { plantId: string } => {
  return { ...query, plantId };
};

/**
 * Validates tenant access for a resource
 */
export const validateTenantAccess = (
  resourcePlantId: string,
  userPlantId: string
): boolean => {
  return resourcePlantId === userPlantId;
};

// ========================================
// ERROR TYPES
// ========================================

export class ContractValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ContractValidationError';
  }
}

export class TenantIsolationError extends Error {
  constructor(message: string = 'Tenant isolation violation') {
    super(message);
    this.name = 'TenantIsolationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Authorization failed') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// ========================================
// AUTHENTICATION RESULT TYPES
// ========================================

export interface AuthResult {
  success: boolean;
  user?: import('./base').Profile;
  error?: string;
  message?: string;
}

export interface AdminAuthResult extends AuthResult {
  adminRoles?: import('./base').AdminRole[];
  permissions?: string[];
}

// ========================================
// CONSTANTS
// ========================================

export const CONTRACT_CONSTANTS = {
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 50,
  MAX_STRING_LENGTH: {
    NAME: 100,
    TITLE: 200,
    DESCRIPTION: 1000,
    EMAIL: 255,
    JOB_TITLE: 100,
  },
  PROGRESS: {
    MIN: 0,
    MAX: 100,
  },
} as const;

// ========================================
// METADATA
// ========================================

export const CONTRACT_VERSION = '1.0.0';
export const SCHEMA_VERSION = '1.0.0';

/**
 * Contract metadata for debugging and validation
 */
export const CONTRACT_METADATA = {
  version: CONTRACT_VERSION,
  schemaVersion: SCHEMA_VERSION,
  lastUpdated: new Date().toISOString(),
  entities: [
    'plants',
    'courses', 
    'profiles',
    'adminRoles',
    'enrollments',
    'progress',
    'activityEvents',
    'questionEvents'
  ],
} as const;

