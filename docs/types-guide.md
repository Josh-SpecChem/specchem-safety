# TypeScript Types Guide

**Date:** 2025-01-10  
**Purpose:** Documentation  
**Status:** Complete  
**Audience:** All  

# TypeScript Types Guide

## Overview
This project uses a centralized type system with TypeScript for better type safety, IDE support, and maintainability. All types are organized into logical modules and exported from a central index file.

## Type Organization

### Core Types (`src/types/database.ts`)
- **Database Entities:** Profile, Course, Plant, Enrollment, Progress
- **CRUD Operations:** Create, Update, Delete variants for all entities
- **Relationships:** Extended types with proper relationships
- **Statistics:** Analytics and reporting types
- **User Context:** Authentication and authorization types

### API Types (`src/types/api.ts`)
- **Request/Response:** Standardized API communication types
- **Error Handling:** Consistent error response types
- **Query Parameters:** Filtering and pagination types
- **Analytics:** Reporting and analytics request/response types
- **Hook Return Types:** Standardized hook return interfaces

### Domain Types (`src/types/domain.ts`)
- **LMS Types:** Learning management system specific types
- **Training Types:** Training modules, assessments, certificates
- **Progress Types:** User progress and completion tracking
- **Role Types:** User roles and training paths
- **Resource Types:** Links and external resources

### UI Types (`src/types/ui.ts`)
- **Component Props:** Reusable component prop types
- **Form Types:** Form data and validation types
- **Navigation:** Navigation and routing types
- **UI Elements:** Modal, toast, table, and other UI types
- **Layout Types:** Page layout and structure types

### Utility Types (`src/types/utils.ts`)
- **Type Helpers:** Optional, Required, DeepPartial utilities
- **Meta Types:** Specific metadata types for events and responses
- **Common Types:** Shared utility types across the application
- **Type Guards:** Runtime type checking functions
- **Validation Helpers:** Type validation utilities

## Type Import Patterns

### Centralized Imports (Recommended)
```typescript
// Preferred: Import from central types
import type {
  Profile,
  Course,
  UserProgress,
  ApiResponse,
  PaginatedResult,
  LmsModule,
  TrainingModule,
  AssessmentQuestion,
  ButtonProps,
  FormFieldProps,
  Optional,
  Required,
  DeepPartial,
} from '@/types';
```

### Specific Imports
```typescript
// Alternative: Import from specific modules
import type { Profile } from '@/types/database';
import type { ApiResponse } from '@/types/api';
import type { UserProgress } from '@/types/domain';
import type { ButtonProps } from '@/types/ui';
import type { Optional } from '@/types/utils';
```

## Type Safety Guidelines

### Avoid Generic Types
```typescript
// Bad: Generic types
const data: any = response.data;
const meta: Record<string, any> = {};

// Good: Specific types
const data: Profile = response.data;
const meta: QuestionResponseMeta = {};
```

### Use Zod for Runtime Validation
```typescript
// Runtime validation with Zod
const profile = profileSchema.parse(rawData);
// TypeScript knows this is a Profile type
```

### Proper Type Exports
```typescript
// Always export types that might be used elsewhere
export interface UserProgress {
  userId: string;
  // ... other properties
}

// Re-export commonly used types
export type { Profile, Course, Plant } from './database';
```

## Database Types

### Core Entities
- **Profile:** User profile information
- **Course:** Training course definitions
- **Plant:** Manufacturing plant information
- **Enrollment:** User course enrollments
- **Progress:** User progress tracking
- **AdminRoleRecord:** Administrative role assignments

### Extended Types
- **ProfileWithDetails:** Profile with plant, roles, and enrollments
- **CourseWithDetails:** Course with enrollments and statistics
- **EnrollmentWithDetails:** Enrollment with user and course details
- **ProgressWithDetails:** Progress with user and course details
- **PlantWithDetails:** Plant with users and statistics

### CRUD Operations
- **CreateProfile:** Data required to create a profile
- **UpdateProfile:** Data allowed for profile updates
- **CreateCourse:** Data required to create a course
- **UpdateCourse:** Data allowed for course updates
- Similar patterns for all entities

## API Types

### Response Types
- **ApiResponse<T>:** Standard API response wrapper
- **PaginatedApiResponse<T>:** Paginated response wrapper
- **ErrorResponse:** Standardized error response

### Request Types
- **CreateUserRequest:** User creation data
- **UpdateUserRequest:** User update data
- **CreateEnrollmentRequest:** Enrollment creation data
- **UpdateEnrollmentRequest:** Enrollment update data

### Hook Types
- **UseUsersReturn:** Return type for users hook
- **UseCoursesReturn:** Return type for courses hook
- **UseCreateCourseReturn:** Return type for course creation hook

## Domain Types

### LMS Types
- **LmsModule:** Learning management system module
- **LmsLesson:** Individual lesson within a module
- **UserProgress:** Consolidated user progress tracking

### Training Types
- **TrainingModule:** Training module with content
- **ModuleSection:** Section within a training module
- **ModuleResource:** Resource associated with a module
- **ModuleAssessment:** Assessment for a module
- **AssessmentQuestion:** Individual assessment question
- **AssessmentResult:** Result of an assessment attempt

### Role Types
- **SpecChemRole:** User role definition
- **TrainingPath:** Training path for a role
- **TrainingPathModule:** Module within a training path
- **CompletionCriteria:** Criteria for path completion

## UI Types

### Component Props
- **ButtonProps:** Button component properties
- **FormFieldProps:** Form field component properties
- **TableProps<T>:** Table component properties
- **ModalProps:** Modal component properties
- **ToastProps:** Toast notification properties

### Form Types
- **LoginFormData:** Login form data structure
- **SignupFormData:** Signup form data structure
- **ProfileUpdateFormData:** Profile update form data
- **AdminCreateUserFormData:** Admin user creation form data

### Navigation Types
- **NavigationItem:** Navigation menu item
- **BreadcrumbItem:** Breadcrumb navigation item

## Utility Types

### Type Helpers
- **Optional<T, K>:** Make specific keys optional
- **Required<T, K>:** Make specific keys required
- **DeepPartial<T>:** Make all nested properties optional
- **NonNullable<T>:** Remove null and undefined from type
- **NonEmptyArray<T>:** Array with at least one element

### Meta Types
- **QuestionResponseMeta:** Metadata for question responses
- **ActivityEventMeta:** Metadata for activity events
- **ProgressUpdateMeta:** Metadata for progress updates
- **UserSessionMeta:** Metadata for user sessions
- **CourseAnalyticsMeta:** Metadata for course analytics

### Type Guards
- **isString(value):** Check if value is a string
- **isNumber(value):** Check if value is a number
- **isBoolean(value):** Check if value is a boolean
- **isObject(value):** Check if value is an object
- **isArray<T>(value):** Check if value is an array
- **isNonNullable<T>(value):** Check if value is not null/undefined

### Validation Helpers
- **isValidEmail(email):** Validate email format
- **isValidUUID(uuid):** Validate UUID format
- **isValidDateString(dateString):** Validate date string
- **isValidProgressPercent(percent):** Validate progress percentage

## Migration History
- Consolidated scattered type definitions into centralized modules
- Eliminated duplicate interfaces across multiple files
- Replaced generic types with specific, type-safe alternatives
- Created comprehensive type hierarchy and documentation
- Added type validation scripts and testing utilities

## Best Practices
1. **Single Source of Truth:** Each type should be defined in one place
2. **Specific Types:** Avoid `any`, prefer `unknown` when necessary
3. **Proper Exports:** Export types that might be used elsewhere
4. **Documentation:** Document complex types and their relationships
5. **Validation:** Use Zod schemas for runtime type validation
6. **Testing:** Write tests for complex type definitions
7. **Consistency:** Use consistent naming conventions across all types

## Type Validation

### Automated Validation
Run the type validation script to check for issues:
```bash
npm run validate-types
```

### Type Audit
Run the type audit script to analyze the codebase:
```bash
npm run audit-types
```

### Manual Validation
- Check for duplicate type definitions
- Verify all generic types have been replaced
- Ensure proper import/export patterns
- Validate type relationships and dependencies

## Common Patterns

### Extending Base Types
```typescript
export interface ProfileWithDetails extends Profile {
  plant: Plant;
  adminRoles: AdminRoleRecord[];
  enrollments: EnrollmentWithDetails[];
}
```

### Generic Type Constraints
```typescript
export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
}
```

### Union Types
```typescript
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

### Conditional Types
```typescript
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

This comprehensive type system provides excellent type safety, developer experience, and maintainability for the SpecChem Safety Training platform.
