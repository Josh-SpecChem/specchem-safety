import { NextRequest, NextResponse } from 'next/server';
import { getPlantStats, getCourseStats } from '@/lib/db/operations';
import { withAdminAuth } from '@/lib/api-auth';
import { formatErrorResponse, DatabaseError } from '@/lib/errors';

/**
 * GET /api/admin/analytics - Get plant and course analytics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const searchParams = request.nextUrl.searchParams;
      const plantId = searchParams.get('plantId');
      const courseId = searchParams.get('courseId');

      let analytics = {};

      // Get plant stats
      if (plantId) {
        const plantStats = await getPlantStats(plantId);
        analytics = { ...analytics, plantStats };
      } else {
        // If HR admin or dev admin, get stats for user's plant
        const plantStats = await getPlantStats(profile.plantId);
        analytics = { ...analytics, plantStats };
      }

      // Get course stats
      if (courseId) {
        const courseStats = await getCourseStats(courseId, plantId || profile.plantId);
        analytics = { ...analytics, courseStats };
      }

      return NextResponse.json({
        success: true,
        data: analytics,
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}