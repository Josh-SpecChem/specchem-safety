import {
    activityEvents,
    courses,
    enrollments,
    plants,
    profiles,
    progress,
    questionEvents
} from '@/contracts';
import type {
    CoursePerformance,
    DatabaseResponse,
    PlantPerformance,
    PlantStatistics,
    QuestionStats
} from '@/types/database';
import { and, asc, avg, count, desc, eq, sql } from 'drizzle-orm';
import { getDb } from '../connection';
import { OperationWrapper } from '../wrappers/operation-wrapper';

/**
 * AnalyticsOperations class for comprehensive analytics and reporting
 * Provides detailed insights into system performance and user engagement
 */
export class AnalyticsOperations {
  /**
   * Get comprehensive analytics overview
   */
  static async getDetailedAnalytics(): Promise<DatabaseResponse<any>> {
    return OperationWrapper.withLegacyWrapper(async () => {
      // Get overview statistics
      const [usersResult, enrollmentsResult, completedResult] = await Promise.all([
        getDb().select({ count: count() }).from(profiles).where(eq(profiles.status, 'active')),
        getDb().select({ count: count() }).from(enrollments),
        getDb().select({ count: count() }).from(enrollments).where(eq(enrollments.status, 'completed'))
      ]);

      const totalUsers = usersResult[0]?.count || 0;
      const activeUsers = usersResult[0]?.count || 0;
      const totalEnrollments = enrollmentsResult[0]?.count || 0;
      const completedCourses = completedResult[0]?.count || 0;
      const overallCompletionRate = totalEnrollments > 0 ? (completedCourses / totalEnrollments) * 100 : 0;

      // Get course performance
      const coursePerformanceData = await getDb()
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

      const coursePerformance: CoursePerformance[] = coursePerformanceData.map((course: any) => ({
        courseId: course.courseId,
        courseName: course.courseName,
        totalEnrollments: course.totalEnrollments,
        completedEnrollments: course.completedEnrollments,
        completionRate: course.totalEnrollments > 0 ? (course.completedEnrollments / course.totalEnrollments) * 100 : 0,
        averageScore: course.avgProgress,
        averageTimeToComplete: 0, // Would need additional calculation
      }));

      // Get plant performance
      const plantPerformanceData = await getDb()
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

      const plantPerformance: PlantPerformance[] = plantPerformanceData.map((plant: any) => ({
        plantId: plant.plantId,
        plantName: plant.plantName,
        totalUsers: plant.totalUsers,
        activeEnrollments: plant.activeEnrollments,
        completedCourses: plant.completedCourses,
        completionRate: plant.totalUsers > 0 ? (plant.completedCourses / plant.totalUsers) * 100 : 0,
      }));

      // Get question analytics
      const questionData = await getDb()
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

      const questionAnalytics = questionData.map((q: any) => ({
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

  /**
   * Get plant statistics
   */
  static async getPlantStats(plantId: string): Promise<PlantStatistics> {
    const enrollmentStatsResult = await getDb()
      .select({
        totalEnrollments: count(),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
        inProgressEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'in_progress' THEN 1 END)`,
      })
      .from(enrollments)
      .where(eq(enrollments.plantId, plantId));

    const progressStatsResult = await getDb()
      .select({
        averageProgress: avg(progress.progressPercent),
      })
      .from(progress)
      .where(eq(progress.plantId, plantId));

    const userStatsResult = await getDb()
      .select({
        totalUsers: count(),
      })
      .from(profiles)
      .where(eq(profiles.plantId, plantId));

    const enrollmentStats = enrollmentStatsResult[0];
    const progressStats = progressStatsResult[0];
    const userStats = userStatsResult[0];

    const totalEnrollments = enrollmentStats?.totalEnrollments || 0;
    const completedEnrollments = enrollmentStats?.completedEnrollments || 0;
    const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

    return {
      totalUsers: userStats?.totalUsers || 0,
      activeEnrollments: enrollmentStats?.inProgressEnrollments || 0,
      completionRate: Math.round(completionRate * 10) / 10,
      averageProgress: Math.round((Number(progressStats?.averageProgress) || 0) * 10) / 10
    };
  }

  /**
   * Get course statistics
   */
  static async getCourseStats(courseId: string, plantId?: string): Promise<{
    totalEnrollments: number;
    completedEnrollments: number;
    averageProgress: number;
    completionRate: number;
  }> {
    const enrollmentConditions = [eq(enrollments.courseId, courseId)];
    const progressConditions = [eq(progress.courseId, courseId)];
    
    if (plantId) {
      enrollmentConditions.push(eq(enrollments.plantId, plantId));
      progressConditions.push(eq(progress.plantId, plantId));
    }

    const enrollmentWhere = and(...enrollmentConditions);
    const progressWhere = and(...progressConditions);

    const enrollmentStatsResult = await getDb()
      .select({
        totalEnrollments: count(),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
      })
      .from(enrollments)
      .where(enrollmentWhere);

    const progressStatsResult = await getDb()
      .select({
        averageProgress: avg(progress.progressPercent),
      })
      .from(progress)
      .where(progressWhere);

    const enrollmentStats = enrollmentStatsResult[0];
    const progressStats = progressStatsResult[0];

    const total = enrollmentStats?.totalEnrollments || 0;
    const completed = enrollmentStats?.completedEnrollments || 0;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      totalEnrollments: total,
      completedEnrollments: completed,
      averageProgress: Math.round((Number(progressStats?.averageProgress) || 0) * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10
    };
  }

  /**
   * Get question statistics
   */
  static async getQuestionStats(
    plantId: string, 
    courseId?: string, 
    questionKey?: string
  ): Promise<QuestionStats[]> {
    const conditions = [eq(questionEvents.plantId, plantId)];
    
    if (courseId) {
      conditions.push(eq(questionEvents.courseId, courseId));
    }
    if (questionKey) {
      conditions.push(eq(questionEvents.questionKey, questionKey));
    }

    const whereClause = and(...conditions);

    const stats = await getDb()
      .select({
        questionKey: questionEvents.questionKey,
        totalAttempts: count(),
        correctAttempts: sql<number>`COUNT(CASE WHEN ${questionEvents.isCorrect} = true THEN 1 END)`,
        uniqueUsers: sql<number>`COUNT(DISTINCT ${questionEvents.userId})`,
      })
      .from(questionEvents)
      .where(whereClause)
      .groupBy(questionEvents.questionKey)
      .orderBy(questionEvents.questionKey);

    return stats.map((stat: any) => ({
      questionKey: stat.questionKey,
      totalAttempts: stat.totalAttempts,
      correctAttempts: stat.correctAttempts,
      uniqueUsers: stat.uniqueUsers,
      successRate: stat.totalAttempts > 0 ? Math.round((stat.correctAttempts / stat.totalAttempts) * 100 * 10) / 10 : 0,
    }));
  }

  /**
   * Get user engagement metrics
   */
  static async getUserEngagementMetrics(plantId?: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    averageSessionsPerUser: number;
    averageTimeSpent: number;
  }> {
    const conditions = plantId ? [eq(profiles.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const userStatsResult = await getDb()
      .select({
        totalUsers: count(),
      })
      .from(profiles)
      .where(whereClause);

    const activityStatsResult = await getDb()
      .select({
        totalSessions: sql<number>`COUNT(DISTINCT ${activityEvents.userId})`,
        totalEvents: count(),
      })
      .from(activityEvents)
      .where(whereClause ? and(...conditions.map(c => eq(activityEvents.plantId, plantId!))) : undefined);

    const userStats = userStatsResult[0];
    const activityStats = activityStatsResult[0];

    return {
      totalUsers: userStats?.totalUsers || 0,
      activeUsers: activityStats?.totalSessions || 0,
      averageSessionsPerUser: (userStats?.totalUsers && userStats.totalUsers > 0) ? Math.round(((activityStats?.totalSessions || 0) / userStats.totalUsers) * 10) / 10 : 0,
      averageTimeSpent: 0, // Would need additional calculation
    };
  }

  /**
   * Get compliance tracking data
   */
  static async getComplianceTracking(plantId?: string): Promise<Array<{
    plantId: string;
    plantName: string;
    courseId: string;
    courseName: string;
    requiredUsers: number;
    enrolledUsers: number;
    completedUsers: number;
    complianceRate: number;
    overdueUsers: number;
  }>> {
    const conditions = plantId ? [eq(plants.id, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await getDb()
      .select({
        plantId: plants.id,
        plantName: plants.name,
        courseId: courses.id,
        courseName: courses.title,
        totalUsers: count(profiles.id),
        enrolledUsers: sql<number>`COUNT(DISTINCT ${enrollments.userId})`,
        completedUsers: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
      })
      .from(plants)
      .leftJoin(profiles, eq(plants.id, profiles.plantId))
      .leftJoin(enrollments, eq(profiles.id, enrollments.userId))
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(whereClause)
      .groupBy(plants.id, plants.name, courses.id, courses.title);

    return results.map((result: any) => {
      const complianceRate = result.totalUsers > 0 ? (result.completedUsers / result.totalUsers) * 100 : 0;
      return {
        plantId: result.plantId,
        plantName: result.plantName,
        courseId: result.courseId || '',
        courseName: result.courseName || '',
        requiredUsers: result.totalUsers,
        enrolledUsers: result.enrolledUsers,
        completedUsers: result.completedUsers,
        complianceRate: Math.round(complianceRate * 10) / 10,
        overdueUsers: Math.max(0, result.totalUsers - result.completedUsers),
      };
    });
  }

  /**
   * Get performance trends over time
   */
  static async getPerformanceTrends(
    days: number = 30,
    plantId?: string
  ): Promise<Array<{
    date: string;
    enrollments: number;
    completions: number;
    averageProgress: number;
  }>> {
    const conditions = [
      sql`${enrollments.enrolledAt} >= NOW() - INTERVAL '${days} days'`
    ];
    
    if (plantId) {
      conditions.push(eq(enrollments.plantId, plantId));
    }

    const results = await getDb()
      .select({
        date: sql<string>`DATE(${enrollments.enrolledAt})`,
        enrollments: count(),
        completions: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
        averageProgress: sql<number>`COALESCE(AVG(${progress.progressPercent}), 0)`,
      })
      .from(enrollments)
      .leftJoin(progress, eq(enrollments.userId, progress.userId))
      .where(and(...conditions))
      .groupBy(sql`DATE(${enrollments.enrolledAt})`)
      .orderBy(asc(sql`DATE(${enrollments.enrolledAt})`));

    return results.map((result: any) => ({
      date: result.date,
      enrollments: result.enrollments,
      completions: result.completions,
      averageProgress: Math.round(result.averageProgress * 10) / 10,
    }));
  }

  /**
   * Get top performing courses
   */
  static async getTopPerformingCourses(
    limit: number = 10,
    plantId?: string
  ): Promise<Array<{
    courseId: string;
    courseName: string;
    completionRate: number;
    averageProgress: number;
    totalEnrollments: number;
  }>> {
    const conditions = plantId ? [eq(enrollments.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

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
      .where(whereClause)
      .groupBy(courses.id, courses.title)
      .orderBy(desc(sql`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END) / NULLIF(COUNT(${enrollments.id}), 0)`))
      .limit(limit);

    return results.map((result: any) => ({
      courseId: result.courseId,
      courseName: result.courseName,
      completionRate: result.totalEnrollments > 0 
        ? Math.round((result.completedEnrollments / result.totalEnrollments) * 100 * 10) / 10
        : 0,
      averageProgress: Math.round(result.averageProgress * 10) / 10,
      totalEnrollments: result.totalEnrollments,
    }));
  }

  /**
   * Get user progress analytics
   */
  static async getUserProgressAnalytics(plantId?: string): Promise<{
    totalUsers: number;
    usersWithProgress: number;
    averageProgress: number;
    progressDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const conditions = plantId ? [eq(progress.plantId, plantId)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const totalStatsResult = await getDb()
      .select({
        totalUsers: sql<number>`COUNT(DISTINCT ${profiles.id})`,
        usersWithProgress: sql<number>`COUNT(DISTINCT ${progress.userId})`,
        averageProgress: sql<number>`COALESCE(AVG(${progress.progressPercent}), 0)`,
      })
      .from(profiles)
      .leftJoin(progress, eq(profiles.id, progress.userId))
      .where(whereClause);

    const totalStats = totalStatsResult[0];

    // Get progress distribution
    const distribution = await getDb()
      .select({
        range: sql<string>`CASE 
          WHEN ${progress.progressPercent} = 0 THEN '0%'
          WHEN ${progress.progressPercent} BETWEEN 1 AND 25 THEN '1-25%'
          WHEN ${progress.progressPercent} BETWEEN 26 AND 50 THEN '26-50%'
          WHEN ${progress.progressPercent} BETWEEN 51 AND 75 THEN '51-75%'
          WHEN ${progress.progressPercent} BETWEEN 76 AND 99 THEN '76-99%'
          WHEN ${progress.progressPercent} = 100 THEN '100%'
          ELSE 'Unknown'
        END`,
        count: count(),
      })
      .from(progress)
      .where(whereClause)
      .groupBy(sql`CASE 
        WHEN ${progress.progressPercent} = 0 THEN '0%'
        WHEN ${progress.progressPercent} BETWEEN 1 AND 25 THEN '1-25%'
        WHEN ${progress.progressPercent} BETWEEN 26 AND 50 THEN '26-50%'
        WHEN ${progress.progressPercent} BETWEEN 51 AND 75 THEN '51-75%'
        WHEN ${progress.progressPercent} BETWEEN 76 AND 99 THEN '76-99%'
        WHEN ${progress.progressPercent} = 100 THEN '100%'
        ELSE 'Unknown'
      END`);

    const totalCount = distribution.reduce((sum: number, item: any) => sum + item.count, 0);

    return {
      totalUsers: totalStats?.totalUsers || 0,
      usersWithProgress: totalStats?.usersWithProgress || 0,
      averageProgress: Math.round((totalStats?.averageProgress || 0) * 10) / 10,
      progressDistribution: distribution.map((item: any) => ({
        range: item.range,
        count: item.count,
        percentage: totalCount > 0 ? Math.round((item.count / totalCount) * 100 * 10) / 10 : 0,
      })),
    };
  }
}
