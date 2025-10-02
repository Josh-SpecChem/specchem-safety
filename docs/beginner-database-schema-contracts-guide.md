# Database Schema Contracts Guide for Beginners

**Date:** 2025-01-10  
**Purpose:** Personal learning notes for database schema management  
**Audience:** Beginner developers  
**Status:** Complete

---

## 🎯 Overview

This guide explains all the database schema contracts, types, and validation layers you need to understand when working with anything that touches the database in this SpecChem Safety Training application. It covers Drizzle ORM, Zod validation, Supabase, and how to keep everything aligned.

## 📚 Table of Contents

1. [The Big Picture](#the-big-picture)
2. [Database Schema Layer (Drizzle ORM)](#database-schema-layer-drizzle-orm)
3. [Validation Layer (Zod Schemas)](#validation-layer-zod-schemas)
4. [TypeScript Types Layer](#typescript-types-layer)
5. [API Routes Layer](#api-routes-layer)
6. [Testing & Alignment](#testing--alignment)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ The Big Picture

Your application has **4 main layers** that must stay synchronized:

```
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                         │
│  (Next.js API routes in src/app/api/)                      │
│  - Standardized route handlers with RouteUtils             │
│  - Unified authentication and validation                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 TypeScript Types Layer                      │
│  (src/types/database.ts - inferred from Zod schemas)       │
│  - 100% type safety from database to UI                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Zod Validation Layer                       │
│  (src/lib/schemas.ts - runtime validation)                 │
│  - Comprehensive schemas aligned with database             │
│  - Form validation, API validation, data integrity         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Database Schema Layer                        │
│  (drizzle/schema.ts + drizzle/relations.ts)                │
│  - Drizzle ORM with PostgreSQL                             │
│  - Complete table definitions with constraints             │
│  - Relationship mappings and foreign keys                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Database                        │
│  (PostgreSQL with RLS policies)                            │
└─────────────────────────────────────────────────────────────┘
```

**Key Principle:** Changes flow DOWNWARD. You modify the database schema first, then update Zod schemas, then TypeScript types are automatically inferred, and finally API routes use the validated types.

---

## 🗄️ Database Schema Layer (Drizzle ORM)

### Location: `drizzle/schema.ts`

This is your **source of truth** for the actual database structure.

### Core Tables

```typescript
// 1. Plants (Multi-tenant isolation)
export const plants = pgTable("plants", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// 2. Profiles (Users)
export const profiles = pgTable("profiles", {
  id: uuid().primaryKey().notNull(),
  plantId: uuid("plant_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text().notNull(),
  jobTitle: text("job_title"),
  status: userStatus().default("active").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// 3. Courses
export const courses = pgTable("courses", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  slug: text().notNull(),
  title: text().notNull(),
  version: text().default("1.0").notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// 4. Enrollments (User-Course relationships)
export const enrollments = pgTable("enrollments", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  courseId: uuid("course_id").notNull(),
  plantId: uuid("plant_id").notNull(),
  status: enrollmentStatus().default("enrolled").notNull(),
  enrolledAt: timestamp("enrolled_at", { mode: "string" })
    .defaultNow()
    .notNull(),
  completedAt: timestamp("completed_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// 5. Progress (Course completion tracking)
export const progress = pgTable("progress", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  courseId: uuid("course_id").notNull(),
  plantId: uuid("plant_id").notNull(),
  progressPercent: integer("progress_percent").default(0).notNull(),
  currentSection: text("current_section"),
  lastActiveAt: timestamp("last_active_at", { mode: "string" })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// 6. Admin Roles (Role-based access control)
export const adminRoles = pgTable("admin_roles", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  role: adminRole().notNull(),
  plantId: uuid("plant_id"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// 7. Activity Events (User behavior tracking)
export const activityEvents = pgTable("activity_events", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  courseId: uuid("course_id").notNull(),
  plantId: uuid("plant_id").notNull(),
  eventType: eventType("event_type").notNull(),
  meta: jsonb(),
  occurredAt: timestamp("occurred_at", { mode: "string" })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

// 8. Question Events (Quiz analytics)
export const questionEvents = pgTable("question_events", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  courseId: uuid("course_id").notNull(),
  plantId: uuid("plant_id").notNull(),
  sectionKey: text("section_key").notNull(),
  questionKey: text("question_key").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptIndex: integer("attempt_index").default(1).notNull(),
  responseMeta: jsonb("response_meta"),
  answeredAt: timestamp("answered_at", { mode: "string" })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});
```

### Enums

```typescript
export const adminRole = pgEnum("admin_role", [
  "hr_admin",
  "dev_admin",
  "plant_manager",
]);
export const enrollmentStatus = pgEnum("enrollment_status", [
  "enrolled",
  "in_progress",
  "completed",
]);
export const eventType = pgEnum("event_type", [
  "view_section",
  "start_course",
  "complete_course",
]);
export const userStatus = pgEnum("user_status", ["active", "suspended"]);
```

### Relationships

Location: `drizzle/relations.ts`

```typescript
// Example: Profile relationships
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  plant: one(plants, {
    fields: [profiles.plantId],
    references: [plants.id],
  }),
  adminRoles: many(adminRoles),
  enrollments: many(enrollments),
  progresses: many(progress),
  activityEvents: many(activityEvents),
  questionEvents: many(questionEvents),
}));
```

---

## ✅ Validation Layer (Zod Schemas)

### Location: `src/lib/schemas.ts`

This is your **runtime validation** layer. Every database operation should validate data through these schemas.

### Schema Categories

#### 1. Enum Schemas (Must match database enums exactly)

```typescript
export const adminRoleSchema = z.enum([
  "hr_admin",
  "dev_admin",
  "plant_manager",
]);
export const enrollmentStatusSchema = z.enum([
  "enrolled",
  "in_progress",
  "completed",
]);
export const eventTypeSchema = z.enum([
  "view_section",
  "start_course",
  "complete_course",
]);
export const userStatusSchema = z.enum(["active", "suspended"]);
```

#### 2. Base Table Schemas (Must match database structure exactly)

```typescript
// Example: Plant schema
export const plantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Plant name is required"),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

#### 3. CRUD Operation Schemas

```typescript
// Create schemas (for POST requests)
export const createPlantSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  isActive: z.boolean().default(true).optional(),
});

// Update schemas (for PATCH requests)
export const updatePlantSchema = z.object({
  name: z.string().min(1, "Plant name is required").optional(),
  isActive: z.boolean().optional(),
});
```

#### 4. Filter Schemas (for query parameters)

```typescript
export const plantFilterSchema = z
  .object({
    isActive: z.coerce.boolean().optional(),
  })
  .merge(paginationSchema);

export const userFiltersSchema = z
  .object({
    plantId: z.string().uuid().optional(),
    status: userStatusSchema.optional(),
    role: adminRoleSchema.optional(),
    search: z.string().optional(),
  })
  .merge(paginationSchema);
```

#### 5. Composite Schemas (with relationships)

```typescript
export const profileWithPlantSchema = profileSchema.extend({
  plant: plantSchema,
});

export const enrollmentWithRelationsSchema = enrollmentSchema.extend({
  profile: profileSchema,
  course: courseSchema,
  plant: plantSchema,
});
```

#### 6. API Response Schemas

```typescript
export const apiResponseSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const paginatedResponseSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    success: z.boolean(),
    data: z.object({
      items: z.array(itemSchema),
      total: z.number().int().min(0),
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      totalPages: z.number().int().min(0),
    }),
    error: z.string().optional(),
    message: z.string().optional(),
  });
```

---

## 🔤 TypeScript Types Layer

### Location: `src/types/database.ts`

This layer **automatically infers types** from your Zod schemas. You rarely need to manually define types here.

### Type Inference Pattern

```typescript
// Base entity types (inferred from Zod schemas)
export type Profile = z.infer<typeof profileSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Plant = z.infer<typeof plantSchema>;

// CRUD operation types
export type CreateProfile = z.infer<typeof createProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Filter types
export type UserFilters = z.infer<typeof userFiltersSchema>;
export type CourseFilters = z.infer<typeof courseFilterSchema>;

// Composite types
export type ProfileWithDetails = z.infer<typeof profileWithPlantSchema>;
```

### Extended Interface Types (for complex relationships)

```typescript
export interface ProfileWithDetails extends Profile {
  plant: Plant;
  adminRoles: AdminRoleRecord[];
  enrollments: EnrollmentWithDetails[];
}

export interface EnrollmentWithDetails extends Enrollment {
  profile: Profile;
  course: Course;
  plant: Plant;
  progress?: Progress;
}
```

---

## 🛣️ API Routes Layer

### Location: `src/app/api/`

This is where you **use** all the schemas and types you've defined.

### Standard API Route Pattern

```typescript
// Example: src/app/api/admin/users/route.ts
import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { CommonSchemas } from "@/app/api/shared/utils/validation-utils";
import type { CreateProfile } from "@/types";

// GET /api/admin/users - List users with filtering
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req) || {};
      const result = await UserOperationsCompat.getUsersWithDetails(
        query as any,
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      return RouteUtils.createSuccessResponse(result.data);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: CommonSchemas.userFilters, // ← Zod validation
    },
  );
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = await req.json();
      const validatedData = CommonSchemas.createUser.parse(body); // ← Zod validation

      const result = await UserOperationsCompat.createUser(validatedData);

      if (!result.success) {
        throw new Error(result.error);
      }

      return RouteUtils.createSuccessResponse(result.data);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateBody: CommonSchemas.createUser, // ← Zod validation
    },
  );
}
```

### Database Operations Pattern

```typescript
// Example: src/lib/db/operations.ts
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import type { CreateProfile, UpdateProfile } from "../schemas";

export async function createProfile(
  data: CreateProfile,
): Promise<DatabaseResponse<Profile>> {
  return withDatabaseOperation(async () => {
    const [profile] = await db.insert(profiles).values(data).returning();
    return profile;
  });
}

export async function getProfile(
  id: string,
): Promise<DatabaseResponse<ProfileWithDetails | null>> {
  return withDatabaseOperation(async () => {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, id),
      with: {
        plant: true,
        adminRoles: true,
        enrollments: {
          with: {
            course: true,
          },
        },
      },
    });
    return profile;
  });
}
```

---

## 🧪 Testing & Alignment

### Testing Scripts Available

#### 1. Comprehensive Integration Test

```bash
node scripts/test-integrations.js
```

Tests:

- Drizzle ORM connection
- Zod validation
- Schema compatibility
- Type inference

#### 2. Drizzle-Zod Compatibility Test

```bash
node scripts/test-drizzle-zod.js
```

Tests:

- Database connection
- Schema validation
- Type safety
- Data compatibility

#### 3. Database Verification

```bash
node scripts/verify-database.js
```

Checks:

- All tables exist
- Required data is present
- Schema integrity

#### 4. API Test Endpoint

```bash
curl http://localhost:3000/api/test/comprehensive
```

Tests:

- Database operations
- Zod validation
- Type safety
- Error handling

### Manual Alignment Checks

#### 1. Check Schema Alignment

```typescript
// In any API route, add this test:
const testData = {
  id: "test-uuid",
  name: "Test Plant",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// This should not throw an error
const validated = plantSchema.parse(testData);
console.log("Schema alignment: ✅");
```

#### 2. Check Type Inference

```typescript
// This should give you proper TypeScript intellisense
const profile: Profile = {
  id: "uuid",
  plantId: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  // TypeScript should autocomplete these fields
};
```

#### 3. Check Database Operations

```typescript
// Test database operation
const result = await createProfile({
  id: "uuid",
  plantId: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
});

if (result.success) {
  console.log("Database operation: ✅");
} else {
  console.log("Database error:", result.error);
}
```

---

## 🎯 Best Practices

### 1. Schema-First Development

**Always start with the database schema:**

1. Modify `drizzle/schema.ts`
2. Run `drizzle-kit generate` to create migration
3. Update `src/lib/schemas.ts` to match
4. TypeScript types are automatically inferred
5. Update API routes to use new schemas

### 2. Validation Everywhere

**Never trust user input:**

```typescript
// ✅ Good: Always validate
const validatedData = createUserSchema.parse(requestBody);

// ❌ Bad: Direct usage
const user = await createUser(requestBody);
```

### 3. Consistent Error Handling

**Use the standardized error wrapper:**

```typescript
export async function withDatabaseOperation<T>(
  operation: () => Promise<T>,
): Promise<DatabaseResponse<T>> {
  try {
    const data = await operation();
    return { data, success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown database error",
      code: error instanceof DatabaseError ? error.code : "UNKNOWN_ERROR",
    };
  }
}
```

### 4. Multi-Tenant Awareness

**Always filter by plantId:**

```typescript
// ✅ Good: Tenant-aware query
const profiles = await db.query.profiles.findMany({
  where: and(
    eq(profiles.plantId, userContext.plantId),
    eq(profiles.status, "active"),
  ),
});

// ❌ Bad: No tenant filtering
const profiles = await db.query.profiles.findMany({
  where: eq(profiles.status, "active"),
});
```

### 5. Use Relations for Complex Queries

**Leverage Drizzle relations:**

```typescript
// ✅ Good: Use relations
const profile = await db.query.profiles.findFirst({
  where: eq(profiles.id, userId),
  with: {
    plant: true,
    adminRoles: true,
    enrollments: {
      with: {
        course: true,
      },
    },
  },
});

// ❌ Bad: Manual joins
const profile = await db
  .select()
  .from(profiles)
  .leftJoin(plants, eq(profiles.plantId, plants.id))
  .leftJoin(enrollments, eq(profiles.id, enrollments.userId));
// ... complex manual joins
```

---

## 🔄 Common Patterns

### 1. CRUD Operations Pattern

```typescript
// Create
export async function createEntity(
  data: CreateEntity,
): Promise<DatabaseResponse<Entity>> {
  return withDatabaseOperation(async () => {
    const [entity] = await db.insert(entities).values(data).returning();
    return entity;
  });
}

// Read (single)
export async function getEntity(
  id: string,
): Promise<DatabaseResponse<Entity | null>> {
  return withDatabaseOperation(async () => {
    const entity = await db.query.entities.findFirst({
      where: eq(entities.id, id),
    });
    return entity;
  });
}

// Read (list with filters)
export async function getEntities(
  filters: EntityFilters,
): Promise<DatabaseResponse<PaginatedResult<Entity>>> {
  return withDatabaseOperation(async () => {
    const query = db.select().from(entities);

    // Apply filters
    if (filters.status) {
      query.where(eq(entities.status, filters.status));
    }

    // Apply pagination
    const offset = (filters.page - 1) * filters.limit;
    const results = await query.limit(filters.limit).offset(offset);

    // Get total count
    const [{ count }] = await db.select({ count: count() }).from(entities);

    return {
      data: results,
      total: count,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(count / filters.limit),
    };
  });
}

// Update
export async function updateEntity(
  id: string,
  data: UpdateEntity,
): Promise<DatabaseResponse<Entity>> {
  return withDatabaseOperation(async () => {
    const [entity] = await db
      .update(entities)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(entities.id, id))
      .returning();
    return entity;
  });
}

// Delete
export async function deleteEntity(
  id: string,
): Promise<DatabaseResponse<void>> {
  return withDatabaseOperation(async () => {
    await db.delete(entities).where(eq(entities.id, id));
  });
}
```

### 2. API Route Pattern

```typescript
// GET /api/entities
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req) || {};
      const result = await getEntities(query as EntityFilters);

      if (!result.success) {
        throw new Error(result.error);
      }

      return RouteUtils.createSuccessResponse(result.data);
    },
    {
      requireAuth: true,
      validateQuery: entityFiltersSchema,
    },
  );
}

// POST /api/entities
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = await req.json();
      const result = await createEntity(body);

      if (!result.success) {
        throw new Error(result.error);
      }

      return RouteUtils.createSuccessResponse(result.data);
    },
    {
      requireAuth: true,
      validateBody: createEntitySchema,
    },
  );
}

// PATCH /api/entities/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = await req.json();
      const result = await updateEntity(params.id, body);

      if (!result.success) {
        throw new Error(result.error);
      }

      return RouteUtils.createSuccessResponse(result.data);
    },
    {
      requireAuth: true,
      validateBody: updateEntitySchema,
    },
  );
}
```

### 3. Form Validation Pattern

```typescript
// Frontend form validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  plantId: z.string().uuid("Please select a plant"),
});

// Use in React component
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    plantId: "",
  },
});
```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Schema Mismatch Errors

**Problem:** Zod validation fails with "Expected string, received undefined"

**Solution:** Check that your Zod schema matches the database schema exactly:

```typescript
// ❌ Problem: Missing field in Zod schema
export const profileSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  // Missing lastName field!
});

// ✅ Solution: Include all fields
export const profileSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(), // Added missing field
  email: z.string().email(),
  plantId: z.string().uuid(),
  status: userStatusSchema.default("active"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

#### 2. Type Inference Issues

**Problem:** TypeScript doesn't recognize new fields

**Solution:** Restart TypeScript server and check imports:

```bash
# In VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### 3. Database Connection Issues

**Problem:** "Connection refused" or "Database not found"

**Solution:** Check environment variables and database status:

```bash
# Check environment variables
cat .env.local | grep DATABASE

# Test database connection
node scripts/test-integrations.js

# Check Supabase status
curl https://api.supabase.com/v1/projects/YOUR_PROJECT_ID/status
```

#### 4. Migration Issues

**Problem:** "Table doesn't exist" or "Column not found"

**Solution:** Run migrations and check schema:

```bash
# Generate migration
npx drizzle-kit generate

# Apply migration
npx drizzle-kit migrate

# Check current schema
npx drizzle-kit introspect
```

#### 5. Validation Errors in API Routes

**Problem:** "Validation failed" errors in API responses

**Solution:** Check request body against schema:

```typescript
// Add debugging to see what's being sent
console.log("Request body:", await req.json());

// Check schema validation
try {
  const validated = schema.parse(data);
  console.log("Validation passed:", validated);
} catch (error) {
  console.log("Validation failed:", error.errors);
}
```

### Debugging Commands

```bash
# Test all integrations
node scripts/test-integrations.js

# Test specific schema
node scripts/test-drizzle-zod.js

# Verify database setup
node scripts/verify-database.js

# Check API health
curl http://localhost:3000/api/health

# Test comprehensive API
curl http://localhost:3000/api/test/comprehensive
```

---

## 📋 Quick Reference Checklist

### When Adding New Database Fields:

- [ ] Update `drizzle/schema.ts`
- [ ] Run `drizzle-kit generate` to create migration
- [ ] Apply migration to database
- [ ] Update corresponding Zod schema in `src/lib/schemas.ts`
- [ ] Check TypeScript types are inferred correctly
- [ ] Update API routes to use new schema
- [ ] Test with `node scripts/test-integrations.js`

### When Adding New API Routes:

- [ ] Define Zod schemas for request/response
- [ ] Create database operations in `src/lib/db/operations.ts`
- [ ] Use `RouteUtils.handleRequest` wrapper
- [ ] Add proper authentication/authorization
- [ ] Validate query parameters and request body
- [ ] Test with API testing tools

### When Adding New Tables:

- [ ] Define table in `drizzle/schema.ts`
- [ ] Add relationships in `drizzle/relations.ts`
- [ ] Create Zod schemas (base, create, update, filter)
- [ ] Add database operations
- [ ] Create API routes
- [ ] Add RLS policies in Supabase
- [ ] Test complete flow

### Regular Maintenance:

- [ ] Run `node scripts/test-integrations.js` weekly
- [ ] Check `node scripts/verify-database.js` after deployments
- [ ] Monitor API health endpoint
- [ ] Review schema alignment monthly
- [ ] Update documentation when schemas change

---

## 🎓 Learning Resources

### Drizzle ORM

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Kit Commands](https://orm.drizzle.team/kit-docs/overview)

### Zod Validation

- [Zod Documentation](https://zod.dev/)
- [Zod with TypeScript](https://zod.dev/?id=typescript)

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Next.js API Routes

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 💡 Pro Tips

1. **Use TypeScript strict mode** - It will catch schema mismatches early
2. **Always validate at API boundaries** - Never trust client data
3. **Use Zod transforms** - Convert data types (e.g., string to number)
4. **Leverage Drizzle relations** - Avoid manual joins when possible
5. **Test with real data** - Use the test scripts regularly
6. **Keep schemas DRY** - Reuse common patterns
7. **Document complex schemas** - Add comments for business logic
8. **Use Zod refinements** - Add custom validation rules
9. **Monitor database performance** - Check query execution times
10. **Backup before migrations** - Always have a rollback plan

---

_This guide should be your go-to reference when working with database-related code. Bookmark it and refer back to it whenever you're unsure about schema contracts or need to troubleshoot alignment issues._
