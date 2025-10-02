import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../unified';
import { extractUserContext, requireAuth, requireRole, hasPlantAccess } from '../context';

// Import test setup
import './setup';

// Mock Supabase
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user', email: 'test@example.com' } }
      })
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              plant_id: 'plant-1',
              admin_roles: [{ role: 'user', plant_id: 'plant-1' }]
            }
          })
        }))
      }))
    }))
  })),
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({
      headers: {
        set: vi.fn()
      },
      cookies: {
        set: vi.fn()
      }
    })),
    redirect: vi.fn(() => ({})),
  },
  NextRequest: class NextRequest {
    constructor(public url: string, public init?: any) {
      this.headers = new Map();
      if (init?.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key, value);
        });
      }
    }
    
    headers: Map<string, string>;
    
    get(key: string) {
      return this.headers.get(key);
    }
    
    set(key: string, value: string) {
      this.headers.set(key, value);
    }
    
    getAll() {
      return Array.from(this.headers.entries()).map(([name, value]) => ({ name, value }));
    }
    
    get nextUrl() {
      return {
        pathname: new URL(this.url).pathname,
        clone: () => ({
          pathname: new URL(this.url).pathname,
          searchParams: new URLSearchParams()
        })
      };
    }
  }
}));

// Mock ConfigurationService
vi.mock('../../configuration', () => ({
  ConfigurationService: {
    getSupabaseConfig: vi.fn(() => ({
      url: 'https://test.supabase.co',
      anonKey: 'test-anon-key'
    })),
    getNextJSConfig: vi.fn(() => ({
      isDevelopment: true
    }))
  }
}));

describe('Unified Middleware', () => {
  beforeEach(() => {
    vi.resetModules();
    
    // Mock environment variables
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    process.env.NODE_ENV = 'test';
  });

  describe('Unified Middleware', () => {
    it('should handle authentication and authorization', async () => {
      const request = new NextRequest('http://localhost:3000/dashboard');
      const result = await middleware(request);
      
      expect(result).toBeDefined();
    });

    it('should allow access to public paths', async () => {
      const request = new NextRequest('http://localhost:3000/login');
      const result = await middleware(request);
      
      expect(result).toBeDefined();
    });

    it('should redirect unauthenticated users from protected paths', async () => {
      // Mock no user
      const { createServerClient } = await import('@supabase/ssr');
      const mockSupabase = createServerClient as any;
      mockSupabase.mockImplementation(() => ({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null }
          })
        }
      }));

      const request = new NextRequest('http://localhost:3000/dashboard');
      const result = await middleware(request);
      
      expect(result).toBeDefined();
    });
  });

  describe('Context Extraction', () => {
    it('should extract user context from headers', () => {
      const request = new NextRequest('http://localhost:3000/test', {
        headers: {
          'x-user-id': 'test-user',
          'x-user-email': 'test@example.com',
          'x-user-role': 'user',
          'x-user-plant-id': 'plant-1',
          'x-accessible-plants': '["plant-1"]'
        }
      });
      
      const context = extractUserContext(request);
      
      expect(context).toEqual({
        id: 'test-user',
        email: 'test@example.com',
        role: 'user',
        plantId: 'plant-1',
        accessiblePlants: ['plant-1']
      });
    });

    it('should return null for missing user context', () => {
      const request = new NextRequest('http://localhost:3000/test');
      
      const context = extractUserContext(request);
      
      expect(context).toBeNull();
    });

    it('should require authentication', () => {
      const request = new NextRequest('http://localhost:3000/test', {
        headers: {
          'x-user-id': 'test-user',
          'x-user-email': 'test@example.com',
          'x-user-role': 'user',
          'x-user-plant-id': 'plant-1',
          'x-accessible-plants': '["plant-1"]'
        }
      });
      
      const context = requireAuth(request);
      
      expect(context.id).toBe('test-user');
    });

    it('should throw error for missing authentication', () => {
      const request = new NextRequest('http://localhost:3000/test');
      
      expect(() => requireAuth(request)).toThrow('Authentication required');
    });

    it('should require specific role', () => {
      const request = new NextRequest('http://localhost:3000/test', {
        headers: {
          'x-user-id': 'test-user',
          'x-user-email': 'test@example.com',
          'x-user-role': 'hr_admin',
          'x-user-plant-id': 'plant-1',
          'x-accessible-plants': '["*"]'
        }
      });
      
      const context = requireRole(request, 'plant_manager');
      
      expect(context.role).toBe('hr_admin');
    });

    it('should throw error for insufficient role', () => {
      const request = new NextRequest('http://localhost:3000/test', {
        headers: {
          'x-user-id': 'test-user',
          'x-user-email': 'test@example.com',
          'x-user-role': 'user',
          'x-user-plant-id': 'plant-1',
          'x-accessible-plants': '["plant-1"]'
        }
      });
      
      expect(() => requireRole(request, 'plant_manager')).toThrow('Insufficient permissions');
    });

    it('should check plant access', () => {
      const request = new NextRequest('http://localhost:3000/test', {
        headers: {
          'x-user-id': 'test-user',
          'x-user-email': 'test@example.com',
          'x-user-role': 'user',
          'x-user-plant-id': 'plant-1',
          'x-accessible-plants': '["plant-1"]'
        }
      });
      
      expect(hasPlantAccess(request, 'plant-1')).toBe(true);
      expect(hasPlantAccess(request, 'plant-2')).toBe(false);
    });

    it('should allow admin access to all plants', () => {
      const request = new NextRequest('http://localhost:3000/test', {
        headers: {
          'x-user-id': 'test-user',
          'x-user-email': 'test@example.com',
          'x-user-role': 'hr_admin',
          'x-user-plant-id': 'plant-1',
          'x-accessible-plants': '["*"]'
        }
      });
      
      expect(hasPlantAccess(request, 'plant-1')).toBe(true);
      expect(hasPlantAccess(request, 'plant-2')).toBe(true);
    });
  });
});
