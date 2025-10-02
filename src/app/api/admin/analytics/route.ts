/**
 * Admin API for analytics - Simplified Implementation
 * GET: Get plant and course analytics
 */

import { NextRequest } from 'next/server';
import { RouteUtils } from '@/lib/route-utils';
import { getPlantStats, getCourseStats } from '@/lib/db/operations';
import { CommonSchemas } from '@/app/api/shared/utils/validation-utils';

// GET /api/admin/analytics - Get analytics data
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const query = RouteUtils.getValidatedQuery(req) as { plantId?: string; courseId?: string } || {};
    
    let analytics = {};

    // Get plant stats
    if (query.plantId) {
      const plantStats = await getPlantStats(query.plantId);
      analytics = { ...analytics, plantStats };
    }

    // Get course stats
    if (query.courseId) {
      const courseStats = await getCourseStats(query.courseId, query.plantId);
      analytics = { ...analytics, courseStats };
    }

    return RouteUtils.createSuccessResponse(analytics);
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateQuery: CommonSchemas.analyticsFilters
  });
}