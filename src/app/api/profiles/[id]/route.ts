/**
 * Profile API Route - Contract System Example
 * 
 * This route demonstrates the proper use of the contract workflow:
 * 1. Request validation with Zod contracts
 * 2. Database operations with tenant isolation
 * 3. Response mapping with DTOs
 * 4. Response validation
 */

import {
    ProfileSchema,
    UpdateProfileSchema,
    UuidSchema,
    createSuccessResponse,
    createValidationErrorResponse,
    mapProfileToDTO,
    validateRequestBody,
    validateResponse,
    validateRouteParams
} from '@/contracts';
import { profiles } from '@/contracts/schema.app';
import { getDb } from '@/lib/db';
import { and, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Route parameter validation schema
const RouteParamsSchema = z.object({
  id: UuidSchema,
});

// ========================================
// GET /api/profiles/[id] - Get Profile by ID
// ========================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validate route parameters
    const paramsValidation = validateRouteParams(params, RouteParamsSchema);
    if (!paramsValidation.success) {
      return createValidationErrorResponse(paramsValidation.error);
    }

    const { id } = paramsValidation.data;

    // 2. Get user context (would come from auth middleware)
    const userPlantId = request.headers.get('x-plant-id');
    const userId = request.headers.get('x-user-id');
    
    if (!userPlantId || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Authentication required',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Query database with tenant isolation
    const dbProfile = await getDb()
      .select()
      .from(profiles)
      .where(and(
        eq(profiles.id, id),
        eq(profiles.plantId, userPlantId) // ← Tenant isolation
      ))
      .limit(1);

    if (!dbProfile[0]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Profile not found',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Map database row to DTO
    const profileDTO = mapProfileToDTO(dbProfile[0]);

    // 5. Validate response before sending
    const responseValidation = validateResponse(ProfileSchema, profileDTO);
    if (!responseValidation.success) {
      console.error('Response validation failed:', responseValidation.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Return standardized success response
    return createSuccessResponse(responseValidation.data, 'Profile retrieved successfully');

  } catch (error) {
    console.error('Profile GET failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ========================================
// PATCH /api/profiles/[id] - Update Profile
// ========================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validate route parameters
    const paramsValidation = validateRouteParams(params, RouteParamsSchema);
    if (!paramsValidation.success) {
      return createValidationErrorResponse(paramsValidation.error);
    }

    const { id } = paramsValidation.data;

    // 2. Validate request body
    const bodyValidation = await validateRequestBody(request, UpdateProfileSchema);
    if (!bodyValidation.success) {
      return createValidationErrorResponse(bodyValidation.error);
    }

    const updateData = bodyValidation.data;

    // 3. Get user context (would come from auth middleware)
    const userPlantId = request.headers.get('x-plant-id');
    const userId = request.headers.get('x-user-id');
    
    if (!userPlantId || !userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Authentication required',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Check if user can update this profile (business logic)
    const canUpdate = userId === id || request.headers.get('x-user-role') === 'hr_admin';
    if (!canUpdate) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Access denied',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Update database with tenant isolation
    const updatedProfiles = await getDb()
      .update(profiles)
      .set({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .where(and(
        eq(profiles.id, id),
        eq(profiles.plantId, userPlantId) // ← Tenant isolation
      ))
      .returning();

    if (!updatedProfiles[0]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Profile not found or access denied',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Map database row to DTO
    const profileDTO = mapProfileToDTO(updatedProfiles[0]);

    // 7. Validate response before sending
    const responseValidation = validateResponse(ProfileSchema, profileDTO);
    if (!responseValidation.success) {
      console.error('Response validation failed:', responseValidation.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 8. Return standardized success response
    return createSuccessResponse(responseValidation.data, 'Profile updated successfully');

  } catch (error) {
    console.error('Profile PATCH failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ========================================
// DELETE /api/profiles/[id] - Delete Profile
// ========================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validate route parameters
    const paramsValidation = validateRouteParams(params, RouteParamsSchema);
    if (!paramsValidation.success) {
      return createValidationErrorResponse(paramsValidation.error);
    }

    const { id } = paramsValidation.data;

    // 2. Get user context (would come from auth middleware)
    const userPlantId = request.headers.get('x-plant-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userPlantId || userRole !== 'hr_admin') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Admin access required',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Delete from database with tenant isolation
    const deletedProfiles = await getDb()
      .delete(profiles)
      .where(and(
        eq(profiles.id, id),
        eq(profiles.plantId, userPlantId) // ← Tenant isolation
      ))
      .returning();

    if (!deletedProfiles[0]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Profile not found or access denied',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Return success response (no data needed for delete)
    return createSuccessResponse(null, 'Profile deleted successfully');

  } catch (error) {
    console.error('Profile DELETE failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
