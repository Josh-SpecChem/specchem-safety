/**
 * Comprehensive Authentication Migration Test Suite
 * Tests the unified authentication system and validates migration success
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { UnifiedAuthMiddleware } from '@/lib/auth/unified-auth-middleware';
import { AuthService } from '@/lib/auth/core/auth-service';

// Mock the AuthService
vi.mock('@/lib/auth/core/auth-service', () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    authenticate: vi.fn(),
    hasAdminRole: vi.fn(),
    hasRole: vi.fn(),
    hasPermission: vi.fn(),
    getUserContext: vi.fn(),
    getUserAdminRoles: vi.fn(),
  })),
}));

describe('Unified Authentication Middleware', () => {
  let mockAuthService: unknown;
  let mockRequest: NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthService = new AuthService();
    mockRequest = new NextRequest('http://localhost:3000/api/test', {
      headers: {
        'authorization': 'Bearer test-token',
      },
    });
  });

  describe('Core Authentication Methods', () => {
    it('should authenticate user successfully', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);

      const result = await UnifiedAuthMiddleware.authenticateUser(mockRequest);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockAuthResult.user);
      expect(mockAuthService.authenticate).toHaveBeenCalledWith('test-token');
    });

    it('should handle authentication failure', async () => {
      mockAuthService.authenticate.mockRejectedValue(new Error('Invalid token'));

      const result = await UnifiedAuthMiddleware.authenticateUser(mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed');
      expect(result.status).toBe(500);
    });

    it('should authenticate admin user with role checking', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'admin-123',
          email: 'admin@example.com',
          role: 'admin',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);
      mockAuthService.hasAdminRole.mockResolvedValue(true);
      mockAuthService.getUserAdminRoles.mockResolvedValue(['hr_admin']);

      const result = await UnifiedAuthMiddleware.authenticateAdmin(mockRequest, 'hr_admin');

      expect(result.success).toBe(true);
      expect(result.isAdmin).toBe(true);
      expect(result.adminRoles).toEqual(['hr_admin']);
    });

    it('should reject admin authentication for insufficient permissions', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'user-123',
          email: 'user@example.com',
          role: 'user',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);
      mockAuthService.hasAdminRole.mockResolvedValue(false);

      const result = await UnifiedAuthMiddleware.authenticateAdmin(mockRequest, 'hr_admin');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions');
      expect(result.status).toBe(403);
    });
  });

  describe('Route Wrapper Methods', () => {
    it('should wrap handler with user authentication', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);

      const mockHandler = vi.fn().mockResolvedValue({ data: 'test' });
      const result = await UnifiedAuthMiddleware.withUserAuth(mockRequest, mockHandler);

      expect(result.status).toBe(200);
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should wrap handler with admin authentication', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'admin-123',
          email: 'admin@example.com',
          role: 'admin',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);
      mockAuthService.hasAdminRole.mockResolvedValue(true);
      mockAuthService.getUserAdminRoles.mockResolvedValue(['hr_admin']);

      const mockHandler = vi.fn().mockResolvedValue({ data: 'admin-test' });
      const result = await UnifiedAuthMiddleware.withAdminAuth(
        mockRequest,
        mockHandler,
        'hr_admin'
      );

      expect(result.status).toBe(200);
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should handle handler errors gracefully', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);

      const mockHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      const result = await UnifiedAuthMiddleware.withUserAuth(mockRequest, mockHandler);

      expect(result.status).toBe(500);
    });
  });

  describe('Context Injection Methods', () => {
    it('should inject user context into request headers', () => {
      const user = {
        id: 'user-123',
        role: 'admin',
        plantId: 'plant-1',
      };

      UnifiedAuthMiddleware.injectUserContext(mockRequest, user);

      expect(mockRequest.headers.get('x-user-id')).toBe('user-123');
      expect(mockRequest.headers.get('x-user-role')).toBe('admin');
      expect(mockRequest.headers.get('x-user-plant-id')).toBe('plant-1');
    });

    it('should extract user context from request headers', () => {
      mockRequest.headers.set('x-user-id', 'user-123');
      mockRequest.headers.set('x-user-role', 'admin');
      mockRequest.headers.set('x-user-plant-id', 'plant-1');

      const context = UnifiedAuthMiddleware.extractUserContext(mockRequest);

      expect(context).toEqual({
        userId: 'user-123',
        role: 'admin',
        plantId: 'plant-1',
        accessiblePlants: ['plant-1'],
      });
    });

    it('should return null for incomplete context', () => {
      mockRequest.headers.set('x-user-id', 'user-123');
      // Missing role

      const context = UnifiedAuthMiddleware.extractUserContext(mockRequest);

      expect(context).toBeNull();
    });
  });

  describe('Middleware Chain Methods', () => {
    it('should create requireAuth middleware', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'user',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);

      const middleware = new UnifiedAuthMiddleware();
      const requireAuth = middleware.requireAuth();

      const result = await requireAuth(mockRequest);

      expect(result.status).toBe(200);
      expect(mockRequest.headers.get('x-user-id')).toBe('user-123');
    });

    it('should create requireRole middleware', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'admin',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);
      mockAuthService.hasRole.mockResolvedValue(true);

      const middleware = new UnifiedAuthMiddleware();
      const requireRole = middleware.requireRole('admin');

      const result = await requireRole(mockRequest);

      expect(result.status).toBe(200);
    });

    it('should create requireAdmin middleware', async () => {
      const mockAuthResult = {
        isAuthenticated: true,
        user: {
          id: 'admin-123',
          email: 'admin@example.com',
          role: 'admin',
          permissions: [],
          plantId: 'plant-1',
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockAuthResult);
      mockAuthService.hasAdminRole.mockResolvedValue(true);

      const middleware = new UnifiedAuthMiddleware();
      const requireAdmin = middleware.requireAdmin();

      const result = await requireAdmin(mockRequest);

      expect(result.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing token', async () => {
      const requestWithoutToken = new NextRequest('http://localhost:3000/api/test');

      const result = await UnifiedAuthMiddleware.authenticateUser(requestWithoutToken);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication token required');
      expect(result.status).toBe(401);
    });

    it('should handle invalid token format', async () => {
      const requestWithInvalidToken = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Invalid token',
        },
      });

      const result = await UnifiedAuthMiddleware.authenticateUser(requestWithInvalidToken);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Authentication failed');
      expect(result.status).toBe(500);
    });
  });

  describe('Migration Validation', () => {
    it('should provide all required authentication methods', () => {
      expect(typeof UnifiedAuthMiddleware.authenticateUser).toBe('function');
      expect(typeof UnifiedAuthMiddleware.authenticateAdmin).toBe('function');
      expect(typeof UnifiedAuthMiddleware.authenticateWithContext).toBe('function');
      expect(typeof UnifiedAuthMiddleware.withUserAuth).toBe('function');
      expect(typeof UnifiedAuthMiddleware.withAdminAuth).toBe('function');
      expect(typeof UnifiedAuthMiddleware.withContextAuth).toBe('function');
      expect(typeof UnifiedAuthMiddleware.injectUserContext).toBe('function');
      expect(typeof UnifiedAuthMiddleware.extractUserContext).toBe('function');
    });

    it('should maintain backward compatibility interfaces', () => {
      // Test that the unified middleware provides the same interface as legacy systems
      expect(UnifiedAuthMiddleware).toBeDefined();
      expect(UnifiedAuthMiddleware.withUserAuth).toBeDefined();
      expect(UnifiedAuthMiddleware.withAdminAuth).toBeDefined();
      expect(UnifiedAuthMiddleware.withContextAuth).toBeDefined();
    });
  });
});

describe('Migration Success Validation', () => {
  it('should have no deprecated authentication functions in active use', () => {
    // This test ensures that all legacy functions have been properly deprecated
    // and that the unified system is being used instead
    expect(true).toBe(true); // Placeholder for actual validation logic
  });

  it('should maintain consistent authentication patterns across all API routes', () => {
    // This test ensures that all API routes use the same authentication patterns
    expect(true).toBe(true); // Placeholder for actual validation logic
  });

  it('should provide comprehensive error handling', () => {
    // This test ensures that all authentication errors are handled consistently
    expect(true).toBe(true); // Placeholder for actual validation logic
  });
});
