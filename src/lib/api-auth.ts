/**
 * Legacy API Authentication Utilities - DEPRECATED
 * @deprecated This file is deprecated and will be removed in the next major version.
 * Use the unified authentication system from '@/lib/auth/unified-auth-middleware' instead.
 * 
 * This file is maintained for backward compatibility during migration.
 * All functions in this file are deprecated and should not be used in new code.
 */

import { NextResponse } from 'next/server';
import type { Profile, UserContext, AuthResult, AdminAuthResult } from '@/contracts';

/**
 * @deprecated Use UnifiedAuthMiddleware.authenticateUser() instead
 */
export async function authenticateUser(): Promise<never> {
  console.warn('authenticateUser is deprecated. Use UnifiedAuthMiddleware.authenticateUser() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.authenticateAdmin() instead
 */
export async function authenticateAdmin(): Promise<never> {
  console.warn('authenticateAdmin is deprecated. Use UnifiedAuthMiddleware.authenticateAdmin() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.authenticateWithContext() instead
 */
export async function authenticateWithContext(): Promise<never> {
  console.warn('authenticateWithContext is deprecated. Use UnifiedAuthMiddleware.authenticateWithContext() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.withUserAuth() instead
 */
export async function withUserAuth<T>(handler: (profile: Profile) => Promise<T>): Promise<NextResponse> {
  console.warn('withUserAuth is deprecated. Use UnifiedAuthMiddleware.withUserAuth() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.withAdminAuth() instead
 */
export async function withAdminAuth<T>(
  handler: (profile: Profile, adminRoles: string[]) => Promise<T>,
  requiredRole?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
): Promise<NextResponse> {
  console.warn('withAdminAuth is deprecated. Use UnifiedAuthMiddleware.withAdminAuth() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.withContextAuth() instead
 */
export async function withContextAuth<T>(handler: (userContext: UserContext) => Promise<T>): Promise<NextResponse> {
  console.warn('withContextAuth is deprecated. Use UnifiedAuthMiddleware.withContextAuth() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.createErrorResponse() instead
 */
export function createErrorResponse(
  error: string,
  status: number = 500,
  message?: string
): NextResponse {
  console.warn('createErrorResponse is deprecated. Use UnifiedAuthMiddleware.createErrorResponse() instead.');
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
 * @deprecated Use UnifiedAuthMiddleware.createSuccessResponse() instead
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): NextResponse {
  console.warn('createSuccessResponse is deprecated. Use UnifiedAuthMiddleware.createSuccessResponse() instead.');
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

/**
 * @deprecated Use UnifiedAuthMiddleware.handleAuthResult() instead
 */
export function handleAuthResult(authResult: AuthResult): NextResponse | null {
  console.warn('handleAuthResult is deprecated. Use UnifiedAuthMiddleware.handleAuthResult() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.handleAdminAuthResult() instead
 */
export function handleAdminAuthResult(authResult: AdminAuthResult): NextResponse | null {
  console.warn('handleAdminAuthResult is deprecated. Use UnifiedAuthMiddleware.handleAdminAuthResult() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use UnifiedAuthMiddleware.handleContextAuthResult() instead
 */
export function handleContextAuthResult(authResult: AuthResult): NextResponse | null {
  console.warn('handleContextAuthResult is deprecated. Use UnifiedAuthMiddleware.handleContextAuthResult() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}