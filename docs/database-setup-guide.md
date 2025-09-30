# SpecChem Safety Training Database Setup Guide

## Overview

This document provides a complete guide for setting up the SpecChem Safety Training LMS database using Supabase, Drizzle ORM, and Zod validation. The system implements a multi-tenant architecture with plant-based row-level security and event-driven analytics.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Dependencies & Initial Setup](#dependencies--initial-setup)
3. [Database Schema Design](#database-schema-design)
4. [Supabase Integration](#supabase-integration)
5. [Validation Layer (Zod)](#validation-layer-zod)
6. [Database Operations](#database-operations)
7. [Security & RLS Implementation](#security--rls-implementation)
8. [Migration Strategy](#migration-strategy)
9. [Testing & Validation](#testing--validation)
10. [Performance Optimization](#performance-optimization)
11. [Deployment Checklist](#deployment-checklist)

---

## System Architecture

### Domain Model
- **Tenant**: Plant (row-level multi-tenancy)
- **Actors**: HR Admin, Plant Manager, Associate, Dev Admin
- **Core Entities**: User, Plant, Course, Enrollment, Progress, Events
- **Security**: RLS policies, role-based access control

### Key Design Decisions
1. **Plant-based tenancy**: Every data row includes `plant_id` for isolation
2. **Event-driven analytics**: Question/activity events are append-only
3. **Minimal quiz backend**: Store analytics via `question_key`, full authoring later
4. **Monotonic progress**: Progress can only increase, never decrease
5. **Auth integration**: Extends Supabase Auth with custom profile data

---

## Dependencies & Initial Setup

### 1. Install Required Packages

```bash
# Core database packages
npm install drizzle-orm @supabase/supabase-js @supabase/ssr
npm install -D drizzle-kit pg @types/pg

# Validation and utilities
npm install zod date-fns

# Development tools (if not already installed)
npm install -D @types/node typescript
```

### 2. Environment Variables

Ensure your `.env.local` contains:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://radbukphijxenmgiljtu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Connections
SUPABASE_DB_PASSWORD=Cai1GxvtKKkzQY9c
SUPABASE_DB_DIRECT=postgresql://postgres:Cai1GxvtKKkzQY9c@db.radbukphijxenmgiljtu.supabase.co:5432/postgres
```

### 3. Project Structure

```
src/
├── lib/
│   ├── db/
│   │   ├── schema.ts              # Drizzle schema definitions
│   │   ├── index.ts               # Database connection
│   │   ├── operations/            # Business logic helpers
│   │   │   ├── enrollments.ts
│   │   │   ├── events.ts
│   │   │   ├── reporting.ts
│   │   │   └── auth.ts
│   │   └── migrations/            # SQL migration files
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server-side client
│   │   └── middleware.ts          # Auth middleware
│   └── validations/               # Zod schemas
│       ├── enrollment.ts
│       ├── progress.ts
│       ├── events.ts
│       └── auth.ts
├── types/
│   └── database.ts                # Generated & custom types
drizzle.config.ts                  # Drizzle configuration
```

---

## Database Schema Design

### Core Tables Overview

| Table | Purpose | Key Fields | Tenant Scoped |
|-------|---------|------------|---------------|
| `plants` | Plant definitions | `id`, `name`, `is_active` | No |
| `profiles` | User profiles | `id` (FK to auth.users), `plant_id` | Yes |
| `admin_roles` | Role assignments | `user_id`, `role`, `plant_id` | Partial |
| `courses` | Course definitions | `id`, `slug`, `title`, `is_published` | No |
| `enrollments` | User course enrollment | `user_id`, `course_id`, `plant_id`, `status` | Yes |
| `progress` | Learning progress | `user_id`, `course_id`, `progress_percent` | Yes |
| `question_events` | Question analytics | `user_id`, `question_key`, `is_correct` | Yes |
| `activity_events` | Activity tracking | `user_id`, `event_type`, `occurred_at` | Yes |

### 1. Create Drizzle Configuration

**File**: `drizzle.config.ts`
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_DIRECT!,
  },
  verbose: true,
  strict: true,
  schemaFilter: ['public'],  // Focus on public schema, auth is managed by Supabase
});
```

### 2. Database Schema Implementation

**File**: `src/lib/db/schema.ts`
```typescript
import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, pgEnum, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['enrolled', 'in_progress', 'completed']);
export const adminRoleEnum = pgEnum('admin_role', ['hr_admin', 'dev_admin', 'plant_manager']);
export const eventTypeEnum = pgEnum('event_type', ['view_section', 'start_course', 'complete_course']);

// Plants (not tenant-scoped - defines tenants)
export const plants = pgTable('plants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User Profiles (extends auth.users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id)
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  jobTitle: text('job_title'),
  status: userStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  plantIdIdx: index('profiles_plant_id_idx').on(table.plantId),
  emailIdx: index('profiles_email_idx').on(table.email),
}));

// Admin Role Assignments
export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  role: adminRoleEnum('role').notNull(),
  plantId: uuid('plant_id').references(() => plants.id), // null for org-wide admins
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userRoleUnique: unique('admin_roles_user_role_plant_unique').on(table.userId, table.role, table.plantId),
  userIdIdx: index('admin_roles_user_id_idx').on(table.userId),
}));

// Courses
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  version: text('version').notNull().default('1.0'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enrollments (tenant-scoped)
export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  status: enrollmentStatusEnum('status').notNull().default('enrolled'),
  enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userCourseUnique: unique('enrollments_user_course_unique').on(table.userId, table.courseId),
  plantCourseIdx: index('enrollments_plant_course_idx').on(table.plantId, table.courseId),
  statusIdx: index('enrollments_status_idx').on(table.status),
}));

// Progress Tracking (tenant-scoped)
export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  progressPercent: integer('progress_percent').notNull().default(0),
  currentSection: text('current_section'),
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userCourseUnique: unique('progress_user_course_unique').on(table.userId, table.courseId),
  plantCourseIdx: index('progress_plant_course_idx').on(table.plantId, table.courseId),
}));

// Question Events (append-only analytics, tenant-scoped)
export const questionEvents = pgTable('question_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  sectionKey: text('section_key').notNull(),
  questionKey: text('question_key').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  attemptIndex: integer('attempt_index').notNull().default(1),
  responseMeta: jsonb('response_meta'), // Optional payload for analytics
  answeredAt: timestamp('answered_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  plantCourseQuestionIdx: index('question_events_plant_course_question_idx')
    .on(table.plantId, table.courseId, table.questionKey),
  answeredAtIdx: index('question_events_answered_at_idx').on(table.answeredAt),
  userQuestionIdx: index('question_events_user_question_idx').on(table.userId, table.questionKey),
}));

// Activity Events (optional audit trail, tenant-scoped)
export const activityEvents = pgTable('activity_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  plantId: uuid('plant_id').notNull().references(() => plants.id),
  eventType: eventTypeEnum('event_type').notNull(),
  meta: jsonb('meta'), // Additional event data
  occurredAt: timestamp('occurred_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  plantCourseEventIdx: index('activity_events_plant_course_event_idx')
    .on(table.plantId, table.courseId, table.eventType),
  occurredAtIdx: index('activity_events_occurred_at_idx').on(table.occurredAt),
  userEventIdx: index('activity_events_user_event_idx').on(table.userId, table.eventType),
}));

// Relations
export const plantsRelations = relations(plants, ({ many }) => ({
  profiles: many(profiles),
  enrollments: many(enrollments),
  progress: many(progress),
  questionEvents: many(questionEvents),
  activityEvents: many(activityEvents),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  plant: one(plants, {
    fields: [profiles.plantId],
    references: [plants.id],
  }),
  adminRoles: many(adminRoles),
  enrollments: many(enrollments),
  progress: many(progress),
  questionEvents: many(questionEvents),
  activityEvents: many(activityEvents),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  progress: many(progress),
  questionEvents: many(questionEvents),
  activityEvents: many(activityEvents),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(profiles, {
    fields: [enrollments.userId],
    references: [profiles.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  plant: one(plants, {
    fields: [enrollments.plantId],
    references: [plants.id],
  }),
}));
```

### 3. Database Connection Setup

**File**: `src/lib/db/index.ts`
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection for migrations and direct queries
const connectionString = process.env.SUPABASE_DB_DIRECT!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

export type Database = typeof db;
export * from './schema';
```

---

## Supabase Integration

### 1. Browser Client

**File**: `src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 2. Server Client

**File**: `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

### 3. Middleware for Auth

**File**: `src/lib/supabase/middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any additional logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
```

### 4. Update Root Middleware

**File**: `middleware.ts`
```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## Validation Layer (Zod)

### 1. Core Validation Schemas

**File**: `src/lib/validations/auth.ts`
```typescript
import { z } from 'zod';

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  plantId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  jobTitle: z.string().max(100).optional(),
  status: z.enum(['active', 'suspended']),
});

export const adminRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['hr_admin', 'dev_admin', 'plant_manager']),
  plantId: z.string().uuid().optional(),
});

export const createProfileSchema = userProfileSchema.omit({ id: true });
export const updateProfileSchema = userProfileSchema.partial().required({ id: true });

export type UserProfile = z.infer<typeof userProfileSchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AdminRoleInput = z.infer<typeof adminRoleSchema>;
```

**File**: `src/lib/validations/enrollment.ts`
```typescript
import { z } from 'zod';

export const enrollmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  status: z.enum(['enrolled', 'in_progress', 'completed']),
  enrolledAt: z.date(),
  completedAt: z.date().optional(),
});

export const createEnrollmentSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
});

export const updateEnrollmentSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['enrolled', 'in_progress', 'completed']).optional(),
  completedAt: z.date().optional(),
});

export type Enrollment = z.infer<typeof enrollmentSchema>;
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
```

**File**: `src/lib/validations/progress.ts`
```typescript
import { z } from 'zod';

export const progressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  progressPercent: z.number().int().min(0).max(100),
  currentSection: z.string().optional(),
  lastActiveAt: z.date(),
});

export const updateProgressSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  progressPercent: z.number().int().min(0).max(100),
  currentSection: z.string().optional(),
});

export const progressPatchSchema = z.object({
  progressPercent: z.number().int().min(0).max(100).optional(),
  currentSection: z.string().optional(),
});

export type Progress = z.infer<typeof progressSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type ProgressPatch = z.infer<typeof progressPatchSchema>;
```

**File**: `src/lib/validations/events.ts`
```typescript
import { z } from 'zod';

export const questionEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  sectionKey: z.string().min(1),
  questionKey: z.string().min(1),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().positive(),
  responseMeta: z.record(z.any()).optional(),
  answeredAt: z.date(),
});

export const createQuestionEventSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  sectionKey: z.string().min(1),
  questionKey: z.string().min(1),
  isCorrect: z.boolean(),
  attemptIndex: z.number().int().positive().default(1),
  responseMeta: z.record(z.any()).optional(),
});

export const activityEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  plantId: z.string().uuid(),
  eventType: z.enum(['view_section', 'start_course', 'complete_course']),
  meta: z.record(z.any()).optional(),
  occurredAt: z.date(),
});

export const createActivityEventSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  eventType: z.enum(['view_section', 'start_course', 'complete_course']),
  meta: z.record(z.any()).optional(),
});

export type QuestionEvent = z.infer<typeof questionEventSchema>;
export type CreateQuestionEventInput = z.infer<typeof createQuestionEventSchema>;
export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type CreateActivityEventInput = z.infer<typeof createActivityEventSchema>;
```

---

## Database Operations

### 1. Auth Operations

**File**: `src/lib/db/operations/auth.ts`
```typescript
import { eq, and } from 'drizzle-orm';
import { db } from '../index';
import { profiles, adminRoles, plants } from '../schema';
import { createProfileSchema, adminRoleSchema, type CreateProfileInput, type AdminRoleInput } from '@/lib/validations/auth';

export async function createProfile(input: CreateProfileInput) {
  const validatedInput = createProfileSchema.parse(input);
  
  const [profile] = await db
    .insert(profiles)
    .values(validatedInput)
    .returning();
    
  return profile;
}

export async function getProfileById(id: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id));
    
  return profile;
}

export async function getProfileByIdWithPlant(id: string) {
  const [result] = await db
    .select({
      profile: profiles,
      plant: plants,
    })
    .from(profiles)
    .innerJoin(plants, eq(profiles.plantId, plants.id))
    .where(eq(profiles.id, id));
    
  return result;
}

export async function assignAdminRole(input: AdminRoleInput) {
  const validatedInput = adminRoleSchema.parse(input);
  
  const [role] = await db
    .insert(adminRoles)
    .values(validatedInput)
    .returning();
    
  return role;
}

export async function getUserRoles(userId: string) {
  return await db
    .select()
    .from(adminRoles)
    .where(eq(adminRoles.userId, userId));
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.length > 0;
}

export async function isUserPlantManager(userId: string, plantId?: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  
  if (plantId) {
    return roles.some(role => 
      role.role === 'plant_manager' && role.plantId === plantId
    );
  }
  
  return roles.some(role => role.role === 'plant_manager');
}

export async function isUserHRAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.some(role => role.role === 'hr_admin');
}
```

### 2. Enrollment Operations

**File**: `src/lib/db/operations/enrollments.ts`
```typescript
import { eq, and, count } from 'drizzle-orm';
import { db } from '../index';
import { enrollments, progress, profiles } from '../schema';
import { createEnrollmentSchema, updateEnrollmentSchema, type CreateEnrollmentInput, type UpdateEnrollmentInput } from '@/lib/validations/enrollment';

export async function createEnrollment(input: CreateEnrollmentInput) {
  const validatedInput = createEnrollmentSchema.parse(input);
  
  // Get user's plant_id for validation
  const [profile] = await db
    .select({ plantId: profiles.plantId })
    .from(profiles)
    .where(eq(profiles.id, validatedInput.userId));
    
  if (!profile) {
    throw new Error('User profile not found');
  }
  
  if (profile.plantId !== validatedInput.plantId) {
    throw new Error('Plant ID mismatch');
  }
  
  const [enrollment] = await db
    .insert(enrollments)
    .values(validatedInput)
    .returning();
    
  // Initialize progress record
  await db
    .insert(progress)
    .values({
      userId: validatedInput.userId,
      courseId: validatedInput.courseId,
      plantId: validatedInput.plantId,
      progressPercent: 0,
    });
    
  return enrollment;
}

export async function updateEnrollment(input: UpdateEnrollmentInput) {
  const validatedInput = updateEnrollmentSchema.parse(input);
  
  const [enrollment] = await db
    .update(enrollments)
    .set({
      ...validatedInput,
      updatedAt: new Date(),
    })
    .where(eq(enrollments.id, validatedInput.id))
    .returning();
    
  return enrollment;
}

export async function completeEnrollment(userId: string, courseId: string) {
  const now = new Date();
  
  // Update enrollment status
  await db
    .update(enrollments)
    .set({
      status: 'completed',
      completedAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      )
    );
    
  // Update progress to 100%
  await db
    .update(progress)
    .set({
      progressPercent: 100,
      lastActiveAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(progress.userId, userId),
        eq(progress.courseId, courseId)
      )
    );
}

export async function getUserEnrollments(userId: string) {
  return await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.userId, userId));
}

export async function getPlantEnrollments(plantId: string) {
  return await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.plantId, plantId));
}

export async function getEnrollmentStats(plantId: string, courseId: string) {
  const [stats] = await db
    .select({
      total: count(),
      completed: count(enrollments.completedAt),
    })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.plantId, plantId),
        eq(enrollments.courseId, courseId)
      )
    );
    
  return {
    total: stats.total,
    completed: stats.completed,
    completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
  };
}
```

### 3. Progress Operations

**File**: `src/lib/db/operations/progress.ts`
```typescript
import { eq, and } from 'drizzle-orm';
import { db } from '../index';
import { progress, enrollments } from '../schema';
import { updateProgressSchema, type UpdateProgressInput } from '@/lib/validations/progress';

export async function updateProgress(input: UpdateProgressInput) {
  const validatedInput = updateProgressSchema.parse(input);
  
  const now = new Date();
  
  const [updatedProgress] = await db
    .update(progress)
    .set({
      progressPercent: validatedInput.progressPercent,
      currentSection: validatedInput.currentSection,
      lastActiveAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(progress.userId, validatedInput.userId),
        eq(progress.courseId, validatedInput.courseId)
      )
    )
    .returning();
    
  // Update enrollment status based on progress
  if (validatedInput.progressPercent > 0) {
    await db
      .update(enrollments)
      .set({
        status: validatedInput.progressPercent >= 100 ? 'completed' : 'in_progress',
        completedAt: validatedInput.progressPercent >= 100 ? now : null,
        updatedAt: now,
      })
      .where(
        and(
          eq(enrollments.userId, validatedInput.userId),
          eq(enrollments.courseId, validatedInput.courseId)
        )
      );
  }
  
  return updatedProgress;
}

export async function markProgress(userId: string, courseId: string, sectionKey: string, progressPercent?: number) {
  const currentProgress = await getUserProgress(userId, courseId);
  
  if (!currentProgress) {
    throw new Error('Progress record not found');
  }
  
  // Ensure progress is monotonic (never decreases)
  const newProgress = progressPercent 
    ? Math.max(currentProgress.progressPercent, progressPercent)
    : currentProgress.progressPercent;
    
  return await updateProgress({
    userId,
    courseId,
    progressPercent: newProgress,
    currentSection: sectionKey,
  });
}

export async function getUserProgress(userId: string, courseId: string) {
  const [userProgress] = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.userId, userId),
        eq(progress.courseId, courseId)
      )
    );
    
  return userProgress;
}

export async function getPlantProgress(plantId: string, courseId?: string) {
  const whereClause = courseId 
    ? and(eq(progress.plantId, plantId), eq(progress.courseId, courseId))
    : eq(progress.plantId, plantId);
    
  return await db
    .select()
    .from(progress)
    .where(whereClause);
}
```

### 4. Event Operations

**File**: `src/lib/db/operations/events.ts`
```typescript
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../index';
import { questionEvents, activityEvents, profiles } from '../schema';
import { createQuestionEventSchema, createActivityEventSchema, type CreateQuestionEventInput, type CreateActivityEventInput } from '@/lib/validations/events';

export async function recordQuestionEvent(input: CreateQuestionEventInput) {
  const validatedInput = createQuestionEventSchema.parse(input);
  
  // Get user's plant_id
  const [profile] = await db
    .select({ plantId: profiles.plantId })
    .from(profiles)
    .where(eq(profiles.id, validatedInput.userId));
    
  if (!profile) {
    throw new Error('User profile not found');
  }
  
  const [event] = await db
    .insert(questionEvents)
    .values({
      ...validatedInput,
      plantId: profile.plantId,
    })
    .returning();
    
  return event;
}

export async function recordActivityEvent(input: CreateActivityEventInput) {
  const validatedInput = createActivityEventSchema.parse(input);
  
  // Get user's plant_id
  const [profile] = await db
    .select({ plantId: profiles.plantId })
    .from(profiles)
    .where(eq(profiles.id, validatedInput.userId));
    
  if (!profile) {
    throw new Error('User profile not found');
  }
  
  const [event] = await db
    .insert(activityEvents)
    .values({
      ...validatedInput,
      plantId: profile.plantId,
    })
    .returning();
    
  return event;
}

export async function getUserQuestionEvents(userId: string, courseId?: string) {
  const whereClause = courseId 
    ? and(eq(questionEvents.userId, userId), eq(questionEvents.courseId, courseId))
    : eq(questionEvents.userId, userId);
    
  return await db
    .select()
    .from(questionEvents)
    .where(whereClause)
    .orderBy(desc(questionEvents.answeredAt));
}

export async function getQuestionDifficulty(plantId: string, courseId: string) {
  return await db
    .select({
      questionKey: questionEvents.questionKey,
      sectionKey: questionEvents.sectionKey,
      totalAttempts: sql<number>`count(*)`,
      correctAttempts: sql<number>`sum(case when ${questionEvents.isCorrect} then 1 else 0 end)`,
      incorrectAttempts: sql<number>`sum(case when ${questionEvents.isCorrect} then 0 else 1 end)`,
      successRate: sql<number>`
        round(
          sum(case when ${questionEvents.isCorrect} then 1 else 0 end)::decimal / count(*) * 100, 
          2
        )
      `,
    })
    .from(questionEvents)
    .where(
      and(
        eq(questionEvents.plantId, plantId),
        eq(questionEvents.courseId, courseId)
      )
    )
    .groupBy(questionEvents.questionKey, questionEvents.sectionKey)
    .orderBy(sql`success_rate ASC`); // Hardest questions first
}

export async function getUserActivityTimeline(userId: string, courseId?: string) {
  const whereClause = courseId 
    ? and(eq(activityEvents.userId, userId), eq(activityEvents.courseId, courseId))
    : eq(activityEvents.userId, userId);
    
  return await db
    .select()
    .from(activityEvents)
    .where(whereClause)
    .orderBy(desc(activityEvents.occurredAt));
}
```

### 5. Reporting Operations

**File**: `src/lib/db/operations/reporting.ts`
```typescript
import { eq, and, sql, desc, count } from 'drizzle-orm';
import { db } from '../index';
import { enrollments, progress, questionEvents, profiles, plants, courses } from '../schema';

export async function getPlantCompletionRate(plantId: string, courseId?: string) {
  const whereClause = courseId 
    ? and(eq(enrollments.plantId, plantId), eq(enrollments.courseId, courseId))
    : eq(enrollments.plantId, plantId);
    
  const [stats] = await db
    .select({
      totalEnrolled: count(),
      completed: sql<number>`sum(case when ${enrollments.status} = 'completed' then 1 else 0 end)`,
      inProgress: sql<number>`sum(case when ${enrollments.status} = 'in_progress' then 1 else 0 end)`,
      notStarted: sql<number>`sum(case when ${enrollments.status} = 'enrolled' then 1 else 0 end)`,
    })
    .from(enrollments)
    .where(whereClause);
    
  const total = stats.totalEnrolled;
  
  return {
    totalEnrolled: total,
    completed: stats.completed,
    inProgress: stats.inProgress,
    notStarted: stats.notStarted,
    completionRate: total > 0 ? (stats.completed / total) * 100 : 0,
  };
}

export async function getPlantProgressSummary(plantId: string) {
  return await db
    .select({
      course: {
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
      },
      totalEnrolled: count(enrollments.id),
      averageProgress: sql<number>`round(avg(${progress.progressPercent}), 2)`,
      completed: sql<number>`sum(case when ${enrollments.status} = 'completed' then 1 else 0 end)`,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .leftJoin(progress, and(
      eq(progress.userId, enrollments.userId),
      eq(progress.courseId, enrollments.courseId)
    ))
    .where(eq(enrollments.plantId, plantId))
    .groupBy(courses.id, courses.title, courses.slug);
}

export async function getMostMissedQuestions(plantId: string, courseId: string, limit = 10) {
  return await db
    .select({
      questionKey: questionEvents.questionKey,
      sectionKey: questionEvents.sectionKey,
      totalAttempts: count(),
      incorrectAttempts: sql<number>`sum(case when ${questionEvents.isCorrect} = false then 1 else 0 end)`,
      missRate: sql<number>`
        round(
          sum(case when ${questionEvents.isCorrect} = false then 1 else 0 end)::decimal / count(*) * 100, 
          2
        )
      `,
    })
    .from(questionEvents)
    .where(
      and(
        eq(questionEvents.plantId, plantId),
        eq(questionEvents.courseId, courseId)
      )
    )
    .groupBy(questionEvents.questionKey, questionEvents.sectionKey)
    .having(sql`count(*) >= 5`) // Only questions with sufficient attempts
    .orderBy(desc(sql`miss_rate`))
    .limit(limit);
}

export async function getUserActivitySummary(userId: string) {
  return await db
    .select({
      course: {
        id: courses.id,
        title: courses.title,
      },
      enrollment: {
        status: enrollments.status,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
      },
      progress: {
        progressPercent: progress.progressPercent,
        currentSection: progress.currentSection,
        lastActiveAt: progress.lastActiveAt,
      },
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .leftJoin(progress, and(
      eq(progress.userId, enrollments.userId),
      eq(progress.courseId, enrollments.courseId)
    ))
    .where(eq(enrollments.userId, userId));
}

export async function getOrgWideCompletionStats() {
  return await db
    .select({
      plant: {
        id: plants.id,
        name: plants.name,
      },
      totalUsers: count(profiles.id),
      totalEnrollments: sql<number>`count(${enrollments.id})`,
      completedEnrollments: sql<number>`sum(case when ${enrollments.status} = 'completed' then 1 else 0 end)`,
      averageProgress: sql<number>`round(avg(${progress.progressPercent}), 2)`,
    })
    .from(plants)
    .leftJoin(profiles, eq(profiles.plantId, plants.id))
    .leftJoin(enrollments, eq(enrollments.userId, profiles.id))
    .leftJoin(progress, and(
      eq(progress.userId, profiles.id),
      eq(progress.courseId, enrollments.courseId)
    ))
    .where(eq(plants.isActive, true))
    .groupBy(plants.id, plants.name);
}
```

---

## Security & RLS Implementation

### Row Level Security Policies

Create these policies in your Supabase SQL editor or migration files:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can see their own profile, admins can see all/plant-scoped
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "HR Admins can view all profiles" ON profiles
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'hr_admin'
    )
  );

CREATE POLICY "Plant Managers can view their plant profiles" ON profiles
  FOR SELECT 
  TO authenticated 
  USING (
    plant_id IN (
      SELECT plant_id FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'plant_manager'
    )
  );

-- Enrollments: Plant-scoped access
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Plant Managers can view plant enrollments" ON enrollments
  FOR SELECT 
  TO authenticated 
  USING (
    plant_id IN (
      SELECT plant_id FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'plant_manager'
    )
  );

CREATE POLICY "HR Admins can view all enrollments" ON enrollments
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'hr_admin'
    )
  );

-- Progress: Same pattern as enrollments
CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Plant Managers can view plant progress" ON progress
  FOR SELECT 
  TO authenticated 
  USING (
    plant_id IN (
      SELECT plant_id FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'plant_manager'
    )
  );

CREATE POLICY "HR Admins can view all progress" ON progress
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'hr_admin'
    )
  );

-- Question Events: Plant-scoped read access, user insert only
CREATE POLICY "Users can insert own question events" ON question_events
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Plant Managers can view plant question events" ON question_events
  FOR SELECT 
  TO authenticated 
  USING (
    plant_id IN (
      SELECT plant_id FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'plant_manager'
    )
  );

CREATE POLICY "HR Admins can view all question events" ON question_events
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'hr_admin'
    )
  );

-- Activity Events: Similar to question events
CREATE POLICY "Users can insert own activity events" ON activity_events
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Plant Managers can view plant activity events" ON activity_events
  FOR SELECT 
  TO authenticated 
  USING (
    plant_id IN (
      SELECT plant_id FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'plant_manager'
    )
  );

CREATE POLICY "HR Admins can view all activity events" ON activity_events
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() AND role = 'hr_admin'
    )
  );

-- Courses and Plants: Read-only for authenticated users
CREATE POLICY "Authenticated users can view published courses" ON courses
  FOR SELECT 
  TO authenticated 
  USING (is_published = true);

CREATE POLICY "Authenticated users can view active plants" ON plants
  FOR SELECT 
  TO authenticated 
  USING (is_active = true);
```

---

## Migration Strategy

### 1. Create Migration Files

**File**: `drizzle/0001_initial_schema.sql`
```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended');
CREATE TYPE "public"."enrollment_status" AS ENUM('enrolled', 'in_progress', 'completed');
CREATE TYPE "public"."admin_role" AS ENUM('hr_admin', 'dev_admin', 'plant_manager');
CREATE TYPE "public"."event_type" AS ENUM('view_section', 'start_course', 'complete_course');

-- Create tables
CREATE TABLE "public"."plants" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL UNIQUE,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "public"."profiles" (
  "id" uuid PRIMARY KEY, -- References auth.users(id)
  "plant_id" uuid NOT NULL REFERENCES "public"."plants"("id"),
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "email" text NOT NULL,
  "job_title" text,
  "status" "public"."user_status" DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Continue with other tables...
-- (Include all table definitions from schema.ts)

-- Create indexes
CREATE INDEX "profiles_plant_id_idx" ON "public"."profiles" ("plant_id");
CREATE INDEX "profiles_email_idx" ON "public"."profiles" ("email");
-- (Include all other indexes)

-- Create unique constraints
ALTER TABLE "public"."admin_roles" ADD CONSTRAINT "admin_roles_user_role_plant_unique" UNIQUE("user_id", "role", "plant_id");
-- (Include all other unique constraints)
```

### 2. Seed Data

**File**: `drizzle/seed.sql`
```sql
-- Insert initial plants
INSERT INTO plants (name) VALUES 
  ('Columbus, OH'),
  ('Phoenix, AZ'),
  ('Dallas, TX'),
  ('Atlanta, GA'),
  ('Denver, CO'),
  ('Seattle, WA');

-- Insert initial course
INSERT INTO courses (slug, title, version, is_published) VALUES 
  ('function-specific-hazmat', 'Function-Specific HazMat Training', '1.0', true);

-- Note: User profiles will be created via triggers when users sign up
```

### 3. Profile Creation Trigger

```sql
-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  default_plant_id uuid;
BEGIN
  -- Get a default plant (or you could require this in signup)
  SELECT id INTO default_plant_id FROM plants WHERE name = 'Columbus, OH' LIMIT 1;
  
  INSERT INTO public.profiles (id, plant_id, first_name, last_name, email)
  VALUES (
    NEW.id, 
    default_plant_id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4. Run Migrations

```bash
# Generate migration
npx drizzle-kit generate

# Push to database
npx drizzle-kit push

# Or use migration files
npx drizzle-kit migrate
```

---

## Testing & Validation

### 1. Database Connection Test

**File**: `src/lib/db/__tests__/connection.test.ts`
```typescript
import { db } from '../index';
import { plants } from '../schema';

describe('Database Connection', () => {
  test('should connect to database', async () => {
    const result = await db.select().from(plants).limit(1);
    expect(Array.isArray(result)).toBe(true);
  });
});
```

### 2. RLS Policy Test

```sql
-- Test RLS policies
-- Create test users and verify they can only access appropriate data

-- Test as regular user
SET ROLE authenticated;
SET "request.jwt.claims" TO '{"sub": "test-user-id", "role": "authenticated"}';

-- Should only see own data
SELECT * FROM profiles WHERE id = 'test-user-id';

-- Test as plant manager
-- Should see plant-scoped data
SELECT * FROM enrollments WHERE plant_id = 'test-plant-id';
```

### 3. Validation Test

**File**: `src/lib/validations/__tests__/enrollment.test.ts`
```typescript
import { createEnrollmentSchema } from '../enrollment';

describe('Enrollment Validation', () => {
  test('should validate correct enrollment data', () => {
    const validData = {
      userId: '123e4567-e89b-12d3-a456-426614174000',
      courseId: '123e4567-e89b-12d3-a456-426614174001',
      plantId: '123e4567-e89b-12d3-a456-426614174002',
    };

    expect(() => createEnrollmentSchema.parse(validData)).not.toThrow();
  });

  test('should reject invalid UUID', () => {
    const invalidData = {
      userId: 'invalid-uuid',
      courseId: '123e4567-e89b-12d3-a456-426614174001',
      plantId: '123e4567-e89b-12d3-a456-426614174002',
    };

    expect(() => createEnrollmentSchema.parse(invalidData)).toThrow();
  });
});
```

---

## Performance Optimization

### 1. Index Optimization

Monitor query performance and add indexes as needed:

```sql
-- Add composite indexes for common query patterns
CREATE INDEX CONCURRENTLY "enrollments_user_status_idx" 
ON enrollments (user_id, status);

CREATE INDEX CONCURRENTLY "question_events_plant_question_answered_idx" 
ON question_events (plant_id, question_key, answered_at DESC);

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY "profiles_active_plant_idx" 
ON profiles (plant_id) WHERE status = 'active';
```

### 2. Query Optimization

Use `EXPLAIN ANALYZE` to optimize slow queries:

```sql
EXPLAIN ANALYZE 
SELECT * FROM enrollments e
JOIN progress p ON e.user_id = p.user_id AND e.course_id = p.course_id
WHERE e.plant_id = 'plant-uuid' AND e.status = 'in_progress';
```

### 3. Connection Pooling

For production, consider using a connection pool:

```typescript
// For high-traffic production apps
const poolClient = postgres(connectionString, { 
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All migrations tested in staging
- [ ] RLS policies validated
- [ ] Seed data prepared
- [ ] Environment variables configured
- [ ] Database backups enabled

### Deployment Steps
1. [ ] Run migrations against production database
2. [ ] Execute seed data scripts
3. [ ] Enable RLS policies
4. [ ] Create auth triggers
5. [ ] Verify connection from application
6. [ ] Test user creation flow
7. [ ] Validate plant-scoped data access

### Post-Deployment
- [ ] Monitor query performance
- [ ] Check error logs
- [ ] Verify auth integration
- [ ] Test all user roles
- [ ] Validate reporting queries

### Monitoring
- [ ] Set up query performance monitoring
- [ ] Monitor RLS policy effectiveness
- [ ] Track user enrollment patterns
- [ ] Monitor question event volume

---

## Conclusion

This guide provides a complete foundation for implementing the SpecChem Safety Training database. The architecture supports:

- **Multi-tenant security** with plant-based isolation
- **Scalable analytics** through event-driven design
- **Flexible user management** with role-based access
- **Performance optimization** through proper indexing
- **Future extensibility** for quiz authoring and advanced features

Follow this guide step-by-step to implement a robust, secure, and scalable LMS database that meets all the requirements outlined in your schema narrative.

## Next Steps

1. **Implement Phase 1**: Set up dependencies and basic configuration
2. **Create Core Schema**: Implement tables and relationships
3. **Set up Auth Integration**: Configure Supabase clients and middleware
4. **Implement RLS**: Create and test security policies
5. **Build Operations Layer**: Create helper functions and validation
6. **Test Thoroughly**: Validate all access patterns and business rules
7. **Deploy to Production**: Follow deployment checklist
8. **Monitor and Optimize**: Track performance and user patterns