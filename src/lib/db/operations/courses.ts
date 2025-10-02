import {
    and,
    asc,
    count,
    courses,
    desc,
    enrollments,
    eq,
    mapCourseToDTO,
    mapCoursesToDTO,
    progress,
    sql,
    type Course,
    type CourseFilter,
    type CourseStatistics,
    type CreateCourse,
    type DatabaseResponse,
    type PaginatedResult,
    type UpdateCourse
} from '@/contracts';
import { FilterBuilder } from '../builders/filter-builder';
import { PaginationBuilder } from '../builders/pagination-builder';
import { getDb } from '../connection';
import { DatabaseErrorHandler } from '../wrappers/error-handler';
import { OperationWrapper } from '../wrappers/operation-wrapper';

// Define CourseWithDetails locally since it's not in contracts
export interface CourseWithDetails extends Course {
  enrollments: Array<{
    id: string;
    userId: string;
    courseId: string;
    plantId: string;
    status: 'enrolled' | 'in_progress' | 'completed';
    enrolledAt: string;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    profile: {
      id: string;
      plantId: string;
      firstName: string;
      lastName: string;
      email: string;
      jobTitle: string | null;
      status: 'active' | 'suspended';
      createdAt: string;
      updatedAt: string;
    };
  }>;
  progresses: Array<{
    id: string;
    userId: string;
    courseId: string;
    plantId: string;
    progressPercent: number;
    currentSection: string | null;
    lastActiveAt: string;
    createdAt: string;
    updatedAt: string;
    profile: {
      id: string;
      plantId: string;
      firstName: string;
      lastName: string;
      email: string;
      jobTitle: string | null;
      status: 'active' | 'suspended';
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

/**
 * CourseOperations class for standardized course database operations
 * Uses the new query builder pattern for consistent, maintainable code
 */
export class CourseOperations {
  /**
   * Get courses with details using pagination and filtering
   */
  static async getCoursesWithDetails(filters: CourseFilter): Promise<DatabaseResponse<PaginatedResult<CourseWithDetails>>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const pagination = PaginationBuilder.validateParams(filters);
      const filterConditions = FilterBuilder.createCourseFilters(filters);
      
      // Execute query directly without QueryBuilder for now
      const coursesData = await getDb().query.courses.findMany({
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
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
      });
      
      // Get total count with null check
      const totalResult = await getDb().select({ count: count() }).from(courses);
      const total = totalResult[0]?.count ?? 0;
      
      return {
        items: coursesData as CourseWithDetails[],
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      };
    });
  }

  /**
   * Get course by ID with all related data
   */
  static async getCourseById(id: string): Promise<DatabaseResponse<CourseWithDetails | null>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const course = await getDb().query.courses.findFirst({
        where: eq(courses.id, id),
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
      
      return course ? (course as CourseWithDetails) : null;
    });
  }

  /**
   * Get course by slug
   */
  static async getCourseBySlug(slug: string): Promise<DatabaseResponse<Course | null>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const course = await getDb().query.courses.findFirst({
        where: eq(courses.slug, slug),
      });
      
      return course ? mapCourseToDTO(course) : null;
    });
  }

  /**
   * Create a new course
   */
  static async createCourse(data: CreateCourse): Promise<DatabaseResponse<Course>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      // Check if course with slug already exists
      const existing = await getDb().query.courses.findFirst({
        where: eq(courses.slug, data.slug)
      });

      if (existing) {
        DatabaseErrorHandler.handleConflictError('Course', 'Course with this slug already exists');
      }

      const [course] = await getDb().insert(courses).values(data).returning();
      if (!course) {
        throw new Error('Failed to create course');
      }
      return mapCourseToDTO(course);
    });
  }

  /**
   * Update course
   */
  static async updateCourse(id: string, data: UpdateCourse): Promise<DatabaseResponse<Course>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const [course] = await getDb()
        .update(courses)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(courses.id, id))
        .returning();
      
      if (!course) {
        DatabaseErrorHandler.handleNotFoundError('Course', id);
      }
      
      return mapCourseToDTO(course);
    });
  }

  /**
   * Delete course
   */
  static async deleteCourse(id: string): Promise<DatabaseResponse<void>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const result = await getDb().delete(courses).where(eq(courses.id, id));
      
      if (result.count === 0) {
        DatabaseErrorHandler.handleNotFoundError('Course', id);
      }
    });
  }

  /**
   * Get published courses
   */
  static async getPublishedCourses(
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<Course>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    
    // Use direct database query instead of QueryBuilder for relational queries
    const coursesData = await getDb().query.courses.findMany({
      where: eq(courses.isPublished, true),
      limit: validatedPagination.limit,
      offset: (validatedPagination.page - 1) * validatedPagination.limit,
      orderBy: [asc(courses.title)],
    });
    
    const totalResult = await getDb().select({ count: count() }).from(courses).where(eq(courses.isPublished, true));
    const total = totalResult[0]?.count ?? 0;
    
    return {
      items: mapCoursesToDTO(coursesData),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Get all courses (admin only)
   */
  static async getAllCourses(
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<Course>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    
    // Use direct database query instead of QueryBuilder for relational queries
    const coursesData = await getDb().query.courses.findMany({
      limit: validatedPagination.limit,
      offset: (validatedPagination.page - 1) * validatedPagination.limit,
      orderBy: [asc(courses.title)],
    });
    
    const totalResult = await getDb().select({ count: count() }).from(courses);
    const total = totalResult[0]?.count ?? 0;
    
    return {
      items: mapCoursesToDTO(coursesData),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Search courses by title or slug
   */
  static async searchCourses(
    searchTerm: string,
    publishedOnly: boolean = true,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<Course>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    
    // Build search conditions
    const searchConditions = [
      sql`${courses.title} ILIKE ${`%${searchTerm}%`}`,
      sql`${courses.slug} ILIKE ${`%${searchTerm}%`}`
    ];
    
    const whereCondition = publishedOnly 
      ? and(eq(courses.isPublished, true), sql`(${searchConditions.join(' OR ')})`)
      : sql`(${searchConditions.join(' OR ')})`;
    
    // Use direct database query
    const coursesData = await getDb().query.courses.findMany({
      where: whereCondition,
      limit: validatedPagination.limit,
      offset: (validatedPagination.page - 1) * validatedPagination.limit,
      orderBy: [asc(courses.title)],
    });
    
    const totalResult = await getDb().select({ count: count() }).from(courses).where(whereCondition);
    const total = totalResult[0]?.count ?? 0;
    
    return {
      items: mapCoursesToDTO(coursesData),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Get course statistics
   */
  static async getCourseStats(courseId: string): Promise<CourseStatistics> {
    const enrollmentResult = await getDb()
      .select({
        totalEnrollments: count(),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
      })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));

    const progressResult = await getDb()
      .select({
        averageProgress: sql<number>`COALESCE(AVG(${progress.progressPercent}), 0)`,
      })
      .from(progress)
      .where(eq(progress.courseId, courseId));

    const enrollmentStats = enrollmentResult[0] ?? { totalEnrollments: 0, completedEnrollments: 0 };
    const progressStats = progressResult[0] ?? { averageProgress: 0 };

    const total = enrollmentStats.totalEnrollments;
    const completed = enrollmentStats.completedEnrollments;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      totalEnrollments: total,
      completedEnrollments: completed,
      averageProgress: Math.round(progressStats.averageProgress * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10
    };
  }

  /**
   * Get course enrollment statistics by plant
   */
  static async getCourseStatsByPlant(courseId: string, plantId: string): Promise<CourseStatistics> {
    const enrollmentResult = await getDb()
      .select({
        totalEnrollments: count(),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
      })
      .from(enrollments)
      .where(and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.plantId, plantId)
      ));

    const progressResult = await getDb()
      .select({
        averageProgress: sql<number>`COALESCE(AVG(${progress.progressPercent}), 0)`,
      })
      .from(progress)
      .where(and(
        eq(progress.courseId, courseId),
        eq(progress.plantId, plantId)
      ));

    const enrollmentStats = enrollmentResult[0] ?? { totalEnrollments: 0, completedEnrollments: 0 };
    const progressStats = progressResult[0] ?? { averageProgress: 0 };

    const total = enrollmentStats.totalEnrollments;
    const completed = enrollmentStats.completedEnrollments;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      totalEnrollments: total,
      completedEnrollments: completed,
      averageProgress: Math.round(progressStats.averageProgress * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10
    };
  }

  /**
   * Check if course exists
   */
  static async courseExists(id: string): Promise<boolean> {
    const course = await getDb().query.courses.findFirst({
      where: eq(courses.id, id),
      columns: { id: true }
    });
    
    return !!course;
  }

  /**
   * Check if slug is available
   */
  static async isSlugAvailable(slug: string, excludeCourseId?: string): Promise<boolean> {
    const conditions = [eq(courses.slug, slug)];
    
    if (excludeCourseId) {
      conditions.push(sql`${courses.id} != ${excludeCourseId}`);
    }
    
    const course = await getDb().query.courses.findFirst({
      where: and(...conditions),
      columns: { id: true }
    });
    
    return !course;
  }

  /**
   * Get courses by version
   */
  static async getCoursesByVersion(version: string): Promise<Course[]> {
    const coursesData = await getDb().query.courses.findMany({
      where: eq(courses.version, version),
      orderBy: [asc(courses.title)],
    });
    
    return mapCoursesToDTO(coursesData);
  }

  /**
   * Bulk update course publish status
   */
  static async bulkUpdatePublishStatus(
    courseIds: string[], 
    isPublished: boolean
  ): Promise<DatabaseResponse<number>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const result = await getDb()
        .update(courses)
        .set({ 
          isPublished, 
          updatedAt: new Date().toISOString() 
        })
        .where(sql`${courses.id} IN (${courseIds.join(',')})`);
      
      return result.count || 0;
    });
  }

  /**
   * Get course completion rates across all plants
   */
  static async getCourseCompletionRates(): Promise<Array<{
    courseId: string;
    courseName: string;
    totalEnrollments: number;
    completedEnrollments: number;
    completionRate: number;
    averageProgress: number;
  }>> {
    const results = await getDb()
      .select({
        courseId: courses.id,
        courseName: courses.title,
        totalEnrollments: count(enrollments.id),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
        averageProgress: sql<number>`COALESCE(AVG(${progress.progressPercent}), 0)`,
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(progress, eq(courses.id, progress.courseId))
      .groupBy(courses.id, courses.title);
    
    return results.map((result: any) => ({
      courseId: result.courseId,
      courseName: result.courseName,
      totalEnrollments: result.totalEnrollments,
      completedEnrollments: result.completedEnrollments,
      completionRate: result.totalEnrollments > 0 
        ? Math.round((result.completedEnrollments / result.totalEnrollments) * 100 * 10) / 10
        : 0,
      averageProgress: Math.round(result.averageProgress * 10) / 10
    }));
  }

  /**
   * Get most popular courses (by enrollment count)
   */
  static async getMostPopularCourses(
    limit: number = 10,
    publishedOnly: boolean = true
  ): Promise<Array<{
    courseId: string;
    courseName: string;
    enrollmentCount: number;
  }>> {
    const conditions = publishedOnly ? [eq(courses.isPublished, true)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const results = await getDb()
      .select({
        courseId: courses.id,
        courseName: courses.title,
        enrollmentCount: count(enrollments.id),
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .where(whereClause)
      .groupBy(courses.id, courses.title)
      .orderBy(desc(count(enrollments.id)))
      .limit(limit);
    
    return results.map((result: any) => ({
      courseId: result.courseId,
      courseName: result.courseName,
      enrollmentCount: result.enrollmentCount
    }));
  }

  /**
   * Get courses with low completion rates
   */
  static async getCoursesWithLowCompletionRates(
    threshold: number = 50,
    limit: number = 10
  ): Promise<Array<{
    courseId: string;
    courseName: string;
    completionRate: number;
    totalEnrollments: number;
  }>> {
    const results = await getDb()
      .select({
        courseId: courses.id,
        courseName: courses.title,
        totalEnrollments: count(enrollments.id),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .groupBy(courses.id, courses.title)
      .having(sql`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END) / NULLIF(COUNT(${enrollments.id}), 0) * 100 < ${threshold}`)
      .orderBy(asc(sql`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END) / NULLIF(COUNT(${enrollments.id}), 0)`))
      .limit(limit);
    
    return results.map((result: any) => ({
      courseId: result.courseId,
      courseName: result.courseName,
      completionRate: result.totalEnrollments > 0 
        ? Math.round((result.completedEnrollments / result.totalEnrollments) * 100 * 10) / 10
        : 0,
      totalEnrollments: result.totalEnrollments
    }));
  }
}
