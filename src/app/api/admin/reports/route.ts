import { NextRequest, NextResponse } from 'next/server';
import { UnifiedAuthMiddleware } from '@/lib/auth/unified-auth-middleware';
import { getDetailedAnalytics } from '@/lib/db/operations';
import { formatErrorResponse, DatabaseError } from '@/lib/errors';
import type { AdminRole } from '@/types/api';

/**
 * Admin API for detailed analytics and reports
 * GET: Comprehensive analytics including completion rates, question performance, etc.
 */

export async function GET(request: NextRequest) {
  try {
    return await UnifiedAuthMiddleware.withAdminAuth(
      request,
      async () => {
        const result = await getDetailedAnalytics();
        
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