import {
    and,
    asc,
    count,
    eq,
    mapProfileToDTO,
    mapProfileWithPlantToDTO,
    profiles,
    sql,
    type CreateProfile,
    type DatabaseResponse,
    type PaginatedResult,
    type Profile,
    type ProfileWithPlant,
    type UpdateProfile,
    type UserFilter
} from '@/contracts';
import { FilterBuilder } from '../builders/filter-builder';
import { PaginationBuilder } from '../builders/pagination-builder';
import { getDb } from '../connection';
import { DatabaseErrorHandler } from '../wrappers/error-handler';
import { OperationWrapper } from '../wrappers/operation-wrapper';

// Use the contracts type for consistency
type ProfileWithDetails = ProfileWithPlant;

/**
 * UserOperations class for standardized user/profile database operations
 * Uses the new query builder pattern for consistent, maintainable code
 */
export class UserOperations {
  /**
   * Get users with details using pagination and filtering
   */
  static async getUsersWithDetails(filters: UserFilter): Promise<DatabaseResponse<PaginatedResult<ProfileWithDetails>>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const pagination = PaginationBuilder.validateParams(filters);
      const filterConditions = FilterBuilder.createUserFilters(filters);
      
      // Use direct database query instead of QueryBuilder for relational queries
      const usersData = await getDb().query.profiles.findMany({
        with: {
          plant: true,
          adminRoles: true,
          enrollments: {
            with: {
              course: true,
            },
          },
        },
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        orderBy: [asc(profiles.lastName), asc(profiles.firstName)],
      });
      
      const totalResult = await getDb().select({ count: count() }).from(profiles);
      const total = totalResult[0]?.count ?? 0;
      
      return {
        items: usersData.map((user: any) => mapProfileWithPlantToDTO(user)),
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      };
    });
  }

  /**
   * Get user by ID with all related data
   */
  static async getUserById(id: string): Promise<DatabaseResponse<ProfileWithDetails | null>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const profile = await getDb().query.profiles.findFirst({
        where: eq(profiles.id, id),
        with: {
          plant: true,
          adminRoles: true,
          enrollments: {
            with: {
              course: true,
            },
          },
        },
      });
      
      return profile ? mapProfileWithPlantToDTO(profile as any) : null;
    });
  }

  /**
   * Get user by email with all related data
   */
  static async getUserByEmail(email: string): Promise<DatabaseResponse<ProfileWithDetails | null>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const profile = await getDb().query.profiles.findFirst({
        where: eq(profiles.email, email),
        with: {
          plant: true,
          adminRoles: true,
          enrollments: {
            with: {
              course: true,
            },
          },
        },
      });
      
      return profile ? mapProfileWithPlantToDTO(profile as any) : null;
    });
  }

  /**
   * Create a new user profile
   */
  static async createUser(data: CreateProfile): Promise<DatabaseResponse<Profile>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      // Check if user already exists
      const existing = await getDb().query.profiles.findFirst({
        where: eq(profiles.email, data.email)
      });

      if (existing) {
        DatabaseErrorHandler.handleConflictError('User', 'User with this email already exists');
      }

      const [profile] = await getDb().insert(profiles).values(data).returning();
      if (!profile) {
        throw new Error('Failed to create user profile');
      }
      return mapProfileToDTO(profile);
    });
  }

  /**
   * Create a new user profile and return with plant details
   */
  static async createUserWithPlant(data: CreateProfile): Promise<DatabaseResponse<ProfileWithPlant>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      // Check if user already exists
      const existing = await getDb().query.profiles.findFirst({
        where: eq(profiles.email, data.email)
      });

      if (existing) {
        DatabaseErrorHandler.handleConflictError('User', 'User with this email already exists');
      }

      const [profile] = await getDb().insert(profiles).values(data).returning();
      
      if (!profile) {
        throw new Error('Failed to create user profile');
      }
      
      // Fetch the created profile with plant details
      const profileWithPlant = await getDb().query.profiles.findFirst({
        where: eq(profiles.id, profile.id),
        with: {
          plant: true,
        },
      });

      if (!profileWithPlant) {
        DatabaseErrorHandler.handleNotFoundError('User', profile.id);
        throw new Error('Profile not found'); // This won't be reached but satisfies TypeScript
      }

      return mapProfileWithPlantToDTO(profileWithPlant as any);
    });
  }

  /**
   * Update user profile
   */
  static async updateUser(id: string, data: UpdateProfile): Promise<DatabaseResponse<Profile>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const [profile] = await getDb()
        .update(profiles)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(profiles.id, id))
        .returning();
      
      if (!profile) {
        DatabaseErrorHandler.handleNotFoundError('User', id);
        throw new Error('Profile not found'); // This won't be reached but satisfies TypeScript
      }
      
      return mapProfileToDTO(profile);
    });
  }

  /**
   * Update user profile and return with plant details
   */
  static async updateUserWithPlant(id: string, data: UpdateProfile): Promise<DatabaseResponse<ProfileWithPlant>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const [profile] = await getDb()
        .update(profiles)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(profiles.id, id))
        .returning();
      
      if (!profile) {
        DatabaseErrorHandler.handleNotFoundError('User', id);
        throw new Error('Profile not found'); // This won't be reached but satisfies TypeScript
      }

      // Fetch the updated profile with plant details
      const profileWithPlant = await getDb().query.profiles.findFirst({
        where: eq(profiles.id, profile.id),
        with: {
          plant: true,
        },
      });

      if (!profileWithPlant) {
        DatabaseErrorHandler.handleNotFoundError('User', profile.id);
      }

      return mapProfileWithPlantToDTO(profileWithPlant as any);
    });
  }

  /**
   * Delete user profile
   */
  static async deleteUser(id: string): Promise<DatabaseResponse<void>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const result = await getDb().delete(profiles).where(eq(profiles.id, id));
      
      if (result.count === 0) {
        DatabaseErrorHandler.handleNotFoundError('User', id);
      }
    });
  }

  /**
   * Get users by plant with pagination
   */
  static async getUsersByPlant(
    plantId: string, 
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<ProfileWithDetails>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    
    const usersData = await getDb().query.profiles.findMany({
      where: eq(profiles.plantId, plantId),
      with: {
        plant: true,
        adminRoles: true,
      },
      limit: validatedPagination.limit,
      offset: (validatedPagination.page - 1) * validatedPagination.limit,
      orderBy: [asc(profiles.lastName), asc(profiles.firstName)],
    });
    
    const totalResult = await getDb().select({ count: count() }).from(profiles).where(eq(profiles.plantId, plantId));
    const total = totalResult[0]?.count ?? 0;
    
    return {
      items: usersData.map((user: any) => mapProfileWithPlantToDTO(user)),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Get active users only
   */
  static async getActiveUsers(filters: Omit<UserFilter, 'status'>): Promise<DatabaseResponse<PaginatedResult<ProfileWithDetails>>> {
    return this.getUsersWithDetails({ ...filters, status: 'active' });
  }

  /**
   * Search users by name or email
   */
  static async searchUsers(
    searchTerm: string,
    plantId?: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<ProfileWithDetails>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    
    // Build search conditions
    const searchConditions = [
      sql`${profiles.firstName} ILIKE ${`%${searchTerm}%`}`,
      sql`${profiles.lastName} ILIKE ${`%${searchTerm}%`}`,
      sql`${profiles.email} ILIKE ${`%${searchTerm}%`}`
    ];
    
    const conditions = [sql`(${searchConditions.join(' OR ')})`];
    
    if (plantId) {
      conditions.push(eq(profiles.plantId, plantId));
    }
    
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;
    
    const usersData = await getDb().query.profiles.findMany({
      where: whereCondition,
      with: {
        plant: true,
        adminRoles: true,
        enrollments: {
          with: {
            course: true,
          },
        },
      },
      limit: validatedPagination.limit,
      offset: (validatedPagination.page - 1) * validatedPagination.limit,
      orderBy: [asc(profiles.lastName), asc(profiles.firstName)],
    });
    
    const totalResult = await getDb().select({ count: count() }).from(profiles).where(whereCondition);
    const total = totalResult[0]?.count ?? 0;
    
    return {
      items: usersData.map((user: any) => mapProfileWithPlantToDTO(user)),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Get user statistics
   */
  static async getUserStats(plantId?: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
  }> {
    const conditions = plantId ? [eq(profiles.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const totalResults = await getDb()
      .select({ count: count() })
      .from(profiles)
      .where(whereClause);
    
    const activeResults = await getDb()
      .select({ count: count() })
      .from(profiles)
      .where(whereClause ? and(...conditions, eq(profiles.status, 'active')) : eq(profiles.status, 'active'));
    
    const suspendedResults = await getDb()
      .select({ count: count() })
      .from(profiles)
      .where(whereClause ? and(...conditions, eq(profiles.status, 'suspended')) : eq(profiles.status, 'suspended'));
    
    const totalResult = totalResults[0] ?? { count: 0 };
    const activeResult = activeResults[0] ?? { count: 0 };
    const suspendedResult = suspendedResults[0] ?? { count: 0 };
    
    return {
      totalUsers: totalResult.count,
      activeUsers: activeResult.count,
      suspendedUsers: suspendedResult.count
    };
  }

  /**
   * Check if user exists
   */
  static async userExists(id: string): Promise<boolean> {
    const user = await getDb().query.profiles.findFirst({
      where: eq(profiles.id, id),
      columns: { id: true }
    });
    
    return !!user;
  }

  /**
   * Check if email is available
   */
  static async isEmailAvailable(email: string, excludeUserId?: string): Promise<boolean> {
    const conditions = [eq(profiles.email, email)];
    
    if (excludeUserId) {
      conditions.push(sql`${profiles.id} != ${excludeUserId}`);
    }
    
    const user = await getDb().query.profiles.findFirst({
      where: and(...conditions),
      columns: { id: true }
    });
    
    return !user;
  }

  /**
   * Get users with admin roles
   */
  static async getUsersWithAdminRoles(plantId?: string): Promise<ProfileWithDetails[]> {
    const conditions = plantId ? [eq(profiles.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const usersData = await getDb().query.profiles.findMany({
      where: whereClause,
      with: {
        plant: true,
        adminRoles: true,
        enrollments: {
          with: {
            course: true,
          },
        },
      },
      orderBy: [asc(profiles.lastName), asc(profiles.firstName)],
    });
    
    // Filter users who have admin roles first, then map
    const usersWithAdminRoles = usersData.filter(user => user.adminRoles && user.adminRoles.length > 0);
    
    return usersWithAdminRoles.map((user: any) => mapProfileWithPlantToDTO(user));
  }

  /**
   * Bulk update user status
   */
  static async bulkUpdateUserStatus(
    userIds: string[], 
    status: 'active' | 'suspended'
  ): Promise<DatabaseResponse<number>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const result = await getDb()
        .update(profiles)
        .set({ 
          status, 
          updatedAt: new Date().toISOString() 
        })
        .where(sql`${profiles.id} IN (${userIds.join(',')})`);
      
      return result.count || 0;
    });
  }
}
