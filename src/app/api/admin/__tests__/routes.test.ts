/**
 * Integration tests for admin API routes
 * Tests the standardized API routes with proper error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST, PATCH } from '../../../app/api/admin/users/route';
import { GET as GET_ENROLLMENTS, POST as POST_ENROLLMENTS, PATCH as PATCH_ENROLLMENTS } from '../../../app/api/admin/enrollments/route';
import { GET as GET_COURSES, POST as POST_COURSES } from '../../../app/api/admin/courses/route';
import { GET as GET_ANALYTICS } from '../../../app/api/admin/analytics/route';
import { GET as GET_REPORTS } from '../../../app/api/admin/reports/route';
import { formatErrorResponse } from '../../../lib/errors';

// Mock the database operations
vi.mock('../../../lib/db/operations', () => ({
  getUsersWithDetails: vi.fn(),
  createProfile: vi.fn(),
  updateProfile: vi.fn(),
  getEnrollmentsWithDetails: vi.fn(),
  createEnrollment: vi.fn(),
  updateEnrollment: vi.fn(),
  getDetailedAnalytics: vi.fn(),
  getPlantStats: vi.fn(),
  getCourseStats: vi.fn(),
}));

// Mock the auth wrapper
vi.mock('../../../lib/api-auth', () => ({
  withAdminAuth: vi.fn((handler) => handler)
}));

describe('Admin API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Users API', () => {
    it('should get users with proper filtering', async () => {
      const { getUsersWithDetails } = await import('../../../lib/db/operations');
      vi.mocked(getUsersWithDetails).mockResolvedValue({
        success: true,
        data: {
          data: [{ id: 'user-1', firstName: 'John', lastName: 'Doe' }],
          total: 1,
          page: 1,
          limit: 50,
          totalPages: 1
        }
      });

      const request = new Request('http://localhost/api/admin/users?plantId=plant-1&search=john');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.data).toHaveLength(1);
      expect(data.data.data[0].firstName).toBe('John');
    });

    it('should handle database errors in GET users', async () => {
      const { getUsersWithDetails } = await import('../../../lib/db/operations');
      vi.mocked(getUsersWithDetails).mockResolvedValue({
        success: false,
        error: 'Database connection failed',
        code: 'DATABASE_ERROR'
      });

      const request = new Request('http://localhost/api/admin/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Database connection failed');
    });

    it('should create user with validation', async () => {
      const { createProfile } = await import('../../../lib/db/operations');
      vi.mocked(createProfile).mockResolvedValue({
        success: true,
        data: {
          id: 'new-user',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@test.com'
        }
      });

      const request = new Request('http://localhost/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@test.com',
          plantId: 'plant-1'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.firstName).toBe('Jane');
      expect(data.message).toContain('User profile created');
    });

    it('should handle validation errors in POST users', async () => {
      const request = new Request('http://localhost/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          firstName: '', // Invalid empty name
          lastName: 'Smith',
          email: 'invalid-email', // Invalid email
          plantId: 'plant-1'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should update user successfully', async () => {
      const { updateProfile } = await import('../../../lib/db/operations');
      vi.mocked(updateProfile).mockResolvedValue({
        success: true,
        data: {
          id: 'user-1',
          firstName: 'Updated',
          lastName: 'Name'
        }
      });

      const request = new Request('http://localhost/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({
          userId: 'user-1',
          firstName: 'Updated'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.firstName).toBe('Updated');
    });

    it('should handle missing userId in PATCH', async () => {
      const request = new Request('http://localhost/api/admin/users', {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: 'Updated'
          // Missing userId
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('userId is required');
    });
  });

  describe('Enrollments API', () => {
    it('should get enrollments with filtering', async () => {
      const { getEnrollmentsWithDetails } = await import('../../../lib/db/operations');
      vi.mocked(getEnrollmentsWithDetails).mockResolvedValue({
        success: true,
        data: {
          data: [{ id: 'enrollment-1', userId: 'user-1', courseId: 'course-1' }],
          total: 1,
          page: 1,
          limit: 50,
          totalPages: 1
        }
      });

      const request = new Request('http://localhost/api/admin/enrollments?status=completed');
      const response = await GET_ENROLLMENTS(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.data).toHaveLength(1);
    });

    it('should create enrollment successfully', async () => {
      const { createEnrollment } = await import('../../../lib/db/operations');
      vi.mocked(createEnrollment).mockResolvedValue({
        success: true,
        data: {
          id: 'new-enrollment',
          userId: 'user-1',
          courseId: 'course-1',
          status: 'enrolled'
        }
      });

      const request = new Request('http://localhost/api/admin/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          userId: 'user-1',
          courseId: 'course-1',
          plantId: 'plant-1'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST_ENROLLMENTS(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('enrolled');
    });

    it('should update enrollment status', async () => {
      const { updateEnrollment } = await import('../../../lib/db/operations');
      vi.mocked(updateEnrollment).mockResolvedValue({
        success: true,
        data: {
          id: 'enrollment-1',
          status: 'completed',
          completedAt: '2024-01-01T00:00:00Z'
        }
      });

      const request = new Request('http://localhost/api/admin/enrollments', {
        method: 'PATCH',
        body: JSON.stringify({
          enrollmentId: 'enrollment-1',
          status: 'completed',
          completedAt: '2024-01-01T00:00:00Z'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await PATCH_ENROLLMENTS(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('completed');
    });
  });

  describe('Courses API', () => {
    it('should get courses with statistics', async () => {
      const request = new Request('http://localhost/api/admin/courses');
      const response = await GET_COURSES();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.courses).toBeDefined();
      expect(data.data.statistics).toBeDefined();
    });

    it('should create course successfully', async () => {
      const request = new Request('http://localhost/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Course',
          slug: 'new-course',
          version: '1.0',
          isPublished: false
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST_COURSES(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('New Course');
    });
  });

  describe('Analytics API', () => {
    it('should get analytics data', async () => {
      const { getPlantStats, getCourseStats } = await import('../../../lib/db/operations');
      vi.mocked(getPlantStats).mockResolvedValue({
        totalEnrollments: 100,
        completedEnrollments: 80,
        averageProgress: 75,
        completionRate: 80
      });
      vi.mocked(getCourseStats).mockResolvedValue({
        totalEnrollments: 50,
        completedEnrollments: 40,
        averageProgress: 80,
        completionRate: 80
      });

      const request = new Request('http://localhost/api/admin/analytics?plantId=plant-1&courseId=course-1');
      const response = await GET_ANALYTICS(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.plantStats).toBeDefined();
      expect(data.data.courseStats).toBeDefined();
    });
  });

  describe('Reports API', () => {
    it('should get detailed analytics report', async () => {
      const { getDetailedAnalytics } = await import('../../../lib/db/operations');
      vi.mocked(getDetailedAnalytics).mockResolvedValue({
        success: true,
        data: {
          overview: {
            totalUsers: 100,
            activeUsers: 80,
            totalEnrollments: 200,
            completedCourses: 150,
            overallCompletionRate: 75
          },
          coursePerformance: [],
          plantPerformance: [],
          questionAnalytics: [],
          userActivity: [],
          complianceTracking: []
        }
      });

      const response = await GET_REPORTS();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.overview).toBeDefined();
      expect(data.data.coursePerformance).toBeDefined();
      expect(data.data.plantPerformance).toBeDefined();
    });
  });

  describe('Error Response Formatting', () => {
    it('should format DatabaseError correctly', () => {
      const error = new Error('Database connection failed');
      const formatted = formatErrorResponse(error);
      
      expect(formatted.success).toBe(false);
      expect(formatted.error).toBe('Database connection failed');
      expect(formatted.statusCode).toBe(500);
    });

    it('should format ValidationError correctly', () => {
      const error = new Error('Invalid email format');
      error.name = 'ValidationError';
      const formatted = formatErrorResponse(error);
      
      expect(formatted.success).toBe(false);
      expect(formatted.error).toBe('Invalid email format');
      expect(formatted.statusCode).toBe(500); // Generic error fallback
    });
  });
});
