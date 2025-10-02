import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db } from '@/lib/db'
import { plants, profiles, enrollments, progress, courses } from '@/contracts'
import { eq, and, count, avg } from 'drizzle-orm'
import {
  plantSchema,
  profileSchema,
  enrollmentSchema,
  progressSchema,
  courseSchema,
  createProfileSchema,
  createEnrollmentSchema,
  createProgressSchema,
} from '@/lib/schemas'

describe('Database Integration Tests', () => {
  let testPlantId: string
  let testProfileId: string
  let testCourseId: string
  let testEnrollmentId: string
  let testProgressId: string

  beforeAll(async () => {
    // Create test data
    const [plant] = await db.insert(plants).values({
      name: 'Test Plant',
      isActive: true,
    }).returning()
    testPlantId = plant.id

    const [profile] = await db.insert(profiles).values({
      id: 'test-profile-id',
      plantId: testPlantId,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      jobTitle: 'Test Role',
      status: 'active',
    }).returning()
    testProfileId = profile.id

    const [course] = await db.insert(courses).values({
      id: 'test-course-id',
      slug: 'test-course',
      title: 'Test Course',
      version: '1.0',
      isPublished: true,
    }).returning()
    testCourseId = course.id

    const [enrollment] = await db.insert(enrollments).values({
      userId: testProfileId,
      courseId: testCourseId,
      plantId: testPlantId,
      status: 'enrolled',
    }).returning()
    testEnrollmentId = enrollment.id

    const [progressRecord] = await db.insert(progress).values({
      userId: testProfileId,
      courseId: testCourseId,
      plantId: testPlantId,
      progressPercent: 50,
      currentSection: 'section-1',
    }).returning()
    testProgressId = progressRecord.id
  })

  afterAll(async () => {
    // Clean up test data
    await db.delete(progress).where(eq(progress.id, testProgressId))
    await db.delete(enrollments).where(eq(enrollments.id, testEnrollmentId))
    await db.delete(courses).where(eq(courses.id, testCourseId))
    await db.delete(profiles).where(eq(profiles.id, testProfileId))
    await db.delete(plants).where(eq(plants.id, testPlantId))
  })

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      const result = await db.select().from(plants).limit(1)
      expect(result).toBeDefined()
    })

    it('should execute basic queries', async () => {
      const plantsResult = await db.select().from(plants)
      expect(Array.isArray(plantsResult)).toBe(true)
    })
  })

  describe('Plant Operations', () => {
    it('should create and retrieve plants', async () => {
      const plantsResult = await db.select().from(plants)
      expect(plantsResult.length).toBeGreaterThan(0)
      
      const testPlant = plantsResult.find(p => p.id === testPlantId)
      expect(testPlant).toBeDefined()
      expect(testPlant?.name).toBe('Test Plant')
      expect(testPlant?.isActive).toBe(true)
    })

    it('should validate plant data with Zod schema', async () => {
      const plantsResult = await db.select().from(plants).where(eq(plants.id, testPlantId))
      const plant = plantsResult[0]
      
      const validatedPlant = plantSchema.parse({
        id: plant.id,
        name: plant.name,
        isActive: plant.isActive,
        createdAt: plant.createdAt.toISOString(),
        updatedAt: plant.updatedAt.toISOString(),
      })
      
      expect(validatedPlant.id).toBe(testPlantId)
      expect(validatedPlant.name).toBe('Test Plant')
    })
  })

  describe('Profile Operations', () => {
    it('should create and retrieve profiles', async () => {
      const profilesResult = await db.select().from(profiles).where(eq(profiles.id, testProfileId))
      const profile = profilesResult[0]
      
      expect(profile).toBeDefined()
      expect(profile.firstName).toBe('Test')
      expect(profile.lastName).toBe('User')
      expect(profile.email).toBe('test@example.com')
    })

    it('should validate profile data with Zod schema', async () => {
      const profilesResult = await db.select().from(profiles).where(eq(profiles.id, testProfileId))
      const profile = profilesResult[0]
      
      const validatedProfile = profileSchema.parse({
        id: profile.id,
        plantId: profile.plantId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        jobTitle: profile.jobTitle,
        status: profile.status,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      })
      
      expect(validatedProfile.id).toBe(testProfileId)
      expect(validatedProfile.email).toBe('test@example.com')
    })

    it('should handle profile creation with validation', () => {
      const validProfileData = {
        id: 'new-profile-id',
        plantId: testPlantId,
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        jobTitle: 'New Role',
        status: 'active' as const,
      }
      
      const validatedProfile = createProfileSchema.parse(validProfileData)
      expect(validatedProfile.firstName).toBe('New')
      expect(validatedProfile.email).toBe('newuser@example.com')
    })
  })

  describe('Course Operations', () => {
    it('should create and retrieve courses', async () => {
      const coursesResult = await db.select().from(courses).where(eq(courses.id, testCourseId))
      const course = coursesResult[0]
      
      expect(course).toBeDefined()
      expect(course.title).toBe('Test Course')
      expect(course.slug).toBe('test-course')
      expect(course.isPublished).toBe(true)
    })

    it('should validate course data with Zod schema', async () => {
      const coursesResult = await db.select().from(courses).where(eq(courses.id, testCourseId))
      const course = coursesResult[0]
      
      const validatedCourse = courseSchema.parse({
        id: course.id,
        slug: course.slug,
        title: course.title,
        version: course.version,
        isPublished: course.isPublished,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
      })
      
      expect(validatedCourse.id).toBe(testCourseId)
      expect(validatedCourse.title).toBe('Test Course')
    })
  })

  describe('Enrollment Operations', () => {
    it('should create and retrieve enrollments', async () => {
      const enrollmentsResult = await db.select().from(enrollments).where(eq(enrollments.id, testEnrollmentId))
      const enrollment = enrollmentsResult[0]
      
      expect(enrollment).toBeDefined()
      expect(enrollment.userId).toBe(testProfileId)
      expect(enrollment.courseId).toBe(testCourseId)
      expect(enrollment.status).toBe('enrolled')
    })

    it('should validate enrollment data with Zod schema', async () => {
      const enrollmentsResult = await db.select().from(enrollments).where(eq(enrollments.id, testEnrollmentId))
      const enrollment = enrollmentsResult[0]
      
      const validatedEnrollment = enrollmentSchema.parse({
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        plantId: enrollment.plantId,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt.toISOString(),
        completedAt: enrollment.completedAt?.toISOString() || null,
        createdAt: enrollment.createdAt.toISOString(),
        updatedAt: enrollment.updatedAt.toISOString(),
      })
      
      expect(validatedEnrollment.id).toBe(testEnrollmentId)
      expect(validatedEnrollment.status).toBe('enrolled')
    })

    it('should handle enrollment creation with validation', () => {
      const validEnrollmentData = {
        userId: testProfileId,
        courseId: testCourseId,
        plantId: testPlantId,
        status: 'enrolled' as const,
      }
      
      const validatedEnrollment = createEnrollmentSchema.parse(validEnrollmentData)
      expect(validatedEnrollment.userId).toBe(testProfileId)
      expect(validatedEnrollment.courseId).toBe(testCourseId)
    })
  })

  describe('Progress Operations', () => {
    it('should create and retrieve progress records', async () => {
      const progressResult = await db.select().from(progress).where(eq(progress.id, testProgressId))
      const progressRecord = progressResult[0]
      
      expect(progressRecord).toBeDefined()
      expect(progressRecord.userId).toBe(testProfileId)
      expect(progressRecord.courseId).toBe(testCourseId)
      expect(progressRecord.progressPercent).toBe(50)
      expect(progressRecord.currentSection).toBe('section-1')
    })

    it('should validate progress data with Zod schema', async () => {
      const progressResult = await db.select().from(progress).where(eq(progress.id, testProgressId))
      const progressRecord = progressResult[0]
      
      const validatedProgress = progressSchema.parse({
        id: progressRecord.id,
        userId: progressRecord.userId,
        courseId: progressRecord.courseId,
        plantId: progressRecord.plantId,
        progressPercent: progressRecord.progressPercent,
        currentSection: progressRecord.currentSection,
        lastActiveAt: progressRecord.lastActiveAt.toISOString(),
        createdAt: progressRecord.createdAt.toISOString(),
        updatedAt: progressRecord.updatedAt.toISOString(),
      })
      
      expect(validatedProgress.id).toBe(testProgressId)
      expect(validatedProgress.progressPercent).toBe(50)
    })

    it('should handle progress creation with validation', () => {
      const validProgressData = {
        userId: testProfileId,
        courseId: testCourseId,
        plantId: testPlantId,
        progressPercent: 75,
        currentSection: 'section-2',
      }
      
      const validatedProgress = createProgressSchema.parse(validProgressData)
      expect(validatedProgress.userId).toBe(testProfileId)
      expect(validatedProgress.progressPercent).toBe(75)
    })
  })

  describe('Complex Queries', () => {
    it('should execute join queries', async () => {
      const profilesWithPlants = await db
        .select({
          profileId: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
          email: profiles.email,
          plantName: plants.name,
        })
        .from(profiles)
        .innerJoin(plants, eq(profiles.plantId, plants.id))
        .where(eq(profiles.id, testProfileId))

      expect(profilesWithPlants.length).toBe(1)
      expect(profilesWithPlants[0].firstName).toBe('Test')
      expect(profilesWithPlants[0].plantName).toBe('Test Plant')
    })

    it('should execute aggregate queries', async () => {
      const enrollmentStats = await db
        .select({
          totalEnrollments: count(),
          averageProgress: avg(progress.progressPercent),
        })
        .from(enrollments)
        .leftJoin(progress, eq(enrollments.userId, progress.userId))
        .where(eq(enrollments.plantId, testPlantId))

      expect(enrollmentStats[0].totalEnrollments).toBeGreaterThan(0)
      expect(enrollmentStats[0].averageProgress).toBeDefined()
    })

    it('should execute conditional queries', async () => {
      const activeEnrollments = await db
        .select()
        .from(enrollments)
        .where(and(
          eq(enrollments.plantId, testPlantId),
          eq(enrollments.status, 'enrolled')
        ))

      expect(activeEnrollments.length).toBeGreaterThan(0)
      activeEnrollments.forEach(enrollment => {
        expect(enrollment.status).toBe('enrolled')
        expect(enrollment.plantId).toBe(testPlantId)
      })
    })
  })

  describe('Data Integrity', () => {
    it('should maintain referential integrity', async () => {
      // Test that foreign key relationships work
      const profileWithPlant = await db.query.profiles.findFirst({
        where: eq(profiles.id, testProfileId),
        with: {
          plant: true,
        },
      })

      expect(profileWithPlant).toBeDefined()
      expect(profileWithPlant?.plant).toBeDefined()
      expect(profileWithPlant?.plant.id).toBe(testPlantId)
    })

    it('should handle cascading operations', async () => {
      // Test that related data is properly linked
      const enrollmentWithRelations = await db.query.enrollments.findFirst({
        where: eq(enrollments.id, testEnrollmentId),
        with: {
          profile: true,
          course: true,
          plant: true,
        },
      })

      expect(enrollmentWithRelations).toBeDefined()
      expect(enrollmentWithRelations?.profile.id).toBe(testProfileId)
      expect(enrollmentWithRelations?.course.id).toBe(testCourseId)
      expect(enrollmentWithRelations?.plant.id).toBe(testPlantId)
    })

    it('should validate data constraints', async () => {
      // Test that database constraints are enforced
      await expect(
        db.insert(profiles).values({
          id: 'invalid-profile',
          plantId: 'non-existent-plant',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          status: 'active',
        })
      ).rejects.toThrow()
    })
  })

  describe('Performance Tests', () => {
    it('should execute queries within reasonable time', async () => {
      const startTime = Date.now()
      
      await db.select().from(profiles)
        .innerJoin(plants, eq(profiles.plantId, plants.id))
        .innerJoin(enrollments, eq(profiles.id, enrollments.userId))
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .leftJoin(progress, eq(enrollments.userId, progress.userId))
      
      const endTime = Date.now()
      const executionTime = endTime - startTime
      
      // Should complete within 1 second
      expect(executionTime).toBeLessThan(1000)
    })

    it('should handle pagination efficiently', async () => {
      const pageSize = 10
      const offset = 0
      
      const startTime = Date.now()
      
      const result = await db.select()
        .from(profiles)
        .limit(pageSize)
        .offset(offset)
      
      const endTime = Date.now()
      const executionTime = endTime - startTime
      
      expect(result.length).toBeLessThanOrEqual(pageSize)
      expect(executionTime).toBeLessThan(500)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid UUIDs gracefully', async () => {
      const result = await db.select()
        .from(profiles)
        .where(eq(profiles.id, 'invalid-uuid'))
      
      expect(result.length).toBe(0)
    })

    it('should handle null values correctly', async () => {
      const profilesWithNullJobTitle = await db.select()
        .from(profiles)
        .where(eq(profiles.jobTitle, null))
      
      // Should not throw error
      expect(Array.isArray(profilesWithNullJobTitle)).toBe(true)
    })

    it('should handle empty result sets', async () => {
      const emptyResult = await db.select()
        .from(profiles)
        .where(eq(profiles.email, 'nonexistent@example.com'))
      
      expect(emptyResult.length).toBe(0)
    })
  })
})
