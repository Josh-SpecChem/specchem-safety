import {
    and,
    asc,
    count,
    courses,
    desc,
    enrollments,
    eq,
    mapCourseToDTO,
    mapEnrollmentWithRelationsToDTO,
    mapProfileWithPlantToDTO,
    mapProgressWithRelationsToDTO,
    or,
    profiles,
    sql,
    validateTenantAccess,
    type AnalyticsData,
    type CourseFilter,
    type CreateCourse,
    type CreateEnrollment,
    type CreateProfile,
    type DashboardStats,
    type EnrollmentFilter,
    type PaginatedResult,
    type UpdateCourse,
    type UpdateEnrollment,
    type UpdateProfile,
    type UserContext,
    type UserFilter
} from '@/contracts';
import type {
    CourseWithDetails,
    EnrollmentWithDetails,
    ProfileWithDetails
} from '@/types/database';
import { like } from 'drizzle-orm';
import { getDb } from './connection';

/**
 * Unified Database Service
 * 
 * Simplified database layer with consistent patterns:
 * - Single service class for all database operations
 * - Consistent tenant filtering across all operations
 * - Streamlined error handling
 * - Direct Drizzle queries without builder pattern overhead
 */
export class DatabaseService {
  
  // ========================================
  // USER OPERATIONS
  // ========================================
  
  /**
   * Get users with pagination and filtering
   */
  static async getUsers(
    filters: UserFilter, 
    userContext: UserContext
  ): Promise<PaginatedResult<ProfileWithDetails>> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;

    // Build filter conditions
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

    // Execute query with relations
    const users = await getDb().query.profiles.findMany({
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

    // Get total count for pagination
    const countResult = await getDb().select({ count: count() })
      .from(profiles)
      .where(and(...conditions));
    const total = countResult[0]?.count || 0;

    return {
      items: users.map((user: any) => mapProfileWithPlantToDTO(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get user by ID with all related data
   */
  static async getUserById(
    id: string, 
    userContext: UserContext
  ): Promise<ProfileWithDetails | null> {
    const user = await getDb().query.profiles.findFirst({
      where: and(
        eq(profiles.id, id),
        eq(profiles.plantId, userContext.plantId)
      ),
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
    
    return user ? mapProfileWithPlantToDTO(user as any) : null;
  }

  /**
   * Get user by email with all related data
   */
  static async getUserByEmail(
    email: string, 
    userContext: UserContext
  ): Promise<ProfileWithDetails | null> {
    const user = await getDb().query.profiles.findFirst({
      where: and(
        eq(profiles.email, email),
        eq(profiles.plantId, userContext.plantId)
      ),
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
    
    return user ? mapProfileWithPlantToDTO(user as any) : null;
  }

  /**
   * Create a new user profile
   */
  static async createUser(data: CreateProfile): Promise<ProfileWithDetails> {
    // Check if user already exists
    const existing = await getDb().query.profiles.findFirst({
      where: eq(profiles.email, data.email)
    });

    if (existing) {
      throw new Error('User with this email already exists');
    }

    const [profile] = await getDb().insert(profiles).values(data).returning();
    
    // Return with relations - add null checks
    if (!profile) {
      throw new Error('Failed to create user');
    }
    
    return this.getUserById(profile.id, { 
      userId: profile.id,
      plantId: profile.plantId,
      accessiblePlants: [profile.plantId], 
      roles: [] 
    }) as Promise<ProfileWithDetails>;
  }

  /**
   * Update user profile
   */
  static async updateUser(
    id: string, 
    data: UpdateProfile, 
    userContext: UserContext
  ): Promise<ProfileWithDetails> {
    // Validate tenant access
    if (data.plantId && !validateTenantAccess(data.plantId, userContext.plantId)) {
      throw new Error('Access denied');
    }

    const [profile] = await getDb()
      .update(profiles)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(profiles.id, id))
      .returning();
    
    if (!profile) {
      throw new Error('User not found');
    }
    
    return this.getUserById(profile.id, userContext) as Promise<ProfileWithDetails>;
  }

  /**
   * Delete user profile
   */
  static async deleteUser(id: string, userContext: UserContext): Promise<void> {
    // Validate tenant access first
    const user = await this.getUserById(id, userContext);
    if (!user) {
      throw new Error('User not found');
    }

    const result = await getDb().delete(profiles).where(eq(profiles.id, id));
    
    if (result.count === 0) {
      throw new Error('User not found');
    }
  }

  // ========================================
  // COURSE OPERATIONS
  // ========================================
  
  /**
   * Get courses with pagination and filtering
   */
  static async getCourses(
    filters: CourseFilter, 
    userContext: UserContext
  ): Promise<PaginatedResult<CourseWithDetails>> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;

    // Build where conditions upfront
    const conditions = [];
    
    // Apply tenant filtering through enrollments
    if (userContext.accessiblePlants.length === 1) {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM enrollments 
          WHERE enrollments.course_id = courses.id 
          AND enrollments.plant_id = ${userContext.accessiblePlants[0]}
        )`
      );
    } else if (userContext.accessiblePlants.length > 1) {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM enrollments 
          WHERE enrollments.course_id = courses.id 
          AND enrollments.plant_id = ANY(${userContext.accessiblePlants})
        )`
      );
    } else {
      // No access - return empty results
      conditions.push(eq(courses.id, '00000000-0000-0000-0000-000000000000'));
    }
    
    // Apply additional filters
    if (filters.isPublished !== undefined) {
      conditions.push(eq(courses.isPublished, filters.isPublished));
    }
    
    if (filters.search) {
      conditions.push(
        or(
          like(courses.title, `%${filters.search}%`),
          like(courses.slug, `%${filters.search}%`)
        )
      );
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Execute query with all conditions
    const coursesData = await getDb().query.courses.findMany({
      where: whereCondition,
      with: {
        enrollments: {
          with: {
            profile: true,
          },
        },
        progresses: {
          with: {
            profile: true,
          },
        },
      },
      limit,
      offset,
      orderBy: [asc(courses.title)],
    });

    // Get total count with same filters
    const countResult = await getDb().select({ count: count() }).from(courses).where(whereCondition);
    const total = countResult[0]?.count ?? 0;

    return {
      items: coursesData.map((course: any) => ({
        ...mapCourseToDTO(course),
        enrollments: course.enrollments?.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment)) || [],
        progresses: course.progresses?.map((prog: any) => mapProgressWithRelationsToDTO(prog)) || [],
        statistics: {
          totalEnrollments: course.enrollments?.length || 0,
          completedEnrollments: course.enrollments?.filter((e: any) => e.status === 'completed').length || 0,
          averageProgress: course.progresses?.length > 0 
            ? course.progresses.reduce((sum: number, p: any) => sum + (p.progressPercent || 0), 0) / course.progresses.length 
            : 0,
          completionRate: course.enrollments?.length > 0 
            ? (course.enrollments.filter((e: any) => e.status === 'completed').length / course.enrollments.length) * 100 
            : 0
        }
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get course by ID with all related data
   */
  static async getCourseById(
    id: string, 
    userContext: UserContext
  ): Promise<CourseWithDetails | null> {
    // Build where conditions upfront
    const conditions = [eq(courses.id, id)];
    
    // Apply tenant filtering
    if (userContext.accessiblePlants.length === 1) {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM enrollments 
          WHERE enrollments.course_id = courses.id 
          AND enrollments.plant_id = ${userContext.accessiblePlants[0]}
        )`
      );
    } else if (userContext.accessiblePlants.length > 1) {
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM enrollments 
          WHERE enrollments.course_id = courses.id 
          AND enrollments.plant_id = ANY(${userContext.accessiblePlants})
        )`
      );
    } else {
      // No access - return null
      return null;
    }

    const course = await getDb().query.courses.findFirst({
      where: and(...conditions),
      with: {
        enrollments: {
          with: {
            profile: true,
          },
        },
        progresses: {
          with: {
            profile: true,
          },
        },
      },
    });
    
    if (!course) return null;
    
    return {
      ...mapCourseToDTO(course),
      enrollments: course.enrollments?.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment)) || [],
      progresses: course.progresses?.map((prog: any) => mapProgressWithRelationsToDTO(prog)) || [],
      statistics: {
        totalEnrollments: course.enrollments?.length || 0,
        completedEnrollments: course.enrollments?.filter((e: any) => e.status === 'completed').length || 0,
        averageProgress: course.progresses?.length > 0 
          ? course.progresses.reduce((sum: number, p: any) => sum + (p.progressPercent || 0), 0) / course.progresses.length 
          : 0,
        completionRate: course.enrollments?.length > 0 
          ? (course.enrollments.filter((e: any) => e.status === 'completed').length / course.enrollments.length) * 100 
          : 0
      }
    };
  }

  /**
   * Create a new course
   */
  static async createCourse(data: CreateCourse): Promise<CourseWithDetails> {
    // Check if course with slug already exists
    const existing = await getDb().query.courses.findFirst({
      where: eq(courses.slug, data.slug)
    });

    if (existing) {
      throw new Error('Course with this slug already exists');
    }

    const [course] = await getDb().insert(courses).values(data).returning();
    
    if (!course) {
      throw new Error('Failed to create course');
    }
    
    // Return with relations
    return this.getCourseById(course.id, { 
      userId: '',
      plantId: '',
      accessiblePlants: [], 
      roles: [] 
    }) as Promise<CourseWithDetails>;
  }

  /**
   * Update course
   */
  static async updateCourse(
    id: string, 
    data: UpdateCourse, 
    userContext: UserContext
  ): Promise<CourseWithDetails> {
    const [course] = await getDb()
      .update(courses)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(courses.id, id))
      .returning();
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return this.getCourseById(course.id, userContext) as Promise<CourseWithDetails>;
  }

  // ========================================
  // ENROLLMENT OPERATIONS
  // ========================================
  
  /**
   * Get enrollments with pagination and filtering
   */
  static async getEnrollments(
    filters: EnrollmentFilter, 
    userContext: UserContext
  ): Promise<PaginatedResult<EnrollmentWithDetails>> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 100);
    const offset = (page - 1) * limit;

    // Build filter conditions
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

    // Execute query with relations
    const enrollmentsData = await getDb().query.enrollments.findMany({
      where: and(...conditions),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      limit,
      offset,
      orderBy: [desc(enrollments.enrolledAt)],
    });

    // Get total count for pagination
    const countResult = await getDb().select({ count: count() })
      .from(enrollments)
      .where(and(...conditions));
    const total = countResult[0]?.count || 0;

    return {
      items: enrollmentsData.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create a new enrollment
   */
  static async createEnrollment(data: CreateEnrollment): Promise<EnrollmentWithDetails> {
    // Check if enrollment already exists
    const existing = await getDb().query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, data.userId),
        eq(enrollments.courseId, data.courseId)
      ),
    });

    if (existing) {
      throw new Error('User is already enrolled in this course');
    }

    const [enrollment] = await getDb().insert(enrollments).values(data).returning();
    
    if (!enrollment) {
      throw new Error('Failed to create enrollment');
    }
    
    // Return with relations
    const query = getDb().query.enrollments.findFirst({
      where: eq(enrollments.id, enrollment.id),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
    });
    
    const result = await query;
    return result ? mapEnrollmentWithRelationsToDTO(result as any) : null as any;
  }

  /**
   * Update enrollment
   */
  static async updateEnrollment(
    id: string, 
    data: UpdateEnrollment, 
    userContext: UserContext
  ): Promise<EnrollmentWithDetails> {
    // Validate tenant access first
    const enrollment = await getDb().query.enrollments.findFirst({
      where: eq(enrollments.id, id),
    });
    
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    if (!validateTenantAccess(enrollment.plantId, userContext.plantId)) {
      throw new Error('Access denied');
    }

    const [updatedEnrollment] = await getDb()
      .update(enrollments)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(enrollments.id, id))
      .returning();
    
    if (!updatedEnrollment) {
      throw new Error('Failed to update enrollment');
    }
    
    // Return with relations
    const result = await getDb().query.enrollments.findFirst({
      where: eq(enrollments.id, updatedEnrollment.id),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
    });
    
    if (!result) {
      throw new Error('Failed to fetch updated enrollment');
    }
    
    return mapEnrollmentWithRelationsToDTO(result as any);
  }

  // ========================================
  // ANALYTICS OPERATIONS
  // ========================================
  
  /**
   * Get analytics data
   */
  static async getAnalytics(
    filters: Record<string, any> = {}, // Analytics filters - using flexible object for now
    userContext: UserContext
  ): Promise<AnalyticsData> {
    // Get overview statistics
    const [usersResult, enrollmentsResult, completedResult] = await Promise.all([
      getDb().select({ count: count() }).from(profiles).where(eq(profiles.status, 'active')),
      getDb().select({ count: count() }).from(enrollments),
      getDb().select({ count: count() }).from(enrollments).where(eq(enrollments.status, 'completed'))
    ]);

    const totalUsers = usersResult[0]?.count || 0;
    const totalEnrollments = enrollmentsResult[0]?.count || 0;
    const completedCourses = completedResult[0]?.count || 0;
    const overallCompletionRate = totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0;

    return {
      plantStats: {
        totalUsers,
        activeEnrollments: totalEnrollments - completedCourses,
        completionRate: Math.round(overallCompletionRate * 10) / 10,
        averageProgress: 0 // Will be calculated when progress data is available
      },
      courseStats: {
        totalEnrollments,
        completedEnrollments: completedCourses,
        averageProgress: 0, // Will be calculated when progress data is available
        completionRate: Math.round(overallCompletionRate * 10) / 10
      },
      enrollmentStats: {
        total: totalEnrollments,
        completed: completedCourses,
        inProgress: totalEnrollments - completedCourses,
        enrolled: 0 // Will be calculated based on enrollment status
      },
      dashboardStats: {
        totalUsers,
        activeEnrollments: totalEnrollments - completedCourses,
        completionRate: Math.round(overallCompletionRate * 10) / 10,
        overdueTraining: 0, // Will be calculated based on training deadlines
        totalPlants: 0, // Will be calculated from plants table
        activePlants: 0 // Will be calculated from active plants
      }
    };
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(plantId?: string): Promise<DashboardStats> {
    const conditions = plantId ? [eq(enrollments.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const enrollmentStatsResult = await getDb()
      .select({
        totalEnrollments: count(),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
        inProgressEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'in_progress' THEN 1 END)`,
      })
      .from(enrollments)
      .where(whereClause);

    const enrollmentStats = enrollmentStatsResult[0];
    const total = enrollmentStats?.totalEnrollments || 0;
    const completed = enrollmentStats?.completedEnrollments || 0;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      totalUsers: 0, // Will be calculated from profiles table
      activeEnrollments: enrollmentStats?.inProgressEnrollments || 0,
      completionRate: Math.round(completionRate * 10) / 10,
      overdueTraining: 0, // Will be calculated based on training deadlines
      totalPlants: 0, // Will be calculated from plants table
      activePlants: 0 // Will be calculated from active plants
    };
  }
}

/**
 * Unified Tenant Filtering Utility
 * 
 * Consistent tenant filtering implementation across all database operations
 */
export class TenantFilter {
  /**
   * Apply tenant filtering to a query based on user context
   */
  static applyToQuery<T>(
    query: any, // TODO: Define proper query type
    userContext: UserContext,
    plantIdColumn: any = 'plantId' // TODO: Define proper column type
  ): any {
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
  static validateAccess(
    userContext: UserContext,
    plantId: string
  ): boolean {
    return userContext.accessiblePlants.includes(plantId);
  }
}
