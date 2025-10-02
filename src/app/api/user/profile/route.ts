/**
 * User Profile API - Simplified Implementation
 * GET: Get current user's profile
 * PATCH: Update current user's profile
 */

import { profiles } from '@/contracts';
import { getDb } from '@/lib/db';
import { RouteUtils } from '@/lib/route-utils';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Schema for profile updates
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  jobTitle: z.string().optional(),
});

// GET /api/user/profile - Get current user's profile
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    // Get user from auth context (this would be injected by UnifiedAuthMiddleware)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const profile = await getDb()
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!profile[0]) {
      throw new Error('Profile not found');
    }

    return RouteUtils.createSuccessResponse({
      id: profile[0].id,
      firstName: profile[0].firstName,
      lastName: profile[0].lastName,
      email: profile[0].email,
      jobTitle: profile[0].jobTitle,
      status: profile[0].status,
      plantId: profile[0].plantId,
    });
  }, {
    requireAuth: true
  });
}

// PATCH /api/user/profile - Update current user's profile
export async function PATCH(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody(req);
    if (!body) {
      throw new Error('Request body required');
    }

    // Get user from auth context
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Update profile
    const [updatedProfile] = await getDb()
      .update(profiles)
      .set({
        ...((body as any).firstName && { firstName: (body as any).firstName }),
        ...((body as any).lastName && { lastName: (body as any).lastName }),
        ...((body as any).jobTitle !== undefined && { jobTitle: (body as any).jobTitle }),
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId))
      .returning();

    if (!updatedProfile) {
      throw new Error('Failed to update profile');
    }

    return RouteUtils.createUpdatedResponse({
      id: updatedProfile.id,
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      email: updatedProfile.email,
      jobTitle: updatedProfile.jobTitle,
      status: updatedProfile.status,
    }, 'Profile updated successfully');
  }, {
    requireAuth: true,
    validateBody: updateProfileSchema
  });
}