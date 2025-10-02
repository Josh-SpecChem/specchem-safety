/**
 * Unified API Authentication Utilities
 * Standardized authentication patterns for API routes
 */

import { NextResponse } from 'next/server';
import { AuthService } from './core/auth-service';
import { UserRole, Permission, UserContext } from './types/auth-types';
import { AuthenticationError, AuthorizationError } from './utils/error-handler';
import type { Profile, ApiResponse } from '@/types';

/**
 * Standard API response format
 */
export interface StandardApiResponse<T = unknown> extends ApiResponse<T> {}

/**
 * Authentication result for API routes
 */
export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
    plantId?: string;
  };
  profile?: Profile;
  userContext?: UserContext;
  error?: string;
  status?: number;
}

/**
 * Admin authentication result
 */
export interface AdminAuthResult extends AuthResult {
  isAdmin?: boolean;
  adminRoles?: string[];
}

/**
 * Create standardized error response
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
 * Create standardized success response
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
    const authService = new AuthService();
    const token = await extractTokenFromRequest();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token required',
        status: 401,
      };
    }

    const authResult = await authService.authenticate(token);
    
    if (!authResult.isAuthenticated) {
      return {
        success: false,
        error: 'Authentication failed',
        status: 401,
      };
    }

    // Get profile data
    const profile = await getProfileFromAuthResult(authResult);

    return {
      success: true,
      user: authResult.user,
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
    const authService = new AuthService();
    const token = await extractTokenFromRequest();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token required',
        status: 401,
      };
    }

    const authResult = await authService.authenticate(token);
    
    if (!authResult.isAuthenticated) {
      return {
        success: false,
        error: 'Authentication failed',
        status: 401,
      };
    }

    // Check if user has admin roles
    const isAdmin = await authService.hasAdminRole(authResult.user.id);
    if (!isAdmin) {
      return {
        success: false,
        error: 'Insufficient permissions',
        status: 403,
      };
    }

    // If specific role required, check it
    if (requiredRole) {
      const hasRole = await authService.hasAdminRole(authResult.user.id, requiredRole, plantId);
      if (!hasRole) {
        return {
          success: false,
          error: 'Insufficient permissions',
          status: 403,
        };
      }
    }

    // Get profile data
    const profile = await getProfileFromAuthResult(authResult);
    const adminRoles = await getAdminRoles(authResult.user.id);

    return {
      success: true,
      user: authResult.user,
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
    const authService = new AuthService();
    const token = await extractTokenFromRequest();
    
    if (!token) {
      return {
        success: false,
        error: 'Authentication token required',
        status: 401,
      };
    }

    const authResult = await authService.authenticate(token);
    
    if (!authResult.isAuthenticated) {
      return {
        success: false,
        error: 'Authentication failed',
        status: 401,
      };
    }

    const userContext = await authService.getUserContext(authResult.user.id);
    
    if (!userContext) {
      return {
        success: false,
        error: 'User context not found',
        status: 404,
      };
    }

    return {
      success: true,
      user: authResult.user,
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

    const result = await handler(authResult.profile!);
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

    const result = await handler(authResult.profile!, authResult.adminRoles || []);
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

    const result = await handler(authResult.userContext!);
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

/**
 * Extract token from request (placeholder - should be implemented based on your auth setup)
 */
async function extractTokenFromRequest(): Promise<string | null> {
  // This should extract the token from cookies, headers, or session
  // Implementation depends on your authentication setup
  return null;
}

/**
 * Get profile from auth result (placeholder - should be implemented based on your data structure)
 */
async function getProfileFromAuthResult(authResult: any): Promise<Profile | undefined> {
  // This should convert the auth result to a Profile object
  // Implementation depends on your Profile type structure
  return undefined;
}

/**
 * Get admin roles for user (placeholder - should be implemented based on your data structure)
 */
async function getAdminRoles(userId: string): Promise<string[]> {
  // This should get the admin roles for the user
  // Implementation depends on your data structure
  return [];
}
