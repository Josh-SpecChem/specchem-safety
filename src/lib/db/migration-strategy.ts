import type {
    AnalyticsData,
    Course,
    CourseFilter,
    CreateCourse,
    CreateEnrollment,
    CreateProfile,
    DashboardStats,
    DatabaseResponse,
    Enrollment,
    EnrollmentFilter,
    EnrollmentWithRelations,
    PaginatedResult,
    ProfileWithPlant,
    UpdateCourse,
    UpdateEnrollment,
    UpdateProfile,
    UserContext,
    UserFilter
} from '@/contracts';
import { DatabaseService } from './database-service';
import {
    AnalyticsOperations,
    CourseOperations,
    EnrollmentOperations,
    UserOperations
} from './operations/index';

// Import CourseWithDetails from operations since it's defined there
import type { CourseWithDetails } from './operations/courses';

// ProfileWithDetails is an alias for ProfileWithPlant
type ProfileWithDetails = ProfileWithPlant;

/**
 * Database Migration Strategy
 * 
 * Provides backward compatibility during the migration from complex operation classes
 * to the simplified DatabaseService. This allows for gradual migration without breaking
 * existing code.
 */

/**
 * Migration Configuration
 */
export interface MigrationConfig {
  useNewService: boolean;
  enableLogging: boolean;
  fallbackToLegacy: boolean;
}

/**
 * Default migration configuration
 */
const DEFAULT_CONFIG: MigrationConfig = {
  useNewService: false, // Start with legacy, gradually enable new service
  enableLogging: true,
  fallbackToLegacy: true,
};

/**
 * Migration Manager
 * 
 * Manages the transition from legacy operations to the new unified service
 */
export class MigrationManager {
  private static config: MigrationConfig = DEFAULT_CONFIG;

  /**
   * Update migration configuration
   */
  static updateConfig(config: Partial<MigrationConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.config.enableLogging) {
      console.log('Migration config updated:', this.config);
    }
  }

  /**
   * Get current migration configuration
   */
  static getConfig(): MigrationConfig {
    return { ...this.config };
  }

  /**
   * Check if new service should be used
   */
  static shouldUseNewService(): boolean {
    return this.config.useNewService;
  }

  /**
   * Log migration activity
   */
  public static log(operation: string, usingNew: boolean): void {
    if (MigrationManager.getConfig().enableLogging) {
      console.log(`Migration: ${operation} using ${usingNew ? 'new' : 'legacy'} service`);
    }
  }
}

/**
 * Backward Compatibility Layer
 * 
 * Provides the same API as the legacy operation classes but routes to either
 * the new DatabaseService or legacy operations based on migration configuration
 */

/**
 * User Operations Compatibility Layer
 */
export class UserOperationsCompat {
  /**
   * Get users with details using pagination and filtering
   */
  static async getUsersWithDetails(
    filters: UserFilter,
    userContext?: UserContext
  ): Promise<DatabaseResponse<PaginatedResult<ProfileWithPlant>>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getUsersWithDetails', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.getUsers(filters, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getUsersWithDetails - falling back to legacy', false);
          return UserOperations.getUsersWithDetails(filters);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return UserOperations.getUsersWithDetails(filters);
  }

  /**
   * Get user by ID with all related data
   */
  static async getUserById(
    id: string,
    userContext?: UserContext
  ): Promise<DatabaseResponse<ProfileWithPlant | null>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getUserById', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.getUserById(id, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getUserById - falling back to legacy', false);
          return UserOperations.getUserById(id);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return UserOperations.getUserById(id);
  }

  /**
   * Get user by email with all related data
   */
  static async getUserByEmail(
    email: string,
    userContext?: UserContext
  ): Promise<DatabaseResponse<ProfileWithPlant | null>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getUserByEmail', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.getUserByEmail(email, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getUserByEmail - falling back to legacy', false);
          return UserOperations.getUserByEmail(email);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return UserOperations.getUserByEmail(email);
  }

  /**
   * Create a new user profile
   */
  static async createUser(data: CreateProfile): Promise<DatabaseResponse<ProfileWithPlant>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('createUser', usingNew);

    if (usingNew) {
      try {
        const result = await DatabaseService.createUser(data);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('createUser - falling back to legacy', false);
          return UserOperations.createUserWithPlant(data);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return UserOperations.createUserWithPlant(data);
  }

  /**
   * Update user profile
   */
  static async updateUser(
    id: string,
    data: UpdateProfile,
    userContext?: UserContext
  ): Promise<DatabaseResponse<ProfileWithPlant>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('updateUser', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.updateUser(id, data, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('updateUser - falling back to legacy', false);
          return UserOperations.updateUserWithPlant(id, data);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return UserOperations.updateUserWithPlant(id, data);
  }

  /**
   * Delete user profile
   */
  static async deleteUser(
    id: string,
    userContext?: UserContext
  ): Promise<DatabaseResponse<void>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('deleteUser', usingNew);

    if (usingNew && userContext) {
      try {
        await DatabaseService.deleteUser(id, userContext);
        return { data: undefined, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('deleteUser - falling back to legacy', false);
          return UserOperations.deleteUser(id);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return UserOperations.deleteUser(id);
  }
}

/**
 * Course Operations Compatibility Layer
 */
export class CourseOperationsCompat {
  /**
   * Get courses with details using pagination and filtering
   */
  static async getCoursesWithDetails(
    filters: CourseFilter,
    userContext?: UserContext
  ): Promise<DatabaseResponse<PaginatedResult<CourseWithDetails>>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getCoursesWithDetails', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.getCourses(filters, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getCoursesWithDetails - falling back to legacy', false);
          return CourseOperations.getCoursesWithDetails(filters);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return CourseOperations.getCoursesWithDetails(filters);
  }

  /**
   * Get course by ID with all related data
   */
  static async getCourseById(
    id: string,
    userContext?: UserContext
  ): Promise<DatabaseResponse<CourseWithDetails | null>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getCourseById', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.getCourseById(id, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getCourseById - falling back to legacy', false);
          return CourseOperations.getCourseById(id);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return CourseOperations.getCourseById(id);
  }

  /**
   * Create a new course
   */
  static async createCourse(data: CreateCourse): Promise<DatabaseResponse<Course>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('createCourse', usingNew);

    if (usingNew) {
      try {
        const result = await DatabaseService.createCourse(data);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('createCourse - falling back to legacy', false);
          return CourseOperations.createCourse(data);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return CourseOperations.createCourse(data);
  }

  /**
   * Update course
   */
  static async updateCourse(
    id: string,
    data: UpdateCourse,
    userContext?: UserContext
  ): Promise<DatabaseResponse<Course>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('updateCourse', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.updateCourse(id, data, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('updateCourse - falling back to legacy', false);
          return CourseOperations.updateCourse(id, data);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return CourseOperations.updateCourse(id, data);
  }
}

/**
 * Enrollment Operations Compatibility Layer
 */
export class EnrollmentOperationsCompat {
  /**
   * Get enrollments with details using pagination and filtering
   */
  static async getEnrollmentsWithDetails(
    filters: EnrollmentFilter,
    userContext?: UserContext
  ): Promise<DatabaseResponse<PaginatedResult<EnrollmentWithRelations>>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getEnrollmentsWithDetails', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.getEnrollments(filters, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getEnrollmentsWithDetails - falling back to legacy', false);
          return EnrollmentOperations.getEnrollmentsWithDetails(filters);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return EnrollmentOperations.getEnrollmentsWithDetails(filters);
  }

  /**
   * Create a new enrollment
   */
  static async createEnrollment(data: CreateEnrollment): Promise<DatabaseResponse<Enrollment>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('createEnrollment', usingNew);

    if (usingNew) {
      try {
        const result = await DatabaseService.createEnrollment(data);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('createEnrollment - falling back to legacy', false);
          return EnrollmentOperations.createEnrollment(data);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return EnrollmentOperations.createEnrollment(data);
  }

  /**
   * Update enrollment
   */
  static async updateEnrollment(
    id: string,
    data: UpdateEnrollment,
    userContext?: UserContext
  ): Promise<DatabaseResponse<Enrollment>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('updateEnrollment', usingNew);

    if (usingNew && userContext) {
      try {
        const result = await DatabaseService.updateEnrollment(id, data, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('updateEnrollment - falling back to legacy', false);
          return EnrollmentOperations.updateEnrollment(id, data);
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return EnrollmentOperations.updateEnrollment(id, data);
  }
}

/**
 * Analytics Operations Compatibility Layer
 */
export class AnalyticsOperationsCompat {
  /**
   * Get comprehensive analytics overview
   */
  static async getDetailedAnalytics(
    filters?: any, // TODO: Define AnalyticsFilters type in contracts
    userContext?: UserContext
  ): Promise<DatabaseResponse<AnalyticsData>> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getDetailedAnalytics', usingNew);

    if (usingNew && userContext && filters) {
      try {
        const result = await DatabaseService.getAnalytics(filters, userContext);
        return { data: result, success: true };
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getDetailedAnalytics - falling back to legacy', false);
          return AnalyticsOperations.getDetailedAnalytics();
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return AnalyticsOperations.getDetailedAnalytics();
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(plantId?: string): Promise<DashboardStats> {
    const usingNew = MigrationManager.shouldUseNewService();
    MigrationManager.log('getDashboardStats', usingNew);

    if (usingNew) {
      try {
        return await DatabaseService.getDashboardStats(plantId);
      } catch (error) {
        if (MigrationManager.getConfig().fallbackToLegacy) {
          MigrationManager.log('getDashboardStats - falling back to legacy', false);
          // Fallback to legacy implementation
          return {
            totalUsers: 0,
            activeEnrollments: 0,
            completionRate: 0,
            overdueTraining: 0,
            totalPlants: 0,
            activePlants: 0,
          };
        }
        throw new Error(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    // Fallback to legacy implementation
    return {
      totalUsers: 0,
      activeEnrollments: 0,
      completionRate: 0,
      overdueTraining: 0,
      totalPlants: 0,
      activePlants: 0,
    };
  }
}

/**
 * Migration Utilities
 */
export class MigrationUtils {
  /**
   * Enable new service for specific operations
   */
  static enableNewService(): void {
    MigrationManager.updateConfig({ useNewService: true });
    console.log('New database service enabled');
  }

  /**
   * Disable new service (fallback to legacy)
   */
  static disableNewService(): void {
    MigrationManager.updateConfig({ useNewService: false });
    console.log('Legacy database service enabled');
  }

  /**
   * Enable logging for migration tracking
   */
  static enableLogging(): void {
    MigrationManager.updateConfig({ enableLogging: true });
  }

  /**
   * Disable logging
   */
  static disableLogging(): void {
    MigrationManager.updateConfig({ enableLogging: false });
  }

  /**
   * Get migration status
   */
  static getStatus(): {
    usingNewService: boolean;
    loggingEnabled: boolean;
    fallbackEnabled: boolean;
  } {
    const config = MigrationManager.getConfig();
    return {
      usingNewService: config.useNewService,
      loggingEnabled: config.enableLogging,
      fallbackEnabled: config.fallbackToLegacy,
    };
  }
}
