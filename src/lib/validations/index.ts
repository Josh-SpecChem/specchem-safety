import { z } from 'zod';

// Plant validation
export const plantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Plant name is required').max(100),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPlantSchema = plantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePlantSchema = createPlantSchema.partial();

// Profile validation
export const profileSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email format'),
  jobTitle: z.string().max(100).optional(),
  status: z.enum(['active', 'suspended']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProfileSchema = profileSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const updateProfileSchema = createProfileSchema.partial().omit({ id: true });

// Admin role validation
export const adminRoleSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(['hr_admin', 'dev_admin', 'plant_manager']),
  plantId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createAdminRoleSchema = adminRoleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Course validation
export const courseSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1, 'Course slug is required').max(100),
  title: z.string().min(1, 'Course title is required').max(200),
  version: z.string().min(1, 'Version is required'),
  isPublished: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCourseSchema = courseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCourseSchema = createCourseSchema.partial();

// Enrollment validation
export const enrollmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  status: z.enum(['enrolled', 'in_progress', 'completed']),
  enrolledAt: z.date(),
  completedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createEnrollmentSchema = enrollmentSchema.omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updateEnrollmentSchema = z.object({
  status: z.enum(['enrolled', 'in_progress', 'completed']),
  completedAt: z.date().optional(),
});

// Progress validation
export const progressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  progressPercent: z.number().min(0).max(100),
  currentSection: z.string().optional(),
  lastActiveAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProgressSchema = progressSchema.omit({
  id: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProgressSchema = z.object({
  progressPercent: z.number().min(0).max(100),
  currentSection: z.string().optional(),
  lastActiveAt: z.date(),
});

// Question event validation
export const questionEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  sectionKey: z.string().min(1, 'Section key is required'),
  questionKey: z.string().min(1, 'Question key is required'),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().min(1),
  responseMeta: z.record(z.string(), z.any()).optional(),
  answeredAt: z.date(),
  createdAt: z.date(),
});

export const createQuestionEventSchema = questionEventSchema.omit({
  id: true,
  answeredAt: true,
  createdAt: true,
});

// Activity event validation
export const activityEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  eventType: z.enum(['view_section', 'start_course', 'complete_course']),
  meta: z.record(z.string(), z.any()).optional(),
  occurredAt: z.date(),
  createdAt: z.date(),
});

export const createActivityEventSchema = activityEventSchema.omit({
  id: true,
  occurredAt: true,
  createdAt: true,
});

// Query parameter validation
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const plantFilterSchema = z.object({
  plantId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export const courseFilterSchema = z.object({
  isPublished: z.boolean().optional(),
  search: z.string().optional(),
});

export const enrollmentFilterSchema = z.object({
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  status: z.enum(['enrolled', 'in_progress', 'completed']).optional(),
  userId: z.string().uuid().optional(),
});

export const progressFilterSchema = z.object({
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  minProgress: z.number().min(0).max(100).optional(),
});

// Combined schemas for complex operations
export const userWithProgressSchema = z.object({
  user: profileSchema,
  enrollments: z.array(enrollmentSchema),
  progress: z.array(progressSchema),
});

export const courseWithStatsSchema = z.object({
  course: courseSchema,
  totalEnrollments: z.number(),
  completionRate: z.number(),
  averageProgress: z.number(),
});

// Type exports for use in components and API routes
export type Plant = z.infer<typeof plantSchema>;
export type CreatePlant = z.infer<typeof createPlantSchema>;
export type UpdatePlant = z.infer<typeof updatePlantSchema>;

export type Profile = z.infer<typeof profileSchema>;
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type AdminRole = z.infer<typeof adminRoleSchema>;
export type CreateAdminRole = z.infer<typeof createAdminRoleSchema>;

export type Course = z.infer<typeof courseSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;

export type Enrollment = z.infer<typeof enrollmentSchema>;
export type CreateEnrollment = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollment = z.infer<typeof updateEnrollmentSchema>;

export type Progress = z.infer<typeof progressSchema>;
export type CreateProgress = z.infer<typeof createProgressSchema>;
export type UpdateProgress = z.infer<typeof updateProgressSchema>;

export type QuestionEvent = z.infer<typeof questionEventSchema>;
export type CreateQuestionEvent = z.infer<typeof createQuestionEventSchema>;

export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type CreateActivityEvent = z.infer<typeof createActivityEventSchema>;

export type PaginationParams = z.infer<typeof paginationSchema>;
export type PlantFilter = z.infer<typeof plantFilterSchema>;
export type CourseFilter = z.infer<typeof courseFilterSchema>;
export type EnrollmentFilter = z.infer<typeof enrollmentFilterSchema>;
export type ProgressFilter = z.infer<typeof progressFilterSchema>;

export type UserWithProgress = z.infer<typeof userWithProgressSchema>;
export type CourseWithStats = z.infer<typeof courseWithStatsSchema>;