/**
 * Authentication Middleware Tests
 * Test suite for authentication middleware functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { AuthMiddleware, AdminMiddleware, UserMiddleware } from '../middleware';
import { AuthenticationError, AuthorizationError } from '../utils/error-handler';

// Mock the auth service
vi.mock('../core/auth-service', () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    authenticate: vi.fn(),
    hasRole: vi.fn(),
    hasPermission: vi.fn(),
    hasAdminRole: vi.fn(),
    getUserContext: vi.fn(),
  })),
}));

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockRequest: NextRequest;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware();
    mockRequest = {
      headers: new Headers({
        'authorization': 'Bearer valid-token',
      }),
    } as NextRequest;
    vi.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('should allow authenticated users', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user' as const,
          permissions: ['read'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(authMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);

      const middleware = authMiddleware.requireAuth();
      const response = await middleware(mockRequest);

      expect(response.status).toBe(200);
      expect(mockRequest.headers.get('x-user-id')).toBe('user-123');
      expect(mockRequest.headers.get('x-user-role')).toBe('user');
    });

    it('should reject unauthenticated users', async () => {
      vi.spyOn(authMiddleware['authService'], 'authenticate').mockRejectedValue(
        new AuthenticationError('Invalid token')
      );

      const middleware = authMiddleware.requireAuth();
      const response = await middleware(mockRequest);

      expect(response.status).toBe(401);
    });

    it('should handle missing authorization header', async () => {
      const requestWithoutAuth = {
        headers: new Headers(),
      } as NextRequest;

      const middleware = authMiddleware.requireAuth();
      const response = await middleware(requestWithoutAuth);

      expect(response.status).toBe(401);
    });
  });

  describe('requireRole', () => {
    it('should allow users with correct role', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'hr_admin' as const,
          permissions: ['read', 'write'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(authMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(authMiddleware['authService'], 'hasRole').mockResolvedValue(true);

      const middleware = authMiddleware.requireRole('hr_admin');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(200);
    });

    it('should reject users without correct role', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user' as const,
          permissions: ['read'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(authMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(authMiddleware['authService'], 'hasRole').mockResolvedValue(false);

      const middleware = authMiddleware.requireRole('hr_admin');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(403);
    });
  });

  describe('requirePermission', () => {
    it('should allow users with correct permission', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'hr_admin' as const,
          permissions: ['manage_users'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(authMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(authMiddleware['authService'], 'hasPermission').mockResolvedValue(true);

      const middleware = authMiddleware.requirePermission('manage_users');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(200);
    });

    it('should reject users without correct permission', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user' as const,
          permissions: ['read'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(authMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(authMiddleware['authService'], 'hasPermission').mockResolvedValue(false);

      const middleware = authMiddleware.requirePermission('manage_users');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(403);
    });
  });
});

describe('AdminMiddleware', () => {
  let adminMiddleware: AdminMiddleware;
  let mockRequest: NextRequest;

  beforeEach(() => {
    adminMiddleware = new AdminMiddleware();
    mockRequest = {
      headers: new Headers({
        'authorization': 'Bearer valid-token',
      }),
    } as NextRequest;
    vi.clearAllMocks();
  });

  describe('requireHRAdmin', () => {
    it('should allow HR admins', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'hr_admin' as const,
          permissions: ['manage_users'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(adminMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(adminMiddleware['authService'], 'hasRole').mockResolvedValue(true);

      const middleware = adminMiddleware.requireHRAdmin();
      const response = await middleware(mockRequest);

      expect(response.status).toBe(200);
    });
  });

  describe('requirePlantManager', () => {
    it('should allow plant managers for correct plant', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'plant_manager' as const,
          permissions: ['manage_courses'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(adminMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(adminMiddleware['authService'], 'hasAdminRole').mockResolvedValue(true);

      const middleware = adminMiddleware.requirePlantManager('plant-123');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(200);
    });

    it('should reject plant managers for wrong plant', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'plant_manager' as const,
          permissions: ['manage_courses'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(adminMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(adminMiddleware['authService'], 'hasAdminRole').mockResolvedValue(false);

      const middleware = adminMiddleware.requirePlantManager('plant-456');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(403);
    });
  });
});

describe('UserMiddleware', () => {
  let userMiddleware: UserMiddleware;
  let mockRequest: NextRequest;

  beforeEach(() => {
    userMiddleware = new UserMiddleware();
    mockRequest = {
      headers: new Headers({
        'authorization': 'Bearer valid-token',
      }),
    } as NextRequest;
    vi.clearAllMocks();
  });

  describe('requireUserWithContext', () => {
    it('should allow users with context', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user' as const,
          permissions: ['read'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      const mockUserContext = {
        userId: 'user-123',
        plantId: 'plant-123',
        roles: [],
        accessiblePlants: ['plant-123'],
      };

      vi.spyOn(userMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(userMiddleware['authService'], 'getUserContext').mockResolvedValue(mockUserContext);

      const middleware = userMiddleware.requireUserWithContext();
      const response = await middleware(mockRequest);

      expect(response.status).toBe(200);
      expect(mockRequest.headers.get('x-accessible-plants')).toBe(JSON.stringify(['plant-123']));
    });

    it('should reject users without context', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user' as const,
          permissions: ['read'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      vi.spyOn(userMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(userMiddleware['authService'], 'getUserContext').mockResolvedValue(null);

      const middleware = userMiddleware.requireUserWithContext();
      const response = await middleware(mockRequest);

      expect(response.status).toBe(403);
    });
  });

  describe('requirePlantAccess', () => {
    it('should allow access to accessible plant', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user' as const,
          permissions: ['read'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      const mockUserContext = {
        userId: 'user-123',
        plantId: 'plant-123',
        roles: [],
        accessiblePlants: ['plant-123', 'plant-456'],
      };

      vi.spyOn(userMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(userMiddleware['authService'], 'getUserContext').mockResolvedValue(mockUserContext);

      const middleware = userMiddleware.requirePlantAccess('plant-123');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(200);
    });

    it('should reject access to inaccessible plant', async () => {
      const mockAuthResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user' as const,
          permissions: ['read'],
          plantId: 'plant-123',
        },
        isAuthenticated: true,
      };

      const mockUserContext = {
        userId: 'user-123',
        plantId: 'plant-123',
        roles: [],
        accessiblePlants: ['plant-123'],
      };

      vi.spyOn(userMiddleware['authService'], 'authenticate').mockResolvedValue(mockAuthResult);
      vi.spyOn(userMiddleware['authService'], 'getUserContext').mockResolvedValue(mockUserContext);

      const middleware = userMiddleware.requirePlantAccess('plant-456');
      const response = await middleware(mockRequest);

      expect(response.status).toBe(403);
    });
  });
});
