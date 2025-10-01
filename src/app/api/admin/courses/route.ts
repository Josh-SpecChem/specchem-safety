import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { formatErrorResponse, ValidationError, DatabaseError } from '@/lib/errors';
import { createCourseSchema, updateCourseSchema } from '@/lib/schemas';
import type { CreateCourse, UpdateCourse } from '@/lib/schemas';
import { db } from '@/lib/db';
import { courses, enrollments, progress } from '@/lib/db/schema';
import { eq, sql, count } from 'drizzle-orm';

export async function GET() {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      // Get courses with enrollment and completion statistics
      const coursesWithStats = await db
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
      const formattedCourses = coursesWithStats.map(course => ({
        ...course,
        completionRate: course.totalEnrollments > 0 
          ? Math.round((course.completedEnrollments / course.totalEnrollments) * 100)
          : 0,
        avgProgress: Math.round(course.avgProgress || 0),
      }));

      // Get overall statistics
      const totalCourses = formattedCourses.length;
      const activeCourses = formattedCourses.filter(c => c.isPublished).length;
      const totalEnrollments = formattedCourses.reduce((sum, c) => sum + c.totalEnrollments, 0);
      const avgCompletionRate = totalEnrollments > 0 
        ? Math.round(formattedCourses.reduce((sum, c) => sum + (c.completionRate * c.totalEnrollments), 0) / totalEnrollments)
        : 0;

      return NextResponse.json({
        success: true,
        data: {
          courses: formattedCourses,
          statistics: {
            totalCourses,
            activeCourses,
            totalEnrollments,
            avgCompletionRate,
          }
        }
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const body = await request.json();
      
      // Validate request body
      const validatedData = createCourseSchema.parse(body);

      const newCourse = await db
        .insert(courses)
        .values(validatedData)
        .returning();

      return NextResponse.json({
        success: true,
        data: newCourse[0],
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}