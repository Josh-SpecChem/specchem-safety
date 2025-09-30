import { NextRequest, NextResponse } from 'next/server';
import { hasAdminRole, getCurrentUserContext } from '@/lib/rls';
import { getPlantStats, getCourseStats } from '@/lib/db/operations';

/**
 * GET /api/admin/analytics - Get plant and course analytics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const userContext = await getCurrentUserContext();
    
    if (!userContext) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin permissions
    const isAdmin = await hasAdminRole();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

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
      const plantStats = await getPlantStats(userContext.plantId);
      analytics = { ...analytics, plantStats };
    }

    // Get course stats
    if (courseId) {
      const courseStats = await getCourseStats(courseId, plantId || userContext.plantId);
      analytics = { ...analytics, courseStats };
    }

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}