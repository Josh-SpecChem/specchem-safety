import { db } from '../db';
import { profiles, plants, enrollments, progress, questionEvents, courses, adminRoles } from '../db/schema';
import { eq, and, desc, asc, count, avg, sql, or, like } from 'drizzle-orm';
import type { 
  CreateProfile, 
  UpdateProfile, 
  EnrollmentFilters, 
  ProgressFilters,
  PaginationParams,
  CreateEnrollment,
  UpdateEnrollment,
  CreateProgress,
  UpdateProgress,
  UserFilters
} from '../schemas';
import { DatabaseError, ValidationError, NotFoundError, ConflictError } from '../errors';
import type { 
  DatabaseResponse, 
  PaginatedResult, 
  ProfileWithDetails, 
  EnrollmentWithDetails,
  ProgressWithDetails,
  UserContext
} from '../../types/database';

// ========================================
// STANDARDIZED DATABASE OPERATION WRAPPER
// ========================================

/**
 * Wraps database operations with standardized error handling
 */
export async function withDatabaseOperation<T>(
  operation: () => Promise<T>
): Promise<DatabaseResponse<T>> {
  try {
    const data = await operation();
    return { data, success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      code: error instanceof DatabaseError ? error.code : 'UNKNOWN_ERROR'
    };
  }
}

// ========================================
// PROFILE OPERATIONS
// ========================================
export async function createProfile(data: CreateProfile): Promise<DatabaseResponse<Profile>> {
  return withDatabaseOperation(async () => {
    const [profile] = await db.insert(profiles).values(data).returning();
    return profile;
  });
}

export async function getProfile(id: string): Promise<DatabaseResponse<ProfileWithDetails | null>> {
  return withDatabaseOperation(async () => {
    const profile = await db.query.profiles.findFirst({
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
    return profile;
  });
}

export async function getProfileByEmail(email: string): Promise<DatabaseResponse<ProfileWithDetails | null>> {
  return withDatabaseOperation(async () => {
    const profile = await db.query.profiles.findFirst({
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
    return profile;
  });
}

export async function updateProfile(id: string, data: UpdateProfile): Promise<DatabaseResponse<Profile>> {
  return withDatabaseOperation(async () => {
    const [profile] = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(profiles.id, id))
      .returning();
    
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }
    
    return profile;
  });
}

export async function deleteProfile(id: string): Promise<DatabaseResponse<void>> {
  return withDatabaseOperation(async () => {
    const result = await db.delete(profiles).where(eq(profiles.id, id));
    if (result.rowCount === 0) {
      throw new NotFoundError('Profile not found');
    }
  });
}

export async function getUsersWithDetails(filters: UserFilters): Promise<DatabaseResponse<PaginatedResult<ProfileWithDetails>>> {
  return withDatabaseOperation(async () => {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [];
    
    if (filters.plantId) {
      conditions.push(eq(profiles.plantId, filters.plantId));
    }
    
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

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const profilesData = await db.query.profiles.findMany({
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
      limit,
      offset,
      orderBy: [asc(profiles.lastName), asc(profiles.firstName)],
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(profiles)
      .where(whereClause);

    return {
      data: profilesData as ProfileWithDetails[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  });
}

export async function getProfilesByPlant(plantId: string, pagination: PaginationParams = { page: 1, limit: 20 }) {
  const offset = (pagination.page - 1) * pagination.limit;
  
  const profilesData = await db.query.profiles.findMany({
    where: eq(profiles.plantId, plantId),
    with: {
      plant: true,
      adminRoles: true,
    },
    limit: pagination.limit,
    offset,
    orderBy: [asc(profiles.lastName), asc(profiles.firstName)],
  });

  const [{ total }] = await db
    .select({ total: count() })
    .from(profiles)
    .where(eq(profiles.plantId, plantId));

  return {
    data: profilesData,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit),
  };
}

// Plant operations
export async function getPlants() {
  return await db.query.plants.findMany({
    orderBy: [asc(plants.name)],
  });
}

export async function getActivePlants() {
  return await db.query.plants.findMany({
    where: eq(plants.isActive, true),
    orderBy: [asc(plants.name)],
  });
}

export async function getPlant(id: string) {
  return await db.query.plants.findFirst({
    where: eq(plants.id, id),
  });
}

// ========================================
// ENROLLMENT OPERATIONS
// ========================================

export async function createEnrollment(data: CreateEnrollment): Promise<DatabaseResponse<Enrollment>> {
  return withDatabaseOperation(async () => {
    // Check if enrollment already exists
    const existing = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, data.userId),
        eq(enrollments.courseId, data.courseId)
      ),
    });

    if (existing) {
      throw new ConflictError('User is already enrolled in this course');
    }

    const [enrollment] = await db.insert(enrollments).values(data).returning();
    return enrollment;
  });
}

export async function updateEnrollment(id: string, data: UpdateEnrollment): Promise<DatabaseResponse<Enrollment>> {
  return withDatabaseOperation(async () => {
    const [enrollment] = await db
      .update(enrollments)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(enrollments.id, id))
      .returning();
    
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }
    
    return enrollment;
  });
}

export async function deleteEnrollment(id: string): Promise<DatabaseResponse<void>> {
  return withDatabaseOperation(async () => {
    const result = await db.delete(enrollments).where(eq(enrollments.id, id));
    if (result.rowCount === 0) {
      throw new NotFoundError('Enrollment not found');
    }
  });
}

export async function getEnrollmentsWithDetails(filters: EnrollmentFilters): Promise<DatabaseResponse<PaginatedResult<EnrollmentWithDetails>>> {
  return withDatabaseOperation(async () => {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [];
    
    if (filters.plantId) {
      conditions.push(eq(enrollments.plantId, filters.plantId));
    }
    
    if (filters.courseId) {
      conditions.push(eq(enrollments.courseId, filters.courseId));
    }
    
    if (filters.userId) {
      conditions.push(eq(enrollments.userId, filters.userId));
    }
    
    if (filters.status) {
      conditions.push(eq(enrollments.status, filters.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const enrollmentsData = await db.query.enrollments.findMany({
      where: whereClause,
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      limit,
      offset,
      orderBy: [desc(enrollments.enrolledAt)],
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(enrollments)
      .where(whereClause);

    return {
      data: enrollmentsData as EnrollmentWithDetails[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  });
}

export async function getEnrollments(filter: EnrollmentFilters, pagination: PaginationParams = { page: 1, limit: 20 }) {
  const offset = (pagination.page - 1) * pagination.limit;
  
  const conditions = [];
  
  if (filter.plantId) {
    conditions.push(eq(enrollments.plantId, filter.plantId));
  }
  if (filter.courseId) {
    conditions.push(eq(enrollments.courseId, filter.courseId));
  }
  if (filter.status) {
    conditions.push(eq(enrollments.status, filter.status));
  }
  if (filter.userId) {
    conditions.push(eq(enrollments.userId, filter.userId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const enrollmentsData = await db.query.enrollments.findMany({
    where: whereClause,
    with: {
      profile: true,
      course: true,
      plant: true,
    },
    limit: pagination.limit,
    offset,
    orderBy: [desc(enrollments.enrolledAt)],
  });

  const [{ total }] = await db
    .select({ total: count() })
    .from(enrollments)
    .where(whereClause);

  return {
    data: enrollmentsData,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit),
  };
}

export async function getUserEnrollments(userId: string) {
  return await db.query.enrollments.findMany({
    where: eq(enrollments.userId, userId),
    with: {
      course: true,
      plant: true,
    },
    orderBy: [desc(enrollments.enrolledAt)],
  });
}

// ========================================
// PROGRESS OPERATIONS
// ========================================

export async function createProgress(data: CreateProgress): Promise<DatabaseResponse<Progress>> {
  return withDatabaseOperation(async () => {
    // Check if progress already exists
    const existing = await db.query.progress.findFirst({
      where: and(
        eq(progress.userId, data.userId),
        eq(progress.courseId, data.courseId)
      ),
    });

    if (existing) {
      throw new ConflictError('Progress record already exists for this user and course');
    }

    const [progressRecord] = await db.insert(progress).values(data).returning();
    return progressRecord;
  });
}

export async function updateProgress(id: string, data: UpdateProgress): Promise<DatabaseResponse<Progress>> {
  return withDatabaseOperation(async () => {
    const [progressRecord] = await db
      .update(progress)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(progress.id, id))
      .returning();
    
    if (!progressRecord) {
      throw new NotFoundError('Progress record not found');
    }
    
    return progressRecord;
  });
}

export async function deleteProgress(id: string): Promise<DatabaseResponse<void>> {
  return withDatabaseOperation(async () => {
    const result = await db.delete(progress).where(eq(progress.id, id));
    if (result.rowCount === 0) {
      throw new NotFoundError('Progress record not found');
    }
  });
}

export async function getProgressWithDetails(filter: ProgressFilters): Promise<DatabaseResponse<PaginatedResult<ProgressWithDetails>>> {
  return withDatabaseOperation(async () => {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [];
    
    if (filter.plantId) {
      conditions.push(eq(progress.plantId, filter.plantId));
    }
    
    if (filter.courseId) {
      conditions.push(eq(progress.courseId, filter.courseId));
    }
    
    if (filter.userId) {
      conditions.push(eq(progress.userId, filter.userId));
    }
    
    if (filter.minProgress !== undefined) {
      conditions.push(sql`${progress.progressPercent} >= ${filter.minProgress}`);
    }
    
    if (filter.maxProgress !== undefined) {
      conditions.push(sql`${progress.progressPercent} <= ${filter.maxProgress}`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const progressData = await db.query.progress.findMany({
      where: whereClause,
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      limit,
      offset,
      orderBy: [desc(progress.lastActiveAt)],
    });

    const [{ total }] = await db
      .select({ total: count() })
      .from(progress)
      .where(whereClause);

    return {
      data: progressData as ProgressWithDetails[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  });
}

export async function getProgress(filter: ProgressFilters, pagination: PaginationParams = { page: 1, limit: 20 }) {
  const offset = (pagination.page - 1) * pagination.limit;
  
  const conditions = [];
  
  if (filter.plantId) {
    conditions.push(eq(progress.plantId, filter.plantId));
  }
  if (filter.courseId) {
    conditions.push(eq(progress.courseId, filter.courseId));
  }
  if (filter.userId) {
    conditions.push(eq(progress.userId, filter.userId));
  }
  if (filter.minProgress !== undefined) {
    conditions.push(sql`${progress.progressPercent} >= ${filter.minProgress}`);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const progressData = await db.query.progress.findMany({
    where: whereClause,
    with: {
      profile: true,
      course: true,
      plant: true,
    },
    limit: pagination.limit,
    offset,
    orderBy: [desc(progress.lastActiveAt)],
  });

  const [{ total }] = await db
    .select({ total: count() })
    .from(progress)
    .where(whereClause);

  return {
    data: progressData,
    total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil(total / pagination.limit),
  };
}

export async function getUserProgress(userId: string, courseId?: string) {
  const conditions = [eq(progress.userId, userId)];
  
  if (courseId) {
    conditions.push(eq(progress.courseId, courseId));
  }

  const whereClause = and(...conditions);

  return await db.query.progress.findMany({
    where: whereClause,
    with: {
      course: true,
      plant: true,
    },
    orderBy: [desc(progress.lastActiveAt)],
  });
}

// Analytics operations
export async function getPlantStats(plantId: string) {
  const [enrollmentStats] = await db
    .select({
      totalEnrollments: count(),
      completedEnrollments: count(sql`CASE WHEN ${enrollments.status} = 'completed' THEN 1 END`),
      inProgressEnrollments: count(sql`CASE WHEN ${enrollments.status} = 'in_progress' THEN 1 END`),
    })
    .from(enrollments)
    .where(eq(enrollments.plantId, plantId));

  const [progressStats] = await db
    .select({
      averageProgress: avg(progress.progressPercent),
    })
    .from(progress)
    .where(eq(progress.plantId, plantId));

  return {
    ...enrollmentStats,
    averageProgress: progressStats.averageProgress || 0,
    completionRate: enrollmentStats.totalEnrollments > 0 
      ? (enrollmentStats.completedEnrollments / enrollmentStats.totalEnrollments) * 100 
      : 0,
  };
}

export async function getCourseStats(courseId: string, plantId?: string) {
  const enrollmentConditions = [eq(enrollments.courseId, courseId)];
  const progressConditions = [eq(progress.courseId, courseId)];
  
  if (plantId) {
    enrollmentConditions.push(eq(enrollments.plantId, plantId));
    progressConditions.push(eq(progress.plantId, plantId));
  }

  const enrollmentWhere = and(...enrollmentConditions);
  const progressWhere = and(...progressConditions);

  const [enrollmentStats] = await db
    .select({
      totalEnrollments: count(),
      completedEnrollments: count(sql`CASE WHEN ${enrollments.status} = 'completed' THEN 1 END`),
    })
    .from(enrollments)
    .where(enrollmentWhere);

  const [progressStats] = await db
    .select({
      averageProgress: avg(progress.progressPercent),
    })
    .from(progress)
    .where(progressWhere);

  return {
    ...enrollmentStats,
    averageProgress: progressStats.averageProgress || 0,
    completionRate: enrollmentStats.totalEnrollments > 0 
      ? (enrollmentStats.completedEnrollments / enrollmentStats.totalEnrollments) * 100 
      : 0,
  };
}

// ========================================
// COMPREHENSIVE ANALYTICS OPERATIONS
// ========================================

export async function getDetailedAnalytics(): Promise<DatabaseResponse<any>> {
  return withDatabaseOperation(async () => {
    // Get overview statistics
    const [usersResult, enrollmentsResult, completedResult] = await Promise.all([
      db.select({ count: count() }).from(profiles).where(eq(profiles.status, 'active')),
      db.select({ count: count() }).from(enrollments),
      db.select({ count: count() }).from(enrollments).where(eq(enrollments.status, 'completed'))
    ]);

    const totalUsers = usersResult[0].count;
    const activeUsers = usersResult[0].count;
    const totalEnrollments = enrollmentsResult[0].count;
    const completedCourses = completedResult[0].count;
    const overallCompletionRate = totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0;

    // Get course performance
    const coursePerformanceData = await db
      .select({
        courseId: courses.id,
        courseName: courses.title,
        totalEnrollments: count(enrollments.id),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
        avgProgress: sql<number>`COALESCE(AVG(${progress.progressPercent}), 0)`,
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(progress, eq(courses.id, progress.courseId))
      .groupBy(courses.id);

    const coursePerformance = coursePerformanceData.map(course => ({
      courseId: course.courseId,
      courseName: course.courseName,
      totalEnrollments: course.totalEnrollments,
      completedEnrollments: course.completedEnrollments,
      completionRate: course.totalEnrollments > 0 ? (course.completedEnrollments / course.totalEnrollments) * 100 : 0,
      averageScore: course.avgProgress,
      averageTimeToComplete: 0, // Would need additional calculation
    }));

    // Get plant performance
    const plantPerformanceData = await db
      .select({
        plantId: plants.id,
        plantName: plants.name,
        totalUsers: count(profiles.id),
        activeEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'in_progress' THEN 1 END)`,
        completedCourses: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
      })
      .from(plants)
      .leftJoin(profiles, eq(plants.id, profiles.plantId))
      .leftJoin(enrollments, eq(profiles.id, enrollments.userId))
      .groupBy(plants.id);

    const plantPerformance = plantPerformanceData.map(plant => ({
      plantId: plant.plantId,
      plantName: plant.plantName,
      totalUsers: plant.totalUsers,
      activeEnrollments: plant.activeEnrollments,
      completedCourses: plant.completedCourses,
      completionRate: plant.totalUsers > 0 ? (plant.completedCourses / plant.totalUsers) * 100 : 0,
    }));

    // Get question analytics
    const questionData = await db
      .select({
        courseId: questionEvents.courseId,
        sectionKey: questionEvents.sectionKey,
        questionKey: questionEvents.questionKey,
        totalAttempts: count(),
        correctAttempts: sql<number>`COUNT(CASE WHEN ${questionEvents.isCorrect} = true THEN 1 END)`,
        avgAttempts: sql<number>`AVG(${questionEvents.attemptIndex})`,
      })
      .from(questionEvents)
      .groupBy(questionEvents.courseId, questionEvents.sectionKey, questionEvents.questionKey);

    const questionAnalytics = questionData.map(q => ({
      courseId: q.courseId,
      courseName: '', // Would need join with courses
      sectionKey: q.sectionKey,
      questionKey: q.questionKey,
      totalAttempts: q.totalAttempts,
      correctAttempts: q.correctAttempts,
      accuracyRate: q.totalAttempts > 0 ? (q.correctAttempts / q.totalAttempts) * 100 : 0,
      averageAttempts: q.avgAttempts,
    }));

    return {
      overview: {
        totalUsers,
        activeUsers,
        totalEnrollments,
        completedCourses,
        overallCompletionRate: Math.round(overallCompletionRate * 10) / 10,
      },
      coursePerformance,
      plantPerformance,
      questionAnalytics,
      userActivity: [], // Would need additional implementation
      complianceTracking: plantPerformance.map(plant => ({
        plantId: plant.plantId,
        plantName: plant.plantName,
        courseId: '',
        courseName: 'All Courses',
        requiredUsers: plant.totalUsers,
        enrolledUsers: plant.activeEnrollments,
        completedUsers: plant.completedCourses,
        complianceRate: plant.completionRate,
        overdueUsers: Math.max(0, plant.totalUsers - plant.completedCourses),
      })),
    };
  });
}

// Question analytics
export async function getQuestionStats(plantId: string, courseId?: string, questionKey?: string) {
  const conditions = [eq(questionEvents.plantId, plantId)];
  
  if (courseId) {
    conditions.push(eq(questionEvents.courseId, courseId));
  }
  if (questionKey) {
    conditions.push(eq(questionEvents.questionKey, questionKey));
  }

  const whereClause = and(...conditions);

  const stats = await db
    .select({
      questionKey: questionEvents.questionKey,
      totalAttempts: count(),
      correctAttempts: count(sql`CASE WHEN ${questionEvents.isCorrect} = true THEN 1 END`),
      uniqueUsers: count(sql`DISTINCT ${questionEvents.userId}`),
    })
    .from(questionEvents)
    .where(whereClause)
    .groupBy(questionEvents.questionKey)
    .orderBy(questionEvents.questionKey);

  return stats.map(stat => ({
    ...stat,
    successRate: stat.totalAttempts > 0 ? (stat.correctAttempts / stat.totalAttempts) * 100 : 0,
  }));
}