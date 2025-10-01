/**
 * Comprehensive tests for database operations standardization
 * Tests all standardized database operations and error handling patterns
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
  createProfile, 
  getProfile, 
  updateProfile, 
  deleteProfile,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  createProgress,
  updateProgress,
  deleteProgress,
  getUsersWithDetails,
  getEnrollmentsWithDetails,
  getProgressWithDetails,
  getDetailedAnalytics
} from '../db/operations';
import { DatabaseError, ValidationError, NotFoundError, ConflictError } from '../errors';
import type { CreateProfile, CreateEnrollment, CreateProgress } from '../schemas';

// Mock the database
vi.mock('../db', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'test-id', name: 'Test' }])
      })
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'test-id', name: 'Updated' }])
        })
      })
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({ rowCount: 1 })
    }),
    query: {
      profiles: {
        findFirst: vi.fn().mockResolvedValue({ id: 'test-id', name: 'Test' }),
        findMany: vi.fn().mockResolvedValue([{ id: 'test-id', name: 'Test' }])
      },
      enrollments: {
        findFirst: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([])
      },
      progress: {
        findFirst: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([])
      }
    },
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ count: 10 }])
      })
    })
  }
}));

describe('Database Operations Standardization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Profile Operations', () => {
    it('should create profile with proper validation', async () => {
      const profileData: CreateProfile = {
        id: 'test-id',
        plantId: 'plant-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
      };
      
      const result = await createProfile(profileData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('test-id');
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
      }
    });

    it('should handle database errors gracefully', async () => {
      const { db } = await import('../db');
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(new Error('Database connection failed'))
        })
      } as any);

      const profileData: CreateProfile = {
        id: 'test-id',
        plantId: 'plant-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
      };
      
      const result = await createProfile(profileData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Database connection failed');
        expect(result.code).toBe('UNKNOWN_ERROR');
      }
    });

    it('should get profile with relations', async () => {
      const result = await getProfile('test-id');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
      }
    });

    it('should update profile and handle not found', async () => {
      const { db } = await import('../db');
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([])
          })
        })
      } as any);

      const result = await updateProfile('non-existent-id', { firstName: 'Updated' });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Profile not found');
      }
    });

    it('should delete profile successfully', async () => {
      const result = await deleteProfile('test-id');
      
      expect(result.success).toBe(true);
    });
  });

  describe('Enrollment Operations', () => {
    it('should create enrollment with conflict detection', async () => {
      const { db } = await import('../db');
      vi.mocked(db.query.enrollments.findFirst).mockResolvedValue({
        id: 'existing-enrollment',
        userId: 'user-id',
        courseId: 'course-id'
      });

      const enrollmentData: CreateEnrollment = {
        userId: 'user-id',
        courseId: 'course-id',
        plantId: 'plant-id',
      };
      
      const result = await createEnrollment(enrollmentData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('already enrolled');
      }
    });

    it('should create enrollment when no conflict exists', async () => {
      const { db } = await import('../db');
      vi.mocked(db.query.enrollments.findFirst).mockResolvedValue(null);

      const enrollmentData: CreateEnrollment = {
        userId: 'user-id',
        courseId: 'course-id',
        plantId: 'plant-id',
      };
      
      const result = await createEnrollment(enrollmentData);
      
      expect(result.success).toBe(true);
    });

    it('should update enrollment successfully', async () => {
      const result = await updateEnrollment('test-id', { status: 'completed' });
      
      expect(result.success).toBe(true);
    });

    it('should delete enrollment successfully', async () => {
      const result = await deleteEnrollment('test-id');
      
      expect(result.success).toBe(true);
    });
  });

  describe('Progress Operations', () => {
    it('should create progress with conflict detection', async () => {
      const { db } = await import('../db');
      vi.mocked(db.query.progress.findFirst).mockResolvedValue({
        id: 'existing-progress',
        userId: 'user-id',
        courseId: 'course-id'
      });

      const progressData: CreateProgress = {
        userId: 'user-id',
        courseId: 'course-id',
        plantId: 'plant-id',
      };
      
      const result = await createProgress(progressData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('already exists');
      }
    });

    it('should create progress when no conflict exists', async () => {
      const { db } = await import('../db');
      vi.mocked(db.query.progress.findFirst).mockResolvedValue(null);

      const progressData: CreateProgress = {
        userId: 'user-id',
        courseId: 'course-id',
        plantId: 'plant-id',
      };
      
      const result = await createProgress(progressData);
      
      expect(result.success).toBe(true);
    });

    it('should update progress successfully', async () => {
      const result = await updateProgress('test-id', { progressPercent: 50 });
      
      expect(result.success).toBe(true);
    });

    it('should delete progress successfully', async () => {
      const result = await deleteProgress('test-id');
      
      expect(result.success).toBe(true);
    });
  });

  describe('Query Operations with Filters', () => {
    it('should get users with details and pagination', async () => {
      const filters = {
        plantId: 'plant-id',
        status: 'active' as const,
        search: 'john',
        page: 1,
        limit: 10
      };
      
      const result = await getUsersWithDetails(filters);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toBeDefined();
        expect(result.data.total).toBeDefined();
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should get enrollments with details and filters', async () => {
      const filters = {
        plantId: 'plant-id',
        courseId: 'course-id',
        status: 'completed' as const,
        page: 1,
        limit: 10
      };
      
      const result = await getEnrollmentsWithDetails(filters);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toBeDefined();
        expect(result.data.total).toBeDefined();
      }
    });

    it('should get progress with details and filters', async () => {
      const filters = {
        plantId: 'plant-id',
        courseId: 'course-id',
        minProgress: 50,
        maxProgress: 100,
        page: 1,
        limit: 10
      };
      
      const result = await getProgressWithDetails(filters);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toBeDefined();
        expect(result.data.total).toBeDefined();
      }
    });
  });

  describe('Analytics Operations', () => {
    it('should get detailed analytics', async () => {
      const result = await getDetailedAnalytics();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.overview).toBeDefined();
        expect(result.data.coursePerformance).toBeDefined();
        expect(result.data.plantPerformance).toBeDefined();
        expect(result.data.questionAnalytics).toBeDefined();
        expect(result.data.complianceTracking).toBeDefined();
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle DatabaseError correctly', () => {
      const error = new DatabaseError('Test database error', 'TEST_ERROR', 500);
      expect(error.message).toBe('Test database error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('DatabaseError');
    });

    it('should handle ValidationError correctly', () => {
      const error = new ValidationError('Test validation error', 'fieldName', 'VALIDATION_ERROR');
      expect(error.message).toBe('Test validation error');
      expect(error.field).toBe('fieldName');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    it('should handle NotFoundError correctly', () => {
      const error = new NotFoundError('Resource not found');
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.name).toBe('NotFoundError');
    });

    it('should handle ConflictError correctly', () => {
      const error = new ConflictError('Resource conflict');
      expect(error.message).toBe('Resource conflict');
      expect(error.code).toBe('CONFLICT');
      expect(error.name).toBe('ConflictError');
    });
  });
});
