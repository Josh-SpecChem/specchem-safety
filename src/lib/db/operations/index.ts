/**
 * Refactored Database Operations - Main Export Index
 * 
 * This file exports all the new refactored database operations organized by domain.
 * The refactoring breaks down the original 732-line operations.ts file into:
 * - Focused operation classes by domain (users, enrollments, courses, analytics)
 * - Reusable query builders and utilities
 * - Standardized error handling and operation wrappers
 * - Consistent pagination and filtering patterns
 */

// ========================================
// OPERATION CLASSES (Domain-Specific)
// ========================================

// Legacy operation classes (for backward compatibility)
export { UserOperations } from './users';
export { EnrollmentOperations } from './enrollments';
export { CourseOperations } from './courses';
export { AnalyticsOperations } from './analytics';

// New unified database service
export { DatabaseService, TenantFilter } from '../database-service';

// Migration and compatibility layer
export { 
  MigrationManager,
  UserOperationsCompat,
  CourseOperationsCompat,
  EnrollmentOperationsCompat,
  AnalyticsOperationsCompat,
  MigrationUtils
} from '../migration-strategy';
