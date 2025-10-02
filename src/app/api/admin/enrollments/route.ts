/**
 * Admin API for enrollment management - Simplified Implementation
 * GET: List all enrollments with filtering
 * POST: Create new enrollment
 * PATCH: Update enrollment status
 */

import { NextRequest } from 'next/server';
import { RouteUtils } from '@/lib/route-utils';
import { EnrollmentOperationsCompat } from '@/lib/db/operations';
import { CommonSchemas } from '@/app/api/shared/utils/validation-utils';
import type { CreateEnrollment, UpdateEnrollment } from '@/types';

// GET /api/admin/enrollments - List enrollments with filtering
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const query = RouteUtils.getValidatedQuery(req) || {};
    const result = await EnrollmentOperationsCompat.getEnrollmentsWithDetails(query as any);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return RouteUtils.createSuccessResponse(result.data);
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateQuery: CommonSchemas.enrollmentFilters
  });
}

// POST /api/admin/enrollments - Create new enrollment
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody<CreateEnrollment>(req);
    if (!body) {
      throw new Error('Request body required');
    }
    
    const result = await EnrollmentOperationsCompat.createEnrollment(body);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return RouteUtils.createCreatedResponse(result.data, 'Enrollment created successfully');
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateBody: CommonSchemas.createEnrollment
  });
}

// PATCH /api/admin/enrollments - Update enrollment status
export async function PATCH(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody<UpdateEnrollment & { enrollmentId: string }>(req);
    if (!body) {
      throw new Error('Request body required');
    }
    
    const { enrollmentId, ...updateData } = body;
    
    if (!enrollmentId) {
      throw new Error('enrollmentId is required');
    }
    
    const result = await EnrollmentOperationsCompat.updateEnrollment(enrollmentId, updateData);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return RouteUtils.createUpdatedResponse(result.data, 'Enrollment updated successfully');
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateBody: CommonSchemas.updateEnrollment
  });
}