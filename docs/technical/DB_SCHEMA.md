# SpecChem Safety Training Database Schema Documentation

**Date:** 2025-01-10  
**Purpose:** Technical reference  
**Status:** Complete  
**Audience:** Technical

# SpecChem Safety Training Database Schema Documentation

## Overview

This document provides a comprehensive overview of the SpecChem Safety Training database schema. The database uses PostgreSQL with Row Level Security (RLS) policies for multi-tenant isolation and role-based access control.

**Database Version:** PostgreSQL (Supabase)  
**Last Updated:** January 10, 2025  
**Schema Version:** 1.0  
**Implementation:** Drizzle ORM with Zod validation

---

## Database Statistics

- **Tables:** 8
- **Columns:** 64 total
- **Enums:** 4
- **Indexes:** 12
- **Foreign Keys:** 15
- **Unique Constraints:** 6
- **Primary Keys:** 8

---

## Enums

### `admin_role`

Administrative role types for user access control.

- `hr_admin` - Human Resources Administrator (global access)
- `dev_admin` - Developer Administrator (global access)
- `plant_manager` - Plant Manager (plant-specific access)

### `enrollment_status`

Course enrollment progress states.

- `enrolled` - User is enrolled but hasn't started
- `in_progress` - User has started the course
- `completed` - User has completed the course

### `event_type`

Types of user activity events for tracking.

- `view_section` - User viewed a course section
- `start_course` - User started a course
- `complete_course` - User completed a course

### `user_status`

User account status.

- `active` - User account is active
- `suspended` - User account is suspended

---

## Tables

### 1. `plants`

**Purpose:** SpecChem facility/location management for multi-tenant isolation.

| Column       | Type      | Nullable | Default             | Description             |
| ------------ | --------- | -------- | ------------------- | ----------------------- |
| `id`         | uuid      | NO       | `gen_random_uuid()` | Primary key             |
| `name`       | text      | NO       | -                   | Plant name (unique)     |
| `is_active`  | boolean   | NO       | `true`              | Whether plant is active |
| `created_at` | timestamp | NO       | `now()`             | Record creation time    |
| `updated_at` | timestamp | NO       | `now()`             | Last update time        |

**Constraints:**

- Primary Key: `plants_pkey` on `id`
- Unique: `plants_name_unique` on `name`

**Indexes:**

- Primary key index on `id`

---

### 2. `profiles`

**Purpose:** User profile information linked to Supabase Auth users.

| Column       | Type        | Nullable | Default    | Description                                  |
| ------------ | ----------- | -------- | ---------- | -------------------------------------------- |
| `id`         | uuid        | NO       | -          | Primary key (matches Supabase auth.users.id) |
| `plant_id`   | uuid        | NO       | -          | Foreign key to plants table                  |
| `first_name` | text        | NO       | -          | User's first name                            |
| `last_name`  | text        | NO       | -          | User's last name                             |
| `email`      | text        | NO       | -          | User's email address                         |
| `job_title`  | text        | YES      | -          | User's job title                             |
| `status`     | user_status | NO       | `'active'` | User account status                          |
| `created_at` | timestamp   | NO       | `now()`    | Record creation time                         |
| `updated_at` | timestamp   | NO       | `now()`    | Last update time                             |

**Constraints:**

- Primary Key: `profiles_pkey` on `id`
- Foreign Key: `profiles_plant_id_plants_id_fk` references `plants(id)`

**Indexes:**

- Primary key index on `id`
- `profiles_email_idx` on `email`
- `profiles_plant_id_idx` on `plant_id`

---

### 3. `admin_roles`

**Purpose:** Administrative role assignments for users.

| Column       | Type       | Nullable | Default             | Description                         |
| ------------ | ---------- | -------- | ------------------- | ----------------------------------- |
| `id`         | uuid       | NO       | `gen_random_uuid()` | Primary key                         |
| `user_id`    | uuid       | NO       | -                   | Foreign key to profiles table       |
| `role`       | admin_role | NO       | -                   | Administrative role type            |
| `plant_id`   | uuid       | YES      | -                   | Plant scope (NULL for global roles) |
| `created_at` | timestamp  | NO       | `now()`             | Record creation time                |
| `updated_at` | timestamp  | NO       | `now()`             | Last update time                    |

**Constraints:**

- Primary Key: `admin_roles_pkey` on `id`
- Foreign Key: `admin_roles_user_id_profiles_id_fk` references `profiles(id)` ON DELETE CASCADE
- Foreign Key: `admin_roles_plant_id_plants_id_fk` references `plants(id)`
- Unique: `admin_roles_user_role_plant_unique` on `(user_id, role, plant_id)`

**Indexes:**

- Primary key index on `id`
- `admin_roles_user_id_idx` on `user_id`

---

### 4. `courses`

**Purpose:** Training course definitions.

| Column         | Type      | Nullable | Default             | Description                             |
| -------------- | --------- | -------- | ------------------- | --------------------------------------- |
| `id`           | uuid      | NO       | `gen_random_uuid()` | Primary key                             |
| `slug`         | text      | NO       | -                   | URL-friendly course identifier (unique) |
| `title`        | text      | NO       | -                   | Course display title                    |
| `version`      | text      | NO       | `'1.0'`             | Course version                          |
| `is_published` | boolean   | NO       | `false`             | Whether course is published             |
| `created_at`   | timestamp | NO       | `now()`             | Record creation time                    |
| `updated_at`   | timestamp | NO       | `now()`             | Last update time                        |

**Constraints:**

- Primary Key: `courses_pkey` on `id`
- Unique: `courses_slug_unique` on `slug`

**Indexes:**

- Primary key index on `id`

---

### 5. `enrollments`

**Purpose:** User course enrollment tracking.

| Column         | Type              | Nullable | Default             | Description                   |
| -------------- | ----------------- | -------- | ------------------- | ----------------------------- |
| `id`           | uuid              | NO       | `gen_random_uuid()` | Primary key                   |
| `user_id`      | uuid              | NO       | -                   | Foreign key to profiles table |
| `course_id`    | uuid              | NO       | -                   | Foreign key to courses table  |
| `plant_id`     | uuid              | NO       | -                   | Foreign key to plants table   |
| `status`       | enrollment_status | NO       | `'enrolled'`        | Enrollment status             |
| `enrolled_at`  | timestamp         | NO       | `now()`             | Enrollment date               |
| `completed_at` | timestamp         | YES      | -                   | Completion date               |
| `created_at`   | timestamp         | NO       | `now()`             | Record creation time          |
| `updated_at`   | timestamp         | NO       | `now()`             | Last update time              |

**Constraints:**

- Primary Key: `enrollments_pkey` on `id`
- Foreign Key: `enrollments_user_id_profiles_id_fk` references `profiles(id)` ON DELETE CASCADE
- Foreign Key: `enrollments_course_id_courses_id_fk` references `courses(id)` ON DELETE CASCADE
- Foreign Key: `enrollments_plant_id_plants_id_fk` references `plants(id)`
- Unique: `enrollments_user_course_unique` on `(user_id, course_id)`

**Indexes:**

- Primary key index on `id`
- `enrollments_plant_course_idx` on `(plant_id, course_id)`
- `enrollments_status_idx` on `status`

---

### 6. `progress`

**Purpose:** User course progress tracking.

| Column             | Type      | Nullable | Default             | Description                   |
| ------------------ | --------- | -------- | ------------------- | ----------------------------- |
| `id`               | uuid      | NO       | `gen_random_uuid()` | Primary key                   |
| `user_id`          | uuid      | NO       | -                   | Foreign key to profiles table |
| `course_id`        | uuid      | NO       | -                   | Foreign key to courses table  |
| `plant_id`         | uuid      | NO       | -                   | Foreign key to plants table   |
| `progress_percent` | integer   | NO       | `0`                 | Completion percentage (0-100) |
| `current_section`  | text      | YES      | -                   | Current section identifier    |
| `last_active_at`   | timestamp | NO       | `now()`             | Last activity timestamp       |
| `created_at`       | timestamp | NO       | `now()`             | Record creation time          |
| `updated_at`       | timestamp | NO       | `now()`             | Last update time              |

**Constraints:**

- Primary Key: `progress_pkey` on `id`
- Foreign Key: `progress_user_id_profiles_id_fk` references `profiles(id)` ON DELETE CASCADE
- Foreign Key: `progress_course_id_courses_id_fk` references `courses(id)` ON DELETE CASCADE
- Foreign Key: `progress_plant_id_plants_id_fk` references `plants(id)`
- Unique: `progress_user_course_unique` on `(user_id, course_id)`

**Indexes:**

- Primary key index on `id`
- `progress_plant_course_idx` on `(plant_id, course_id)`

---

### 7. `question_events`

**Purpose:** Question response tracking for analytics.

| Column          | Type      | Nullable | Default             | Description                   |
| --------------- | --------- | -------- | ------------------- | ----------------------------- |
| `id`            | uuid      | NO       | `gen_random_uuid()` | Primary key                   |
| `user_id`       | uuid      | NO       | -                   | Foreign key to profiles table |
| `course_id`     | uuid      | NO       | -                   | Foreign key to courses table  |
| `plant_id`      | uuid      | NO       | -                   | Foreign key to plants table   |
| `section_key`   | text      | NO       | -                   | Section identifier            |
| `question_key`  | text      | NO       | -                   | Question identifier           |
| `is_correct`    | boolean   | NO       | -                   | Whether answer was correct    |
| `attempt_index` | integer   | NO       | `1`                 | Attempt number                |
| `response_meta` | jsonb     | YES      | -                   | Additional response metadata  |
| `answered_at`   | timestamp | NO       | `now()`             | When question was answered    |
| `created_at`    | timestamp | NO       | `now()`             | Record creation time          |

**Constraints:**

- Primary Key: `question_events_pkey` on `id`
- Foreign Key: `question_events_user_id_profiles_id_fk` references `profiles(id)` ON DELETE CASCADE
- Foreign Key: `question_events_course_id_courses_id_fk` references `courses(id)` ON DELETE CASCADE
- Foreign Key: `question_events_plant_id_plants_id_fk` references `plants(id)`

**Indexes:**

- Primary key index on `id`
- `question_events_answered_at_idx` on `answered_at`
- `question_events_plant_course_question_idx` on `(plant_id, course_id, question_key)`
- `question_events_user_question_idx` on `(user_id, question_key)`

---

### 8. `activity_events`

**Purpose:** User activity tracking for analytics and compliance.

| Column        | Type       | Nullable | Default             | Description                   |
| ------------- | ---------- | -------- | ------------------- | ----------------------------- |
| `id`          | uuid       | NO       | `gen_random_uuid()` | Primary key                   |
| `user_id`     | uuid       | NO       | -                   | Foreign key to profiles table |
| `course_id`   | uuid       | NO       | -                   | Foreign key to courses table  |
| `plant_id`    | uuid       | NO       | -                   | Foreign key to plants table   |
| `event_type`  | event_type | NO       | -                   | Type of activity event        |
| `meta`        | jsonb      | YES      | -                   | Additional event metadata     |
| `occurred_at` | timestamp  | NO       | `now()`             | When event occurred           |
| `created_at`  | timestamp  | NO       | `now()`             | Record creation time          |

**Constraints:**

- Primary Key: `activity_events_pkey` on `id`
- Foreign Key: `activity_events_user_id_profiles_id_fk` references `profiles(id)` ON DELETE CASCADE
- Foreign Key: `activity_events_course_id_courses_id_fk` references `courses(id)` ON DELETE CASCADE
- Foreign Key: `activity_events_plant_id_plants_id_fk` references `plants(id)`

**Indexes:**

- Primary key index on `id`
- `activity_events_occurred_at_idx` on `occurred_at`
- `activity_events_plant_course_event_idx` on `(plant_id, course_id, event_type)`
- `activity_events_user_event_idx` on `(user_id, event_type)`

---

## Relationships

### Primary Relationships

1. **Plants → Profiles**: One-to-Many
   - Each plant can have multiple users
   - Each user belongs to exactly one plant

2. **Profiles → Admin Roles**: One-to-Many
   - Each user can have multiple admin roles
   - Each admin role belongs to one user

3. **Courses → Enrollments**: One-to-Many
   - Each course can have multiple enrollments
   - Each enrollment is for one course

4. **Users → Enrollments**: One-to-Many
   - Each user can have multiple enrollments
   - Each enrollment belongs to one user

5. **Users → Progress**: One-to-Many
   - Each user can have progress for multiple courses
   - Each progress record belongs to one user

### Cross-Reference Relationships

- **Enrollments**: Links Users, Courses, and Plants
- **Progress**: Links Users, Courses, and Plants
- **Activity Events**: Links Users, Courses, and Plants with event tracking
- **Question Events**: Links Users, Courses, and Plants with question responses

---

## Security Features

### Row Level Security (RLS)

- **Enabled** on all tables
- **Tenant Isolation**: Plant-based data separation
- **Role-Based Access**: Admin roles control data access scope

### Cascade Deletions

- User deletion cascades to all related records
- Course deletion cascades to enrollments and progress
- Plant references are protected (no cascade)

### Data Integrity

- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate enrollments and progress records
- Enum constraints ensure valid status values

---

## Indexes and Performance

### Optimized for:

- **Plant-based queries**: Multi-tenant data access
- **User activity lookups**: Progress and enrollment queries
- **Time-based analytics**: Event timestamp queries
- **Course analytics**: Plant and course performance metrics

### Key Indexes:

- Plant-based filtering on all tenant-isolated tables
- User-based queries for profile and progress lookups
- Time-based queries for activity and question events
- Status-based filtering for enrollments and users

---

## Current Data

### Seeded Plants (8 total):

- Columbus, OH - Corporate (Corporate HQ)
- Atlanta, GA
- Denver, CO
- Seattle, WA
- Phoenix, AZ
- Dallas, TX
- Chicago, IL
- Miami, FL

### Seeded Courses (2 total):

- Function-Specific HazMat Training (English)
- Capacitación Específica de HazMat por Función (Spanish)

---

## Schema Evolution

### Migration History:

- **Initial Schema**: 8 tables, 4 enums, comprehensive RLS policies
- **Auto-enrollment**: Trigger-based user profile creation
- **Multi-tenant**: Plant-based data isolation

### Future Considerations:

- Additional course types and categories
- Advanced user roles and permissions
- Enhanced analytics and reporting tables
- Integration with external training systems

---

## Implementation Details

### Drizzle ORM Schema

The database schema is implemented using Drizzle ORM with the following key files:

- **Schema Definition:** `drizzle/schema.ts` - Complete table definitions with constraints
- **Relations:** `drizzle/relations.ts` - Relationship mappings between tables
- **Zod Validation:** `src/lib/schemas.ts` - Runtime validation schemas matching database structure

### Type Safety

- **100% Type Safety:** All database operations are fully typed with TypeScript
- **Runtime Validation:** Zod schemas ensure data integrity at runtime
- **Schema Alignment:** Database schema, TypeScript types, and Zod schemas are perfectly aligned

### Migration Management

- **Drizzle Kit:** Automated migration generation and management
- **Version Control:** All schema changes tracked in migration files
- **Rollback Support:** Safe rollback capabilities for schema changes

---

**Generated:** January 10, 2025  
**Source:** Direct database introspection via Drizzle Kit  
**Database:** SpecChem Safety Training (Supabase PostgreSQL)  
**Validation:** Confirmed alignment with Drizzle schema and Zod validation
