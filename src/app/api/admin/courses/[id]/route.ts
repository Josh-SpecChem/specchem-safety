import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { formatErrorResponse, ValidationError, DatabaseError, NotFoundError } from '@/lib/errors';
import { updateCourseSchema } from '@/lib/schemas';
import type { UpdateCourse } from '@/lib/schemas';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const { id } = await params;

      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.id, id))
        .limit(1);

      if (course.length === 0) {
        throw new NotFoundError('Course not found');
      }

      return NextResponse.json({
        success: true,
        data: course[0],
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const { id } = await params;
      const body = await request.json();
      
      // Validate request body
      const validatedData = updateCourseSchema.parse(body);

      const updatedCourse = await db
        .update(courses)
        .set({ 
          ...validatedData,
          updatedAt: new Date().toISOString()
        })
        .where(eq(courses.id, id))
        .returning();

      if (updatedCourse.length === 0) {
        throw new NotFoundError('Course not found');
      }

      return NextResponse.json({
        success: true,
        data: updatedCourse[0],
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}