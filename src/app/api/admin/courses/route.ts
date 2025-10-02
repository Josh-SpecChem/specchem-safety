/**
 * Admin API for course management - Simplified Implementation
 * GET: List all courses with statistics
 * POST: Create new course
 */

import { CommonSchemas } from '@/app/api/shared/utils/validation-utils';
import { courses, enrollments, progress } from '@/contracts';
import { getDb } from '@/lib/db';
import { RouteUtils } from '@/lib/route-utils';
import { count, eq, sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';

// GET /api/admin/courses - List courses with statistics
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(request, async () => {
    // Get courses with enrollment and completion statistics
    const coursesWithStats = await getDb()
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        version: courses.version,
        isPublished: courses.isPublished,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        totalEnrollments: count(enrollments.id),
        completedEnrollments: sql<number>`COUNT(CASE WHEN ${enrollments.completedAt} IS NOT NULL THEN 1 END)`,
        avgProgress: sql<number>`COALESCE(AVG(${progress.progressPercent}), 0)`,
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(progress, eq(courses.id, progress.courseId))
      .groupBy(courses.id)
      .orderBy(courses.title);

    // Calculate completion rates and format response
    const formattedCourses = coursesWithStats.map((course: any) => ({
      ...course,
      completionRate: course.totalEnrollments > 0 
        ? Math.round((course.completedEnrollments / course.totalEnrollments) * 100)
        : 0,
      avgProgress: Math.round(course.avgProgress || 0),
    }));

    // Get overall statistics
    const totalCourses = formattedCourses.length;
    const activeCourses = formattedCourses.filter((c: any) => c.isPublished).length;
    const totalEnrollments = formattedCourses.reduce((sum: number, c: any) => sum + c.totalEnrollments, 0);
    const avgCompletionRate = totalEnrollments > 0 
      ? Math.round(formattedCourses.reduce((sum: number, c: any) => sum + (c.completionRate * c.totalEnrollments), 0) / totalEnrollments)
      : 0;

    return RouteUtils.createSuccessResponse({
      courses: formattedCourses,
      statistics: {
        totalCourses,
        activeCourses,
        totalEnrollments,
        avgCompletionRate,
      }
    });
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateQuery: CommonSchemas.courseFilters
  });
}

// POST /api/admin/courses - Create new course
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody(req);
    if (!body) {
      throw new Error('Request body required');
    }

    const newCourse = await getDb()
      .insert(courses)
      .values(body as any)
      .returning();

    return RouteUtils.createCreatedResponse(newCourse[0], 'Course created successfully');
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateBody: CommonSchemas.createCourse
  });
}