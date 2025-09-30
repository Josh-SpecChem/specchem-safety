import { db } from '../db';
import { profiles, plants, enrollments, progress, questionEvents } from '../db/schema';
import { eq, and, desc, asc, count, avg, sql, type SQL } from 'drizzle-orm';
import type { 
  CreateProfile, 
  UpdateProfile, 
  EnrollmentFilter, 
  ProgressFilter,
  PaginationParams 
} from '../validations';

// Profile operations
export async function createProfile(data: CreateProfile) {
  const [profile] = await db.insert(profiles).values(data).returning();
  return profile;
}

export async function getProfile(id: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, id),
    with: {
      plant: true,
      adminRoles: true,
    },
  });
  return profile;
}

export async function getProfileByEmail(email: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.email, email),
    with: {
      plant: true,
      adminRoles: true,
    },
  });
  return profile;
}

export async function updateProfile(id: string, data: UpdateProfile) {
  const [profile] = await db
    .update(profiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(profiles.id, id))
    .returning();
  return profile;
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

// Enrollment operations
export async function getEnrollments(filter: EnrollmentFilter, pagination: PaginationParams = { page: 1, limit: 20 }) {
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
      user: true,
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

// Progress operations
export async function getProgress(filter: ProgressFilter, pagination: PaginationParams = { page: 1, limit: 20 }) {
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
      user: true,
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