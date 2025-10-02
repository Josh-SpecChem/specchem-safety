/**
 * Tenant-aware database operation helpers
 * Ensures proper tenant isolation and access control for all database operations
 */

import type { UserContext } from '@/contracts';
import { enrollments, profiles, progress } from '@/contracts';
import { and, eq, like, or, sql } from 'drizzle-orm';
import type { PgColumn, PgSelect } from 'drizzle-orm/pg-core';
import type {
    EnrollmentFilter as EnrollmentFilters,
    EnrollmentWithDetails,
    PaginatedResult,
    ProfileWithDetails,
    ProgressFilter as ProgressFilters,
    ProgressWithDetails,
    UserFilter as UserFilters
} from '../../types/database';
import { getDb } from './connection';

/**
 * Apply tenant filtering to a Drizzle query based on user context
 */
export function withTenantFilter<T extends PgSelect>(
  query: T,
  userContext: UserContext,
  plantIdColumn: PgColumn = profiles.plantId // Default to profiles.plantId
): T {
  // Apply tenant filtering based on user context
  if (userContext.accessiblePlants.length === 1) {
    return (query as any).where(eq(plantIdColumn, userContext.accessiblePlants[0]));
  }
  
  if (userContext.accessiblePlants.length > 1) {
    return (query as any).where(sql`${plantIdColumn} = ANY(${userContext.accessiblePlants})`);
  }
  
  // No access - return empty results
  return (query as any).where(eq(plantIdColumn, '00000000-0000-0000-0000-000000000000'));
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
  let query = getDb().query.profiles.findMany({
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

  // Apply tenant filtering and additional filters
  const conditions = [];
  
  // Always apply tenant filtering
  conditions.push(eq(profiles.plantId, userContext.plantId));
  
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

  // Apply all conditions to the query
  const profilesData = await getDb().query.profiles.findMany({
    where: and(...conditions),
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

  // Get total count with same filters
  const countResult = await getDb().select({ count: sql<number>`count(*)` })
    .from(profiles)
    .where(and(...conditions));
  
  const total = countResult[0]?.count || 0;

  return {
    items: profilesData as ProfileWithDetails[],
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

  // Apply tenant filtering and additional filters
  const conditions = [];
  
  // Always apply tenant filtering
  conditions.push(eq(enrollments.plantId, userContext.plantId));
  
  if (filters.courseId) {
    conditions.push(eq(enrollments.courseId, filters.courseId));
  }
  
  if (filters.userId) {
    conditions.push(eq(enrollments.userId, filters.userId));
  }
  
  if (filters.status) {
    conditions.push(eq(enrollments.status, filters.status));
  }

  // Execute query with all conditions
  const enrollmentsData = await getDb().query.enrollments.findMany({
    where: and(...conditions),
    with: {
      profile: true,
      course: true,
      plant: true,
    },
    limit,
    offset,
    orderBy: [enrollments.enrolledAt],
  });

  // Get total count with same filters
  const countResult = await getDb().select({ count: sql<number>`count(*)` })
    .from(enrollments)
    .where(and(...conditions));
  
  const total = countResult[0]?.count || 0;

  return {
    items: enrollmentsData as EnrollmentWithDetails[],
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

  // Apply tenant filtering and additional filters
  const conditions = [];
  
  // Always apply tenant filtering
  conditions.push(eq(progress.plantId, userContext.plantId));
  
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

  // Execute query with all conditions
  const progressData = await getDb().query.progress.findMany({
    where: and(...conditions),
    with: {
      profile: true,
      course: true,
      plant: true,
    },
    limit,
    offset,
    orderBy: [progress.lastActiveAt],
  });

  // Get total count with same filters
  const countResult = await getDb().select({ count: sql<number>`count(*)` })
    .from(progress)
    .where(and(...conditions));
  
  const total = countResult[0]?.count || 0;

  return {
    items: progressData as ProgressWithDetails[],
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

  return userContext.roles.some((userRole: any) => {
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
