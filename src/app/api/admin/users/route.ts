import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { getUsersWithDetails, createProfile, updateProfile } from '@/lib/db/operations';
import { formatErrorResponse, ValidationError, DatabaseError } from '@/lib/errors';
import { userFiltersSchema, createProfileSchema, updateProfileSchema } from '@/lib/schemas';
import type { UserFilters, CreateProfile, UpdateProfile } from '@/lib/schemas';

/**
 * Admin API for user management
 * GET: List all users with filtering
 * POST: Create new user (invite)
 * PATCH: Update user role/status
 */

export async function GET(request: Request) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const { searchParams } = new URL(request.url);

      // Parse and validate query parameters
      const filters: UserFilters = {
        plantId: searchParams.get('plantId') || undefined,
        role: searchParams.get('role') || undefined,
        status: searchParams.get('isActive') === 'true' ? 'active' : 
                searchParams.get('isActive') === 'false' ? 'suspended' : undefined,
        search: searchParams.get('search') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '50'),
      };

      // Validate filters
      const validatedFilters = userFiltersSchema.parse(filters);

      const result = await getUsersWithDetails(validatedFilters);
      
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
      const validatedData = createProfileSchema.parse(body);

      const result = await createProfile(validatedData);
      
      if (!result.success) {
        throw new DatabaseError(result.error, result.code);
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'User profile created. User must complete registration via invitation link.',
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
      
      const { userId, ...updateData } = body;

      if (!userId) {
        throw new ValidationError('userId is required', 'userId');
      }

      // Validate update data
      const validatedData = updateProfileSchema.parse(updateData);

      const result = await updateProfile(userId, validatedData);
      
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