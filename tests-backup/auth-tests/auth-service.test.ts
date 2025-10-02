/**
 * Authentication Service Tests
 * Comprehensive test suite for the unified authentication system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../core/auth-service';
import { RoleService } from '../core/role-service';
import { PermissionService } from '../core/permission-service';
import { AuthenticationError, AuthorizationError } from '../utils/error-handler';
import { UserRole, Permission } from '../types/auth-types';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    refreshSession: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  })),
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => mockSupabase,
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
  });

  describe('authentication', () => {
    it('should authenticate valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockProfile = {
        plant_id: 'plant-123',
        admin_roles: [
          { role: 'hr_admin', plant_id: null },
        ],
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
            }),
          })),
        })),
      });

      const result = await authService.authenticate('valid-token');

      expect(result.isAuthenticated).toBe(true);
      expect(result.user.id).toBe('user-123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe('hr_admin');
    });

    it('should reject invalid token', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Invalid token'),
      });

      await expect(authService.authenticate('invalid-token'))
        .rejects.toThrow(AuthenticationError);
    });

    it('should handle missing profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
            }),
          })),
        })),
      });

      await expect(authService.authenticate('valid-token'))
        .rejects.toThrow(AuthenticationError);
    });
  });

  describe('role checking', () => {
    it('should check user roles correctly', async () => {
      const mockProfile = {
        admin_roles: [
          { role: 'hr_admin', plant_id: null },
        ],
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
            }),
          })),
        })),
      });

      const hasAdminRole = await authService.hasRole('user-123', 'hr_admin');
      expect(hasAdminRole).toBe(true);

      const hasUserRole = await authService.hasRole('user-123', 'user');
      expect(hasUserRole).toBe(false);
    });

    it('should check admin roles with plant restrictions', async () => {
      const mockProfile = {
        admin_roles: [
          { role: 'plant_manager', plant_id: 'plant-123' },
        ],
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
            }),
          })),
        })),
      });

      const hasRoleInCorrectPlant = await authService.hasAdminRole('user-123', 'plant_manager', 'plant-123');
      expect(hasRoleInCorrectPlant).toBe(true);

      const hasRoleInWrongPlant = await authService.hasAdminRole('user-123', 'plant_manager', 'plant-456');
      expect(hasRoleInWrongPlant).toBe(false);
    });
  });

  describe('permission checking', () => {
    it('should check permissions correctly', async () => {
      const mockProfile = {
        admin_roles: [
          { role: 'hr_admin', plant_id: null },
        ],
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
            }),
          })),
        })),
      });

      const hasPermission = await authService.hasPermission('user-123', 'manage_users');
      expect(hasPermission).toBe(true);

      const hasNoPermission = await authService.hasPermission('user-123', 'delete');
      expect(hasNoPermission).toBe(true); // hr_admin has delete permission
    });
  });
});

describe('RoleService', () => {
  let roleService: RoleService;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    roleService = new RoleService(authService);
    vi.clearAllMocks();
  });

  describe('role checking', () => {
    it('should check admin role correctly', async () => {
      vi.spyOn(authService, 'hasRole').mockResolvedValue(true);

      const isAdmin = await roleService.checkAdminRole('user-123');
      expect(isAdmin).toBe(true);
    });

    it('should require admin role or throw error', async () => {
      vi.spyOn(authService, 'hasRole').mockResolvedValue(false);

      await expect(roleService.requireAdminRole('user-123'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should check specific admin roles', async () => {
      vi.spyOn(authService, 'hasAdminRole').mockResolvedValue(true);

      const isHRAdmin = await roleService.checkSpecificAdminRole('user-123', 'hr_admin');
      expect(isHRAdmin).toBe(true);
    });
  });
});

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    permissionService = new PermissionService(authService);
    vi.clearAllMocks();
  });

  describe('permission checking', () => {
    it('should check permissions correctly', async () => {
      vi.spyOn(authService, 'hasPermission').mockResolvedValue(true);

      const hasPermission = await permissionService.hasPermission('user-123', 'manage_users');
      expect(hasPermission).toBe(true);
    });

    it('should require permission or throw error', async () => {
      vi.spyOn(authService, 'hasPermission').mockResolvedValue(false);

      await expect(permissionService.requirePermission('user-123', 'manage_users'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should check any permission', async () => {
      vi.spyOn(authService, 'hasPermission')
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      const hasAnyPermission = await permissionService.hasAnyPermission('user-123', ['read', 'write']);
      expect(hasAnyPermission).toBe(true);
    });

    it('should check all permissions', async () => {
      vi.spyOn(authService, 'hasPermission').mockResolvedValue(true);

      const hasAllPermissions = await permissionService.hasAllPermissions('user-123', ['read', 'write']);
      expect(hasAllPermissions).toBe(true);
    });
  });

  describe('convenience methods', () => {
    it('should check specific permissions', async () => {
      vi.spyOn(authService, 'hasPermission').mockResolvedValue(true);

      const canManageUsers = await permissionService.canManageUsers('user-123');
      expect(canManageUsers).toBe(true);

      const canManageCourses = await permissionService.canManageCourses('user-123');
      expect(canManageCourses).toBe(true);
    });
  });
});

describe('Error Handling', () => {
  it('should create proper error instances', () => {
    const authError = new AuthenticationError('Auth failed');
    expect(authError.name).toBe('AuthenticationError');
    expect(authError.message).toBe('Auth failed');

    const authzError = new AuthorizationError('No permission');
    expect(authzError.name).toBe('AuthorizationError');
    expect(authzError.message).toBe('No permission');
  });

  it('should handle errors correctly', () => {
    expect(() => {
      AuthErrorHandler.handle(new AuthenticationError('Test error'));
    }).toThrow(AuthenticationError);

    expect(() => {
      AuthErrorHandler.handle(new Error('expired token'));
    }).toThrow(TokenExpiredError);
  });
});
