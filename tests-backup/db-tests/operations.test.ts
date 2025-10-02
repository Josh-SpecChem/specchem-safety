import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QueryBuilder } from '../builders/query-builder';
import { PaginationBuilder } from '../builders/pagination-builder';
import { FilterBuilder } from '../builders/filter-builder';
import { OperationWrapper } from '../wrappers/operation-wrapper';
import { DatabaseErrorHandler } from '../wrappers/error-handler';
import { UserOperations } from '../operations/users';
import { EnrollmentOperations } from '../operations/enrollments';
import { CourseOperations } from '../operations/courses';
import { AnalyticsOperations } from '../operations/analytics';

// Type for mocked database
type MockedDb = {
  query: {
    profiles: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
    enrollments: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
    courses: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
  };
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
};

// Mock database connection
const mockDb: MockedDb = {
  query: {
    profiles: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    enrollments: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    courses: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  select: vi.fn(),
};

vi.mock('../connection', () => ({
  db: mockDb,
}));

describe('Database Operations Refactoring', () => {
  describe('QueryBuilder', () => {
    let mockQuery: unknown;

    beforeEach(() => {
      mockQuery = {
        leftJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
      };
    });

    it('should create a query builder instance', () => {
      const builder = new QueryBuilder(mockQuery);
      expect(builder).toBeInstanceOf(QueryBuilder);
    });

    it('should add filter conditions', () => {
      const builder = new QueryBuilder(mockQuery);
      const condition = {
        field: 'status',
        operator: 'eq' as const,
        value: 'active'
      };

      builder.where(condition);
      expect(builder['filters']).toContain(condition);
    });

    it('should add multiple filter conditions', () => {
      const builder = new QueryBuilder(mockQuery);
      const conditions = [
        { field: 'status', operator: 'eq' as const, value: 'active' },
        { field: 'plantId', operator: 'eq' as const, value: 'plant-1' }
      ];

      builder.whereMany(conditions);
      expect(builder['filters']).toEqual(conditions);
    });

    it('should add sorting conditions', () => {
      const builder = new QueryBuilder(mockQuery);
      builder.orderBy('lastName', 'asc');
      
      expect(builder['sorts']).toContainEqual({
        field: 'lastName',
        direction: 'asc'
      });
    });

    it('should add pagination', () => {
      const builder = new QueryBuilder(mockQuery);
      builder.paginate(1, 20);
      
      expect(builder['pagination']).toEqual({
        page: 1,
        limit: 20,
        maxLimit: 100
      });
    });

    it('should clone the builder', () => {
      const builder = new QueryBuilder(mockQuery);
      builder.where({ field: 'status', operator: 'eq', value: 'active' });
      
      const cloned = builder.clone();
      expect(cloned['filters']).toEqual(builder['filters']);
      expect(cloned).not.toBe(builder);
    });
  });

  describe('PaginationBuilder', () => {
    it('should validate pagination options', () => {
      const options = { page: 0, limit: 150 };
      const validated = PaginationBuilder.validate(options);
      
      expect(validated.page).toBe(1); // Minimum page
      expect(validated.limit).toBe(100); // Maximum limit
    });

    it('should calculate offset correctly', () => {
      const offset = PaginationBuilder.calculateOffset(3, 20);
      expect(offset).toBe(40); // (3-1) * 20
    });

    it('should calculate total pages correctly', () => {
      const totalPages = PaginationBuilder.calculateTotalPages(100, 20);
      expect(totalPages).toBe(5);
    });

    it('should create pagination result', () => {
      const result = PaginationBuilder.createResult(2, 20, 100);
      
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.total).toBe(100);
      expect(result.totalPages).toBe(5);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(true);
    });

    it('should validate page number', () => {
      expect(PaginationBuilder.isValidPage(1)).toBe(true);
      expect(PaginationBuilder.isValidPage(0)).toBe(false);
      expect(PaginationBuilder.isValidPage(-1)).toBe(false);
    });

    it('should validate limit number', () => {
      expect(PaginationBuilder.isValidLimit(20)).toBe(true);
      expect(PaginationBuilder.isValidLimit(0)).toBe(false);
      expect(PaginationBuilder.isValidLimit(150)).toBe(false);
    });

    it('should get page range for UI', () => {
      const range = PaginationBuilder.getPageRange(5, 10, 5);
      expect(range).toEqual([3, 4, 5, 6, 7]);
    });
  });

  describe('FilterBuilder', () => {
    it('should create user filters', () => {
      const filters = {
        plantId: 'plant-1',
        status: 'active',
        search: 'john'
      };

      const conditions = FilterBuilder.createUserFilters(filters);
      
      expect(conditions).toHaveLength(5); // plantId, status, firstName, lastName, email
      expect(conditions[0]).toEqual({
        field: 'plantId',
        operator: 'eq',
        value: 'plant-1'
      });
    });

    it('should create enrollment filters', () => {
      const filters = {
        userId: 'user-1',
        courseId: 'course-1',
        status: 'completed'
      };

      const conditions = FilterBuilder.createEnrollmentFilters(filters);
      
      expect(conditions).toHaveLength(3);
      expect(conditions[0]).toEqual({
        field: 'userId',
        operator: 'eq',
        value: 'user-1'
      });
    });

    it('should create text search filters', () => {
      const conditions = FilterBuilder.createTextSearchFilters('test', ['name', 'email']);
      
      expect(conditions).toHaveLength(2);
      expect(conditions[0]).toEqual({
        field: 'name',
        operator: 'like',
        value: '%test%',
        joinOperator: 'or'
      });
    });

    it('should create date range filters', () => {
      const start = new Date('2023-01-01');
      const end = new Date('2023-12-31');
      
      const conditions = FilterBuilder.createDateRangeFilters('createdAt', start, end);
      
      expect(conditions).toHaveLength(2);
      expect(conditions[0]).toEqual({
        field: 'createdAt',
        operator: 'gte',
        value: start
      });
    });

    it('should sanitize filters', () => {
      const conditions = [
        { field: 'status', operator: 'eq' as const, value: 'active' },
        { field: 'name', operator: 'like' as const, value: '' },
        { field: 'id', operator: 'eq' as const, value: null },
        { field: 'tags', operator: 'in' as const, value: [] }
      ];

      const sanitized = FilterBuilder.sanitizeFilters(conditions);
      expect(sanitized).toHaveLength(1);
      expect(sanitized[0].field).toBe('status');
    });
  });

  describe('OperationWrapper', () => {
    it('should execute operation successfully', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success');
      
      const result = await OperationWrapper.withDatabaseOperation(mockOperation);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(1);
    });

    it('should handle operation failure', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Test error'));
      
      const result = await OperationWrapper.withDatabaseOperation(mockOperation);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
      expect(result.attempts).toBe(3); // Default retries
    });

    it('should retry on retryable errors', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('timeout'))
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValue('success');
      
      const result = await OperationWrapper.withDatabaseOperation(mockOperation, { retries: 3 });
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(3);
    });

    it('should not retry on non-retryable errors', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('duplicate key'));
      
      const result = await OperationWrapper.withDatabaseOperation(mockOperation);
      
      expect(result.success).toBe(false);
      expect(result.attempts).toBe(1);
    });

    it('should handle timeout', async () => {
      const mockOperation = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      const result = await OperationWrapper.withDatabaseOperation(mockOperation, { timeout: 50 });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Operation timeout');
    });
  });

  describe('DatabaseErrorHandler', () => {
    it('should handle conflict errors', () => {
      const error = new Error('duplicate key');
      
      expect(() => DatabaseErrorHandler.handle(error)).toThrow('Resource already exists');
    });

    it('should handle foreign key errors', () => {
      const error = new Error('foreign key constraint');
      
      expect(() => DatabaseErrorHandler.handle(error)).toThrow('Referenced resource does not exist');
    });

    it('should handle not found errors', () => {
      const error = new Error('not found');
      
      expect(() => DatabaseErrorHandler.handle(error)).toThrow('Resource not found');
    });

    it('should handle validation errors', () => {
      const error = new Error('not null');
      
      expect(() => DatabaseErrorHandler.handle(error)).toThrow('Required field is missing');
    });

    it('should check if error is retryable', () => {
      expect(DatabaseErrorHandler.isRetryableError(new Error('timeout'))).toBe(true);
      expect(DatabaseErrorHandler.isRetryableError(new Error('duplicate key'))).toBe(false);
    });

    it('should get HTTP status code for error', () => {
      const conflictError = new Error('duplicate key');
      const notFoundError = new Error('not found');
      
      expect(DatabaseErrorHandler.getStatusCode(conflictError)).toBe(409);
      expect(DatabaseErrorHandler.getStatusCode(notFoundError)).toBe(404);
    });

    it('should format error for API response', () => {
      const error = new Error('Test error');
      const formatted = DatabaseErrorHandler.formatError(error);
      
      expect(formatted.error).toBe('Test error');
      expect(formatted.statusCode).toBe(500);
      expect(formatted.timestamp).toBeDefined();
    });
  });

  describe('UserOperations', () => {
    it('should get users with details', async () => {
      const mockUsers = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
      ];
      
      vi.mocked(db.query.profiles.findMany).mockResolvedValue(mockUsers);
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 1 }])
        })
      });

      const result = await UserOperations.getUsersWithDetails({
        page: 1,
        limit: 20,
        status: 'active'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toEqual(mockUsers);
        expect(result.data.total).toBe(1);
      }
    });

    it('should create user', async () => {
      const userData = {
        id: '1',
        plantId: 'plant-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      vi.mocked(db.query.profiles.findFirst).mockResolvedValue(null);
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([userData])
        })
      });

      const result = await UserOperations.createUser(userData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userData);
      }
    });

    it('should handle user creation conflict', async () => {
      const userData = {
        id: '1',
        plantId: 'plant-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      vi.mocked(db.query.profiles.findFirst).mockResolvedValue({ id: '1' });

      const result = await UserOperations.createUser(userData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('already exists');
      }
    });
  });

  describe('EnrollmentOperations', () => {
    it('should get enrollments with details', async () => {
      const mockEnrollments = [
        { id: '1', userId: 'user-1', courseId: 'course-1', status: 'enrolled' }
      ];
      
      vi.mocked(db.query.enrollments.findMany).mockResolvedValue(mockEnrollments);
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 1 }])
        })
      });

      const result = await EnrollmentOperations.getEnrollmentsWithDetails({
        page: 1,
        limit: 20,
        status: 'enrolled'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toEqual(mockEnrollments);
      }
    });

    it('should create enrollment', async () => {
      const enrollmentData = {
        userId: 'user-1',
        courseId: 'course-1',
        plantId: 'plant-1'
      };

      vi.mocked(db.query.enrollments.findFirst).mockResolvedValue(null);
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: '1', ...enrollmentData }])
        })
      });

      const result = await EnrollmentOperations.createEnrollment(enrollmentData);

      expect(result.success).toBe(true);
    });

    it('should handle enrollment conflict', async () => {
      const enrollmentData = {
        userId: 'user-1',
        courseId: 'course-1',
        plantId: 'plant-1'
      };

      vi.mocked(db.query.enrollments.findFirst).mockResolvedValue({ id: '1' });

      const result = await EnrollmentOperations.createEnrollment(enrollmentData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('already enrolled');
      }
    });
  });

  describe('CourseOperations', () => {
    it('should get courses with details', async () => {
      const mockCourses = [
        { id: '1', title: 'Course 1', slug: 'course-1', isPublished: true }
      ];
      
      vi.mocked(db.query.courses.findMany).mockResolvedValue(mockCourses);
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 1 }])
        })
      });

      const result = await CourseOperations.getCoursesWithDetails({
        page: 1,
        limit: 20,
        isPublished: true
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toEqual(mockCourses);
      }
    });

    it('should create course', async () => {
      const courseData = {
        title: 'New Course',
        slug: 'new-course',
        version: '1.0'
      };

      vi.mocked(db.query.courses.findFirst).mockResolvedValue(null);
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: '1', ...courseData }])
        })
      });

      const result = await CourseOperations.createCourse(courseData);

      expect(result.success).toBe(true);
    });

    it('should handle course creation conflict', async () => {
      const courseData = {
        title: 'New Course',
        slug: 'existing-course',
        version: '1.0'
      };

      vi.mocked(db.query.courses.findFirst).mockResolvedValue({ id: '1' });

      const result = await CourseOperations.createCourse(courseData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('slug already exists');
      }
    });
  });

  describe('AnalyticsOperations', () => {
    it('should get detailed analytics', async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 10 }])
        })
      });

      const result = await AnalyticsOperations.getDetailedAnalytics();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.overview).toBeDefined();
        expect(result.data.coursePerformance).toBeDefined();
        expect(result.data.plantPerformance).toBeDefined();
      }
    });

    it('should get plant statistics', async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ 
            totalEnrollments: 50,
            completedEnrollments: 30,
            inProgressEnrollments: 15,
            averageProgress: 75
          }])
        })
      });

      const result = await AnalyticsOperations.getPlantStats('plant-1');

      expect(result.totalUsers).toBeDefined();
      expect(result.activeEnrollments).toBeDefined();
      expect(result.completionRate).toBeDefined();
      expect(result.averageProgress).toBeDefined();
    });

    it('should get course statistics', async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ 
            totalEnrollments: 25,
            completedEnrollments: 20,
            averageProgress: 85
          }])
        })
      });

      const result = await AnalyticsOperations.getCourseStats('course-1');

      expect(result.totalEnrollments).toBeDefined();
      expect(result.completedEnrollments).toBeDefined();
      expect(result.completionRate).toBeDefined();
      expect(result.averageProgress).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex query with multiple filters and pagination', async () => {
      const mockData = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
      ];
      
      vi.mocked(db.query.profiles.findMany).mockResolvedValue(mockData);
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 1 }])
        })
      });

      const result = await UserOperations.getUsersWithDetails({
        page: 1,
        limit: 20,
        plantId: 'plant-1',
        status: 'active',
        search: 'john'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.data).toEqual(mockData);
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it('should handle error scenarios gracefully', async () => {
      vi.mocked(db.query.profiles.findMany).mockRejectedValue(new Error('Database connection failed'));

      const result = await UserOperations.getUsersWithDetails({
        page: 1,
        limit: 20
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.code).toBeDefined();
      }
    });
  });
});