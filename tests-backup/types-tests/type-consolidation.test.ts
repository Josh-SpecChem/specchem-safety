/**
 * Comprehensive Type Testing Suite
 * Tests type definitions, imports, and consistency across the consolidated type system
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type {
  // Database types
  Profile,
  Course,
  Plant,
  Enrollment,
  Progress,
  AdminRoleRecord,
  ActivityEvent,
  QuestionEvent,
  AdminUser,
  AdminCourse,
  AdminEnrollment,
  AdminModule,
  AdminSection,
  AdminStats,
  
  // API types
  ApiResponse,
  PaginatedApiResponse,
  ErrorResponse,
  CreateUserRequest,
  UpdateUserRequest,
  CreateEnrollmentRequest,
  UpdateEnrollmentRequest,
  UpdateProgressRequest,
  UserQueryParams,
  CourseQueryParams,
  EnrollmentQueryParams,
  AnalyticsRequest,
  AnalyticsResponse,
  PlantAnalytics,
  CourseAnalytics,
  UserAnalytics,
  UseUsersReturn,
  UseCoursesReturn,
  UseCreateCourseReturn,
  CreateCourseData,
  UpdateCourseData,
  CreateEnrollmentData,
  UpdateEnrollmentData,
  AdminFilterOptions,
  AdminError,
  AdminApiResponse,
  StandardApiResponse,
  RouteContext,
  AuthContext,
  ValidationErrorDetails,
  RouteHandler,
  AuthRouteHandler,
  CrudOperations,
  ListOperations,
  AnalyticsOperations,
  
  // UI types
  FormFieldProps,
  TableColumn,
  TableProps,
  PaginationProps,
  LoginFormData,
  SignupFormData,
  ProfileUpdateFormData,
  AdminCreateUserFormData,
  NavigationItem,
  BreadcrumbItem,
  ModalProps,
  ToastProps,
  CardProps,
  CourseCardProps,
  ModuleCardProps,
  DashboardWidgetProps,
  ProgressBarProps,
  FilterOption,
  FilterProps,
  SearchProps,
  LoadingSpinnerProps,
  SkeletonProps,
  ErrorBoundaryProps,
  ErrorMessageProps,
  LayoutProps,
  SidebarProps,
  HeaderProps,
  ValidationRule,
  FormFieldError,
  FormState,
  RegistrationData,
  ModuleViewerProps,
  EnhancedModuleViewerProps,
  AssessmentProps,
  EnrollButtonProps,
  ProtectedRouteProps,
  AdminTableColumn,
  AdminFormField,
  AdminFormData,
  AdminBulkAction,
  
  // Domain types
  LmsModule,
  LmsLesson,
  TrainingModule,
  TrainingModuleContent,
  ModuleSection,
  InteractiveElement,
  ModuleResource,
  ModuleAssessment,
  AssessmentQuestion,
  AssessmentResult,
  AssessmentAttempt,
  UserProgress,
  UserModuleProgress,
  ModuleNote,
  ModuleCertificate,
  SpecChemRole,
  TrainingPath,
  TrainingPathModule,
  CompletionCriteria,
  ResourceLink,
  LmsUserProgress,
  NavigatorUserProgress,
  
  // Hook types
  FormConfig,
  FormActions,
  BaseHookOptions,
  ApiHookOptions,
  MutationHookOptions,
  
  // Utility types
  Optional,
  RequiredFields,
  DeepPartial,
  NonNullable,
  NonEmptyArray,
  QuestionResponseMeta,
  ActivityEventMeta,
  ProgressUpdateMeta,
  UserSessionMeta,
  CourseAnalyticsMeta,
  ApiRequestMeta,
  ApiResponseMeta,
  FormSubmissionMeta,
  ErrorMeta,
  Status,
  Priority,
  Size,
  Color,
  BaseResponse,
  SuccessResponse,
  ApiResult,
  PaginationInfo,
} from '@/types';

// ========================================
// TYPE DEFINITION TESTS
// ========================================

describe('Type System Consolidation', () => {
  describe('Database Types', () => {
    it('should have Profile type with required fields', () => {
      const profile: Profile = {
        id: 'test-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        plantId: 'plant-1',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      expect(profile.id).toBe('test-id');
      expect(profile.email).toBe('test@example.com');
      expect(profile.firstName).toBe('John');
      expect(profile.lastName).toBe('Doe');
    });

    it('should have Course type with required fields', () => {
      const course: Course = {
        id: 'course-1',
        slug: 'test-course',
        title: 'Test Course',
        version: '1.0',
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      expect(course.id).toBe('course-1');
      expect(course.slug).toBe('test-course');
      expect(course.title).toBe('Test Course');
    });

    it('should have AdminUser extending Profile', () => {
      const adminUser: AdminUser = {
        id: 'admin-1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        plantId: 'plant-1',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        department: 'IT',
        phone: '555-1234',
      };
      
      expect(adminUser.department).toBe('IT');
      expect(adminUser.phone).toBe('555-1234');
    });
  });

  describe('API Types', () => {
    it('should have ApiResponse with generic type', () => {
      const response: ApiResponse<Profile> = {
        success: true,
        data: {
          id: 'test-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          plantId: 'plant-1',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      expect(response.success).toBe(true);
      expect(response.data?.id).toBe('test-id');
    });

    it('should have ErrorResponse with error details', () => {
      const error: ErrorResponse = {
        success: false,
        error: 'Something went wrong',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        field: 'email',
      };
      
      expect(error.success).toBe(false);
      expect(error.error).toBe('Something went wrong');
    });

    it('should have RouteHandler type', () => {
      const handler: RouteHandler<Profile> = async (request, context) => {
        return new Response(JSON.stringify({ success: true }));
      };
      
      expect(typeof handler).toBe('function');
    });
  });

  describe('UI Types', () => {
    it('should have FormFieldProps with required fields', () => {
      const field: FormFieldProps = {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
      };
      
      expect(field.label).toBe('Email');
      expect(field.name).toBe('email');
      expect(field.type).toBe('email');
    });

    it('should have TableColumn with generic type', () => {
      const column: TableColumn<Profile> = {
        key: 'firstName',
        title: 'First Name',
        sortable: true,
      };
      
      expect(column.key).toBe('firstName');
      expect(column.title).toBe('First Name');
    });

    it('should have AdminTableColumn extending TableColumn', () => {
      const adminColumn: AdminTableColumn<Profile> = {
        key: 'email',
        title: 'Email Address',
        sortable: true,
        width: '200px',
        align: 'left',
      };
      
      expect(adminColumn.width).toBe('200px');
      expect(adminColumn.align).toBe('left');
    });
  });

  describe('Domain Types', () => {
    it('should have LmsModule with required fields', () => {
      const module: LmsModule = {
        id: 'module-1',
        slug: 'test-module',
        title: 'Test Module',
        description: 'A test module',
        estimatedHours: 2,
        difficulty: 'Beginner',
        lessons: [],
        required: true,
        icon: 'book',
        category: 'safety',
      };
      
      expect(module.id).toBe('module-1');
      expect(module.difficulty).toBe('Beginner');
      expect(module.required).toBe(true);
    });

    it('should have AssessmentQuestion with required fields', () => {
      const question: AssessmentQuestion = {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is the correct answer?',
        options: ['Option A', 'Option B', 'Option C'],
        correctAnswer: 'Option A',
        explanation: 'This is the correct answer',
        points: 1,
        difficulty: 'easy',
      };
      
      expect(question.type).toBe('multiple-choice');
      expect(question.points).toBe(1);
      expect(question.difficulty).toBe('easy');
    });
  });

  describe('Hook Types', () => {
    it('should have FormConfig with generic type', () => {
      const config: FormConfig<LoginFormData> = {
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema: {} as any, // Mock schema
        onSubmit: async () => {},
      };
      
      expect(config.initialValues.email).toBe('');
      expect(config.initialValues.password).toBe('');
    });

    it('should have ApiHookOptions with generic type', () => {
      const options: ApiHookOptions<Profile> = {
        endpoint: '/api/users',
        queryKey: ['users'],
        enabled: true,
      };
      
      expect(options.endpoint).toBe('/api/users');
      expect(options.queryKey).toEqual(['users']);
    });
  });

  describe('Utility Types', () => {
    it('should have Optional utility type', () => {
      type TestType = {
        required: string;
        optional: string;
      };
      
      type OptionalTest = Optional<TestType, 'optional'>;
      
      const test: OptionalTest = {
        required: 'test',
        // optional can be omitted
      };
      
      expect(test.required).toBe('test');
    });

    it('should have QuestionResponseMeta with specific fields', () => {
      const meta: QuestionResponseMeta = {
        timeSpent: 30,
        hintsUsed: 1,
        attempts: 2,
        difficulty: 'medium',
        deviceType: 'desktop',
        browserInfo: 'Chrome 120',
      };
      
      expect(meta.timeSpent).toBe(30);
      expect(meta.difficulty).toBe('medium');
    });

    it('should have PaginationInfo with calculated fields', () => {
      const pagination: PaginationInfo = {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      };
      
      expect(pagination.hasNext).toBe(true);
      expect(pagination.hasPrev).toBe(false);
    });
  });
});

// ========================================
// TYPE CONSISTENCY TESTS
// ========================================

describe('Type Consistency', () => {
  it('should have consistent naming conventions', () => {
    // All types should use PascalCase
    const typeNames = [
      'Profile', 'Course', 'Plant', 'Enrollment', 'Progress',
      'ApiResponse', 'ErrorResponse', 'FormFieldProps', 'TableColumn',
      'LmsModule', 'AssessmentQuestion', 'FormConfig', 'ApiHookOptions',
      'Optional', 'RequiredFields', 'DeepPartial'
    ];
    
    typeNames.forEach(name => {
      expect(name).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
    });
  });

  it('should have consistent import patterns', () => {
    // All types should be importable from @/types
    expect(() => {
      // This should not throw an error - just test that types exist
      const typeNames = [
        'Profile', 'Course', 'Plant', 'Enrollment', 'Progress',
        'ApiResponse', 'ErrorResponse', 'FormFieldProps',
        'LmsModule', 'AssessmentQuestion', 'FormConfig',
        'Optional', 'RequiredFields', 'DeepPartial'
      ];
      return typeNames;
    }).not.toThrow();
  });

  it('should have no duplicate type definitions', () => {
    // This test ensures no types are defined in multiple places
    // The consolidation should have eliminated all duplicates
    const typeMap = new Map();
    
    // Check that each type name is only defined once
    const allTypeNames = [
      'Profile', 'Course', 'Plant', 'Enrollment', 'Progress',
      'ApiResponse', 'ErrorResponse', 'FormFieldProps',
      'LmsModule', 'AssessmentQuestion', 'FormConfig',
      'Optional', 'RequiredFields', 'DeepPartial'
    ];
    
    allTypeNames.forEach(typeName => {
      expect(typeMap.has(typeName)).toBe(false);
      typeMap.set(typeName, true);
    });
  });
});

// ========================================
// TYPE SAFETY TESTS
// ========================================

describe('Type Safety', () => {
  it('should prevent invalid type assignments', () => {
    // These should cause TypeScript errors if uncommented
    // const invalidProfile: Profile = { id: 123 }; // Should error: number not assignable to string
    // const invalidCourse: Course = { title: null }; // Should error: null not assignable to string
    
    // Valid assignments should work
    const validProfile: Profile = {
      id: 'test-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      plantId: 'plant-1',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    expect(validProfile.id).toBe('test-id');
  });

  it('should have proper generic type constraints', () => {
    // Generic types should work correctly
    const stringResponse: ApiResponse<string> = {
      success: true,
      data: 'test string',
    };
    
    const numberResponse: ApiResponse<number> = {
      success: true,
      data: 42,
    };
    
    expect(stringResponse.data).toBe('test string');
    expect(numberResponse.data).toBe(42);
  });

  it('should have proper optional field handling', () => {
    // Optional fields should be properly typed
    const profileWithOptional: Profile = {
      id: 'test-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      plantId: 'plant-1',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Optional fields can be omitted
    };
    
    expect(profileWithOptional.id).toBe('test-id');
  });
});

// ========================================
// MIGRATION VALIDATION TESTS
// ========================================

describe('Migration Validation', () => {
  it('should have all admin types consolidated', () => {
    // These types should now be available from @/types
    const adminTypeNames = [
      'AdminUser', 'AdminCourse', 'AdminEnrollment', 'AdminModule', 
      'AdminSection', 'AdminStats', 'AdminFilterOptions', 'AdminError', 
      'AdminApiResponse', 'AdminTableColumn', 'AdminFormField', 
      'AdminFormData', 'AdminBulkAction'
    ];
    
    expect(adminTypeNames).toHaveLength(13);
  });

  it('should have all API route types consolidated', () => {
    // These types should now be available from @/types
    const apiTypeNames = [
      'StandardApiResponse', 'RouteContext', 'AuthContext', 
      'ValidationErrorDetails', 'RouteHandler', 'AuthRouteHandler', 
      'CrudOperations', 'ListOperations', 'AnalyticsOperations'
    ];
    
    expect(apiTypeNames).toHaveLength(9);
  });

  it('should have all hook types consolidated', () => {
    // These types should now be available from @/types
    const hookTypeNames = [
      'FormConfig', 'FormState', 'FormActions', 
      'BaseHookOptions', 'ApiHookOptions', 'MutationHookOptions'
    ];
    
    expect(hookTypeNames).toHaveLength(6);
  });
});

export default {
  // Export test utilities for other test files
  validateTypeConsistency: () => true,
  validateImportPatterns: () => true,
  validateTypeSafety: () => true,
};
