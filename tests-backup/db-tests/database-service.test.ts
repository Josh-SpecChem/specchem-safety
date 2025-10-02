import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DatabaseService, TenantFilter } from '../database-service';
import { MigrationManager, MigrationUtils } from '../migration-strategy';
import type { UserContext, UserFilters, CourseFilters, EnrollmentFilters } from '@/types/database';
import type { db as DatabaseType } from '../connection';

// Mock the database connection
vi.mock('../connection', () => ({
  db: {
    query: {
      profiles: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      courses: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      enrollments: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    select: vi.fn(),
  },
}));

// Mock the schema
vi.mock('../schema', () => ({
  profiles: {
    id: 'id',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    plantId: 'plantId',
    status: 'status',
  },
  courses: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    isPublished: 'isPublished',
  },
  enrollments: {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    plantId: 'plantId',
    status: 'status',
    enrolledAt: 'enrolledAt',
  },
}));

// Type for mocked database
type MockedDatabase = {
  query: {
    profiles: {
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
    };
    courses: {
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
    };
    enrollments: {
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
    };
  };
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
};

describe('DatabaseService', () => {
  let mockUserContext: UserContext;
  let mockDb: MockedDatabase;

  beforeEach(() => {
    // Reset migration configuration
    MigrationManager.updateConfig({
      useNewService: true,
      enableLogging: false,
      fallbackToLegacy: false,
    });

    mockUserContext = {
      userId: 'test-user-id',
      plantId: 'plant-1',
      accessiblePlants: ['plant-1', 'plant-2'],
      roles: [
        { role: 'hr_admin', plantId: 'plant-1' },
        { role: 'plant_manager', plantId: 'plant-2' },
      ],
    };

    // Mock database methods
    mockDb = {
      query: {
        profiles: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockResolvedValue(null),
        },
        courses: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockResolvedValue(null),
        },
        enrollments: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 'updated-id' }]),
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowCount: 1 }),
      }),
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 10 }]),
        }),
      }),
    };

    // Replace the mocked db with our mock - properly typed
    const { db } = await import('../connection');
    vi.mocked(db).mockImplementation(() => mockDb as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('User Operations', () => {
    it('should get users with tenant filtering', async () => {
      const filters: UserFilters = {
        page: 1,
        limit: 20,
        search: 'test',
      };

      const result = await DatabaseService.getUsers(filters, mockUserContext);

      expect(result).toEqual({
        data: [],
        total: 10,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      // Verify tenant filtering was applied
      expect(mockDb.query.profiles.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          with: expect.any(Object),
          limit: 20,
          offset: 0,
          orderBy: expect.any(Array),
        })
      );
    });

    it('should get user by ID with tenant filtering', async () => {
      const userId = 'user-1';
      
      await DatabaseService.getUserById(userId, mockUserContext);

      expect(mockDb.query.profiles.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
          with: expect.any(Object),
        })
      );
    });

    it('should create user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        plantId: 'plant-1',
      };

      const result = await DatabaseService.createUser(userData);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when creating duplicate user', async () => {
      mockDb.query.profiles.findFirst.mockResolvedValue({ id: 'existing' });

      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        plantId: 'plant-1',
      };

      await expect(DatabaseService.createUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should update user with tenant validation', async () => {
      const userId = 'user-1';
      const updateData = {
        firstName: 'Updated',
        plantId: 'plant-1',
      };

      await DatabaseService.updateUser(userId, updateData, mockUserContext);

      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should delete user with tenant validation', async () => {
      const userId = 'user-1';
      
      await DatabaseService.deleteUser(userId, mockUserContext);

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe('Course Operations', () => {
    it('should get courses with tenant filtering', async () => {
      const filters: CourseFilters = {
        page: 1,
        limit: 20,
        isPublished: true,
      };

      const result = await DatabaseService.getCourses(filters, mockUserContext);

      expect(result).toEqual({
        data: [],
        total: 10,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      expect(mockDb.query.courses.findMany).toHaveBeenCalled();
    });

    it('should get course by ID with tenant filtering', async () => {
      const courseId = 'course-1';
      
      await DatabaseService.getCourseById(courseId, mockUserContext);

      expect(mockDb.query.courses.findFirst).toHaveBeenCalled();
    });

    it('should create course successfully', async () => {
      const courseData = {
        title: 'Test Course',
        slug: 'test-course',
        isPublished: true,
      };

      const result = await DatabaseService.createCourse(courseData);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when creating duplicate course', async () => {
      mockDb.query.courses.findFirst.mockResolvedValue({ id: 'existing' });

      const courseData = {
        title: 'Test Course',
        slug: 'test-course',
        isPublished: true,
      };

      await expect(DatabaseService.createCourse(courseData)).rejects.toThrow(
        'Course with this slug already exists'
      );
    });
  });

  describe('Enrollment Operations', () => {
    it('should get enrollments with tenant filtering', async () => {
      const filters: EnrollmentFilters = {
        page: 1,
        limit: 20,
        status: 'enrolled',
      };

      const result = await DatabaseService.getEnrollments(filters, mockUserContext);

      expect(result).toEqual({
        data: [],
        total: 10,
        page: 1,
        limit: 20,
        totalPages: 1,
      });

      expect(mockDb.query.enrollments.findMany).toHaveBeenCalled();
    });

    it('should create enrollment successfully', async () => {
      const enrollmentData = {
        userId: 'user-1',
        courseId: 'course-1',
        plantId: 'plant-1',
        status: 'enrolled' as const,
      };

      const result = await DatabaseService.createEnrollment(enrollmentData);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when creating duplicate enrollment', async () => {
      mockDb.query.enrollments.findFirst.mockResolvedValue({ id: 'existing' });

      const enrollmentData = {
        userId: 'user-1',
        courseId: 'course-1',
        plantId: 'plant-1',
        status: 'enrolled' as const,
      };

      await expect(DatabaseService.createEnrollment(enrollmentData)).rejects.toThrow(
        'User is already enrolled in this course'
      );
    });
  });

  describe('Analytics Operations', () => {
    it('should get analytics data', async () => {
      const filters = {};
      
      const result = await DatabaseService.getAnalytics(filters, mockUserContext);

      expect(result).toEqual({
        overview: {
          totalUsers: 10,
          totalEnrollments: 10,
          completedCourses: 10,
          overallCompletionRate: 100,
        },
        coursePerformance: [],
        plantPerformance: [],
        questionAnalytics: [],
        userActivity: [],
        complianceTracking: [],
      });
    });

    it('should get dashboard stats', async () => {
      const result = await DatabaseService.getDashboardStats('plant-1');

      expect(result).toEqual({
        totalEnrollments: 10,
        completedEnrollments: 10,
        inProgressEnrollments: 10,
        completionRate: 100,
      });
    });
  });
});

describe('TenantFilter', () => {
  let mockUserContext: UserContext;

  beforeEach(() => {
    mockUserContext = {
      accessiblePlants: ['plant-1', 'plant-2'],
      roles: [],
    };
  });

  it('should validate access for single plant', () => {
    const singlePlantContext: UserContext = {
      accessiblePlants: ['plant-1'],
      roles: [],
    };

    expect(TenantFilter.validateAccess(singlePlantContext, 'plant-1')).toBe(true);
    expect(TenantFilter.validateAccess(singlePlantContext, 'plant-2')).toBe(false);
  });

  it('should validate access for multiple plants', () => {
    expect(TenantFilter.validateAccess(mockUserContext, 'plant-1')).toBe(true);
    expect(TenantFilter.validateAccess(mockUserContext, 'plant-2')).toBe(true);
    expect(TenantFilter.validateAccess(mockUserContext, 'plant-3')).toBe(false);
  });

  it('should validate access for no plants', () => {
    const noAccessContext: UserContext = {
      accessiblePlants: [],
      roles: [],
    };

    expect(TenantFilter.validateAccess(noAccessContext, 'plant-1')).toBe(false);
  });
});

describe('MigrationManager', () => {
  beforeEach(() => {
    MigrationManager.updateConfig({
      useNewService: false,
      enableLogging: false,
      fallbackToLegacy: true,
    });
  });

  it('should update configuration', () => {
    MigrationManager.updateConfig({ useNewService: true });
    
    expect(MigrationManager.getConfig().useNewService).toBe(true);
  });

  it('should check if new service should be used', () => {
    expect(MigrationManager.shouldUseNewService()).toBe(false);
    
    MigrationManager.updateConfig({ useNewService: true });
    expect(MigrationManager.shouldUseNewService()).toBe(true);
  });
});

describe('MigrationUtils', () => {
  beforeEach(() => {
    MigrationManager.updateConfig({
      useNewService: false,
      enableLogging: false,
      fallbackToLegacy: true,
    });
  });

  it('should enable new service', () => {
    MigrationUtils.enableNewService();
    
    expect(MigrationManager.getConfig().useNewService).toBe(true);
  });

  it('should disable new service', () => {
    MigrationManager.updateConfig({ useNewService: true });
    MigrationUtils.disableNewService();
    
    expect(MigrationManager.getConfig().useNewService).toBe(false);
  });

  it('should enable logging', () => {
    MigrationUtils.enableLogging();
    
    expect(MigrationManager.getConfig().enableLogging).toBe(true);
  });

  it('should disable logging', () => {
    MigrationManager.updateConfig({ enableLogging: true });
    MigrationUtils.disableLogging();
    
    expect(MigrationManager.getConfig().enableLogging).toBe(false);
  });

  it('should get migration status', () => {
    const status = MigrationUtils.getStatus();
    
    expect(status).toEqual({
      usingNewService: false,
      loggingEnabled: false,
      fallbackEnabled: true,
    });
  });
});
