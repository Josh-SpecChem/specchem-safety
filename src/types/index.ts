// Central type exports - single source of truth
export * from './database';
export * from './api';
export * from './ui';
export * from './domain';
export * from './utils';

// Re-export commonly used types for convenience
export type {
  // Database types
  Profile,
  Course,
  Plant,
  Enrollment,
  Progress,
  ProfileWithDetails,
  CourseWithDetails,
  EnrollmentWithDetails,
  ProgressWithDetails,
  PlantWithDetails,
  
  // API types
  ApiResponse,
  PaginatedResult,
  ErrorResponse,
  UseUsersReturn,
  UseCoursesReturn,
  
  // Domain types
  LmsModule,
  TrainingModule,
  UserProgress,
  SpecChemRole,
  TrainingPath,
  AssessmentQuestion,
  AssessmentResult,
  
  // UI types
  FormFieldProps,
  TableProps,
  ModalProps,
  ToastProps,
  
  // Utility types
  Optional,
  Required,
  DeepPartial,
  QuestionResponseMeta,
  ActivityEventMeta,
  ProgressUpdateMeta,
} from './database';
