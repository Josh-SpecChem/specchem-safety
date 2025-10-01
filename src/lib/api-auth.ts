import { NextResponse } from 'next/server';
import { getCurrentProfile } from './auth';
import { hasAdminRole, getCurrentUserContext } from './rls';
import type { UserContext, Profile, ApiResponse } from '@/types';

/**
 * Standardized API authentication utilities for consistent auth patterns
 * across all API routes in the SpecChem Safety Training Platform
 */

export interface AuthResult {
  success: boolean;
  user?: unknown;
  profile?: Profile;
  userContext?: UserContext;
  error?: string;
  status?: number;
}

export interface AdminAuthResult extends AuthResult {
  isAdmin?: boolean;
  adminRoles?: string[];
}

/**
 * Standard API response format for consistency
 */
export interface StandardApiResponse<T = unknown> extends ApiResponse<T> {}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: string,
  status: number = 500,
  message?: string
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

/**
 * Authenticate user and get profile - Standard pattern for user routes
 */
export async function authenticateUser(): Promise<AuthResult> {
  try {
    const profile = await getCurrentProfile();
    
    if (!profile) {
      return {
        success: false,
        error: 'User profile not found',
        status: 404,
      };
    }

    return {
      success: true,
      profile,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500,
    };
  }
}

/**
 * Authenticate admin user with role checking - Standard pattern for admin routes
 */
export async function authenticateAdmin(
  requiredRole?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
): Promise<AdminAuthResult> {
  try {
    const profile = await getCurrentProfile();
    
    if (!profile) {
      return {
        success: false,
        error: 'User profile not found',
        status: 404,
      };
    }

    // Check if user has admin roles
    if (!profile.adminRoles || profile.adminRoles.length === 0) {
      return {
        success: false,
        error: 'Insufficient permissions',
        status: 403,
      };
    }

    // If specific role required, check it
    if (requiredRole) {
      const hasRole = await hasAdminRole(requiredRole, plantId);
      if (!hasRole) {
        return {
          success: false,
          error: 'Insufficient permissions',
          status: 403,
        };
      }
    }

    const adminRoles = profile.adminRoles.map((role: { role: string }) => role.role);

    return {
      success: true,
      profile,
      isAdmin: true,
      adminRoles,
    };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500,
    };
  }
}

/**
 * Authenticate user with RLS context - Standard pattern for tenant-aware routes
 */
export async function authenticateWithContext(): Promise<AuthResult> {
  try {
    const userContext = await getCurrentUserContext();
    
    if (!userContext) {
      return {
        success: false,
        error: 'Authentication required',
        status: 401,
      };
    }

    return {
      success: true,
      userContext,
    };
  } catch (error) {
    console.error('Context authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 500,
    };
  }
}

/**
 * Handle authentication result and return appropriate response
 */
export function handleAuthResult(authResult: AuthResult): NextResponse | null {
  if (!authResult.success) {
    return createErrorResponse(
      authResult.error || 'Authentication failed',
      authResult.status || 500
    );
  }
  return null;
}

/**
 * Handle admin authentication result and return appropriate response
 */
export function handleAdminAuthResult(authResult: AdminAuthResult): NextResponse | null {
  if (!authResult.success) {
    return createErrorResponse(
      authResult.error || 'Authentication failed',
      authResult.status || 500
    );
  }
  return null;
}

/**
 * Handle context authentication result and return appropriate response
 */
export function handleContextAuthResult(authResult: AuthResult): NextResponse | null {
  if (!authResult.success) {
    return createErrorResponse(
      authResult.error || 'Authentication failed',
      authResult.status || 500
    );
  }
  return null;
}

/**
 * Wrapper for API routes that require user authentication
 */
export async function withUserAuth<T>(
  handler: (profile: Profile) => Promise<T>
): Promise<NextResponse> {
  try {
    const authResult = await authenticateUser();
    const errorResponse = handleAuthResult(authResult);
    if (errorResponse) return errorResponse;

    const result = await handler(authResult.profile);
    return createSuccessResponse(result);
  } catch (error) {
    console.error('API route error:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Wrapper for API routes that require admin authentication
 */
export async function withAdminAuth<T>(
  handler: (profile: Profile, adminRoles: string[]) => Promise<T>,
  requiredRole?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
): Promise<NextResponse> {
  try {
    const authResult = await authenticateAdmin(requiredRole, plantId);
    const errorResponse = handleAdminAuthResult(authResult);
    if (errorResponse) return errorResponse;

    const result = await handler(authResult.profile, authResult.adminRoles || []);
    return createSuccessResponse(result);
  } catch (error) {
    console.error('Admin API route error:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Wrapper for API routes that require RLS context
 */
export async function withContextAuth<T>(
  handler: (userContext: UserContext) => Promise<T>
): Promise<NextResponse> {
  try {
    const authResult = await authenticateWithContext();
    const errorResponse = handleContextAuthResult(authResult);
    if (errorResponse) return errorResponse;

    const result = await handler(authResult.userContext);
    return createSuccessResponse(result);
  } catch (error) {
    console.error('Context API route error:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
