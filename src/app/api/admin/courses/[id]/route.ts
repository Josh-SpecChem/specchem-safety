import { courses } from '@/contracts';
import { UnifiedAuthMiddleware } from '@/lib/auth/unified-auth-middleware';
import { getDb } from '@/lib/db';
import { NotFoundError, formatErrorResponse } from '@/lib/errors';
import { updateCourseSchema } from '@/lib/schemas';
import type { AdminRole } from '@/types/api';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    return await UnifiedAuthMiddleware.withAdminAuth(
      request,
      async () => {
        const { id } = await params;

        const course = await getDb()
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
      },
      { role: 'hr_admin' } as AdminRole
    );
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    return await UnifiedAuthMiddleware.withAdminAuth(
      request,
      async () => {
        const { id } = await params;
        const body = await request.json();
        
        // Validate request body
        const validatedData = updateCourseSchema.parse(body);

        const updatedCourse = await getDb()
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
      },
      { role: 'hr_admin' } as AdminRole
    );
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}