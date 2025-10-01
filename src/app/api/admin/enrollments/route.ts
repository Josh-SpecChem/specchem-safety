import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { getEnrollmentsWithDetails, createEnrollment, updateEnrollment } from '@/lib/db/operations';
import { formatErrorResponse, ValidationError, DatabaseError } from '@/lib/errors';
import { enrollmentFiltersSchema, createEnrollmentSchema, updateEnrollmentSchema } from '@/lib/schemas';
import type { EnrollmentFilters, CreateEnrollment, UpdateEnrollment } from '@/lib/schemas';

/**
 * Admin API for enrollment management
 * GET: List all enrollments with filtering
 * POST: Create new enrollment
 * PATCH: Update enrollment status
 */

export async function GET(request: Request) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const { searchParams } = new URL(request.url);

      // Parse and validate query parameters
      const filters: EnrollmentFilters = {
        plantId: searchParams.get('plantId') || undefined,
        courseId: searchParams.get('courseId') || undefined,
        userId: searchParams.get('userId') || undefined,
        status: searchParams.get('status') as 'enrolled' | 'in_progress' | 'completed' || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '50'),
      };

      // Validate filters
      const validatedFilters = enrollmentFiltersSchema.parse(filters);

      const result = await getEnrollmentsWithDetails(validatedFilters);
      
      if (!result.success) {
        throw new DatabaseError(result.error, result.code);
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}

export async function POST(request: Request) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const body = await request.json();
      
      // Validate request body
      const validatedData = createEnrollmentSchema.parse(body);

      const result = await createEnrollment(validatedData);
      
      if (!result.success) {
        throw new DatabaseError(result.error, result.code);
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}

export async function PATCH(request: Request) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const body = await request.json();
      
      const { enrollmentId, ...updateData } = body;

      if (!enrollmentId) {
        throw new ValidationError('enrollmentId is required', 'enrollmentId');
      }

      // Validate update data
      const validatedData = updateEnrollmentSchema.parse(updateData);

      const result = await updateEnrollment(enrollmentId, validatedData);
      
      if (!result.success) {
        throw new DatabaseError(result.error, result.code);
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}