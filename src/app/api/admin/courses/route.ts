import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, enrollments, progress } from '@/lib/db/schema';
import { eq, sql, count } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['hr_admin', 'dev_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['hr_admin', 'dev_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      version = '1.0',
      isPublished = false
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCourse = await db
      .insert(courses)
      .values({
        title,
        slug,
        version,
        isPublished,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCourse[0]
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}