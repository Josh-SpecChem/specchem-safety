/**
 * Data Mappers - Convert Drizzle Rows to DTOs
 * 
 * These mappers convert raw database rows to validated DTO objects.
 * They handle nullability, field transformations, and ensure tenant isolation.
 * 
 * CRITICAL: Never return raw Drizzle rows to API clients.
 * Always use these mappers to convert DB data → DTOs.
 */

import type { InferSelectModel } from 'drizzle-orm';
import type {
  plants,
  courses,
  profiles,
  adminRoles,
  enrollments,
  progress,
  activityEvents,
  questionEvents
} from './schema.app';

import {
  PlantSchema,
  CourseSchema,
  ProfileSchema,
  AdminRoleRecordSchema,
  EnrollmentSchema,
  ProgressSchema,
  ActivityEventSchema,
  QuestionEventSchema,
  type Plant,
  type Course,
  type Profile,
  type AdminRoleRecord,
  type Enrollment,
  type Progress,
  type ActivityEvent,
  type QuestionEvent,
  type ProfileWithPlant,
  type EnrollmentWithRelations,
  type ProgressWithRelations
} from './base';

// ========================================
// TYPE DEFINITIONS FOR DATABASE ROWS
// ========================================

type PlantRow = InferSelectModel<typeof plants>;
type CourseRow = InferSelectModel<typeof courses>;
type ProfileRow = InferSelectModel<typeof profiles>;
type AdminRoleRow = InferSelectModel<typeof adminRoles>;
type EnrollmentRow = InferSelectModel<typeof enrollments>;
type ProgressRow = InferSelectModel<typeof progress>;
type ActivityEventRow = InferSelectModel<typeof activityEvents>;
type QuestionEventRow = InferSelectModel<typeof questionEvents>;

// ========================================
// CORE ENTITY MAPPERS
// ========================================

/**
 * Maps Plant database row to Plant DTO
 */
export function mapPlantToDTO(dbPlant: PlantRow): Plant {
  const mapped = {
    id: dbPlant.id,
    name: dbPlant.name,
    isActive: dbPlant.isActive,
    createdAt: dbPlant.createdAt,
    updatedAt: dbPlant.updatedAt,
  };

  // Validate the mapped result
  return PlantSchema.parse(mapped);
}

/**
 * Maps Course database row to Course DTO
 */
export function mapCourseToDTO(dbCourse: CourseRow): Course {
  const mapped = {
    id: dbCourse.id,
    slug: dbCourse.slug,
    title: dbCourse.title,
    version: dbCourse.version,
    isPublished: dbCourse.isPublished,
    createdAt: dbCourse.createdAt,
    updatedAt: dbCourse.updatedAt,
  };

  // Validate the mapped result
  return CourseSchema.parse(mapped);
}

/**
 * Maps Profile database row to Profile DTO
 */
export function mapProfileToDTO(dbProfile: ProfileRow): Profile {
  const mapped = {
    id: dbProfile.id,
    plantId: dbProfile.plantId,
    firstName: dbProfile.firstName,
    lastName: dbProfile.lastName,
    email: dbProfile.email,
    jobTitle: dbProfile.jobTitle,
    status: dbProfile.status,
    createdAt: dbProfile.createdAt,
    updatedAt: dbProfile.updatedAt,
  };

  // Validate the mapped result
  return ProfileSchema.parse(mapped);
}

/**
 * Maps AdminRole database row to AdminRoleRecord DTO
 */
export function mapAdminRoleToDTO(dbAdminRole: AdminRoleRow): AdminRoleRecord {
  const mapped = {
    id: dbAdminRole.id,
    userId: dbAdminRole.userId,
    role: dbAdminRole.role,
    plantId: dbAdminRole.plantId,
    createdAt: dbAdminRole.createdAt,
    updatedAt: dbAdminRole.updatedAt,
  };

  // Validate the mapped result
  return AdminRoleRecordSchema.parse(mapped);
}

/**
 * Maps Enrollment database row to Enrollment DTO
 */
export function mapEnrollmentToDTO(dbEnrollment: EnrollmentRow): Enrollment {
  const mapped = {
    id: dbEnrollment.id,
    userId: dbEnrollment.userId,
    courseId: dbEnrollment.courseId,
    plantId: dbEnrollment.plantId,
    status: dbEnrollment.status,
    enrolledAt: dbEnrollment.enrolledAt,
    completedAt: dbEnrollment.completedAt,
    createdAt: dbEnrollment.createdAt,
    updatedAt: dbEnrollment.updatedAt,
  };

  // Validate the mapped result
  return EnrollmentSchema.parse(mapped);
}

/**
 * Maps Progress database row to Progress DTO
 */
export function mapProgressToDTO(dbProgress: ProgressRow): Progress {
  const mapped = {
    id: dbProgress.id,
    userId: dbProgress.userId,
    courseId: dbProgress.courseId,
    plantId: dbProgress.plantId,
    progressPercent: dbProgress.progressPercent,
    currentSection: dbProgress.currentSection,
    lastActiveAt: dbProgress.lastActiveAt,
    createdAt: dbProgress.createdAt,
    updatedAt: dbProgress.updatedAt,
  };

  // Validate the mapped result
  return ProgressSchema.parse(mapped);
}

/**
 * Maps ActivityEvent database row to ActivityEvent DTO
 */
export function mapActivityEventToDTO(dbActivityEvent: ActivityEventRow): ActivityEvent {
  const mapped = {
    id: dbActivityEvent.id,
    userId: dbActivityEvent.userId,
    courseId: dbActivityEvent.courseId,
    plantId: dbActivityEvent.plantId,
    eventType: dbActivityEvent.eventType,
    meta: dbActivityEvent.meta,
    occurredAt: dbActivityEvent.occurredAt,
    createdAt: dbActivityEvent.createdAt,
  };

  // Validate the mapped result
  return ActivityEventSchema.parse(mapped);
}

/**
 * Maps QuestionEvent database row to QuestionEvent DTO
 */
export function mapQuestionEventToDTO(dbQuestionEvent: QuestionEventRow): QuestionEvent {
  const mapped = {
    id: dbQuestionEvent.id,
    userId: dbQuestionEvent.userId,
    courseId: dbQuestionEvent.courseId,
    plantId: dbQuestionEvent.plantId,
    sectionKey: dbQuestionEvent.sectionKey,
    questionKey: dbQuestionEvent.questionKey,
    isCorrect: dbQuestionEvent.isCorrect,
    attemptIndex: dbQuestionEvent.attemptIndex,
    responseMeta: dbQuestionEvent.responseMeta,
    answeredAt: dbQuestionEvent.answeredAt,
    createdAt: dbQuestionEvent.createdAt,
  };

  // Validate the mapped result
  return QuestionEventSchema.parse(mapped);
}

// ========================================
// COMPOSITE MAPPERS WITH RELATIONS
// ========================================

/**
 * Maps Profile with Plant relation to ProfileWithPlant DTO
 */
export function mapProfileWithPlantToDTO(
  dbProfile: ProfileRow & { plant: PlantRow }
): ProfileWithPlant {
  return {
    ...mapProfileToDTO(dbProfile),
    plant: mapPlantToDTO(dbProfile.plant),
  };
}

/**
 * Maps Enrollment with relations to EnrollmentWithRelations DTO
 */
export function mapEnrollmentWithRelationsToDTO(
  dbEnrollment: EnrollmentRow & {
    profile: ProfileRow;
    course: CourseRow;
    plant: PlantRow;
  }
): EnrollmentWithRelations {
  return {
    ...mapEnrollmentToDTO(dbEnrollment),
    profile: mapProfileToDTO(dbEnrollment.profile),
    course: mapCourseToDTO(dbEnrollment.course),
    plant: mapPlantToDTO(dbEnrollment.plant),
  };
}

/**
 * Maps Progress with relations to ProgressWithRelations DTO
 */
export function mapProgressWithRelationsToDTO(
  dbProgress: ProgressRow & {
    profile: ProfileRow;
    course: CourseRow;
    plant: PlantRow;
  }
): ProgressWithRelations {
  return {
    ...mapProgressToDTO(dbProgress),
    profile: mapProfileToDTO(dbProgress.profile),
    course: mapCourseToDTO(dbProgress.course),
    plant: mapPlantToDTO(dbProgress.plant),
  };
}

// ========================================
// ARRAY MAPPERS
// ========================================

/**
 * Maps array of Plant rows to Plant DTOs
 */
export function mapPlantsToDTO(dbPlants: PlantRow[]): Plant[] {
  return dbPlants.map(mapPlantToDTO);
}

/**
 * Maps array of Course rows to Course DTOs
 */
export function mapCoursesToDTO(dbCourses: CourseRow[]): Course[] {
  return dbCourses.map(mapCourseToDTO);
}

/**
 * Maps array of Profile rows to Profile DTOs
 */
export function mapProfilesToDTO(dbProfiles: ProfileRow[]): Profile[] {
  return dbProfiles.map(mapProfileToDTO);
}

/**
 * Maps array of AdminRole rows to AdminRoleRecord DTOs
 */
export function mapAdminRolesToDTO(dbAdminRoles: AdminRoleRow[]): AdminRoleRecord[] {
  return dbAdminRoles.map(mapAdminRoleToDTO);
}

/**
 * Maps array of Enrollment rows to Enrollment DTOs
 */
export function mapEnrollmentsToDTO(dbEnrollments: EnrollmentRow[]): Enrollment[] {
  return dbEnrollments.map(mapEnrollmentToDTO);
}

/**
 * Maps array of Progress rows to Progress DTOs
 */
export function mapProgressListToDTO(dbProgressList: ProgressRow[]): Progress[] {
  return dbProgressList.map(mapProgressToDTO);
}

/**
 * Maps array of ActivityEvent rows to ActivityEvent DTOs
 */
export function mapActivityEventsToDTO(dbActivityEvents: ActivityEventRow[]): ActivityEvent[] {
  return dbActivityEvents.map(mapActivityEventToDTO);
}

/**
 * Maps array of QuestionEvent rows to QuestionEvent DTOs
 */
export function mapQuestionEventsToDTO(dbQuestionEvents: QuestionEventRow[]): QuestionEvent[] {
  return dbQuestionEvents.map(mapQuestionEventToDTO);
}

// ========================================
// TENANT ISOLATION HELPERS
// ========================================

/**
 * Validates that a mapped DTO belongs to the expected tenant
 */
export function validateTenantOwnership<T extends { plantId: string }>(
  dto: T,
  expectedPlantId: string
): T {
  if (dto.plantId !== expectedPlantId) {
    throw new Error(`Tenant isolation violation: Expected plantId ${expectedPlantId}, got ${dto.plantId}`);
  }
  return dto;
}

/**
 * Filters an array of DTOs to only include items from the specified tenant
 */
export function filterByTenant<T extends { plantId: string }>(
  dtos: T[],
  plantId: string
): T[] {
  return dtos.filter(dto => dto.plantId === plantId);
}

// ========================================
// PAGINATION HELPERS
// ========================================

/**
 * Maps paginated database results to paginated DTO response
 */
export function mapPaginatedResult<TRow, TDTO>(
  rows: TRow[],
  total: number,
  page: number,
  limit: number,
  mapper: (row: TRow) => TDTO
): {
  items: TDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  return {
    items: rows.map(mapper),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ========================================
// ERROR HANDLING
// ========================================

export class MappingError extends Error {
  constructor(
    message: string,
    public entityType: string,
    public entityId?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'MappingError';
  }
}

/**
 * Safely maps a database row to DTO with error handling
 */
export function safeMapToDTO<TRow, TDTO>(
  row: TRow,
  mapper: (row: TRow) => TDTO,
  entityType: string,
  entityId?: string
): TDTO {
  try {
    return mapper(row);
  } catch (error) {
    throw new MappingError(
      `Failed to map ${entityType} to DTO: ${error instanceof Error ? error.message : 'Unknown error'}`,
      entityType,
      entityId,
      error instanceof Error ? error : undefined
    );
  }
}

