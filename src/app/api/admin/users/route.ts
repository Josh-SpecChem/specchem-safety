/**
 * Admin API for user management - Simplified Implementation
 * GET: List all users with filtering
 * POST: Create new user (invite)
 */

import { NextRequest } from 'next/server';
import { RouteUtils } from '@/lib/route-utils';
import { UserOperationsCompat } from '@/lib/db/operations';
import { CommonSchemas } from '@/app/api/shared/utils/validation-utils';
import type { AdminRole } from '@/types/api';
import type { CreateProfile } from '@/types';

// GET /api/admin/users - List users with pagination
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const query = RouteUtils.getValidatedQuery(req) || {};
    const result = await UserOperationsCompat.getUsersWithDetails(query as any);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return RouteUtils.createSuccessResponse(result.data);
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateQuery: CommonSchemas.userFilters
  });
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody<CreateProfile>(req);
    if (!body) {
      throw new Error('Request body required');
    }
    
    const result = await UserOperationsCompat.createUser(body);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return RouteUtils.createCreatedResponse(result.data, 'User created successfully');
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateBody: CommonSchemas.createUser
  });
}

// For PATCH operations, we'll create a custom handler since it's not part of standard CRUD
export async function PATCH(request: Request) {
  const { UnifiedAuthMiddleware } = await import('@/lib/auth/unified-auth-middleware');
  const { formatErrorResponse, ValidationError, DatabaseError } = await import('@/lib/errors');
  const { updateProfile } = await import('@/lib/db/operations');
  const { updateProfileSchema } = await import('@/lib/schemas');
  const { NextResponse } = await import('next/server');

  try {
    return await UnifiedAuthMiddleware.withAdminAuth(
      request as NextRequest,
      async () => {
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