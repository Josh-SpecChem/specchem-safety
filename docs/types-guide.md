# TypeScript Types Guide

**Date:** 2025-01-10  
**Purpose:** Documentation  
**Status:** Complete  
**Audience:** All

# TypeScript Types Guide

## Overview

This project uses a centralized type system with TypeScript for better type safety, IDE support, and maintainability. All types are organized into logical modules and exported from a central index file. The type system is fully integrated with Drizzle ORM and Zod validation for 100% type safety from database to UI.

## Implementation Status

- ✅ **Consolidated Types:** All scattered type definitions consolidated into centralized modules
- ✅ **Drizzle Integration:** Database types generated from Drizzle schema
- ✅ **Zod Validation:** Runtime validation schemas aligned with TypeScript types
- ✅ **API Types:** Comprehensive API request/response types
- ✅ **Hook Types:** Standardized hook return types for consistent data fetching

## Type Organization

### Core Types (`src/types/database.ts`)

- **Database Entities:** Profile, Course, Plant, Enrollment, Progress, AdminRoleRecord, ActivityEvent, QuestionEvent
- **CRUD Operations:** Create, Update variants for all entities (aligned with Zod schemas)
- **Relationships:** Extended types with proper relationships (ProfileWithDetails, CourseWithStats, etc.)
- **Statistics:** Analytics and reporting types (CourseStatistics, PlantStatistics)
- **User Context:** Authentication and authorization types with plant-based access control

### API Types (`src/types/api.ts`)

- **Request/Response:** Standardized API communication types (ApiResponse, PaginatedApiResponse)
- **Error Handling:** Consistent error response types with detailed error information
- **Query Parameters:** Filtering and pagination types (UserQueryParams, CourseQueryParams, etc.)
- **Analytics:** Reporting and analytics request/response types (PlantAnalytics, CourseAnalytics)
- **Hook Return Types:** Standardized hook return interfaces (UseUsersReturn, UseCoursesReturn)
- **Route Handlers:** Type-safe route handler definitions with auth context

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
} from "@/types";
```

### Specific Imports

```typescript
// Alternative: Import from specific modules
import type { Profile } from "@/types/database";
import type { ApiResponse } from "@/types/api";
import type { UserProgress } from "@/types/domain";
import type { ButtonProps } from "@/types/ui";
import type { Optional } from "@/types/utils";
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
export type { Profile, Course, Plant } from "./database";
```

## Database Types

### Core Entities (from Drizzle Schema)

- **Profile:** User profile information (matches `profiles` table exactly)
- **Course:** Training course definitions (matches `courses` table exactly)
- **Plant:** Manufacturing plant information (matches `plants` table exactly)
- **Enrollment:** User course enrollments (matches `enrollments` table exactly)
- **Progress:** User progress tracking (matches `progress` table exactly)
- **AdminRoleRecord:** Administrative role assignments (matches `admin_roles` table exactly)
- **ActivityEvent:** User activity tracking (matches `activity_events` table exactly)
- **QuestionEvent:** Question response tracking (matches `question_events` table exactly)

### Extended Types with Relationships

- **ProfileWithDetails:** Profile with plant, adminRoles, and enrollments
- **CourseWithDetails:** Course with enrollments and statistics
- **EnrollmentWithDetails:** Enrollment with profile, course, and plant details
- **ProgressWithDetails:** Progress with profile, course, and plant details
- **PlantWithDetails:** Plant with profiles and statistics

### CRUD Operations (Zod-Validated)

- **CreateProfile:** Data required to create a profile (validated by `createProfileSchema`)
- **UpdateProfile:** Data allowed for profile updates (validated by `updateProfileSchema`)
- **CreateCourse:** Data required to create a course (validated by `createCourseSchema`)
- **UpdateCourse:** Data allowed for course updates (validated by `updateCourseSchema`)
- Similar patterns for all entities with full Zod validation

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

- ✅ **Phase 1:** Consolidated scattered type definitions into centralized modules
- ✅ **Phase 2:** Eliminated duplicate interfaces across multiple files
- ✅ **Phase 3:** Replaced generic types with specific, type-safe alternatives
- ✅ **Phase 4:** Integrated Drizzle ORM for database type generation
- ✅ **Phase 5:** Aligned Zod schemas with TypeScript types for runtime validation
- ✅ **Phase 6:** Created comprehensive type hierarchy and documentation
- ✅ **Phase 7:** Added type validation scripts and testing utilities
- ✅ **Phase 8:** Implemented standardized API response types with error handling

## Best Practices

1. **Single Source of Truth:** Each type should be defined in one place (enforced by centralized modules)
2. **Database Alignment:** All database types must match Drizzle schema exactly
3. **Runtime Validation:** Use Zod schemas for all API inputs and critical data validation
4. **Specific Types:** Avoid `any`, prefer `unknown` when necessary, use specific union types
5. **Proper Exports:** Export types that might be used elsewhere with clear naming
6. **Documentation:** Document complex types and their relationships with JSDoc comments
7. **Testing:** Write tests for complex type definitions and validation schemas
8. **Consistency:** Use consistent naming conventions across all types (PascalCase for types, camelCase for properties)
9. **Type Guards:** Use type guards for runtime type checking when needed
10. **Hook Types:** Standardize hook return types for consistent data fetching patterns

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

### Drizzle-Zod Alignment Test

Verify database schema and Zod schema alignment:

```bash
npm run test:drizzle-zod
```

### Manual Validation Checklist

- ✅ Check for duplicate type definitions (eliminated)
- ✅ Verify all generic types have been replaced with specific types
- ✅ Ensure proper import/export patterns from centralized modules
- ✅ Validate type relationships and dependencies
- ✅ Confirm Drizzle schema matches TypeScript types
- ✅ Verify Zod schemas align with database constraints
- ✅ Test API request/response type safety

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
export type Status = "active" | "inactive" | "pending" | "completed" | "failed";
export type Priority = "low" | "medium" | "high" | "urgent";
```

### Conditional Types

```typescript
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

## Summary

This comprehensive type system provides excellent type safety, developer experience, and maintainability for the SpecChem Safety Training platform. The integration of Drizzle ORM, Zod validation, and centralized TypeScript types ensures:

- **100% Type Safety:** From database to UI with no type gaps
- **Runtime Validation:** All critical data paths validated with Zod
- **Developer Experience:** Excellent IDE support with auto-completion and error detection
- **Maintainability:** Single source of truth for all type definitions
- **Scalability:** Consistent patterns that scale with application growth

The type system is battle-tested and production-ready, providing a solid foundation for continued development and feature expansion.
