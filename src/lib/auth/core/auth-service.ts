/**
 * Core Authentication Service
 * Centralized authentication logic for the SpecChem Safety Training Platform
 */

import { createClient } from '@/lib/supabase/server';
import { AuthResult, TokenResult, UserRole, Permission, UserContext, AdminRole } from '../types/auth-types';
import { AuthenticationError, AuthorizationError, TokenExpiredError, InvalidTokenError } from '../utils/error-handler';

export class AuthService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Authenticate user with token
   */
  async authenticate(token: string): Promise<AuthResult> {
    try {
      const supabase = await this.getSupabase();
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new AuthenticationError('Invalid or expired token');
      }
      
      // Get user profile with plant and admin roles
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          plant_id,
          admin_roles (
            role,
            plant_id
          )
        `)
        .eq('id', user.id)
        .single();

      if (!profile) {
        throw new AuthenticationError('User profile not found');
      }

      const userRole = this.determineUserRole(profile.admin_roles || []);
      const permissions = await this.getUserPermissions(user.id, userRole);
      
      return {
        user: {
          id: user.id,
          email: user.email!,
          role: userRole,
          permissions,
          plantId: profile.plant_id
        },
        isAuthenticated: true
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError('Authentication failed', error as Error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<TokenResult> {
    try {
      const supabase = await this.getSupabase();
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });
      
      if (error || !data.session) {
        throw new AuthenticationError('Token refresh failed');
      }
      
      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: new Date(data.session.expires_at! * 1000)
      };
    } catch (error) {
      throw new AuthenticationError('Token refresh failed', error as Error);
    }
  }

  /**
   * Check if user has specific role
   */
  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      const supabase = await this.getSupabase();
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          admin_roles (
            role,
            plant_id
          )
        `)
        .eq('id', userId)
        .single();
      
      if (!profile) {
        return false;
      }

      const userRole = this.determineUserRole(profile.admin_roles || []);
      return userRole === role;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    try {
      const userRole = await this.getUserRole(userId);
      const rolePermissions = this.getRolePermissions(userRole);
      
      return rolePermissions.includes(permission);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user context for RLS operations
   */
  async getUserContext(userId: string): Promise<UserContext | null> {
    try {
      const supabase = await this.getSupabase();
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          plant_id,
          admin_roles (
            role,
            plant_id
          )
        `)
        .eq('id', userId)
        .single();

      if (!profile) {
        return null;
      }

      const roles = profile.admin_roles || [];
      const accessiblePlants = await this.getAccessiblePlants(userId, roles);

      return {
        userId,
        plantId: profile.plant_id,
        roles,
        accessiblePlants
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if user has admin role with optional plant restriction
   */
  async hasAdminRole(
    userId: string,
    role?: 'hr_admin' | 'dev_admin' | 'plant_manager',
    plantId?: string
  ): Promise<boolean> {
    try {
      const supabase = await this.getSupabase();
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          admin_roles (
            role,
            plant_id
          )
        `)
        .eq('id', userId)
        .single();

      if (!profile || !profile.admin_roles || profile.admin_roles.length === 0) {
        return false;
      }

      // If no specific role required, any admin role is sufficient
      if (!role) {
        return true;
      }

      // Check for the specific role
      return profile.admin_roles.some((userRole: AdminRole) => {
        if (userRole.role !== role) {
          return false;
        }
        
        // For plant-specific roles, check plant match
        if (plantId && userRole.plantId && userRole.plantId !== plantId) {
          return false;
        }
        
        return true;
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * Get accessible plants for user
   */
  async getAccessiblePlants(userId: string, roles: AdminRole[]): Promise<string[]> {
    try {
      const supabase = await this.getSupabase();
      const { data: profile } = await supabase
        .from('profiles')
        .select('plant_id')
        .eq('id', userId)
        .single();

      if (!profile) {
        return [];
      }

      const accessiblePlantIds = new Set<string>();
      
      // Always include user's own plant
      accessiblePlantIds.add(profile.plant_id);
      
      // HR and dev admins can access all plants
      const isHRAdmin = roles.some(role => role.role === 'hr_admin');
      const isDevAdmin = roles.some(role => role.role === 'dev_admin');
      
      if (isHRAdmin || isDevAdmin) {
        const { data: plants } = await supabase
          .from('plants')
          .select('id')
          .eq('is_active', true);
        
        plants?.forEach(plant => accessiblePlantIds.add(plant.id));
      } else {
        // Add plants where user is a plant manager
        roles.forEach(role => {
          if (role.role === 'plant_manager' && role.plantId) {
            accessiblePlantIds.add(role.plantId);
          }
        });
      }

      return Array.from(accessiblePlantIds);
    } catch (error) {
      return [];
    }
  }

  /**
   * Determine user role from admin roles
   */
  private determineUserRole(adminRoles: AdminRole[]): UserRole {
    if (adminRoles.length === 0) {
      return 'user';
    }

    // Priority order: hr_admin > dev_admin > plant_manager > user
    if (adminRoles.some(role => role.role === 'hr_admin')) {
      return 'hr_admin';
    }
    if (adminRoles.some(role => role.role === 'dev_admin')) {
      return 'dev_admin';
    }
    if (adminRoles.some(role => role.role === 'plant_manager')) {
      return 'plant_manager';
    }

    return 'user';
  }

  /**
   * Get user role
   */
  private async getUserRole(userId: string): Promise<UserRole> {
    const supabase = await this.getSupabase();
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        admin_roles (
          role,
          plant_id
        )
      `)
      .eq('id', userId)
      .single();
    
    return this.determineUserRole(profile?.admin_roles || []);
  }

  /**
   * Get user permissions based on role
   */
  private async getUserPermissions(userId: string, role: UserRole): Promise<Permission[]> {
    return this.getRolePermissions(role);
  }

  /**
   * Get permissions for a role
   */
  private getRolePermissions(role: UserRole): Permission[] {
    const rolePermissions: Record<UserRole, Permission[]> = {
      hr_admin: ['read', 'write', 'delete', 'manage_users', 'manage_courses', 'manage_enrollments', 'view_analytics', 'manage_plants'],
      dev_admin: ['read', 'write', 'delete', 'manage_users', 'manage_courses', 'manage_enrollments', 'view_analytics', 'manage_plants'],
      plant_manager: ['read', 'write', 'manage_courses', 'manage_enrollments', 'view_analytics'],
      user: ['read']
    };
    
    return rolePermissions[role] || [];
  }
}
