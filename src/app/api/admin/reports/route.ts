import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { getDetailedAnalytics } from '@/lib/db/operations';
import { formatErrorResponse, DatabaseError } from '@/lib/errors';

/**
 * Admin API for detailed analytics and reports
 * GET: Comprehensive analytics including completion rates, question performance, etc.
 */

export async function GET() {
  try {
    return withAdminAuth(async (profile, adminRoles) => {
      const result = await getDetailedAnalytics();
      
      if (!result.success) {
        throw new DatabaseError(result.error, result.code);
      }
      
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }, 'hr_admin');
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}