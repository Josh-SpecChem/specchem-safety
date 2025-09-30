import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/user/profile - Get current user's profile
 */
export async function GET() {
  try {
    const profile = await getCurrentProfile();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        jobTitle: profile.jobTitle,
        status: profile.status,
        plant: profile.plant,
        adminRoles: profile.adminRoles,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile - Update current user's profile
 */
export async function PATCH(request: Request) {
  try {
    const profile = await getCurrentProfile();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, jobTitle } = body;

    // Validate input
    if (firstName && typeof firstName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid firstName' },
        { status: 400 }
      );
    }

    if (lastName && typeof lastName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid lastName' },
        { status: 400 }
      );
    }

    if (jobTitle && typeof jobTitle !== 'string') {
      return NextResponse.json(
        { error: 'Invalid jobTitle' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProfile.id,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        jobTitle: updatedProfile.jobTitle,
        status: updatedProfile.status,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}