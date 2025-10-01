/**
 * Tenant-aware database operation helpers
 * Ensures proper tenant isolation and access control for all database operations
 */

import { eq, and, sql, or, like } from 'drizzle-orm';
import { profiles, enrollments, progress, courses, plants, adminRoles } from '../db/schema';
import { db } from '../db';
import { DatabaseError, TenantAccessError } from '../errors';
import type { UserContext } from '../rls';
import type { 
  UserFilters, 
  EnrollmentFilters, 
  ProgressFilters,
  PaginatedResult,
  ProfileWithDetails,
  EnrollmentWithDetails,
  ProgressWithDetails
} from '../../types/database';

/**
 * Apply tenant filtering to a Drizzle query based on user context
 */
export function withTenantFilter<T>(
  query: unknown,
  userContext: UserContext,
  plantIdColumn: string = 'plantId'
) {
  // Apply tenant filtering based on user context
  if (userContext.accessiblePlants.length === 1) {
    return query.where(eq(plantIdColumn, userContext.accessiblePlants[0]));
  }
  
  if (userContext.accessiblePlants.length > 1) {
    return query.where(sql`${plantIdColumn} = ANY(${userContext.accessiblePlants})`);
  }
  
  // No access - return empty results
  return query.where(eq(plantIdColumn, '00000000-0000-0000-0000-000000000000'));
}

/**
 * Validate that a user has access to a specific plant
 */
export function validateTenantAccess(
  userContext: UserContext,
  plantId: string
): boolean {
  return userContext.accessiblePlants.includes(plantId);
}

/**
 * Get users with details, respecting tenant boundaries
 */
export async function getTenantUsers(
  userContext: UserContext, 
  filters: UserFilters
): Promise<PaginatedResult<ProfileWithDetails>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  // Build base query with relations
  let query = db.query.profiles.findMany({
    with: {
      plant: true,
      adminRoles: true,
      enrollments: {
        with: {
          course: true,
        },
      },
    },
    limit,
    offset,
    orderBy: [profiles.lastName, profiles.firstName],
  });

  // Apply tenant filtering
  query = withTenantFilter(query, userContext, 'plantId');
  
  // Apply additional filters
  const conditions = [];
  
  if (filters.status) {
    conditions.push(eq(profiles.status, filters.status));
  }
  
  if (filters.search) {
    conditions.push(
      or(
        like(profiles.firstName, `%${filters.search}%`),
        like(profiles.lastName, `%${filters.search}%`),
        like(profiles.email, `%${filters.search}%`)
      )
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const profilesData = await query;

  // Get total count with same filters
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(profiles);
  countQuery = withTenantFilter(countQuery, userContext, 'plantId');
  
  if (conditions.length > 0) {
    countQuery = countQuery.where(and(...conditions));
  }

  const [{ count: total }] = await countQuery;

  return {
    data: profilesData as ProfileWithDetails[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get enrollments with details, respecting tenant boundaries
 */
export async function getTenantEnrollments(
  userContext: UserContext,
  filters: EnrollmentFilters
): Promise<PaginatedResult<EnrollmentWithDetails>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  // Build base query with relations
  let query = db.query.enrollments.findMany({
    with: {
      profile: true,
      course: true,
      plant: true,
    },
    limit,
    offset,
    orderBy: [enrollments.enrolledAt],
  });

  // Apply tenant filtering
  query = withTenantFilter(query, userContext, 'plantId');
  
  // Apply additional filters
  const conditions = [];
  
  if (filters.courseId) {
    conditions.push(eq(enrollments.courseId, filters.courseId));
  }
  
  if (filters.userId) {
    conditions.push(eq(enrollments.userId, filters.userId));
  }
  
  if (filters.status) {
    conditions.push(eq(enrollments.status, filters.status));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const enrollmentsData = await query;

  // Get total count with same filters
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(enrollments);
  countQuery = withTenantFilter(countQuery, userContext, 'plantId');
  
  if (conditions.length > 0) {
    countQuery = countQuery.where(and(...conditions));
  }

  const [{ count: total }] = await countQuery;

  return {
    data: enrollmentsData as EnrollmentWithDetails[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get progress with details, respecting tenant boundaries
 */
export async function getTenantProgress(
  userContext: UserContext,
  filters: ProgressFilters
): Promise<PaginatedResult<ProgressWithDetails>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  // Build base query with relations
  let query = db.query.progress.findMany({
    with: {
      profile: true,
      course: true,
      plant: true,
    },
    limit,
    offset,
    orderBy: [progress.lastActiveAt],
  });

  // Apply tenant filtering
  query = withTenantFilter(query, userContext, 'plantId');
  
  // Apply additional filters
  const conditions = [];
  
  if (filters.courseId) {
    conditions.push(eq(progress.courseId, filters.courseId));
  }
  
  if (filters.userId) {
    conditions.push(eq(progress.userId, filters.userId));
  }
  
  if (filters.minProgress !== undefined) {
    conditions.push(sql`${progress.progressPercent} >= ${filters.minProgress}`);
  }
  
  if (filters.maxProgress !== undefined) {
    conditions.push(sql`${progress.progressPercent} <= ${filters.maxProgress}`);
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const progressData = await query;

  // Get total count with same filters
  let countQuery = db.select({ count: sql<number>`count(*)` }).from(progress);
  countQuery = withTenantFilter(countQuery, userContext, 'plantId');
  
  if (conditions.length > 0) {
    countQuery = countQuery.where(and(...conditions));
  }

  const [{ count: total }] = await countQuery;

  return {
    data: progressData as ProgressWithDetails[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Validate tenant access for a specific record
 */
export async function validateRecordTenantAccess(
  userContext: UserContext,
  tableName: 'profiles' | 'enrollments' | 'progress' | 'courses',
  recordId: string,
  plantIdColumn: string = 'plantId'
): Promise<boolean> {
  if (!validateTenantAccess(userContext, recordId)) {
    return false;
  }

  // Additional validation could be added here for specific table checks
  return true;
}

/**
 * Get accessible plants for a user context
 */
export function getAccessiblePlantsFromContext(userContext: UserContext): string[] {
  return userContext.accessiblePlants;
}

/**
 * Check if user has admin role in context
 */
export function hasAdminRoleInContext(
  userContext: UserContext,
  role?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
): boolean {
  if (!role) {
    return userContext.roles.length > 0;
  }

  return userContext.roles.some(userRole => {
    if (userRole.role !== role) {
      return false;
    }
    
    // For plant-specific roles, check plant match or org-wide admin
    if (plantId && userRole.plantId && userRole.plantId !== plantId) {
      return false;
    }
    
    return true;
  });
}
