import {
    and,
    count,
    courses,
    desc,
    enrollments,
    eq,
    mapEnrollmentToDTO,
    mapEnrollmentWithRelationsToDTO,
    sql,
    type CreateEnrollment,
    type DatabaseResponse,
    type Enrollment,
    type EnrollmentFilter,
    type EnrollmentWithRelations,
    type PaginatedResult,
    type UpdateEnrollment
} from '@/contracts';
import { FilterBuilder } from '../builders/filter-builder';
import { PaginationBuilder } from '../builders/pagination-builder';
import { getDb } from '../connection';
import { DatabaseErrorHandler } from '../wrappers/error-handler';
import { OperationWrapper } from '../wrappers/operation-wrapper';

// Use the contracts type for consistency
type EnrollmentWithDetails = EnrollmentWithRelations;

/**
 * EnrollmentOperations class for standardized enrollment database operations
 * Uses the new query builder pattern for consistent, maintainable code
 */
export class EnrollmentOperations {
  /**
   * Get enrollments with details using pagination and filtering
   */
  static async getEnrollmentsWithDetails(filters: EnrollmentFilter): Promise<DatabaseResponse<PaginatedResult<EnrollmentWithDetails>>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const pagination = PaginationBuilder.validateParams(filters);
      const filterConditions = FilterBuilder.createEnrollmentFilters(filters);
      
      // Execute query directly without QueryBuilder for now
      const enrollmentsData = await getDb().query.enrollments.findMany({
        with: {
          profile: true,
          course: true,
          plant: true,
        },
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        orderBy: [desc(enrollments.enrolledAt)],
      });
      
      // Get total count with null check
      const totalResult = await getDb().select({ count: count() }).from(enrollments);
      const total = totalResult[0]?.count ?? 0;
      
      return {
        items: enrollmentsData.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment)),
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      };
    });
  }

  /**
   * Create a new enrollment
   */
  static async createEnrollment(data: CreateEnrollment): Promise<DatabaseResponse<Enrollment>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      // Check if enrollment already exists
      const existing = await getDb().query.enrollments.findFirst({
        where: and(
          eq(enrollments.userId, data.userId),
          eq(enrollments.courseId, data.courseId)
        ),
      });

      if (existing) {
        DatabaseErrorHandler.handleConflictError('Enrollment', 'User is already enrolled in this course');
      }

      const [enrollment] = await getDb().insert(enrollments).values(data).returning();
      if (!enrollment) {
        throw new Error('Failed to create enrollment');
      }
      return mapEnrollmentToDTO(enrollment);
    });
  }

  /**
   * Update enrollment
   */
  static async updateEnrollment(id: string, data: UpdateEnrollment): Promise<DatabaseResponse<Enrollment>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const [enrollment] = await getDb()
        .update(enrollments)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(enrollments.id, id))
        .returning();
      
      if (!enrollment) {
        DatabaseErrorHandler.handleNotFoundError('Enrollment', id);
      }
      
      return mapEnrollmentToDTO(enrollment);
    });
  }

  /**
   * Delete enrollment
   */
  static async deleteEnrollment(id: string): Promise<DatabaseResponse<void>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const result = await getDb().delete(enrollments).where(eq(enrollments.id, id));
      
      if (result.count === 0) {
        DatabaseErrorHandler.handleNotFoundError('Enrollment', id);
      }
    });
  }

  /**
   * Get enrollments by user ID
   */
  static async getUserEnrollments(userId: string): Promise<EnrollmentWithDetails[]> {
    const enrollmentsData = await getDb().query.enrollments.findMany({
      where: eq(enrollments.userId, userId),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      orderBy: [desc(enrollments.enrolledAt)],
    });
    
    return enrollmentsData.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment));
  }

  /**
   * Get enrollments by course ID
   */
  static async getCourseEnrollments(
    courseId: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<EnrollmentWithDetails>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    
    const enrollmentsData = await getDb().query.enrollments.findMany({
      where: eq(enrollments.courseId, courseId),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      limit: validatedPagination.limit,
      offset: (validatedPagination.page - 1) * validatedPagination.limit,
      orderBy: [desc(enrollments.enrolledAt)],
    });
    
    const totalResult = await getDb().select({ count: count() }).from(enrollments).where(eq(enrollments.courseId, courseId));
    const total = totalResult[0]?.count ?? 0;
    
    return {
      items: enrollmentsData.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment)),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Get enrollments by plant ID
   */
  static async getPlantEnrollments(
    plantId: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<EnrollmentWithDetails>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    
    const enrollmentsData = await getDb().query.enrollments.findMany({
      where: eq(enrollments.plantId, plantId),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      limit: validatedPagination.limit,
      offset: (validatedPagination.page - 1) * validatedPagination.limit,
      orderBy: [desc(enrollments.enrolledAt)],
    });
    
    const totalResult = await getDb().select({ count: count() }).from(enrollments).where(eq(enrollments.plantId, plantId));
    const total = totalResult[0]?.count ?? 0;
    
    return {
      items: enrollmentsData.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment)),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Get enrollments by status
   */
  static async getEnrollmentsByStatus(
    status: 'enrolled' | 'in_progress' | 'completed',
    plantId?: string,
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<EnrollmentWithDetails>> {
    const validatedPagination = PaginationBuilder.validate(pagination);
    const conditions = [eq(enrollments.status, status)];
    
    if (plantId) {
      conditions.push(eq(enrollments.plantId, plantId));
    }
    
    // Use direct query for relational data
    const offset = (validatedPagination.page - 1) * validatedPagination.limit;
    
    const [results, totalCount] = await Promise.all([
      getDb().query.enrollments.findMany({
        where: and(...conditions),
        with: {
          profile: true,
          course: true,
          plant: true,
        },
        limit: validatedPagination.limit,
        offset,
      }),
      getDb().select({ count: count() }).from(enrollments).where(and(...conditions))
    ]);
    
    const total = totalCount[0]?.count || 0;
    
    return {
      items: results.map(mapEnrollmentWithRelationsToDTO),
      total,
      page: validatedPagination.page,
      limit: validatedPagination.limit,
      totalPages: Math.ceil(total / validatedPagination.limit),
    };
  }

  /**
   * Get enrollment statistics
   */
  static async getEnrollmentStats(plantId?: string): Promise<{
    totalEnrollments: number;
    completedEnrollments: number;
    inProgressEnrollments: number;
    enrolledCount: number;
    completionRate: number;
  }> {
    const conditions = plantId ? [eq(enrollments.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const totalResults = await getDb()
      .select({ count: count() })
      .from(enrollments)
      .where(whereClause);
    
    const completedResults = await getDb()
      .select({ count: count() })
      .from(enrollments)
      .where(whereClause ? and(...conditions, eq(enrollments.status, 'completed')) : eq(enrollments.status, 'completed'));
    
    const inProgressResults = await getDb()
      .select({ count: count() })
      .from(enrollments)
      .where(whereClause ? and(...conditions, eq(enrollments.status, 'in_progress')) : eq(enrollments.status, 'in_progress'));
    
    const enrolledResults = await getDb()
      .select({ count: count() })
      .from(enrollments)
      .where(whereClause ? and(...conditions, eq(enrollments.status, 'enrolled')) : eq(enrollments.status, 'enrolled'));
    
    const totalResult = totalResults[0] ?? { count: 0 };
    const completedResult = completedResults[0] ?? { count: 0 };
    const inProgressResult = inProgressResults[0] ?? { count: 0 };
    const enrolledResult = enrolledResults[0] ?? { count: 0 };
    
    const total = totalResult.count;
    const completed = completedResult.count;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      totalEnrollments: total,
      completedEnrollments: completed,
      inProgressEnrollments: inProgressResult.count,
      enrolledCount: enrolledResult.count,
      completionRate: Math.round(completionRate * 10) / 10
    };
  }

  /**
   * Check if user is enrolled in course
   */
  static async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await getDb().query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
      columns: { id: true }
    });
    
    return !!enrollment;
  }

  /**
   * Get enrollment by user and course
   */
  static async getEnrollmentByUserAndCourse(
    userId: string, 
    courseId: string
  ): Promise<EnrollmentWithDetails | null> {
    const enrollment = await getDb().query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
    });
    
    return enrollment ? mapEnrollmentWithRelationsToDTO(enrollment as any) : null;
  }

  /**
   * Bulk update enrollment status
   */
  static async bulkUpdateEnrollmentStatus(
    enrollmentIds: string[], 
    status: 'enrolled' | 'in_progress' | 'completed'
  ): Promise<DatabaseResponse<number>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      const result = await getDb()
        .update(enrollments)
        .set({ 
          status, 
          updatedAt: new Date().toISOString(),
          ...(status === 'completed' && { completedAt: new Date().toISOString() })
        })
        .where(sql`${enrollments.id} IN (${enrollmentIds.join(',')})`);
      
      return result.count || 0;
    });
  }

  /**
   * Get recent enrollments
   */
  static async getRecentEnrollments(
    days: number = 7,
    plantId?: string,
    limit: number = 50
  ): Promise<EnrollmentWithDetails[]> {
    const conditions = [
      sql`${enrollments.enrolledAt} >= NOW() - INTERVAL '${days} days'`
    ];
    
    if (plantId) {
      conditions.push(eq(enrollments.plantId, plantId));
    }
    
    const enrollmentsData = await getDb().query.enrollments.findMany({
      where: and(...conditions),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      limit,
      orderBy: [desc(enrollments.enrolledAt)],
    });
    
    return enrollmentsData.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment));
  }

  /**
   * Get overdue enrollments (enrolled but not started)
   */
  static async getOverdueEnrollments(
    daysThreshold: number = 30,
    plantId?: string
  ): Promise<EnrollmentWithDetails[]> {
    const conditions = [
      eq(enrollments.status, 'enrolled'),
      sql`${enrollments.enrolledAt} < NOW() - INTERVAL '${daysThreshold} days'`
    ];
    
    if (plantId) {
      conditions.push(eq(enrollments.plantId, plantId));
    }
    
    const enrollmentsData = await getDb().query.enrollments.findMany({
      where: and(...conditions),
      with: {
        profile: true,
        course: true,
        plant: true,
      },
      orderBy: [enrollments.enrolledAt],
    });
    
    return enrollmentsData.map((enrollment: any) => mapEnrollmentWithRelationsToDTO(enrollment));
  }

  /**
   * Get enrollment completion rate by course
   */
  static async getCourseCompletionRates(plantId?: string): Promise<Array<{
    courseId: string;
    courseName: string;
    totalEnrollments: number;
    completedEnrollments: number;
    completionRate: number;
  }>> {
    const conditions = plantId ? [eq(enrollments.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const results = await getDb()
      .select({
        courseId: courses.id,
        courseName: courses.title,
        totalEnrollments: count(enrollments.id),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .where(whereClause)
      .groupBy(courses.id, courses.title);
    
    return results.map((result: any) => ({
      courseId: result.courseId,
      courseName: result.courseName,
      totalEnrollments: result.totalEnrollments,
      completedEnrollments: result.completedEnrollments,
      completionRate: result.totalEnrollments > 0 
        ? Math.round((result.completedEnrollments / result.totalEnrollments) * 100 * 10) / 10
        : 0
    }));
  }
}
