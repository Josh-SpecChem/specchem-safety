/**
 * Admin-specific Middleware
 * Handles admin role authentication and authorization
 */

import { NextRequest, NextResponse } from 'next/server';
import { AuthorizationError } from '../utils/error-handler';
import { AuthMiddleware } from './auth-middleware';

export class AdminMiddleware extends AuthMiddleware {
  constructor() {
    super();
  }

  /**
   * Require HR admin role
   */
  requireHRAdmin() {
    return this.requireRole('hr_admin');
  }

  /**
   * Require Dev admin role
   */
  requireDevAdmin() {
    return this.requireRole('dev_admin');
  }

  /**
   * Require Plant manager role
   */
  requirePlantManager(plantId?: string) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const isPlantManager = await this.authService.hasAdminRole(
          authResult.user.id, 
          'plant_manager', 
          plantId
        );
        
        if (!isPlantManager) {
          throw new AuthorizationError('Plant manager role required');
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
   * Require HR admin or Dev admin role
   */
  requireOrgAdmin() {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        const token = this.extractToken(request);
        const authResult = await this.authService.authenticate(token);
        
        const isHRAdmin = await this.authService.hasAdminRole(authResult.user.id, 'hr_admin');
        const isDevAdmin = await this.authService.hasAdminRole(authResult.user.id, 'dev_admin');
        
        if (!isHRAdmin && !isDevAdmin) {
          throw new AuthorizationError('HR admin or Dev admin role required');
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
   * Require admin role with plant access
   */
  requireAdminWithPlantAccess(plantId: string) {
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
          throw new AuthorizationError('Access denied: insufficient permissions for this plant');
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
