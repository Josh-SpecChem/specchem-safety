import { z } from 'zod';

/**
 * Consolidated Zod validation schemas for SpecChem Safety Training system
 * Generated from actual database schema to ensure 100% type safety
 * 
 * This file replaces all duplicate schema definitions and serves as the
 * single source of truth for validation across the application.
 */

// ========================================
// ENUM SCHEMAS (matching database enums exactly)
// ========================================

export const adminRoleSchema = z.enum(['hr_admin', 'dev_admin', 'plant_manager']);
export const enrollmentStatusSchema = z.enum(['enrolled', 'in_progress', 'completed']);
export const eventTypeSchema = z.enum(['view_section', 'start_course', 'complete_course']);
export const userStatusSchema = z.enum(['active', 'suspended']);

// ========================================
// BASE TABLE SCHEMAS (matching database exactly)
// ========================================

// Plants Table Schema
export const plantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Plant name is required'),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createPlantSchema = z.object({
  name: z.string().min(1, 'Plant name is required'),
  isActive: z.boolean().default(true).optional(),
});

export const updatePlantSchema = z.object({
  name: z.string().min(1, 'Plant name is required').optional(),
  isActive: z.boolean().optional(),
});

// Courses Table Schema
export const courseSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1, 'Course slug is required'),
  title: z.string().min(1, 'Course title is required'),
  version: z.string().default('1.0'),
  isPublished: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createCourseSchema = z.object({
  slug: z.string().min(1, 'Course slug is required'),
  title: z.string().min(1, 'Course title is required'),
  version: z.string().default('1.0').optional(),
  isPublished: z.boolean().default(false).optional(),
});

export const updateCourseSchema = z.object({
  slug: z.string().min(1, 'Course slug is required').optional(),
  title: z.string().min(1, 'Course title is required').optional(),
  version: z.string().optional(),
  isPublished: z.boolean().optional(),
});

// Profiles Table Schema
export const profileSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  jobTitle: z.string().nullable(),
  status: userStatusSchema.default('active'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProfileSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  jobTitle: z.string().optional(),
  status: userStatusSchema.default('active').optional(),
});

export const updateProfileSchema = z.object({
  plantId: z.string().uuid().optional(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  jobTitle: z.string().optional(),
  status: userStatusSchema.optional(),
});

// Admin Roles Table Schema
export const adminRoleRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  role: adminRoleSchema,
  plantId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createAdminRoleSchema = z.object({
  userId: z.string().uuid(),
  role: adminRoleSchema,
  plantId: z.string().uuid().optional(),
});

export const updateAdminRoleSchema = z.object({
  userId: z.string().uuid().optional(),
  role: adminRoleSchema.optional(),
  plantId: z.string().uuid().optional(),
});

// Enrollments Table Schema
export const enrollmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  status: enrollmentStatusSchema.default('enrolled'),
  enrolledAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createEnrollmentSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  status: enrollmentStatusSchema.default('enrolled').optional(),
});

export const updateEnrollmentSchema = z.object({
  status: enrollmentStatusSchema.optional(),
  completedAt: z.string().datetime().nullable().optional(),
});

// Progress Table Schema
export const progressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  progressPercent: z.number().int().min(0).max(100).default(0),
  currentSection: z.string().nullable(),
  lastActiveAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProgressSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  progressPercent: z.number().int().min(0).max(100).default(0).optional(),
  currentSection: z.string().optional(),
});

export const updateProgressSchema = z.object({
  progressPercent: z.number().int().min(0).max(100).optional(),
  currentSection: z.string().optional(),
});

// Activity Events Table Schema
export const activityEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  eventType: eventTypeSchema,
  meta: z.record(z.string(), z.any()).nullable(), // JSONB field
  occurredAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const createActivityEventSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  eventType: eventTypeSchema,
  meta: z.record(z.string(), z.any()).optional(),
});

// Question Events Table Schema
export const questionEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  sectionKey: z.string().min(1, 'Section key is required'),
  questionKey: z.string().min(1, 'Question key is required'),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().min(1).default(1),
  responseMeta: z.record(z.string(), z.any()).nullable(), // JSONB field
  answeredAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const createQuestionEventSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  sectionKey: z.string().min(1, 'Section key is required'),
  questionKey: z.string().min(1, 'Question key is required'),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().min(1).default(1).optional(),
  responseMeta: z.record(z.string(), z.any()).optional(),
});

// ========================================
// COMPOSITE SCHEMAS WITH RELATIONS
// ========================================

export const profileWithPlantSchema = profileSchema.extend({
  plant: plantSchema,
});

export const enrollmentWithRelationsSchema = enrollmentSchema.extend({
  profile: profileSchema,
  course: courseSchema,
  plant: plantSchema,
});

export const progressWithRelationsSchema = progressSchema.extend({
  profile: profileSchema,
  course: courseSchema,
  plant: plantSchema,
});

export const activityEventWithRelationsSchema = activityEventSchema.extend({
  profile: profileSchema,
  course: courseSchema,
  plant: plantSchema,
});

export const questionEventWithRelationsSchema = questionEventSchema.extend({
  profile: profileSchema,
  course: courseSchema,
  plant: plantSchema,
});

// ========================================
// API RESPONSE SCHEMAS
// ========================================

export const apiResponseSchema = <T>(dataSchema: z.ZodType<T>) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const paginatedResponseSchema = <T>(itemSchema: z.ZodType<T>) => z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(itemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(0),
  }),
  error: z.string().optional(),
  message: z.string().optional(),
});

// ========================================
// QUERY PARAMETER SCHEMAS
// ========================================

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const plantFilterSchema = z.object({
  isActive: z.coerce.boolean().optional(),
}).merge(paginationSchema);

export const courseFilterSchema = z.object({
  isPublished: z.coerce.boolean().optional(),
  search: z.string().optional(),
}).merge(paginationSchema);

export const enrollmentFiltersSchema = z.object({
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: enrollmentStatusSchema.optional(),
}).merge(paginationSchema);

export const progressFiltersSchema = z.object({
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  minProgress: z.coerce.number().min(0).max(100).optional(),
  maxProgress: z.coerce.number().min(0).max(100).optional(),
}).merge(paginationSchema);

export const userFiltersSchema = z.object({
  plantId: z.string().uuid().optional(),
  status: userStatusSchema.optional(),
  role: adminRoleSchema.optional(),
  search: z.string().optional(), // for name/email search
}).merge(paginationSchema);

// ========================================
// FORM VALIDATION SCHEMAS
// ========================================

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

// ========================================
// ANALYTICS SCHEMAS
// ========================================

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

// ========================================
// TRAINING MODULE SCHEMAS (for existing system integration)
// ========================================

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

// ========================================
// SCHEMA ALIASES (for backward compatibility)
// ========================================

// Aliases for existing code compatibility
export const courseProgressSchema = progressSchema;
export const userProfileSchema = profileSchema;
export const updateUserProfileSchema = updateProfileSchema;

// Additional type aliases for backward compatibility
export type UserProfile = Profile;
export type CourseProgress = Progress;
export type UpdateUserProfile = UpdateProfile;

// Profile with admin roles (for components that need role information)
export type ProfileWithRoles = Profile & {
  adminRoles: AdminRoleRecord[];
  role?: AdminRole; // Computed primary role for backward compatibility
};

// ========================================
// HOOK-SPECIFIC SCHEMAS (for standardized hooks)
// ========================================

// User with detailed information including plant, roles, and enrollments
export const userWithDetailsSchema = profileSchema.extend({
  plant: plantSchema,
  adminRoles: z.array(adminRoleRecordSchema),
  enrollments: z.array(enrollmentSchema.extend({
    course: courseSchema,
  })),
});

// Course with statistics
export const courseWithStatsSchema = courseSchema.extend({
  totalEnrollments: z.number().int().min(0),
  completedEnrollments: z.number().int().min(0),
  avgProgress: z.number().min(0).max(100),
  completionRate: z.number().min(0).max(100),
});

// Enrollment with detailed user and course information
export const enrollmentWithDetailsSchema = enrollmentSchema.extend({
  profile: profileSchema.extend({
    plant: plantSchema,
  }),
  course: courseSchema,
});

// Analytics data schemas
export const analyticsDataSchema = z.object({
  plantStats: z.object({
    plantId: z.string().uuid(),
    plantName: z.string(),
    totalUsers: z.number().int().min(0),
    activeEnrollments: z.number().int().min(0),
    completionRate: z.number().min(0).max(100),
    averageProgress: z.number().min(0).max(100),
    overdueCount: z.number().int().min(0),
  }).optional(),
  courseStats: z.object({
    courseId: z.string().uuid(),
    courseName: z.string(),
    totalEnrollments: z.number().int().min(0),
    completions: z.number().int().min(0),
    averageScore: z.number().min(0).max(100),
    averageTimeSpent: z.number().min(0),
  }).optional(),
});

// Dashboard statistics
export const dashboardStatsSchema = z.object({
  totalUsers: z.number().int().min(0),
  activeEnrollments: z.number().int().min(0),
  completionRate: z.number().min(0).max(100),
  overdueTraining: z.number().int().min(0),
  totalPlants: z.number().int().min(0),
  activePlants: z.number().int().min(0),
});

// Enrollment statistics
export const enrollmentStatsSchema = z.object({
  total: z.number().int().min(0),
  completed: z.number().int().min(0),
  inProgress: z.number().int().min(0),
  overdue: z.number().int().min(0),
});

// Course statistics (for backward compatibility)
export const courseStatisticsSchema = z.object({
  totalCourses: z.number().int().min(0),
  activeCourses: z.number().int().min(0),
  totalEnrollments: z.number().int().min(0),
  avgCompletionRate: z.number().min(0).max(100),
});

// ========================================
// TYPE EXPORTS FOR HOOKS
// ========================================

// Hook-specific types
export type UserWithDetails = z.infer<typeof userWithDetailsSchema>;
export type CourseWithStats = z.infer<typeof courseWithStatsSchema>;
export type EnrollmentWithDetails = z.infer<typeof enrollmentWithDetailsSchema>;
export type AnalyticsData = z.infer<typeof analyticsDataSchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
export type EnrollmentStats = z.infer<typeof enrollmentStatsSchema>;
export type CourseStatistics = z.infer<typeof courseStatisticsSchema>;

// ========================================
// TYPE EXPORTS
// ========================================

// Enum types
export type AdminRole = z.infer<typeof adminRoleSchema>;
export type EnrollmentStatus = z.infer<typeof enrollmentStatusSchema>;
export type EventType = z.infer<typeof eventTypeSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;

// Base entity types
export type Plant = z.infer<typeof plantSchema>;
export type CreatePlant = z.infer<typeof createPlantSchema>;
export type UpdatePlant = z.infer<typeof updatePlantSchema>;

export type Course = z.infer<typeof courseSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;

export type Profile = z.infer<typeof profileSchema>;
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type AdminRoleRecord = z.infer<typeof adminRoleRecordSchema>;
export type CreateAdminRole = z.infer<typeof createAdminRoleSchema>;
export type UpdateAdminRole = z.infer<typeof updateAdminRoleSchema>;

export type Enrollment = z.infer<typeof enrollmentSchema>;
export type CreateEnrollment = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollment = z.infer<typeof updateEnrollmentSchema>;

export type Progress = z.infer<typeof progressSchema>;
export type CreateProgress = z.infer<typeof createProgressSchema>;
export type UpdateProgress = z.infer<typeof updateProgressSchema>;

export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type CreateActivityEvent = z.infer<typeof createActivityEventSchema>;

export type QuestionEvent = z.infer<typeof questionEventSchema>;
export type CreateQuestionEvent = z.infer<typeof createQuestionEventSchema>;

// Composite types
export type ProfileWithPlant = z.infer<typeof profileWithPlantSchema>;
export type EnrollmentWithRelations = z.infer<typeof enrollmentWithRelationsSchema>;
export type ProgressWithRelations = z.infer<typeof progressWithRelationsSchema>;
export type ActivityEventWithRelations = z.infer<typeof activityEventWithRelationsSchema>;
export type QuestionEventWithRelations = z.infer<typeof questionEventWithRelationsSchema>;

// Utility types
export type PaginationParams = z.infer<typeof paginationSchema>;
export type PlantFilter = z.infer<typeof plantFilterSchema>;
export type CourseFilter = z.infer<typeof courseFilterSchema>;
export type EnrollmentFilters = z.infer<typeof enrollmentFiltersSchema>;
export type ProgressFilters = z.infer<typeof progressFiltersSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;

// Form types
export type LoginForm = z.infer<typeof loginFormSchema>;
export type ProfileUpdateForm = z.infer<typeof profileUpdateFormSchema>;
export type AdminCreateUserForm = z.infer<typeof adminCreateUserFormSchema>;

// Analytics types
export type AnalyticsOverview = z.infer<typeof analyticsOverviewSchema>;
export type CoursePerformance = z.infer<typeof coursePerformanceSchema>;
export type PlantPerformance = z.infer<typeof plantPerformanceSchema>;

// Training module types
export type TrainingModule = z.infer<typeof trainingModuleSchema>;
export type UserModuleProgress = z.infer<typeof userModuleProgressSchema>;

// API response types
export type ApiResponse<T> = z.infer<ReturnType<typeof apiResponseSchema<T>>>;
export type PaginatedResponse<T> = z.infer<ReturnType<typeof paginatedResponseSchema<T>>>;

// ========================================
// VALIDATION HELPERS
// ========================================

export const validateUUID = (value: string): boolean => {
  return z.string().uuid().safeParse(value).success;
};

export const validateEmail = (value: string): boolean => {
  return z.string().email().safeParse(value).success;
};

export const validateDateString = (value: string): boolean => {
  return z.string().datetime().safeParse(value).success;
};

export const validateProgressPercent = (value: number): boolean => {
  return z.number().int().min(0).max(100).safeParse(value).success;
};

export const validateEnrollmentStatus = (value: string): boolean => {
  return enrollmentStatusSchema.safeParse(value).success;
};

export const validateUserStatus = (value: string): boolean => {
  return userStatusSchema.safeParse(value).success;
};

export const validateAdminRole = (value: string): boolean => {
  return adminRoleSchema.safeParse(value).success;
};

export const validateEventType = (value: string): boolean => {
  return eventTypeSchema.safeParse(value).success;
};
