/**
 * Authentication Utility Functions
 * Helper functions for common authentication operations
 */

import { AuthService } from './core/auth-service';
import { RoleService } from './core/role-service';
import { PermissionService } from './core/permission-service';
import { UserRole, Permission, UserContext } from './types/auth-types';

// Create singleton instances
const authService = new AuthService();
const roleService = new RoleService(authService);
const permissionService = new PermissionService(authService);

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  return authService.authenticate(await getTokenFromSession());
}

/**
 * Get current user context for RLS operations
 */
export async function getCurrentUserContext(): Promise<UserContext | null> {
  const user = await getCurrentUser();
  if (!user.isAuthenticated) {
    return null;
  }
  return authService.getUserContext(user.user.id);
}

/**
 * Check if current user has admin role
 */
export async function hasAdminRole(
  role?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user.isAuthenticated) {
    return false;
  }
  return authService.hasAdminRole(user.user.id, role, plantId);
}

/**
 * Check if current user has specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user.isAuthenticated) {
    return false;
  }
  return authService.hasRole(user.user.id, role);
}

/**
 * Check if current user has specific permission
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user.isAuthenticated) {
    return false;
  }
  return authService.hasPermission(user.user.id, permission);
}

/**
 * Get accessible plants for current user
 */
export async function getAccessiblePlants(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user.isAuthenticated) {
    return [];
  }
  const userContext = await authService.getUserContext(user.user.id);
  return userContext?.accessiblePlants || [];
}

/**
 * Check if current user has access to specific plant
 */
export async function hasPlantAccess(plantId: string): Promise<boolean> {
  const accessiblePlants = await getAccessiblePlants();
  return accessiblePlants.includes(plantId);
}

/**
 * Require authentication or redirect to login
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user.isAuthenticated) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require admin role or throw error
 */
export async function requireAdminRole(
  role?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
) {
  const user = await requireAuth();
  const hasRole = await authService.hasAdminRole(user.user.id, role, plantId);
  if (!hasRole) {
    throw new Error(`${role || 'Admin'} role required`);
  }
  return user;
}

/**
 * Require specific permission or throw error
 */
export async function requirePermission(permission: Permission) {
  const user = await requireAuth();
  const hasPermission = await authService.hasPermission(user.user.id, permission);
  if (!hasPermission) {
    throw new Error(`Permission '${permission}' required`);
  }
  return user;
}

/**
 * Require plant access or throw error
 */
export async function requirePlantAccess(plantId: string) {
  const hasAccess = await hasPlantAccess(plantId);
  if (!hasAccess) {
    throw new Error(`Access denied: insufficient permissions for plant ${plantId}`);
  }
  return true;
}

/**
 * Get token from current session
 */
async function getTokenFromSession(): Promise<string> {
  // This would typically get the token from cookies or headers
  // For now, we'll throw an error as this should be handled by middleware
  throw new Error('Token extraction should be handled by middleware');
}

// Export services for direct use
export { authService, roleService, permissionService };
export { AuthService, RoleService, PermissionService } from './core';
export { AuthMiddleware, AdminMiddleware, UserMiddleware } from './middleware';
export * from './types/auth-types';
export * from './utils/error-handler';

