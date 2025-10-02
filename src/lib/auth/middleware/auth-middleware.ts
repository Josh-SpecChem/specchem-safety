/**
 * Unified Authentication Middleware
 * Handles authentication for API routes and middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../core/auth-service';
import { Permission, UserRole } from '../types/auth-types';
import { AuthenticationError, AuthorizationError } from '../utils/error-handler';

export class AuthMiddleware {
  protected authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Require authentication
   */
  requireAuth() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        // Add user info to request headers for downstream use
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId || '');
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require specific role
   */
  requireRole(role: UserRole) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const hasRole = await this.authService.hasRole(authResult.user.id, role);
        if (!hasRole) {
          throw new AuthorizationError(`${role} role required`);
        }
        
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId || '');
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require specific permission
   */
  requirePermission(permission: Permission) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const hasPermission = await this.authService.hasPermission(
          authResult.user.id, 
          permission
        );
        if (!hasPermission) {
          throw new AuthorizationError(`Permission '${permission}' required`);
        }
        
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId || '');
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require admin role
   */
  requireAdmin() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const isAdmin = await this.authService.hasAdminRole(authResult.user.id);
        if (!isAdmin) {
          throw new AuthorizationError('Admin role required');
        }
        
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId || '');
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require admin or instructor role
   */
  requireAdminOrInstructor() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const isAdmin = await this.authService.hasAdminRole(authResult.user.id);
        const isInstructor = await this.authService.hasRole(authResult.user.id, 'plant_manager');
        
        if (!isAdmin && !isInstructor) {
          throw new AuthorizationError('Admin or instructor role required');
        }
        
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId || '');
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Extract token from request
   */
  protected extractToken(request: NextRequest): string {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header');
    }
    return authHeader.substring(7);
  }

  /**
   * Handle authentication errors
   */
  protected handleAuthError(error: Error): NextResponse {
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
