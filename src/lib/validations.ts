import { z } from 'zod';

/**
 * Zod validation schemas for SpecChem Safety Training system
 * These schemas validate API requests/responses and form data
 */

// User Profile Schemas
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  jobTitle: z.string().optional(),
  role: z.enum(['employee', 'plant_manager', 'hr_admin', 'dev_admin']),
  isActive: z.boolean(),
  plantId: z.string().uuid(),
  lastLoginAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  jobTitle: z.string().optional(),
});

// Course Progress Schemas
export const courseProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  progressPercent: z.number().min(0).max(100),
  currentSection: z.string().nullable(),
  lastActiveAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const updateProgressSchema = z.object({
  progressPercent: z.number().min(0).max(100),
  currentSection: z.string().optional(),
  eventType: z.enum(['view_section', 'start_course', 'complete_course']).optional(),
});

// Question Event Schemas
export const questionEventSchema = z.object({
  sectionKey: z.string().min(1, 'Section key is required'),
  questionKey: z.string().min(1, 'Question key is required'),
  isCorrect: z.boolean(),
  attemptIndex: z.number().min(1).default(1),
  responseMeta: z.record(z.string(), z.any()).optional(),
});

// Course Schemas
export const courseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Course name is required'),
  slug: z.string().min(1, 'Course slug is required'),
  configurationId: z.string().optional(),
  language: z.enum(['en', 'es']).default('en'),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Plant Schemas
export const plantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Plant name is required'),
  location: z.string().min(1, 'Plant location is required'),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Enrollment Schemas
export const enrollmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  status: z.enum(['active', 'completed', 'suspended']),
  enrolledAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createEnrollmentSchema = z.object({
  userId: z.string().uuid('Valid user ID is required'),
  courseId: z.string().uuid('Valid course ID is required'),
});

export const updateEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid('Valid enrollment ID is required'),
  status: z.enum(['active', 'completed', 'suspended']),
  completedAt: z.string().datetime().optional(),
});

// Profile Creation Schema (for database operations)
export const createProfileSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  jobTitle: z.string().optional(),
  status: z.enum(['active', 'suspended']).default('active'),
});

export const updateProfileSchema = z.object({
  plantId: z.string().uuid().optional(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email().optional(),
  jobTitle: z.string().optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

// Admin User Management Schemas
export const createUserSchema = z.object({
  email: z.string().email('Valid email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  jobTitle: z.string().optional(),
  role: z.enum(['employee', 'plant_manager', 'hr_admin', 'dev_admin']).default('employee'),
  plantId: z.string().uuid('Valid plant ID is required'),
});

export const updateUserSchema = z.object({
  userId: z.string().uuid('Valid user ID is required'),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  jobTitle: z.string().optional(),
  role: z.enum(['employee', 'plant_manager', 'hr_admin', 'dev_admin']).optional(),
  isActive: z.boolean().optional(),
  plantId: z.string().uuid().optional(),
});

// Analytics Schemas
export const analyticsOverviewSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  totalEnrollments: z.number(),
  completedCourses: z.number(),
  overallCompletionRate: z.number(),
});

export const coursePerformanceSchema = z.object({
  courseId: z.string().uuid(),
  courseName: z.string(),
  totalEnrollments: z.number(),
  completedEnrollments: z.number(),
  completionRate: z.number(),
  averageScore: z.number(),
  averageTimeToComplete: z.number(),
});

export const plantPerformanceSchema = z.object({
  plantId: z.string().uuid(),
  plantName: z.string(),
  totalUsers: z.number(),
  activeEnrollments: z.number(),
  completedCourses: z.number(),
  completionRate: z.number(),
});

// API Response Schemas
export const apiResponseSchema = <T>(dataSchema: z.ZodType<T>) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
});

// Query Parameter Schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const enrollmentFiltersSchema = z.object({
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: z.enum(['enrolled', 'in_progress', 'completed']).optional(),
}).merge(paginationSchema);

export const progressFiltersSchema = z.object({
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  minProgress: z.coerce.number().min(0).max(100).optional(),
}).merge(paginationSchema);

export const userFiltersSchema = z.object({
  plantId: z.string().uuid().optional(),
  role: z.enum(['employee', 'plant_manager', 'hr_admin', 'dev_admin']).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(), // for name/email search
}).merge(paginationSchema);

// Form Validation Schemas for Frontend
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const profileUpdateFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  jobTitle: z.string().max(100, 'Job title is too long').optional(),
});

export const adminCreateUserFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  jobTitle: z.string().max(100, 'Job title is too long').optional(),
  role: z.enum(['employee', 'plant_manager', 'hr_admin'], {
    message: 'Please select a valid role'
  }),
  plantId: z.string().uuid('Please select a plant'),
});

// Module/Training Content Schemas (for existing training system integration)
export const trainingModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    estimatedReadTime: z.string(),
  })),
  learningObjectives: z.array(z.string()),
  resources: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    url: z.string(),
    description: z.string(),
  })),
});

export const userModuleProgressSchema = z.object({
  moduleId: z.string(),
  completedSections: z.array(z.string()),
  bookmarks: z.array(z.string()),
  notes: z.array(z.object({
    id: z.string(),
    sectionId: z.string(),
    content: z.string(),
    createdAt: z.string().datetime(),
  })),
  assessmentAttempts: z.array(z.object({
    id: z.string(),
    score: z.number(),
    completedAt: z.string().datetime(),
  })),
  completionPercentage: z.number().min(0).max(100),
  lastAccessed: z.string().datetime(),
  timeSpent: z.number(),
});

// Type exports for TypeScript
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type CourseProgress = z.infer<typeof courseProgressSchema>;
export type UpdateProgress = z.infer<typeof updateProgressSchema>;
export type QuestionEvent = z.infer<typeof questionEventSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Plant = z.infer<typeof plantSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type CreateEnrollment = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollment = z.infer<typeof updateEnrollmentSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type AnalyticsOverview = z.infer<typeof analyticsOverviewSchema>;
export type CoursePerformance = z.infer<typeof coursePerformanceSchema>;
export type PlantPerformance = z.infer<typeof plantPerformanceSchema>;
export type EnrollmentFilters = z.infer<typeof enrollmentFiltersSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;
export type LoginForm = z.infer<typeof loginFormSchema>;
export type ProfileUpdateForm = z.infer<typeof profileUpdateFormSchema>;
export type AdminCreateUserForm = z.infer<typeof adminCreateUserFormSchema>;
export type TrainingModule = z.infer<typeof trainingModuleSchema>;
export type UserModuleProgress = z.infer<typeof userModuleProgressSchema>;
export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<T>>>;

// Additional types for database operations
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type EnrollmentFilter = z.infer<typeof enrollmentFiltersSchema>;
export type ProgressFilter = z.infer<typeof progressFiltersSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type Pagination = z.infer<typeof paginationSchema>;