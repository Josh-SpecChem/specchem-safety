# Type Documentation

**Generated:** 2025-10-01T21:54:22.340Z  
**Purpose:** Auto-generated type documentation from TypeScript types  
**Status:** Current

## Overview

This documentation is automatically generated from TypeScript type files.

## Types

### src/types/api.ts

**Types:** ApiResponse, PaginatedApiResponse, ErrorResponse, CreateUserRequest, UpdateUserRequest, CreateEnrollmentRequest, UpdateEnrollmentRequest, UpdateProgressRequest, UserQueryParams, CourseQueryParams, EnrollmentQueryParams, AnalyticsRequest, AnalyticsResponse, PlantAnalytics, CourseAnalytics, UserAnalytics, UseUsersReturn, UseCoursesReturn, UseCreateCourseReturn, CreateCourseData, UpdateCourseData, CreateEnrollmentData, UpdateEnrollmentData, AdminFilterOptions, AdminError, AdminApiResponse, StandardApiResponse, RouteContext, AuthContext, ValidationErrorDetails, RouteHandler, AuthRouteHandler, CrudOperations, ListOperations, AnalyticsOperations

```typescript
// Type definitions
/**
 * Centralized API types for SpecChem Safety Training system
 * Provides type-safe interfaces for all API communication
 */

import type { PaginatedResult } from './database';
import { NextRequest, NextResponse } from 'next/server';

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
// ... (truncated)
```

---

### src/types/css.d.ts

**Types:** No types found

```typescript
// Type definitions
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.sass" {
  const content: Record<string, string>;
  export default content;
}
```

---

### src/types/database.ts

**Types:** Profile, Course, Plant, Enrollment, Progress, AdminRoleRecord, ActivityEvent, QuestionEvent, CreateProfile, UpdateProfile, CreateCourse, UpdateCourse, CreatePlant, UpdatePlant, CreateEnrollment, UpdateEnrollment, CreateProgress, UpdateProgress, UserFilters, CourseFilters, EnrollmentFilters, ProgressFilters, PlantFilters, ProfileWithDetails, CourseWithDetails, EnrollmentWithDetails, ProgressWithDetails, PlantWithDetails, CourseStatistics, PlantStatistics, PaginationParams, PaginatedResult, DatabaseResult, DatabaseErrorResult, DatabaseResponse, AnalyticsOverview, CoursePerformance, PlantPerformance, QuestionStats, UserContext, UserWithDetails, CourseWithStats, EnrollmentWithDetailsFromSchema, AnalyticsData, DashboardStats, EnrollmentStats, CourseStatisticsFromSchema, Optional, RequiredFields, DeepPartial, AdminUser, AdminEnrollment, AdminCourse, AdminModule, AdminSection, AdminStats, UserProfile, CourseProgress, UpdateUserProfile, ProfileWithRoles

```typescript
// Type definitions
/**
 * Comprehensive centralized database types for SpecChem Safety Training system
 * Consolidates all scattered type definitions into a single source of truth
 */

import type { z } from 'zod';
import type {
  // Base schemas
  profileSchema,
  courseSchema,
  plantSchema,
  enrollmentSchema,
  progressSchema,
  adminRoleRecordSchema,
  activityEventSchema,
// ... (truncated)
```

---

### src/types/domain.ts

**Types:** LmsModule, LmsLesson, TrainingModule, TrainingModuleContent, ModuleSection, InteractiveElement, ModuleResource, ModuleAssessment, AssessmentQuestion, AssessmentResult, AssessmentAttempt, UserProgress, UserModuleProgress, ModuleNote, ModuleCertificate, SpecChemRole, TrainingPath, TrainingPathModule, CompletionCriteria, ResourceLink, LmsUserProgress, NavigatorUserProgress

```typescript
// Type definitions
/**
 * Centralized business domain types for SpecChem Safety Training system
 * Consolidates LMS, training, and navigator-specific types
 */

// ========================================
// LMS MODULE TYPES
// ========================================

export interface LmsModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedHours: number;
// ... (truncated)
```

---

### src/types/hooks.ts

**Types:** FormConfig, FormState, FormActions, BaseHookOptions, ApiHookOptions, MutationHookOptions

```typescript
// Type definitions
import type {
  Profile,
  Course,
  Enrollment,
  Progress,
  AdminRoleRecord,
  Plant,
  UserWithDetails,
  CourseWithStats,
  EnrollmentWithDetails,
  AnalyticsData,
  DashboardStats,
  EnrollmentStats,
  CourseStatistics,
  UserFilters,
// ... (truncated)
```

---

### src/types/index.ts

**Types:** No types found

```typescript
// Type definitions
// Central type exports - single source of truth
export * from "./database";
export * from "./api";
export * from "./ui";
export * from "./domain";
export * from "./utils";
```

---

### src/types/ui.ts

**Types:** FormFieldProps, TableColumn, TableProps, PaginationProps, LoginFormData, SignupFormData, ProfileUpdateFormData, AdminCreateUserFormData, NavigationItem, BreadcrumbItem, ModalProps, ToastProps, CardProps, CourseCardProps, ModuleCardProps, DashboardWidgetProps, ProgressBarProps, FilterOption, FilterProps, SearchProps, LoadingSpinnerProps, SkeletonProps, ErrorBoundaryProps, ErrorMessageProps, LayoutProps, SidebarProps, HeaderProps, ValidationRule, FormFieldError, FormState, RegistrationData, ModuleViewerProps, EnhancedModuleViewerProps, AssessmentProps, EnrollButtonProps, ProtectedRouteProps, AdminTableColumn, AdminFormField, AdminFormData, AdminBulkAction

```typescript
// Type definitions
/**
 * Centralized UI component types for SpecChem Safety Training system
 * Provides type-safe interfaces for all UI components and forms
 */

import type React from "react";
import type { AssessmentQuestion, AssessmentResult } from "./domain";

// ========================================
// COMPONENT PROP TYPES
// ========================================

// Note: ButtonProps is defined in src/components/ui/button.tsx
// as it extends HTML button attributes

// ... (truncated)
```

---

### src/types/utils.ts

**Types:** Optional, RequiredFields, DeepPartial, NonNullable, NonEmptyArray, QuestionResponseMeta, ActivityEventMeta, ProgressUpdateMeta, UserSessionMeta, CourseAnalyticsMeta, ApiRequestMeta, ApiResponseMeta, FormSubmissionMeta, ErrorMeta, Status, Priority, Size, Color, BaseResponse, SuccessResponse, ApiResult, PaginationInfo

```typescript
// Type definitions
/**
 * Centralized utility types for SpecChem Safety Training system
 * Replaces generic types with specific, type-safe alternatives
 */

import type { ErrorResponse } from './api';

// ========================================
// TYPE UTILITIES
// ========================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
// ... (truncated)
```

---

### src/types/**tests**/type-consolidation.test.ts

**Types:** No types found

```typescript
// Type definitions
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
// ... (truncated)
```

---

### src/types/**tests**/type-validation.test.ts

**Types:** utilities, guards

```typescript
// Type definitions
/**
 * Type Validation Tests
 * Ensures all centralized types are properly defined and exported
 */

import { describe, it, expect } from 'vitest';

// Test all type exports from centralized types
describe('Type Consolidation Validation', () => {
  describe('Database Types', () => {
    it('should export core database types', () => {
      // These should be available from the centralized types
      const types = [
        'Profile',
        'Course',
// ... (truncated)
```

---

## Notes

- This documentation is automatically generated
- For the most up-to-date information, refer to the source code
- Types are defined using TypeScript
- All types are located in `src/types/`

---

_Generated by DocumentationGenerator_
