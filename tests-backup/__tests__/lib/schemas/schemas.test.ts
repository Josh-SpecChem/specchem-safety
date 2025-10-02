import { describe, it, expect } from 'vitest'
import {
  plantSchema,
  createPlantSchema,
  updatePlantSchema,
  courseSchema,
  profileSchema,
  enrollmentSchema,
  progressSchema,
  paginationSchema,
  enrollmentFiltersSchema,
  progressFiltersSchema,
  loginFormSchema,
  profileUpdateFormSchema,
  adminCreateUserFormSchema,
  validateUUID,
  validateEmail,
  validateDateString,
  validateProgressPercent,
  validateEnrollmentStatus,
  validateUserStatus,
  validateAdminRole,
  validateEventType,
} from '@/lib/schemas'

describe('Schema Validation Tests', () => {
  describe('Plant Schemas', () => {
    it('should validate valid plant data', () => {
      const validPlant = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Plant',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = plantSchema.safeParse(validPlant)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Test Plant')
        expect(result.data.isActive).toBe(true)
      }
    })

    it('should reject invalid plant data', () => {
      const invalidPlant = {
        id: 'invalid-uuid',
        name: '',
        isActive: 'not-boolean',
        createdAt: 'invalid-date',
        updatedAt: 'invalid-date',
      }

      const result = plantSchema.safeParse(invalidPlant)
      expect(result.success).toBe(false)
    })

    it('should validate create plant schema', () => {
      const validCreatePlant = {
        name: 'New Plant',
        isActive: true,
      }

      const result = createPlantSchema.safeParse(validCreatePlant)
      expect(result.success).toBe(true)
    })

    it('should validate update plant schema', () => {
      const validUpdatePlant = {
        name: 'Updated Plant',
        isActive: false,
      }

      const result = updatePlantSchema.safeParse(validUpdatePlant)
      expect(result.success).toBe(true)
    })
  })

  describe('Course Schemas', () => {
    it('should validate valid course data', () => {
      const validCourse = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-course',
        title: 'Test Course',
        version: '1.0',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = courseSchema.safeParse(validCourse)
      expect(result.success).toBe(true)
    })

    it('should reject invalid course data', () => {
      const invalidCourse = {
        id: 'invalid-uuid',
        slug: '',
        title: '',
        version: 'invalid',
        isPublished: 'not-boolean',
      }

      const result = courseSchema.safeParse(invalidCourse)
      expect(result.success).toBe(false)
    })
  })

  describe('Profile Schemas', () => {
    it('should validate valid profile data', () => {
      const validProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        plantId: '123e4567-e89b-12d3-a456-426614174001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        jobTitle: 'Safety Coordinator',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = profileSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('should reject invalid profile data', () => {
      const invalidProfile = {
        id: 'invalid-uuid',
        plantId: 'invalid-uuid',
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        status: 'invalid-status',
      }

      const result = profileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })
  })

  describe('Enrollment Schemas', () => {
    it('should validate valid enrollment data', () => {
      const validEnrollment = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        courseId: '123e4567-e89b-12d3-a456-426614174002',
        plantId: '123e4567-e89b-12d3-a456-426614174003',
        status: 'enrolled',
        enrolledAt: '2024-01-01T00:00:00Z',
        completedAt: null,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = enrollmentSchema.safeParse(validEnrollment)
      expect(result.success).toBe(true)
    })

    it('should reject invalid enrollment data', () => {
      const invalidEnrollment = {
        id: 'invalid-uuid',
        userId: 'invalid-uuid',
        courseId: 'invalid-uuid',
        plantId: 'invalid-uuid',
        status: 'invalid-status',
        enrolledAt: 'invalid-date',
      }

      const result = enrollmentSchema.safeParse(invalidEnrollment)
      expect(result.success).toBe(false)
    })
  })

  describe('Progress Schemas', () => {
    it('should validate valid progress data', () => {
      const validProgress = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        courseId: '123e4567-e89b-12d3-a456-426614174002',
        plantId: '123e4567-e89b-12d3-a456-426614174003',
        progressPercent: 75,
        currentSection: 'section-1',
        lastActiveAt: '2024-01-01T00:00:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = progressSchema.safeParse(validProgress)
      expect(result.success).toBe(true)
    })

    it('should reject invalid progress data', () => {
      const invalidProgress = {
        id: 'invalid-uuid',
        userId: 'invalid-uuid',
        courseId: 'invalid-uuid',
        plantId: 'invalid-uuid',
        progressPercent: 150, // Invalid: > 100
        lastActiveAt: 'invalid-date',
      }

      const result = progressSchema.safeParse(invalidProgress)
      expect(result.success).toBe(false)
    })
  })

  describe('Query Parameter Schemas', () => {
    it('should validate pagination schema', () => {
      const validPagination = {
        page: 1,
        limit: 20,
      }

      const result = paginationSchema.safeParse(validPagination)
      expect(result.success).toBe(true)
    })

    it('should reject invalid pagination data', () => {
      const invalidPagination = {
        page: 0, // Invalid: < 1
        limit: 1000, // Invalid: > 100
      }

      const result = paginationSchema.safeParse(invalidPagination)
      expect(result.success).toBe(false)
    })

    it('should validate enrollment filters schema', () => {
      const validFilters = {
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        courseId: '123e4567-e89b-12d3-a456-426614174001',
        userId: '123e4567-e89b-12d3-a456-426614174002',
        status: 'enrolled',
        page: 1,
        limit: 50,
      }

      const result = enrollmentFiltersSchema.safeParse(validFilters)
      expect(result.success).toBe(true)
    })

    it('should validate progress filters schema', () => {
      const validFilters = {
        plantId: '123e4567-e89b-12d3-a456-426614174000',
        courseId: '123e4567-e89b-12d3-a456-426614174001',
        userId: '123e4567-e89b-12d3-a456-426614174002',
        minProgress: 0,
        maxProgress: 100,
        page: 1,
        limit: 50,
      }

      const result = progressFiltersSchema.safeParse(validFilters)
      expect(result.success).toBe(true)
    })
  })

  describe('Form Validation Schemas', () => {
    it('should validate login form schema', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = loginFormSchema.safeParse(validLogin)
      expect(result.success).toBe(true)
    })

    it('should reject invalid login form data', () => {
      const invalidLogin = {
        email: 'invalid-email',
        password: '123', // Too short
      }

      const result = loginFormSchema.safeParse(invalidLogin)
      expect(result.success).toBe(false)
    })

    it('should validate profile update form schema', () => {
      const validProfileUpdate = {
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Safety Coordinator',
      }

      const result = profileUpdateFormSchema.safeParse(validProfileUpdate)
      expect(result.success).toBe(true)
    })

    it('should validate admin create user form schema', () => {
      const validCreateUser = {
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'Safety Manager',
        role: 'plant_manager',
        plantId: '123e4567-e89b-12d3-a456-426614174000',
      }

      const result = adminCreateUserFormSchema.safeParse(validCreateUser)
      expect(result.success).toBe(true)
    })
  })

  describe('Validation Helper Functions', () => {
    it('should validate UUIDs correctly', () => {
      expect(validateUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
      expect(validateUUID('invalid-uuid')).toBe(false)
      expect(validateUUID('')).toBe(false)
    })

    it('should validate emails correctly', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })

    it('should validate date strings correctly', () => {
      expect(validateDateString('2024-01-01T00:00:00Z')).toBe(true)
      expect(validateDateString('invalid-date')).toBe(false)
      expect(validateDateString('')).toBe(false)
    })

    it('should validate progress percent correctly', () => {
      expect(validateProgressPercent(0)).toBe(true)
      expect(validateProgressPercent(50)).toBe(true)
      expect(validateProgressPercent(100)).toBe(true)
      expect(validateProgressPercent(-1)).toBe(false)
      expect(validateProgressPercent(101)).toBe(false)
    })

    it('should validate enrollment status correctly', () => {
      expect(validateEnrollmentStatus('enrolled')).toBe(true)
      expect(validateEnrollmentStatus('in_progress')).toBe(true)
      expect(validateEnrollmentStatus('completed')).toBe(true)
      expect(validateEnrollmentStatus('invalid')).toBe(false)
    })

    it('should validate user status correctly', () => {
      expect(validateUserStatus('active')).toBe(true)
      expect(validateUserStatus('suspended')).toBe(true)
      expect(validateUserStatus('invalid')).toBe(false)
    })

    it('should validate admin role correctly', () => {
      expect(validateAdminRole('hr_admin')).toBe(true)
      expect(validateAdminRole('dev_admin')).toBe(true)
      expect(validateAdminRole('plant_manager')).toBe(true)
      expect(validateAdminRole('invalid')).toBe(false)
    })

    it('should validate event type correctly', () => {
      expect(validateEventType('view_section')).toBe(true)
      expect(validateEventType('start_course')).toBe(true)
      expect(validateEventType('complete_course')).toBe(true)
      expect(validateEventType('invalid')).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle optional fields correctly', () => {
      const minimalProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        plantId: '123e4567-e89b-12d3-a456-426614174001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        jobTitle: null, // Optional field
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = profileSchema.safeParse(minimalProfile)
      expect(result.success).toBe(true)
    })

    it('should handle default values correctly', () => {
      const createPlant = {
        name: 'Test Plant',
        // isActive should default to true
      }

      const result = createPlantSchema.safeParse(createPlant)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.isActive).toBe(true)
      }
    })

    it('should handle array validation correctly', () => {
      // Test enum validation
      expect(validateEnrollmentStatus('enrolled')).toBe(true)
      expect(validateEnrollmentStatus('invalid')).toBe(false)
    })
  })
})
