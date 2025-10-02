/**
 * User-specific Middleware
 * Handles user authentication and tenant-aware operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthorizationError, TenantAccessError } from '../utils/error-handler';
import { AuthMiddleware } from './auth-middleware';

export class UserMiddleware extends AuthMiddleware {
  constructor() {
    super();
  }

  /**
   * Require user authentication with tenant context
   */
  requireUserWithContext() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const userContext = await this.authService.getUserContext(authResult.user.id);
        if (!userContext) {
          throw new AuthorizationError('User context not found');
        }
        
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId || '');
        request.headers.set('x-accessible-plants', JSON.stringify(userContext.accessiblePlants));
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require user access to specific plant
   */
  requirePlantAccess(plantId: string) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const userContext = await this.authService.getUserContext(authResult.user.id);
        if (!userContext) {
          throw new AuthorizationError('User context not found');
        }

        // Check if user has access to the plant
        const hasAccess = userContext.accessiblePlants.includes(plantId);
        if (!hasAccess) {
          throw new TenantAccessError(`Access denied: insufficient permissions for plant ${plantId}`);
        }
        
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId || '');
        request.headers.set('x-accessible-plants', JSON.stringify(userContext.accessiblePlants));
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require user to be in their own plant
   */
  requireOwnPlant() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        if (!authResult.user.plantId) {
          throw new AuthorizationError('User plant not found');
        }
        
        request.headers.set('x-user-id', authResult.user.id);
        request.headers.set('x-user-role', authResult.user.role);
        request.headers.set('x-user-plant-id', authResult.user.plantId);
        
        return NextResponse.next();
      } catch (error) {
        return this.handleAuthError(error as Error);
      }
    };
  }

  /**
   * Require user with specific permission
   */
  requireUserPermission(permission: string) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const hasPermission = await this.authService.hasPermission(
          authResult.user.id, 
          permission as any
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

}
