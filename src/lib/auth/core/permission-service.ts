/**
 * Permission Service
 * Handles permission-based access control operations
 */

import { AuthService } from './auth-service';
import { Permission } from '../types/auth-types';
import { AuthorizationError } from '../utils/error-handler';

export class PermissionService {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    return this.authService.hasPermission(userId, permission);
  }

  /**
   * Require specific permission or throw error
   */
  async requirePermission(userId: string, permission: Permission): Promise<void> {
    const hasPermission = await this.hasPermission(userId, permission);
    if (!hasPermission) {
      throw new AuthorizationError(`Permission '${permission}' required`);
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
    for (const permission of permissions) {
      if (await this.hasPermission(userId, permission)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Require any of the specified permissions or throw error
   */
  async requireAnyPermission(userId: string, permissions: Permission[]): Promise<void> {
    const hasAny = await this.hasAnyPermission(userId, permissions);
    if (!hasAny) {
      throw new AuthorizationError(`One of the following permissions required: ${permissions.join(', ')}`);
    }
  }

  /**
   * Check if user has all of the specified permissions
   */
  async hasAllPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
    for (const permission of permissions) {
      if (!(await this.hasPermission(userId, permission))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Require all of the specified permissions or throw error
   */
  async requireAllPermissions(userId: string, permissions: Permission[]): Promise<void> {
    const hasAll = await this.hasAllPermissions(userId, permissions);
    if (!hasAll) {
      throw new AuthorizationError(`All of the following permissions required: ${permissions.join(', ')}`);
    }
  }

  /**
   * Check if user can manage users
   */
  async canManageUsers(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'manage_users');
  }

  /**
   * Check if user can manage courses
   */
  async canManageCourses(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'manage_courses');
  }

  /**
   * Check if user can manage enrollments
   */
  async canManageEnrollments(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'manage_enrollments');
  }

  /**
   * Check if user can view analytics
   */
  async canViewAnalytics(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'view_analytics');
  }

  /**
   * Check if user can manage plants
   */
  async canManagePlants(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'manage_plants');
  }

  /**
   * Check if user can write data
   */
  async canWrite(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'write');
  }

  /**
   * Check if user can delete data
   */
  async canDelete(userId: string): Promise<boolean> {
    return this.hasPermission(userId, 'delete');
  }
}
