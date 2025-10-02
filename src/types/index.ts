// Central type exports - single source of truth
// Note: Contracts are the primary source, database.ts provides extensions

// Primary exports from contracts (avoiding conflicts)
export type {
  // Base entity types
  Plant,
  Course,
  Profile,
  Enrollment,
  Progress,
  AdminRoleRecord,
  ActivityEvent,
  QuestionEvent,
  
  // CRUD types
  CreateProfile,
  UpdateProfile,
  CreateCourse,
  UpdateCourse,
  CreatePlant,
  UpdatePlant,
  CreateEnrollment,
  UpdateEnrollment,
  CreateProgress,
  UpdateProgress,
  
  // Filter types
  UserFilter,
  CourseFilter,
  EnrollmentFilter,
  ProgressFilter,
  PlantFilter,
  PaginationParams,
  
  // Composite types
  ProfileWithPlant,
  EnrollmentWithRelations,
  ProgressWithRelations,
  
  // Statistics types
  CourseStatistics,
  PlantStatistics,
  DashboardStats,
  EnrollmentStats,
  AnalyticsData,
  
  // Utility types
  PaginatedResult,
  Optional,
  RequiredFields,
  DeepPartial,
  UserContext,
  
  // Enum types
  AdminRole,
  EnrollmentStatus,
  EventType,
  UserStatus,
  
  // Validation types
  ApiResponse,
  PaginatedResponse
} from '@/contracts';

// Extended types from database.ts (avoiding conflicts)
export type {
  DatabaseResult,
  DatabaseErrorResult,
  DatabaseResponse,
  AnalyticsOverview,
  CoursePerformance,
  PlantPerformance,
  QuestionStats,
  AdminUser,
  AdminEnrollment,
  AdminCourse,
  AdminModule,
  AdminSection,
  AdminStats,
  UserProfile,
  CourseProgress,
  UpdateUserProfile,
  ProfileWithRoles,
  CourseWithDetails,
  ProgressWithDetails,
  PlantWithDetails,
  ProfileWithDetails,
  EnrollmentWithDetails,
  UserWithDetails,
  CourseWithStats
} from './database';

export * from './api';
export * from './ui';
export * from './domain';
export * from './utils';
