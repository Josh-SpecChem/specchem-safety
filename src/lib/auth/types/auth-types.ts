/**
 * Unified Authentication Types
 * Centralized type definitions for the authentication system
 */

export type UserRole = 'hr_admin' | 'dev_admin' | 'plant_manager' | 'user';

export type Permission = 
  | 'read'
  | 'write'
  | 'delete'
  | 'manage_users'
  | 'manage_courses'
  | 'manage_enrollments'
  | 'view_analytics'
  | 'manage_plants';

export interface AuthResult {
  user: {
    id: string;
    email: string;
    role: UserRole;
    permissions: Permission[];
    plantId?: string;
  };
  isAuthenticated: boolean;
}

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface AuthContext {
  user: AuthResult['user'];
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

export interface AdminRole {
  role: 'hr_admin' | 'dev_admin' | 'plant_manager';
  plantId?: string;
}

export interface UserContext {
  userId: string;
  plantId: string;
  roles: AdminRole[];
  accessiblePlants: string[];
}

export interface AuthServiceConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  defaultRole: UserRole;
  sessionTimeout: number;
}
