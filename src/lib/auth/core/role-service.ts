/**
 * Role Service
 * Handles role-based access control operations
 */

import { AuthService } from './auth-service';
import { UserRole } from '../types/auth-types';
import { AuthorizationError } from '../utils/error-handler';

export class RoleService {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Check if user has admin role
   */
  async checkAdminRole(userId: string): Promise<boolean> {
    return this.authService.hasRole(userId, 'hr_admin') || 
           this.authService.hasRole(userId, 'dev_admin') || 
           this.authService.hasRole(userId, 'plant_manager');
  }

  /**
   * Check if user has specific admin role
   */
  async checkSpecificAdminRole(
    userId: string, 
    role: 'hr_admin' | 'dev_admin' | 'plant_manager',
    plantId?: string
  ): Promise<boolean> {
    return this.authService.hasAdminRole(userId, role, plantId);
  }

  /**
   * Check if user has user role
   */
  async checkUserRole(userId: string): Promise<boolean> {
    return this.authService.hasRole(userId, 'user');
  }

  /**
   * Check if user has instructor role (plant_manager)
   */
  async checkInstructorRole(userId: string): Promise<boolean> {
    return this.authService.hasRole(userId, 'plant_manager');
  }

  /**
   * Require admin role or throw error
   */
  async requireAdminRole(userId: string): Promise<void> {
    const isAdmin = await this.checkAdminRole(userId);
    if (!isAdmin) {
      throw new AuthorizationError('Admin role required');
    }
  }

  /**
   * Require specific admin role or throw error
   */
  async requireSpecificAdminRole(
    userId: string, 
    role: 'hr_admin' | 'dev_admin' | 'plant_manager',
    plantId?: string
  ): Promise<void> {
    const hasRole = await this.checkSpecificAdminRole(userId, role, plantId);
    if (!hasRole) {
      throw new AuthorizationError(`${role} role required`);
    }
  }

  /**
   * Require user role or throw error
   */
  async requireUserRole(userId: string): Promise<void> {
    const isUser = await this.checkUserRole(userId);
    if (!isUser) {
      throw new AuthorizationError('User role required');
    }
  }

  /**
   * Require instructor role or throw error
   */
  async requireInstructorRole(userId: string): Promise<void> {
    const isInstructor = await this.checkInstructorRole(userId);
    if (!isInstructor) {
      throw new AuthorizationError('Instructor role required');
    }
  }

  /**
   * Check if user has admin or instructor role
   */
  async checkAdminOrInstructorRole(userId: string): Promise<boolean> {
    return this.checkAdminRole(userId) || this.checkInstructorRole(userId);
  }

  /**
   * Require admin or instructor role or throw error
   */
  async requireAdminOrInstructorRole(userId: string): Promise<void> {
    const hasRole = await this.checkAdminOrInstructorRole(userId);
    if (!hasRole) {
      throw new AuthorizationError('Admin or instructor role required');
    }
  }
}
