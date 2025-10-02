/**
 * Unified Authentication Middleware
 * Single source of truth for all authentication operations
 * Consolidates legacy middleware systems into one unified interface
 */

import type { Profile } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from './core/auth-service';
import { AdminRole, Permission, UserContext, UserRole } from './types/auth-types';
import { AuthenticationError, AuthorizationError } from './utils/error-handler';

/**
 * Unified authentication middleware class
 * Provides all authentication patterns in one place
 */
export class UnifiedAuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Core authentication methods
   */
  
  /**
   * Authenticate user and return result
   */
  static async authenticateUser(request: NextRequest): Promise<AuthResult> {
    try {
      const authService = new AuthService();
      const token = UnifiedAuthMiddleware.extractToken(request);
      
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
      const profile = await UnifiedAuthMiddleware.getProfileFromAuthResult(authResult);

      return {
        success: true,
        user: authResult.user,
        profile: profile || undefined,
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
   * Authenticate admin user with role checking
   */
  static async authenticateAdmin(
    request: NextRequest,
    role?: AdminRole,
    plantId?: string
  ): Promise<AdminAuthResult> {
    try {
      const authService = new AuthService();
      const token = UnifiedAuthMiddleware.extractToken(request);
      
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
      if (role) {
        const hasRole = await authService.hasAdminRole(authResult.user.id, role as any, plantId);
        if (!hasRole) {
          return {
            success: false,
            error: 'Insufficient permissions',
            status: 403,
          };
        }
      }

      // Get profile data
      const profile = await UnifiedAuthMiddleware.getProfileFromAuthResult(authResult);
      const adminRoles = await UnifiedAuthMiddleware.getAdminRoles(authResult.user.id);

      return {
        success: true,
        user: authResult.user,
        profile: profile || undefined,
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
   * Authenticate user with RLS context
   */
  static async authenticateWithContext(request: NextRequest): Promise<AuthResult> {
    try {
      const authService = new AuthService();
      const token = UnifiedAuthMiddleware.extractToken(request);
      
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
   * Route wrapper methods
   */

  /**
   * Wrap handler with user authentication
   */
  static async withUserAuth<T>(
    request: NextRequest,
    handler: (profile: Profile) => Promise<T>
  ): Promise<NextResponse> {
    try {
      const authResult = await UnifiedAuthMiddleware.authenticateUser(request);
      const errorResponse = UnifiedAuthMiddleware.handleAuthResult(authResult);
      if (errorResponse) return errorResponse;

      const result = await handler(authResult.profile!);
      return UnifiedAuthMiddleware.createSuccessResponse(result);
    } catch (error) {
      console.error('API route error:', error);
      return UnifiedAuthMiddleware.createErrorResponse(
        'Internal server error',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Wrap handler with admin authentication
   */
  static async withAdminAuth<T>(
    request: NextRequest,
    handler: (profile: Profile, adminRoles: string[]) => Promise<T>,
    requiredRole?: AdminRole,
    plantId?: string
  ): Promise<NextResponse> {
    try {
      const authResult = await UnifiedAuthMiddleware.authenticateAdmin(request, requiredRole, plantId);
      const errorResponse = UnifiedAuthMiddleware.handleAdminAuthResult(authResult);
      if (errorResponse) return errorResponse;

      const result = await handler(authResult.profile!, authResult.adminRoles || []);
      return UnifiedAuthMiddleware.createSuccessResponse(result);
    } catch (error) {
      console.error('Admin API route error:', error);
      return UnifiedAuthMiddleware.createErrorResponse(
        'Internal server error',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Wrap handler with RLS context authentication
   */
  static async withContextAuth<T>(
    request: NextRequest,
    handler: (userContext: UserContext) => Promise<T>
  ): Promise<NextResponse> {
    try {
      const authResult = await UnifiedAuthMiddleware.authenticateWithContext(request);
      const errorResponse = UnifiedAuthMiddleware.handleContextAuthResult(authResult);
      if (errorResponse) return errorResponse;

      const result = await handler(authResult.userContext!);
      return UnifiedAuthMiddleware.createSuccessResponse(result);
    } catch (error) {
      console.error('Context API route error:', error);
      return UnifiedAuthMiddleware.createErrorResponse(
        'Internal server error',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Context injection methods
   */

  /**
   * Inject user context into request headers
   */
  static injectUserContext(request: NextRequest, user: { id: string; role: string; plantId?: string }): void {
    request.headers.set('x-user-id', user.id);
    request.headers.set('x-user-role', user.role);
    request.headers.set('x-user-plant-id', user.plantId || '');
  }

  /**
   * Extract user context from request headers
   */
  static extractUserContext(request: NextRequest): UserContext | null {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role') as UserRole;
    const plantId = request.headers.get('x-user-plant-id');

    if (!userId || !userRole) {
      return null;
    }

    return {
      userId,
      plantId: plantId!,
      accessiblePlants: plantId ? [plantId] : [],
      roles: [{ role: userRole as any, plantId: plantId || undefined }],
    };
  }

  /**
   * Middleware chain methods (for Next.js middleware)
   */

  /**
   * Require authentication middleware
   */
  requireAuth() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = UnifiedAuthMiddleware.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        // Add user info to request headers for downstream use
        UnifiedAuthMiddleware.injectUserContext(request, authResult.user);
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require specific role middleware
   */
  requireRole(role: UserRole) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = UnifiedAuthMiddleware.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const hasRole = await this.authService.hasRole(authResult.user.id, role);
        if (!hasRole) {
          throw new AuthorizationError(`${role} role required`);
        }
        
        UnifiedAuthMiddleware.injectUserContext(request, authResult.user);
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require specific permission middleware
   */
  requirePermission(permission: Permission) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = UnifiedAuthMiddleware.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const hasPermission = await this.authService.hasPermission(
          authResult.user.id, 
          permission
        );
        if (!hasPermission) {
          throw new AuthorizationError(`Permission '${permission}' required`);
        }
        
        UnifiedAuthMiddleware.injectUserContext(request, authResult.user);
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require admin role middleware
   */
  requireAdmin() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = UnifiedAuthMiddleware.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const isAdmin = await this.authService.hasAdminRole(authResult.user.id);
        if (!isAdmin) {
          throw new AuthorizationError('Admin role required');
        }
        
        UnifiedAuthMiddleware.injectUserContext(request, authResult.user);
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require admin or instructor role middleware
   */
  requireAdminOrInstructor() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = UnifiedAuthMiddleware.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const isAdmin = await this.authService.hasAdminRole(authResult.user.id);
        const isInstructor = await this.authService.hasRole(authResult.user.id, 'plant_manager');
        
        if (!isAdmin && !isInstructor) {
          throw new AuthorizationError('Admin or instructor role required');
        }
        
        UnifiedAuthMiddleware.injectUserContext(request, authResult.user);
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Utility methods
   */

  /**
   * Extract token from request
   */
  private static extractToken(request: NextRequest): string {
    // Try Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try cookies as fallback
    const tokenCookie = request.cookies.get('sb-access-token');
    if (tokenCookie) {
      return tokenCookie.value;
    }

    throw new AuthenticationError('Missing or invalid authorization token');
  }

  /**
   * Get profile from auth result
   */
  private static async getProfileFromAuthResult(authResult: { user: { id: string; email: string; plantId?: string } }): Promise<Profile | null> {
    // Convert auth result to Profile object
    // This should be implemented based on your Profile type structure
    if (!authResult.user) return null;

    return {
      id: authResult.user.id,
      email: authResult.user.email,
      firstName: '', // These would need to be populated from the database
      lastName: '',
      jobTitle: null,
      plantId: authResult.user.plantId!,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get admin roles for user
   */
  private static async getAdminRoles(userId: string): Promise<string[]> {
    // This should get the admin roles for the user
    // Implementation depends on your data structure
    const authService = new AuthService();
    // getUserAdminRoles method doesn't exist, return empty array for now
    return [];
  }

  /**
   * Handle authentication result and return appropriate response
   */
  private static handleAuthResult(authResult: AuthResult): NextResponse | null {
    if (!authResult.success) {
      return UnifiedAuthMiddleware.createErrorResponse(
        authResult.error || 'Authentication failed',
        authResult.status || 500
      );
    }
    return null;
  }

  /**
   * Handle admin authentication result and return appropriate response
   */
  private static handleAdminAuthResult(authResult: AdminAuthResult): NextResponse | null {
    if (!authResult.success) {
      return UnifiedAuthMiddleware.createErrorResponse(
        authResult.error || 'Authentication failed',
        authResult.status || 500
      );
    }
    return null;
  }

  /**
   * Handle context authentication result and return appropriate response
   */
  private static handleContextAuthResult(authResult: AuthResult): NextResponse | null {
    if (!authResult.success) {
      return UnifiedAuthMiddleware.createErrorResponse(
        authResult.error || 'Authentication failed',
        authResult.status || 500
      );
    }
    return null;
  }

  /**
   * Create standardized error response
   */
  private static createErrorResponse(
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
  private static createSuccessResponse<T>(
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
   * Handle authentication errors
   */
  private handleAuthError(error: Error | AuthenticationError | AuthorizationError): NextResponse {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }
    
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: 'Insufficient permissions', code: 'AUTH_INSUFFICIENT' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * Type definitions
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

export interface AdminAuthResult extends AuthResult {
  isAdmin?: boolean;
  adminRoles?: string[];
}

/**
 * Convenience exports for backward compatibility
 */
export const UnifiedAuth = UnifiedAuthMiddleware;
export const AuthMiddleware = UnifiedAuthMiddleware;
