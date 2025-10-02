# API Documentation

**Generated:** 2025-10-01T21:54:22.338Z  
**Purpose:** Auto-generated API documentation from route files  
**Status:** Current

## Overview

This documentation is automatically generated from the API route files in `src/app/api/`.

## API Routes

### **tests**/migrated-routes.test

**Path:** `src/app/api/__tests__/migrated-routes.test.ts`  
**Methods:** Not specified  
**Description:** Integration Tests for Migrated Admin Routes
Tests the actual migrated admin routes using standardized patterns

```typescript
// Route implementation
/**
 * Integration Tests for Migrated Admin Routes
 * Tests the actual migrated admin routes using standardized patterns
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  GET as usersGET,
  POST as usersPOST,
} from "@/app/api/admin/users/route";
import {
  GET as enrollmentsGET,
  POST as enrollmentsPOST,
} from "@/app/api/admin/enrollments/route";
import {
  GET as coursesGET,
  POST as coursesPOST,
} from "@/app/api/admin/courses/route";
// ... (truncated)
```

---

### **tests**/route-standardization.test

**Path:** `src/app/api/__tests__/route-standardization.test.ts`  
**Methods:** Not specified  
**Description:** Tests for Simplified API Route Patterns
Tests the new simplified route patterns and utilities

```typescript
// Route implementation
/**
 * Tests for Simplified API Route Patterns
 * Tests the new simplified route patterns and utilities
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { ResponseUtils } from "@/app/api/shared/utils/response-utils";
import { z } from "zod";
// ... (truncated)
```

---

### **tests**/simple-route-tests.test

**Path:** `src/app/api/__tests__/simple-route-tests.test.ts`  
**Methods:** Not specified  
**Description:** Simple Tests for API Route Standardization
Tests the core functionality without requiring full environment setup

```typescript
// Route implementation
/**
 * Simple Tests for API Route Standardization
 * Tests the core functionality without requiring full environment setup
 */

import { describe, it, expect } from "vitest";
import { ResponseUtils } from "@/app/api/shared/utils/response-utils";
import { ValidationUtils } from "@/app/api/shared/utils/validation-utils";
import { z } from "zod";

// ... (truncated)
```

---

### progress/route

**Path:** `src/app/api/progress/route.ts`  
**Methods:** Not specified  
**Description:** GET /api/progress - Get user's progress across all courses

```typescript
// Route implementation
import { NextResponse } from 'next/server';
import { getAllUserProgress } from '@/lib/progress';
import { withContextAuth } from '@/lib/api-auth';

/**
 * GET /api/progress - Get user's progress across all courses
 */
export async function GET() {
  return withContextAuth(async (userContext) => {
    const progress = await getAllUserProgress();
// ... (truncated)
```

---

### admin/**tests**/routes.test

**Path:** `src/app/api/admin/__tests__/routes.test.ts`  
**Methods:** Not specified  
**Description:** Integration tests for admin API routes
Tests the standardized API routes with proper error handling

```typescript
// Route implementation
/**
 * Integration tests for admin API routes
 * Tests the standardized API routes with proper error handling
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET, POST, PATCH } from "../../../app/api/admin/users/route";
import {
  GET as GET_ENROLLMENTS,
  POST as POST_ENROLLMENTS,
  PATCH as PATCH_ENROLLMENTS,
} from "../../../app/api/admin/enrollments/route";
import {
  GET as GET_COURSES,
  POST as POST_COURSES,
} from "../../../app/api/admin/courses/route";
import { GET as GET_ANALYTICS } from "../../../app/api/admin/analytics/route";
// ... (truncated)
```

---

### admin/analytics/route

**Path:** `src/app/api/admin/analytics/route.ts`  
**Methods:** Not specified  
**Description:** Admin API for analytics - Simplified Implementation
GET: Get plant and course analytics

```typescript
// Route implementation
/**
 * Admin API for analytics - Simplified Implementation
 * GET: Get plant and course analytics
 */

import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { getPlantStats, getCourseStats } from "@/lib/db/operations";
import { CommonSchemas } from "@/app/api/shared/utils/validation-utils";

// ... (truncated)
```

---

### admin/courses/route

**Path:** `src/app/api/admin/courses/route.ts`  
**Methods:** Not specified  
**Description:** Admin API for course management - Simplified Implementation
GET: List all courses with statistics
POST: Create new course

```typescript
// Route implementation
/**
 * Admin API for course management - Simplified Implementation
 * GET: List all courses with statistics
 * POST: Create new course
 */

import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { CommonSchemas } from "@/app/api/shared/utils/validation-utils";
import { db } from "@/lib/db";
// ... (truncated)
```

---

### admin/enrollments/route

**Path:** `src/app/api/admin/enrollments/route.ts`  
**Methods:** Not specified  
**Description:** Admin API for enrollment management - Simplified Implementation
GET: List all enrollments with filtering
POST: Create new enrollment
PATCH: Update enrollment status

```typescript
// Route implementation
/**
 * Admin API for enrollment management - Simplified Implementation
 * GET: List all enrollments with filtering
 * POST: Create new enrollment
 * PATCH: Update enrollment status
 */

import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { EnrollmentOperationsCompat } from "@/lib/db/operations";
// ... (truncated)
```

---

### admin/reports/route

**Path:** `src/app/api/admin/reports/route.ts`  
**Methods:** Not specified  
**Description:** Admin API for detailed analytics and reports
GET: Comprehensive analytics including completion rates, question performance, etc.

```typescript
// Route implementation
import { NextResponse } from "next/server";
import { UnifiedAuthMiddleware } from "@/lib/auth/unified-auth-middleware";
import { getDetailedAnalytics } from "@/lib/db/operations";
import { formatErrorResponse, DatabaseError } from "@/lib/errors";

/**
 * Admin API for detailed analytics and reports
 * GET: Comprehensive analytics including completion rates, question performance, etc.
 */

// ... (truncated)
```

---

### admin/users/route

**Path:** `src/app/api/admin/users/route.ts`  
**Methods:** Not specified  
**Description:** Admin API for user management - Simplified Implementation
GET: List all users with filtering
POST: Create new user (invite)

```typescript
// Route implementation
/**
 * Admin API for user management - Simplified Implementation
 * GET: List all users with filtering
 * POST: Create new user (invite)
 */

import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { UserOperationsCompat } from "@/lib/db/operations";
import { CommonSchemas } from "@/app/api/shared/utils/validation-utils";
// ... (truncated)
```

---

### auth/callback/route

**Path:** `src/app/api/auth/callback/route.ts`  
**Methods:** Not specified  
**Description:** ${forwardedHost}${next}`)

```typescript
// Route implementation
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
// ... (truncated)
```

---

### auth/confirm/route

**Path:** `src/app/api/auth/confirm/route.ts`  
**Methods:** Not specified  
**Description:** Redirect user to specified redirect URL or root of app

```typescript
// Route implementation
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
// ... (truncated)
```

---

### auth/test/route

**Path:** `src/app/api/auth/test/route.ts`  
**Methods:** Not specified  
**Description:** No description available

```typescript
// Route implementation
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
      success: true,
// ... (truncated)
```

---

### shared/utils/response-utils

**Path:** `src/app/api/shared/utils/response-utils.ts`  
**Methods:** Not specified  
**Description:** Response Utilities for API Route Standardization
Provides consistent response formatting across all API routes

```typescript
// Route implementation
/**
 * Response Utilities for API Route Standardization
 * Provides consistent response formatting across all API routes
 */

import { NextResponse } from 'next/server';

export class ResponseUtils {
  /**
   * Create a successful response with data
// ... (truncated)
```

---

### shared/utils/route-utils

**Path:** `src/app/api/shared/utils/route-utils.ts`  
**Methods:** Not specified  
**Description:** Route Utilities for API Route Standardization
Provides common utilities for extracting and validating request data

```typescript
// Route implementation
/**
 * Route Utilities for API Route Standardization
 * Provides common utilities for extracting and validating request data
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';

export class RouteUtils {
  /**
// ... (truncated)
```

---

### shared/utils/validation-utils

**Path:** `src/app/api/shared/utils/validation-utils.ts`  
**Methods:** Not specified  
**Description:** Validation Utilities for API Route Standardization
Provides common validation schemas and utilities

```typescript
// Route implementation
/**
 * Validation Utilities for API Route Standardization
 * Provides common validation schemas and utilities
 */

import { z } from 'zod';

export const CommonSchemas = {
  // Pagination schemas
  pagination: z.object({
// ... (truncated)
```

---

### test/comprehensive/route

**Path:** `src/app/api/test/comprehensive/route.ts`  
**Methods:** Not specified  
**Description:** Comprehensive test API endpoint for Drizzle ORM and Zod validation
GET: Runs all validation and database tests

```typescript
// Route implementation
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { plants, profiles } from "@/lib/db/schema";
import {
  plantSchema,
  paginationSchema,
  enrollmentFiltersSchema,
  createProfileSchema,
} from "@/lib/schemas";
import { eq } from "drizzle-orm";
// ... (truncated)
```

---

### test/drizzle-zod/route

**Path:** `src/app/api/test/drizzle-zod/route.ts`  
**Methods:** Not specified  
**Description:** Test API endpoint to verify Drizzle ORM and Zod validation are working
GET: Returns all plants from database

```typescript
// Route implementation
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { plants, profiles } from "@/lib/db/schema";
import { plantSchema } from "@/lib/schemas";

/**
 * Test API endpoint to verify Drizzle ORM and Zod validation are working
 * GET: Returns all plants from database
 */
// ... (truncated)
```

---

### user/profile/route

**Path:** `src/app/api/user/profile/route.ts`  
**Methods:** Not specified  
**Description:** User Profile API - Simplified Implementation
GET: Get current user's profile
PATCH: Update current user's profile

```typescript
// Route implementation
/**
 * User Profile API - Simplified Implementation
 * GET: Get current user's profile
 * PATCH: Update current user's profile
 */

import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
// ... (truncated)
```

---

### admin/courses/[id]/route

**Path:** `src/app/api/admin/courses/[id]/route.ts`  
**Methods:** Not specified  
**Description:** Validate request body

```typescript
// Route implementation
import { NextRequest, NextResponse } from 'next/server';
import { UnifiedAuthMiddleware } from '@/lib/auth/unified-auth-middleware';
import { formatErrorResponse, ValidationError, DatabaseError, NotFoundError } from '@/lib/errors';
import { updateCourseSchema } from '@/lib/schemas';
import type { UpdateCourse } from '@/lib/schemas';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
// ... (truncated)
```

---

### courses/[course]/progress/route

**Path:** `src/app/api/courses/[course]/progress/route.ts`  
**Methods:** Not specified  
**Description:** GET /api/courses/[course]/progress - Get progress for a specific course route

```typescript
// Route implementation
import { NextRequest, NextResponse } from "next/server";
import {
  getProgressByRoute,
  updateProgressByRoute,
  recordActivityEvent,
} from "@/lib/progress";
import { isValidCourseRoute } from "@/lib/courses";

interface RouteParams {
  params: Promise<{
    course: string;
  }>;
}

// ... (truncated)
```

---

### courses/[course]/questions/route

**Path:** `src/app/api/courses/[course]/questions/route.ts`  
**Methods:** Not specified  
**Description:** POST /api/courses/[course]/questions - Record question response for analytics

```typescript
// Route implementation
import { NextRequest, NextResponse } from "next/server";
import { recordQuestionEvent } from "@/lib/progress";
import { isValidCourseRoute } from "@/lib/courses";

interface RouteParams {
  params: Promise<{
    course: string;
  }>;
}

// ... (truncated)
```

---

## Notes

- This documentation is automatically generated
- For the most up-to-date information, refer to the source code
- API routes follow Next.js App Router conventions
- All routes are located in `src/app/api/`

---

_Generated by DocumentationGenerator_
