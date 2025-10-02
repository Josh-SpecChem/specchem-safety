import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  createProfile, 
  getProfile, 
  getProfileByEmail, 
  updateProfile, 
  deleteProfile,
  createEnrollment,
  updateEnrollment,
  getEnrollmentsWithDetails,
  createProgress,
  updateProgress,
  getProgressWithDetails,
  getPlantStats,
  getCourseStats,
  getDetailedAnalytics,
  getQuestionStats,
  withDatabaseOperation
} from '@/lib/db/operations'
import { DatabaseError, ValidationError } from '@/lib/errors'
import type { 
  CreateProfile, 
  UpdateProfile, 
  EnrollmentFilters, 
  ProgressFilters,
  CreateEnrollment,
  CreateProgress
} from '@/lib/schemas'

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    select: vi.fn(),
    query: {
      profiles: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      enrollments: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      progress: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      plants: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
  },
}))

// Mock drizzle-orm functions
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((field, value) => ({ field, value, operator: 'eq' })),
  and: vi.fn((...conditions) => ({ conditions, operator: 'and' })),
  desc: vi.fn((field) => ({ field, direction: 'desc' })),
  asc: vi.fn((field) => ({ field, direction: 'asc' })),
  count: vi.fn(() => ({ function: 'count' })),
  avg: vi.fn((field) => ({ function: 'avg', field })),
  sql: vi.fn((template) => ({ sql: template })),
  or: vi.fn((...conditions) => ({ conditions, operator: 'or' })),
  like: vi.fn((field, pattern) => ({ field, pattern, operator: 'like' })),
}))

describe('Database Operations Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('withDatabaseOperation', () => {
    it('should return success response for successful operation', async () => {
      const mockData = { id: 'test-id', name: 'Test' }
      const mockOperation = vi.fn().mockResolvedValue(mockData)

      const result = await withDatabaseOperation(mockOperation)

      expect(result).toEqual({
        data: mockData,
        success: true,
      })
    })

    it('should return error response for failed operation', async () => {
      const mockError = new Error('Database error')
      const mockOperation = vi.fn().mockRejectedValue(mockError)

      const result = await withDatabaseOperation(mockOperation)

      expect(result).toEqual({
        success: false,
        error: 'Database error',
        code: 'UNKNOWN_ERROR',
      })
    })

    it('should handle DatabaseError with custom code', async () => {
      const mockError = new DatabaseError('Custom error', 'VALIDATION_ERROR')
      const mockOperation = vi.fn().mockRejectedValue(mockError)

      const result = await withDatabaseOperation(mockOperation)

      expect(result).toEqual({
        success: false,
        error: 'Custom error',
        code: 'VALIDATION_ERROR',
      })
    })
  })

  describe('Profile Operations', () => {
    const mockProfile: CreateProfile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      plantId: '123e4567-e89b-12d3-a456-426614174001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      jobTitle: 'Safety Coordinator',
      status: 'active',
    }

    it('should create profile successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockProfile])
        })
      })
      mockDb.db.insert = mockInsert

      const result = await createProfile(mockProfile)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProfile)
    })

    it('should get profile by id successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockFindFirst = vi.fn().mockResolvedValue(mockProfile)
      mockDb.db.query.profiles.findFirst = mockFindFirst

      const result = await getProfile('test-id')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProfile)
    })

    it('should get profile by email successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockFindFirst = vi.fn().mockResolvedValue(mockProfile)
      mockDb.db.query.profiles.findFirst = mockFindFirst

      const result = await getProfileByEmail('john.doe@test.com')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProfile)
    })

    it('should update profile successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockProfile])
          })
        })
      })
      mockDb.db.update = mockUpdate

      const updateData: UpdateProfile = {
        firstName: 'Jane',
        lastName: 'Smith',
      }

      const result = await updateProfile('test-id', updateData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProfile)
    })

    it('should handle profile not found error', async () => {
      const mockDb = await import('@/lib/db')
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]) // Empty array = not found
          })
        })
      })
      mockDb.db.update = mockUpdate

      const result = await updateProfile('non-existent-id', { firstName: 'Jane' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Profile not found')
    })

    it('should delete profile successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowCount: 1 })
      })
      mockDb.db.delete = mockDelete

      const result = await deleteProfile('test-id')

      expect(result.success).toBe(true)
    })

    it('should handle profile not found during deletion', async () => {
      const mockDb = await import('@/lib/db')
      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowCount: 0 }) // No rows affected
      })
      mockDb.db.delete = mockDelete

      const result = await deleteProfile('non-existent-id')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Profile not found')
    })
  })

  describe('Enrollment Operations', () => {
    const mockEnrollment: CreateEnrollment = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      courseId: '123e4567-e89b-12d3-a456-426614174001',
      plantId: '123e4567-e89b-12d3-a456-426614174002',
      status: 'enrolled',
    }

    it('should create enrollment successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockQuery = vi.fn().mockResolvedValue(null) // No existing enrollment
      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockEnrollment])
        })
      })
      mockDb.db.query.enrollments.findFirst = mockQuery
      mockDb.db.insert = mockInsert

      const result = await createEnrollment(mockEnrollment)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockEnrollment)
    })

    it('should handle enrollment conflict', async () => {
      const mockDb = await import('@/lib/db')
      const mockQuery = vi.fn().mockResolvedValue(mockEnrollment) // Existing enrollment found
      mockDb.db.query.enrollments.findFirst = mockQuery

      const result = await createEnrollment(mockEnrollment)

      expect(result.success).toBe(false)
      expect(result.error).toBe('User is already enrolled in this course')
    })

    it('should update enrollment successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockEnrollment])
          })
        })
      })
      mockDb.db.update = mockUpdate

      const updateData = { status: 'completed' as const }

      const result = await updateEnrollment('test-id', updateData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockEnrollment)
    })

    it('should get enrollments with details successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockFindMany = vi.fn().mockResolvedValue([mockEnrollment])
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ total: 1 }])
        })
      })
      mockDb.db.query.enrollments.findMany = mockFindMany
      mockDb.db.select = mockSelect

      const filters: EnrollmentFilters = {
        plantId: 'test-plant-id',
        page: 1,
        limit: 20,
      }

      const result = await getEnrollmentsWithDetails(filters)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })

  describe('Progress Operations', () => {
    const mockProgress: CreateProgress = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      courseId: '123e4567-e89b-12d3-a456-426614174001',
      plantId: '123e4567-e89b-12d3-a456-426614174002',
      progressPercent: 50,
      currentSection: 'section-1',
    }

    it('should create progress successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockQuery = vi.fn().mockResolvedValue(null) // No existing progress
      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockProgress])
        })
      })
      mockDb.db.query.progress.findFirst = mockQuery
      mockDb.db.insert = mockInsert

      const result = await createProgress(mockProgress)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProgress)
    })

    it('should handle progress conflict', async () => {
      const mockDb = await import('@/lib/db')
      const mockQuery = vi.fn().mockResolvedValue(mockProgress) // Existing progress found
      mockDb.db.query.progress.findFirst = mockQuery

      const result = await createProgress(mockProgress)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Progress record already exists for this user and course')
    })

    it('should update progress successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockProgress])
          })
        })
      })
      mockDb.db.update = mockUpdate

      const updateData = { progressPercent: 75 }

      const result = await updateProgress('test-id', updateData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProgress)
    })

    it('should get progress with details successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockFindMany = vi.fn().mockResolvedValue([mockProgress])
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ total: 1 }])
        })
      })
      mockDb.db.query.progress.findMany = mockFindMany
      mockDb.db.select = mockSelect

      const filters: ProgressFilters = {
        plantId: 'test-plant-id',
        page: 1,
        limit: 20,
      }

      const result = await getProgressWithDetails(filters)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })

  describe('Analytics Operations', () => {
    it('should get plant stats successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{
            totalEnrollments: 10,
            completedEnrollments: 5,
            inProgressEnrollments: 3,
          }])
        })
      })
      mockDb.db.select = mockSelect

      const result = await getPlantStats('test-plant-id')

      expect(result).toBeDefined()
      expect(result.totalEnrollments).toBe(10)
      expect(result.completedEnrollments).toBe(5)
    })

    it('should get course stats successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{
            totalEnrollments: 8,
            completedEnrollments: 4,
          }])
        })
      })
      mockDb.db.select = mockSelect

      const result = await getCourseStats('test-course-id')

      expect(result).toBeDefined()
      expect(result.totalEnrollments).toBe(8)
      expect(result.completedEnrollments).toBe(4)
    })

    it('should get detailed analytics successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ count: 100 }])
        })
      })
      mockDb.db.select = mockSelect

      const result = await getDetailedAnalytics()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should get question stats successfully', async () => {
      const mockDb = await import('@/lib/db')
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            groupBy: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockResolvedValue([{
                questionKey: 'q1',
                totalAttempts: 20,
                correctAttempts: 15,
                uniqueUsers: 10,
              }])
            })
          })
        })
      })
      mockDb.db.select = mockSelect

      const result = await getQuestionStats('test-plant-id')

      expect(result).toBeDefined()
      expect(result[0].questionKey).toBe('q1')
      expect(result[0].totalAttempts).toBe(20)
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const mockDb = await import('@/lib/db')
      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(new Error('Connection failed'))
        })
      })
      mockDb.db.insert = mockInsert

      const result = await createProfile({
        id: 'test-id',
        plantId: 'test-plant-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Connection failed')
    })

    it('should handle validation errors', async () => {
      const mockDb = await import('@/lib/db')
      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(new ValidationError('Invalid data'))
        })
      })
      mockDb.db.insert = mockInsert

      const result = await createProfile({
        id: 'test-id',
        plantId: 'test-plant-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid data')
    })
  })
})
