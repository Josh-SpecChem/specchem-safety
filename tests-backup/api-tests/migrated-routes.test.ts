/**
 * Integration Tests for Migrated Admin Routes
 * Tests the actual migrated admin routes using standardized patterns
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as usersGET, POST as usersPOST } from '@/app/api/admin/users/route';
import { GET as enrollmentsGET, POST as enrollmentsPOST } from '@/app/api/admin/enrollments/route';
import { GET as coursesGET, POST as coursesPOST } from '@/app/api/admin/courses/route';
import { GET as analyticsGET } from '@/app/api/admin/analytics/route';

// Mock the database operations
vi.mock('@/lib/db/operations', () => ({
  getUsersWithDetails: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
    ]
  }),
  createProfile: vi.fn().mockResolvedValue({
    success: true,
    data: { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
  }),
  updateProfile: vi.fn().mockResolvedValue({
    success: true,
    data: { id: '1', email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
  }),
  getEnrollmentsWithDetails: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: '1', userId: '1', courseId: '1', status: 'enrolled' }
    ]
  }),
  createEnrollment: vi.fn().mockResolvedValue({
    success: true,
    data: { id: '1', userId: '1', courseId: '1', status: 'enrolled' }
  }),
  updateEnrollment: vi.fn().mockResolvedValue({
    success: true,
    data: { id: '1', userId: '1', courseId: '1', status: 'completed' }
  }),
  getPlantStats: vi.fn().mockResolvedValue({
    totalUsers: 100,
    totalCourses: 10,
    totalEnrollments: 500
  }),
  getCourseStats: vi.fn().mockResolvedValue({
    enrollments: 50,
    completions: 30,
    avgProgress: 75
  })
}));

// Mock the auth middleware
vi.mock('@/lib/api-auth', () => ({
  withAdminAuth: vi.fn().mockImplementation((handler) => {
    return async (request: NextRequest) => {
      const mockProfile = {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        plantId: 'plant-1'
      };
      const mockAdminRoles = ['hr_admin'];
      return handler(mockProfile, mockAdminRoles);
    };
  })
}));

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: '1', title: 'Test Course' }])
  }
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
  sql: vi.fn(),
  count: vi.fn()
}));

describe('Migrated Admin Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Users Route', () => {
    it('should handle GET request with pagination', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users?page=1&limit=10');
      const response = await usersGET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it('should handle POST request with user creation', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          role: 'user',
          plantId: 'plant-1'
        })
      });
      
      const response = await usersPOST(request);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it('should handle validation errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          firstName: '',
          lastName: '',
          role: 'invalid-role'
        })
      });
      
      const response = await usersPOST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('Enrollments Route', () => {
    it('should handle GET request with filtering', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/enrollments?status=enrolled&page=1&limit=10');
      const response = await enrollmentsGET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it('should handle POST request with enrollment creation', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-1',
          courseId: 'course-1'
        })
      });
      
      const response = await enrollmentsPOST(request);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe('Courses Route', () => {
    it('should handle GET request with course statistics', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/courses');
      const response = await coursesGET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.courses).toBeDefined();
      expect(data.data.statistics).toBeDefined();
    });

    it('should handle POST request with course creation', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Course',
          slug: 'new-course',
          description: 'A new course',
          plantId: 'plant-1'
        })
      });
      
      const response = await coursesPOST(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe('Analytics Route', () => {
    it('should handle GET request with plant analytics', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/analytics?plantId=plant-1');
      const response = await analyticsGET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it('should handle GET request with course analytics', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/analytics?courseId=course-1&plantId=plant-1');
      const response = await analyticsGET(request);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock a database error
      const { getUsersWithDetails } = await import('@/lib/db/operations');
      vi.mocked(getUsersWithDetails).mockResolvedValueOnce({
        success: false,
        error: 'Database connection failed',
        code: 'DB_CONNECTION_ERROR'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users');
      const response = await usersGET(request);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should handle validation errors with proper status codes', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          firstName: '',
          lastName: '',
          role: 'invalid-role'
        })
      });
      
      const response = await usersPOST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('Response Format Consistency', () => {
    it('should maintain consistent response format across all routes', async () => {
      const routes = [
        { handler: usersGET, url: 'http://localhost:3000/api/admin/users' },
        { handler: enrollmentsGET, url: 'http://localhost:3000/api/admin/enrollments' },
        { handler: coursesGET, url: 'http://localhost:3000/api/admin/courses' },
        { handler: analyticsGET, url: 'http://localhost:3000/api/admin/analytics' }
      ];

      for (const route of routes) {
        const request = new NextRequest(route.url);
        const response = await route.handler(request);
        
        expect(response.status).toBe(200);
        const data = await response.json();
        
        // Check for consistent response structure
        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('timestamp');
        expect(typeof data.success).toBe('boolean');
        expect(typeof data.timestamp).toBe('string');
      }
    });
  });
});
