/**
 * Zod Validation Contracts - Runtime Type Safety
 * 
 * These schemas provide runtime validation and DTO definitions.
 * MUST stay synchronized with schema.app.ts (database schema).
 * 
 * Contract Update Rule: Always update database schema first, then these contracts.
 */

import { z } from 'zod';

// ========================================
// BASE VALIDATION SCHEMAS
// ========================================

export const UuidSchema = z.string().uuid('Invalid UUID format');
export const EmailSchema = z.string().email('Invalid email format');
export const TimestampSchema = z.string().min(1, 'Timestamp required');
export const OptionalTimestampSchema = z.string().nullable();

// ========================================
// ENUM SCHEMAS (matching database exactly)
// ========================================

export const AdminRoleSchema = z.enum(['hr_admin', 'dev_admin', 'plant_manager'], {
  message: 'Invalid admin role'
});

export const EnrollmentStatusSchema = z.enum(['enrolled', 'in_progress', 'completed'], {
  message: 'Invalid enrollment status'
});

export const EventTypeSchema = z.enum(['view_section', 'start_course', 'complete_course'], {
  message: 'Invalid event type'
});

export const UserStatusSchema = z.enum(['active', 'suspended'], {
  message: 'Invalid user status'
});

export const ContentBlockTypeSchema = z.enum([
  'hero', 'text', 'card', 'image', 'table', 'list', 'grid', 
  'callout', 'quote', 'divider', 'video', 'audio'
], {
  message: 'Invalid content block type'
});

export const QuestionTypeSchema = z.enum(['true-false', 'multiple-choice'], {
  message: 'Invalid question type'
});

export const ContentTypeSchema = z.enum(['section', 'content_block', 'quiz_question'], {
  message: 'Invalid content type'
});

export const LanguageCodeSchema = z.enum(['en', 'es', 'fr', 'de'], {
  message: 'Invalid language code'
});

export const InteractionTypeSchema = z.enum([
  'view', 'click', 'expand', 'collapse', 'download', 'share'
], {
  message: 'Invalid interaction type'
});

// ========================================
// CORE ENTITY SCHEMAS
// ========================================

/**
 * Plant Schema - Tenant boundary
 */
export const PlantSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1, 'Plant name is required').max(100, 'Plant name too long'),
  isActive: z.boolean(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreatePlantSchema = z.object({
  name: z.string().min(1, 'Plant name is required').max(100, 'Plant name too long'),
  isActive: z.boolean().default(true).optional(),
});

export const UpdatePlantSchema = z.object({
  name: z.string().min(1, 'Plant name is required').max(100, 'Plant name too long').optional(),
  isActive: z.boolean().optional(),
});

/**
 * Course Schema - Training content
 */
export const CourseSchema = z.object({
  id: UuidSchema,
  slug: z.string().min(1, 'Course slug is required').max(100, 'Course slug too long'),
  title: z.string().min(1, 'Course title is required').max(200, 'Course title too long'),
  version: z.string().min(1, 'Version is required').max(20, 'Version too long'),
  isPublished: z.boolean(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateCourseSchema = z.object({
  slug: z.string().min(1, 'Course slug is required').max(100, 'Course slug too long'),
  title: z.string().min(1, 'Course title is required').max(200, 'Course title too long'),
  version: z.string().min(1, 'Version is required').max(20, 'Version too long').default('1.0').optional(),
  isPublished: z.boolean().default(false).optional(),
});

export const UpdateCourseSchema = z.object({
  slug: z.string().min(1, 'Course slug is required').max(100, 'Course slug too long').optional(),
  title: z.string().min(1, 'Course title is required').max(200, 'Course title too long').optional(),
  version: z.string().min(1, 'Version is required').max(20, 'Version too long').optional(),
  isPublished: z.boolean().optional(),
  defaultLanguage: LanguageCodeSchema.optional(),
  availableLanguages: z.array(LanguageCodeSchema).optional(),
  contentVersion: z.string().optional(),
});

/**
 * Profile Schema - User accounts
 */
export const ProfileSchema = z.object({
  id: UuidSchema,
  plantId: UuidSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: EmailSchema,
  jobTitle: z.string().max(100, 'Job title too long').nullable(),
  status: UserStatusSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateProfileSchema = z.object({
  id: UuidSchema,
  plantId: UuidSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: EmailSchema,
  jobTitle: z.string().max(100, 'Job title too long').optional(),
  status: UserStatusSchema.default('active').optional(),
});

export const UpdateProfileSchema = z.object({
  plantId: UuidSchema.optional(),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  email: EmailSchema.optional(),
  jobTitle: z.string().max(100, 'Job title too long').optional(),
  status: UserStatusSchema.optional(),
});

/**
 * Admin Role Schema - RBAC
 */
export const AdminRoleRecordSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  role: AdminRoleSchema,
  plantId: UuidSchema.nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateAdminRoleSchema = z.object({
  userId: UuidSchema,
  role: AdminRoleSchema,
  plantId: UuidSchema.optional(),
});

export const UpdateAdminRoleSchema = z.object({
  userId: UuidSchema.optional(),
  role: AdminRoleSchema.optional(),
  plantId: UuidSchema.optional(),
});

// ========================================
// TRAINING MANAGEMENT SCHEMAS
// ========================================

/**
 * Enrollment Schema - User course registrations
 */
export const EnrollmentSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  status: EnrollmentStatusSchema,
  enrolledAt: TimestampSchema,
  completedAt: OptionalTimestampSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateEnrollmentSchema = z.object({
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  status: EnrollmentStatusSchema.default('enrolled').optional(),
});

export const UpdateEnrollmentSchema = z.object({
  status: EnrollmentStatusSchema.optional(),
  completedAt: OptionalTimestampSchema.optional(),
});

/**
 * Progress Schema - Course completion tracking
 */
export const ProgressSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  progressPercent: z.number().int().min(0).max(100),
  currentSection: z.string().nullable(),
  lastActiveAt: TimestampSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateProgressSchema = z.object({
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  progressPercent: z.number().int().min(0).max(100).default(0).optional(),
  currentSection: z.string().optional(),
});

export const UpdateProgressSchema = z.object({
  progressPercent: z.number().int().min(0).max(100).optional(),
  currentSection: z.string().optional(),
});

// ========================================
// ANALYTICS & TRACKING SCHEMAS
// ========================================

/**
 * Activity Event Schema - User interaction tracking
 */
export const ActivityEventSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  eventType: EventTypeSchema,
  meta: z.record(z.string(), z.any()).nullable(),
  occurredAt: TimestampSchema,
  createdAt: TimestampSchema,
});

export const CreateActivityEventSchema = z.object({
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  eventType: EventTypeSchema,
  meta: z.record(z.string(), z.any()).optional(),
});

/**
 * Question Event Schema - Assessment tracking
 */
export const QuestionEventSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  sectionKey: z.string().min(1, 'Section key is required'),
  questionKey: z.string().min(1, 'Question key is required'),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().min(1),
  responseMeta: z.record(z.string(), z.any()).nullable(),
  answeredAt: TimestampSchema,
  createdAt: TimestampSchema,
});

export const CreateQuestionEventSchema = z.object({
  userId: UuidSchema,
  courseId: UuidSchema,
  plantId: UuidSchema,
  sectionKey: z.string().min(1, 'Section key is required'),
  questionKey: z.string().min(1, 'Question key is required'),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().min(1).default(1).optional(),
  responseMeta: z.record(z.string(), z.any()).optional(),
});

// ========================================
// EBOOK CONTENT SCHEMAS
// ========================================

/**
 * Course Section Schema - Sections within a course
 */
export const CourseSectionSchema = z.object({
  id: UuidSchema,
  courseId: UuidSchema,
  sectionKey: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  orderIndex: z.number().int().min(0),
  iconName: z.string().max(50).nullable(),
  isPublished: z.boolean(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateCourseSectionSchema = z.object({
  courseId: UuidSchema,
  sectionKey: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  orderIndex: z.number().int().min(0),
  iconName: z.string().max(50).nullable().optional(),
  isPublished: z.boolean().default(false).optional(),
});

export const UpdateCourseSectionSchema = z.object({
  sectionKey: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(200).optional(),
  orderIndex: z.number().int().min(0).optional(),
  iconName: z.string().max(50).nullable().optional(),
  isPublished: z.boolean().optional(),
});

/**
 * Content Block Schema - Structured content within sections
 */
export const ContentBlockSchema = z.object({
  id: UuidSchema,
  sectionId: UuidSchema,
  blockType: ContentBlockTypeSchema,
  orderIndex: z.number().int().min(0),
  content: z.record(z.string(), z.any()),
  metadata: z.record(z.string(), z.any()).nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateContentBlockSchema = z.object({
  sectionId: UuidSchema,
  blockType: ContentBlockTypeSchema,
  orderIndex: z.number().int().min(0),
  content: z.record(z.string(), z.any()),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
});

export const UpdateContentBlockSchema = z.object({
  blockType: ContentBlockTypeSchema.optional(),
  orderIndex: z.number().int().min(0).optional(),
  content: z.record(z.string(), z.any()).optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
});

/**
 * Quiz Question Schema - Questions within sections
 */
export const QuizQuestionSchema = z.object({
  id: UuidSchema,
  sectionId: UuidSchema,
  questionKey: z.string().min(1).max(100),
  questionType: QuestionTypeSchema,
  questionText: z.string().min(1),
  options: z.array(z.string()).nullable(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().min(1),
  orderIndex: z.number().int().min(1).default(1),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateQuizQuestionSchema = z.object({
  sectionId: UuidSchema,
  questionKey: z.string().min(1).max(100),
  questionType: QuestionTypeSchema,
  questionText: z.string().min(1),
  options: z.array(z.string()).nullable().optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().min(1),
  orderIndex: z.number().int().min(1).default(1).optional(),
});

export const UpdateQuizQuestionSchema = z.object({
  questionKey: z.string().min(1).max(100).optional(),
  questionType: QuestionTypeSchema.optional(),
  questionText: z.string().min(1).optional(),
  options: z.array(z.string()).nullable().optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  explanation: z.string().min(1).optional(),
  orderIndex: z.number().int().min(1).optional(),
});

/**
 * Content Translation Schema - Multilingual content support
 */
export const ContentTranslationSchema = z.object({
  id: UuidSchema,
  contentType: ContentTypeSchema,
  contentId: UuidSchema,
  languageCode: LanguageCodeSchema,
  translatedContent: z.record(z.string(), z.any()),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateContentTranslationSchema = z.object({
  contentType: ContentTypeSchema,
  contentId: UuidSchema,
  languageCode: LanguageCodeSchema,
  translatedContent: z.record(z.string(), z.any()),
});

export const UpdateContentTranslationSchema = z.object({
  translatedContent: z.record(z.string(), z.any()).optional(),
});

/**
 * Course Language Schema - Available languages per course
 */
export const CourseLanguageSchema = z.object({
  id: UuidSchema,
  courseId: UuidSchema,
  languageCode: LanguageCodeSchema,
  isPrimary: z.boolean(),
  isPublished: z.boolean(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateCourseLanguageSchema = z.object({
  courseId: UuidSchema,
  languageCode: LanguageCodeSchema,
  isPrimary: z.boolean().default(false).optional(),
  isPublished: z.boolean().default(false).optional(),
});

export const UpdateCourseLanguageSchema = z.object({
  isPrimary: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

/**
 * Section Progress Schema - Granular progress tracking
 */
export const SectionProgressSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  sectionId: UuidSchema,
  plantId: UuidSchema,
  isCompleted: z.boolean(),
  timeSpentSeconds: z.number().int().min(0),
  lastViewedAt: TimestampSchema,
  completedAt: OptionalTimestampSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const CreateSectionProgressSchema = z.object({
  userId: UuidSchema,
  sectionId: UuidSchema,
  plantId: UuidSchema,
  isCompleted: z.boolean().default(false).optional(),
  timeSpentSeconds: z.number().int().min(0).default(0).optional(),
});

export const UpdateSectionProgressSchema = z.object({
  isCompleted: z.boolean().optional(),
  timeSpentSeconds: z.number().int().min(0).optional(),
  lastViewedAt: TimestampSchema.optional(),
  completedAt: OptionalTimestampSchema.optional(),
});

/**
 * Content Interaction Schema - User interaction analytics
 */
export const ContentInteractionSchema = z.object({
  id: UuidSchema,
  userId: UuidSchema,
  contentBlockId: UuidSchema,
  plantId: UuidSchema,
  interactionType: InteractionTypeSchema,
  interactionData: z.record(z.string(), z.any()).nullable(),
  occurredAt: TimestampSchema,
  createdAt: TimestampSchema,
});

export const CreateContentInteractionSchema = z.object({
  userId: UuidSchema,
  contentBlockId: UuidSchema,
  plantId: UuidSchema,
  interactionType: InteractionTypeSchema,
  interactionData: z.record(z.string(), z.any()).nullable().optional(),
});

// ========================================
// ENHANCED COURSE CONTENT SCHEMAS
// ========================================

/**
 * Enhanced Course Schema with content support
 */
export const EnhancedCourseSchema = CourseSchema.extend({
  defaultLanguage: LanguageCodeSchema,
  availableLanguages: z.array(LanguageCodeSchema),
  contentVersion: z.string(),
  sections: z.array(CourseSectionSchema).optional(),
  languages: z.array(CourseLanguageSchema).optional(),
});

/**
 * Course Content Response Schema
 */
export const CourseContentSchema = z.object({
  course: EnhancedCourseSchema,
  sections: z.array(CourseSectionSchema.extend({
    contentBlocks: z.array(ContentBlockSchema).optional(),
    quizQuestions: z.array(QuizQuestionSchema).optional(),
  })),
  translations: z.record(z.string(), z.any()).optional(),
});

/**
 * Section Content Response Schema
 */
export const SectionContentSchema = z.object({
  section: CourseSectionSchema,
  contentBlocks: z.array(ContentBlockSchema),
  quizQuestions: z.array(QuizQuestionSchema),
  translations: z.record(z.string(), z.any()).optional(),
});

// ========================================
// CONTENT MANAGEMENT SCHEMAS
// ========================================

/**
 * Content Import Schema - For migrating existing content
 */
export const ContentImportSchema = z.object({
  courseId: UuidSchema,
  language: LanguageCodeSchema.default('en'),
  sections: z.array(z.object({
    sectionKey: z.string(),
    title: z.string(),
    orderIndex: z.number().int(),
    iconName: z.string().nullable().optional(),
    contentBlocks: z.array(z.object({
      blockType: ContentBlockTypeSchema,
      orderIndex: z.number().int(),
      content: z.record(z.string(), z.any()),
      metadata: z.record(z.string(), z.any()).nullable().optional(),
    })),
    quizQuestions: z.array(z.object({
      questionKey: z.string(),
      questionType: QuestionTypeSchema,
      questionText: z.string(),
      options: z.array(z.string()).nullable().optional(),
      correctAnswer: z.union([z.string(), z.array(z.string())]),
      explanation: z.string(),
      orderIndex: z.number().int().default(1).optional(),
    })).optional(),
  })),
});

/**
 * Content Export Schema - For backing up content
 */
export const ContentExportSchema = z.object({
  course: EnhancedCourseSchema,
  content: CourseContentSchema,
  exportedAt: TimestampSchema,
  version: z.string(),
});

// ========================================
// COMPOSITE SCHEMAS WITH RELATIONS
// ========================================

export const ProfileWithPlantSchema = ProfileSchema.extend({
  plant: PlantSchema,
});

export const EnrollmentWithRelationsSchema = EnrollmentSchema.extend({
  profile: ProfileSchema,
  course: CourseSchema,
  plant: PlantSchema,
});

export const ProgressWithRelationsSchema = ProgressSchema.extend({
  profile: ProfileSchema,
  course: CourseSchema,
  plant: PlantSchema,
});

// ========================================
// STATISTICS & ANALYTICS SCHEMAS
// ========================================

export const CourseStatisticsSchema = z.object({
  totalEnrollments: z.number().int().min(0),
  completedEnrollments: z.number().int().min(0),
  averageProgress: z.number().min(0).max(100),
  completionRate: z.number().min(0).max(100),
});

export const PlantStatisticsSchema = z.object({
  totalUsers: z.number().int().min(0),
  activeEnrollments: z.number().int().min(0),
  completionRate: z.number().min(0).max(100),
  averageProgress: z.number().min(0).max(100),
});

export const DashboardStatsSchema = z.object({
  totalUsers: z.number().int().min(0),
  activeEnrollments: z.number().int().min(0),
  completionRate: z.number().min(0).max(100),
  overdueTraining: z.number().int().min(0),
  totalPlants: z.number().int().min(0),
  activePlants: z.number().int().min(0),
});

export const EnrollmentStatsSchema = z.object({
  total: z.number().int().min(0),
  completed: z.number().int().min(0),
  inProgress: z.number().int().min(0),
  enrolled: z.number().int().min(0),
  overdue: z.number().int().min(0).optional(),
});

export const AnalyticsDataSchema = z.object({
  plantStats: PlantStatisticsSchema.optional(),
  courseStats: CourseStatisticsSchema.optional(),
  enrollmentStats: EnrollmentStatsSchema.optional(),
  dashboardStats: DashboardStatsSchema.optional(),
});

// ========================================
// API REQUEST/RESPONSE SCHEMAS
// ========================================

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const ApiResponseSchema = <T>(dataSchema: z.ZodType<T>) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const PaginatedResponseSchema = <T>(itemSchema: z.ZodType<T>) => z.object({
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
// FILTER SCHEMAS
// ========================================

// Date range schema for filtering
export const DateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).optional();

export const PlantFilterSchema = z.object({
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
  dateRange: DateRangeSchema,
}).merge(PaginationSchema);

export const CourseFilterSchema = z.object({
  isPublished: z.coerce.boolean().optional(),
  search: z.string().optional(),
  version: z.string().optional(),
  dateRange: DateRangeSchema,
}).merge(PaginationSchema);

export const EnrollmentFilterSchema = z.object({
  plantId: UuidSchema.optional(),
  courseId: UuidSchema.optional(),
  userId: UuidSchema.optional(),
  status: EnrollmentStatusSchema.optional(),
  dateRange: DateRangeSchema,
}).merge(PaginationSchema);

export const ProgressFilterSchema = z.object({
  plantId: UuidSchema.optional(),
  courseId: UuidSchema.optional(),
  userId: UuidSchema.optional(),
  minProgress: z.coerce.number().min(0).max(100).optional(),
  maxProgress: z.coerce.number().min(0).max(100).optional(),
  dateRange: DateRangeSchema,
}).merge(PaginationSchema);

export const UserFilterSchema = z.object({
  plantId: UuidSchema.optional(),
  status: UserStatusSchema.optional(),
  role: AdminRoleSchema.optional(),
  search: z.string().optional(),
  dateRange: DateRangeSchema,
}).merge(PaginationSchema);

// ========================================
// TYPE EXPORTS (DTOs)
// ========================================

// Enum types
export type AdminRole = z.infer<typeof AdminRoleSchema>;
export type EnrollmentStatus = z.infer<typeof EnrollmentStatusSchema>;
export type EventType = z.infer<typeof EventTypeSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;

// Base entity types
export type Plant = z.infer<typeof PlantSchema>;
export type CreatePlant = z.infer<typeof CreatePlantSchema>;
export type UpdatePlant = z.infer<typeof UpdatePlantSchema>;

export type Course = z.infer<typeof CourseSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;

export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export type AdminRoleRecord = z.infer<typeof AdminRoleRecordSchema>;
export type CreateAdminRole = z.infer<typeof CreateAdminRoleSchema>;
export type UpdateAdminRole = z.infer<typeof UpdateAdminRoleSchema>;

export type Enrollment = z.infer<typeof EnrollmentSchema>;
export type CreateEnrollment = z.infer<typeof CreateEnrollmentSchema>;
export type UpdateEnrollment = z.infer<typeof UpdateEnrollmentSchema>;

export type Progress = z.infer<typeof ProgressSchema>;
export type CreateProgress = z.infer<typeof CreateProgressSchema>;
export type UpdateProgress = z.infer<typeof UpdateProgressSchema>;

export type ActivityEvent = z.infer<typeof ActivityEventSchema>;
export type CreateActivityEvent = z.infer<typeof CreateActivityEventSchema>;

export type QuestionEvent = z.infer<typeof QuestionEventSchema>;
export type CreateQuestionEvent = z.infer<typeof CreateQuestionEventSchema>;

// Ebook content types
export type CourseSection = z.infer<typeof CourseSectionSchema>;
export type CreateCourseSection = z.infer<typeof CreateCourseSectionSchema>;
export type UpdateCourseSection = z.infer<typeof UpdateCourseSectionSchema>;

export type ContentBlock = z.infer<typeof ContentBlockSchema>;
export type CreateContentBlock = z.infer<typeof CreateContentBlockSchema>;
export type UpdateContentBlock = z.infer<typeof UpdateContentBlockSchema>;

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type CreateQuizQuestion = z.infer<typeof CreateQuizQuestionSchema>;
export type UpdateQuizQuestion = z.infer<typeof UpdateQuizQuestionSchema>;

export type ContentTranslation = z.infer<typeof ContentTranslationSchema>;
export type CreateContentTranslation = z.infer<typeof CreateContentTranslationSchema>;
export type UpdateContentTranslation = z.infer<typeof UpdateContentTranslationSchema>;

export type CourseLanguage = z.infer<typeof CourseLanguageSchema>;
export type CreateCourseLanguage = z.infer<typeof CreateCourseLanguageSchema>;
export type UpdateCourseLanguage = z.infer<typeof UpdateCourseLanguageSchema>;

export type SectionProgress = z.infer<typeof SectionProgressSchema>;
export type CreateSectionProgress = z.infer<typeof CreateSectionProgressSchema>;
export type UpdateSectionProgress = z.infer<typeof UpdateSectionProgressSchema>;

export type ContentInteraction = z.infer<typeof ContentInteractionSchema>;
export type CreateContentInteraction = z.infer<typeof CreateContentInteractionSchema>;

// Enhanced content types
export type EnhancedCourse = z.infer<typeof EnhancedCourseSchema>;
export type CourseContent = z.infer<typeof CourseContentSchema>;
export type SectionContent = z.infer<typeof SectionContentSchema>;

// Content management types
export type ContentImport = z.infer<typeof ContentImportSchema>;
export type ContentExport = z.infer<typeof ContentExportSchema>;

// Composite types
export type ProfileWithPlant = z.infer<typeof ProfileWithPlantSchema>;
export type EnrollmentWithRelations = z.infer<typeof EnrollmentWithRelationsSchema>;
export type ProgressWithRelations = z.infer<typeof ProgressWithRelationsSchema>;

// Statistics types
export type CourseStatistics = z.infer<typeof CourseStatisticsSchema>;
export type PlantStatistics = z.infer<typeof PlantStatisticsSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type EnrollmentStats = z.infer<typeof EnrollmentStatsSchema>;
export type AnalyticsData = z.infer<typeof AnalyticsDataSchema>;

// Filter types
export type DateRange = z.infer<typeof DateRangeSchema>;
export type PaginationParams = z.infer<typeof PaginationSchema>;
export type PlantFilter = z.infer<typeof PlantFilterSchema>;
export type CourseFilter = z.infer<typeof CourseFilterSchema>;
export type EnrollmentFilter = z.infer<typeof EnrollmentFilterSchema>;
export type ProgressFilter = z.infer<typeof ProgressFilterSchema>;
export type UserFilter = z.infer<typeof UserFilterSchema>;

// Compatibility aliases for legacy code
export type EnrollmentFilters = EnrollmentFilter;
export type UserFilters = UserFilter;

// API response types
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<T>>>;
export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<T>>>;
