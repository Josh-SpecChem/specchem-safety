# Contract Workflow Implementation Guide

**Status**: ✅ Implemented  
**Date**: October 2, 2025  
**Version**: 1.0.0

## 🎯 Overview

This document describes the implementation of the contract workflow system in the SpecChem Safety Training application. The contract system provides a three-layer architecture for type safety and data validation:

1. **Database Schema** (Drizzle) - Source of truth for data structure
2. **Zod Contracts** - Runtime validation and DTO definitions
3. **API Layer** - Request/response validation with standardized shapes

## 📁 File Structure

The contract system is organized in the `src/contracts/` directory:

```
src/contracts/
├── schema.app.ts      # Drizzle database schema (source of truth)
├── relations.ts       # Database relationship definitions
├── base.ts           # Zod validation schemas and DTOs
├── mappers.ts        # Database row → DTO mapping functions
├── validation.ts     # Request/response validation utilities
└── index.ts          # Barrel export for all contracts
```

### Legacy Compatibility

The old drizzle files are maintained for backward compatibility:

```
drizzle/
├── schema.ts         # DEPRECATED: Re-exports from contracts
├── relations.ts      # DEPRECATED: Re-exports from contracts
└── migrations/       # Generated migration files (still used)
```

## 🔄 Contract Update Workflow

### Golden Rule

**Always start with the database schema, then cascade changes through Zod contracts, then update consumers.**

### Step-by-Step Process

#### 1. Update Database Schema

```typescript
// src/contracts/schema.app.ts
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  plantId: uuid("plant_id")
    .notNull()
    .references(() => plants.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  jobTitle: text("job_title"),
  department: text("department"), // ← New field added
  status: userStatus().default("active").notNull(),
  // ... timestamps
});
```

#### 2. Generate Migration

```bash
pnpm drizzle:gen  # Generates migration file
pnpm drizzle:push # Applies to dev database
```

#### 3. Update Zod Contracts

```typescript
// src/contracts/base.ts
export const ProfileSchema = z.object({
  id: UuidSchema,
  plantId: UuidSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: EmailSchema,
  jobTitle: z.string().nullable(),
  department: z.string().nullable(), // ← New field added
  status: UserStatusSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(), // ← New field added
  status: UserStatusSchema.optional(),
});
```

#### 4. Update Mappers

```typescript
// src/contracts/mappers.ts
export function mapProfileToDTO(dbProfile: ProfileRow): Profile {
  const mapped = {
    id: dbProfile.id,
    plantId: dbProfile.plantId,
    firstName: dbProfile.firstName,
    lastName: dbProfile.lastName,
    email: dbProfile.email,
    jobTitle: dbProfile.jobTitle,
    department: dbProfile.department, // ← Handle new field
    status: dbProfile.status,
    createdAt: dbProfile.createdAt,
    updatedAt: dbProfile.updatedAt,
  };

  return ProfileSchema.parse(mapped);
}
```

#### 5. Update API Routes

```typescript
// src/app/api/profiles/[id]/route.ts
import {
  ProfileSchema,
  UpdateProfileSchema,
  validateRequestBody,
  validateResponse,
  createSuccessResponse,
  mapProfileToDTO,
} from "@/contracts";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // 1. Validate request
  const bodyValidation = await validateRequestBody(
    request,
    UpdateProfileSchema,
  );
  if (!bodyValidation.success) {
    return createValidationErrorResponse(bodyValidation.error);
  }

  // 2. Update database with tenant isolation
  const updatedProfiles = await db
    .update(profiles)
    .set(bodyValidation.data)
    .where(
      and(
        eq(profiles.id, params.id),
        eq(profiles.plantId, userPlantId), // ← Tenant isolation
      ),
    )
    .returning();

  // 3. Map to DTO and validate response
  const profileDTO = mapProfileToDTO(updatedProfiles[0]);
  const validatedResponse = ProfileSchema.parse(profileDTO);

  return createSuccessResponse(
    validatedResponse,
    "Profile updated successfully",
  );
}
```

## 🏗️ Architecture Components

### Database Schema (`schema.app.ts`)

The authoritative database schema using Drizzle ORM:

- **Enums**: Database-level enums for controlled values
- **Tables**: All table definitions with proper indexing
- **Constraints**: Foreign keys, unique constraints, defaults
- **Tenant Isolation**: Every tenant-scoped table includes `plantId`

Key features:

- Plant-based multi-tenancy
- Comprehensive indexing for performance
- Proper foreign key relationships
- Audit timestamps on all entities

### Zod Contracts (`base.ts`)

Runtime validation schemas that mirror the database structure:

- **Base Schemas**: Core entity validation (Plant, Course, Profile, etc.)
- **CRUD Schemas**: Create/Update variants with appropriate optionality
- **Composite Schemas**: Schemas with relations for complex queries
- **Filter Schemas**: Query parameter validation with pagination
- **Response Schemas**: API response structure validation

### Mappers (`mappers.ts`)

Functions that convert database rows to validated DTOs:

- **Single Entity Mappers**: Convert individual rows to DTOs
- **Composite Mappers**: Handle entities with relations
- **Array Mappers**: Batch conversion utilities
- **Validation**: All mappers validate output with Zod schemas
- **Error Handling**: Comprehensive error handling with context

### Validation Utilities (`validation.ts`)

Standardized validation functions for API routes:

- **Request Validation**: Body, params, query string validation
- **Response Validation**: Ensure API responses match contracts
- **Tenant Validation**: Enforce tenant isolation rules
- **Error Formatting**: Standardized error response creation
- **Success Responses**: Consistent success response format

## 🔒 Tenant Isolation

All tenant-scoped operations must include plant-based filtering:

```typescript
// ✅ CORRECT: Always include plantId filter
const profiles = await db
  .select()
  .from(profiles)
  .where(
    and(
      eq(profiles.status, "active"),
      eq(profiles.plantId, userPlantId), // ← Required for tenant isolation
    ),
  );

// ❌ WRONG: Missing tenant isolation
const profiles = await db
  .select()
  .from(profiles)
  .where(eq(profiles.status, "active")); // ← Security violation!
```

### Tenant-Scoped Entities

All these entities require `plantId` filtering:

- `profiles` - User accounts
- `enrollments` - Course enrollments
- `progress` - Course progress tracking
- `activityEvents` - User activity logs
- `questionEvents` - Assessment responses
- `adminRoles` - Admin role assignments

### Global Entities

These entities are shared across tenants:

- `plants` - Tenant definitions
- `courses` - Training content (global catalog)

## 🧪 Testing & Validation

### Contract Validation Tests

Run the contract validation test suite:

```bash
pnpm test:contracts
```

This validates:

- Drizzle ↔ Zod schema alignment
- CRUD schema validation
- Enum value validation
- Tenant isolation patterns
- Type compatibility

### CI Integration

The contract tests should be run in CI to catch mismatches:

```yaml
# .github/workflows/ci.yml
- name: Validate Contracts
  run: pnpm test:contracts
```

### Manual Validation

Check specific contract alignment:

```typescript
import { ProfileSchema } from "@/contracts";
import type { InferSelectModel } from "drizzle-orm";
import { profiles } from "@/contracts/schema.app";

// Verify Drizzle type matches Zod schema
type DrizzleProfile = InferSelectModel<typeof profiles>;
const testProfile: DrizzleProfile = {
  /* ... */
};
const validation = ProfileSchema.safeParse(testProfile);
console.log("Valid:", validation.success);
```

## 📋 Best Practices

### 1. Always Use Mappers

```typescript
// ✅ CORRECT: Use mapper to convert DB row → DTO
const profileDTO = mapProfileToDTO(dbProfile);
return createSuccessResponse(profileDTO);

// ❌ WRONG: Return raw database row
return createSuccessResponse(dbProfile); // Exposes internal structure
```

### 2. Validate All Inputs

```typescript
// ✅ CORRECT: Validate request body
const bodyValidation = await validateRequestBody(request, UpdateProfileSchema);
if (!bodyValidation.success) {
  return createValidationErrorResponse(bodyValidation.error);
}

// ❌ WRONG: Use unvalidated input
const body = await request.json(); // No validation!
```

### 3. Validate All Outputs

```typescript
// ✅ CORRECT: Validate response before sending
const responseValidation = validateResponse(ProfileSchema, profileDTO);
if (!responseValidation.success) {
  throw new Error("Response validation failed");
}

// ❌ WRONG: Send unvalidated response
return createSuccessResponse(someData); // Might not match contract
```

### 4. Enforce Tenant Isolation

```typescript
// ✅ CORRECT: Include tenant filter
.where(and(
  eq(profiles.id, profileId),
  eq(profiles.plantId, userPlantId) // ← Always include
))

// ❌ WRONG: Missing tenant isolation
.where(eq(profiles.id, profileId)) // ← Security risk!
```

### 5. Use Standard Response Format

```typescript
// ✅ CORRECT: Use standard response utilities
return createSuccessResponse(data, "Operation successful");
return createValidationErrorResponse(error);

// ❌ WRONG: Custom response format
return new Response(JSON.stringify({ result: data })); // Inconsistent
```

## 🚨 Common Pitfalls

### 1. Schema Drift

**Problem**: Drizzle schema and Zod contracts get out of sync.  
**Solution**: Run `pnpm test:contracts` regularly and in CI.

### 2. Missing Tenant Isolation

**Problem**: Queries without `plantId` filter expose cross-tenant data.  
**Solution**: Always use tenant-scoped query patterns.

### 3. Raw Database Exposure

**Problem**: Returning raw Drizzle rows exposes internal structure.  
**Solution**: Always use mappers to convert rows → DTOs.

### 4. Inconsistent Validation

**Problem**: Some routes validate, others don't.  
**Solution**: Use validation utilities consistently across all routes.

### 5. Breaking Changes Without Migration

**Problem**: Schema changes without proper migration path.  
**Solution**: Always generate and test migrations before deployment.

## 🔧 Migration from Legacy System

### Phase 1: Parallel Implementation

1. ✅ Create contracts directory structure
2. ✅ Move Drizzle schemas to contracts
3. ✅ Create Zod validation schemas
4. ✅ Implement mappers and validation utilities
5. ✅ Update drizzle.config.ts to use new schema location

### Phase 2: API Route Updates (In Progress)

1. ✅ Create example API route with contract validation
2. 🔄 Update existing API routes to use contracts
3. 🔄 Replace legacy validation with contract validation
4. 🔄 Update error handling to use standard responses

### Phase 3: Frontend Integration (Pending)

1. 🔄 Update hooks to use contract DTOs
2. 🔄 Replace local types with contract exports
3. 🔄 Update components to use standardized types

### Phase 4: Legacy Cleanup (Pending)

1. 🔄 Remove duplicate type definitions
2. 🔄 Remove legacy validation schemas
3. 🔄 Update documentation
4. 🔄 Remove deprecated files

## 📚 Related Documentation

- [Contract Workflow Guide](./contracts-workflow.md) - Original workflow specification
- [Database Schema Guide](./technical/DB_SCHEMA.md) - Database structure documentation
- [API Documentation](./API.md) - API endpoint documentation
- [Types Guide](./types-guide.md) - Type system documentation

## 🎉 Benefits Achieved

1. **Type Safety**: End-to-end type safety from database to API responses
2. **Runtime Validation**: All data validated at runtime with Zod
3. **Tenant Isolation**: Enforced plant-based multi-tenancy
4. **Consistency**: Standardized API response format
5. **Maintainability**: Single source of truth for data contracts
6. **Developer Experience**: Clear patterns and comprehensive tooling
7. **Testing**: Automated contract validation in CI/CD

The contract workflow system provides a robust foundation for safe, maintainable data operations in the SpecChem Safety Training application.
