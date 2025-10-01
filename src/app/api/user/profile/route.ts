import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withUserAuth } from '@/lib/api-auth';

/**
 * GET /api/user/profile - Get current user's profile
 */
export async function GET() {
  return withUserAuth(async (profile) => {
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      jobTitle: profile.jobTitle,
      status: profile.status,
      plant: profile.plant,
      adminRoles: profile.adminRoles,
    };
  });
}

/**
 * PATCH /api/user/profile - Update current user's profile
 */
export async function PATCH(request: Request) {
  return withUserAuth(async (profile) => {
    const body = await request.json();
    const { firstName, lastName, jobTitle } = body;

    // Validate input
    if (firstName && typeof firstName !== 'string') {
      throw new Error('Invalid firstName');
    }

    if (lastName && typeof lastName !== 'string') {
      throw new Error('Invalid lastName');
    }

    if (jobTitle && typeof jobTitle !== 'string') {
      throw new Error('Invalid jobTitle');
    }

    // Update profile
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(jobTitle !== undefined && { jobTitle }),
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profile.id))
      .returning();

    return {
      id: updatedProfile.id,
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      email: updatedProfile.email,
      jobTitle: updatedProfile.jobTitle,
      status: updatedProfile.status,
    };
  });
}