# Contract Workflow: Safe Contract Updates in Our Codebase

**Date:** 2025-01-02  
**Purpose:** Step-by-step guide for safely performing contract updates  
**Audience:** Developers working on the SpecChem Safety Training application  
**Status:** Living document - update as patterns evolve

---

## 🎯 Overview

This document provides a comprehensive workflow for safely updating contracts in our Next.js + React application. Our contracts consist of:

- **Database Schema** (Drizzle ORM) - Source of truth
- **Zod Validation Schemas** - Runtime validation and API contracts
- **TypeScript Types** - Compile-time safety (inferred from Zod)
- **DTO Mappers** - Transform database rows to API responses
- **Hooks** - Standardized data fetching with consistent return shapes

**Key Principle:** Changes flow DOWNWARD from database → Zod → TypeScript → API → UI

---

## 📋 Contract Update Checklist

### **Phase 1: Database Schema (P0 - Must Do)**

#### 1.1 Update Drizzle Schema First

```typescript
// drizzle/schema.ts - Add new column
export const profiles = pgTable("profiles", {
  id: uuid().primaryKey().notNull(),
  plantId: uuid("plant_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text().notNull(),
  jobTitle: text("job_title"),
  department: text("department"), // 🆕 New nullable column
  status: userStatus().default("active").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});
```

#### 1.2 Generate and Apply Migration

```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Review generated migration file in drizzle/
# Ensure it's safe for both fresh and existing DBs

# Apply to development database
pnpm drizzle-kit push
```

#### 1.3 Verify Migration Safety

- [ ] Migration applies cleanly to fresh database
- [ ] Migration applies cleanly to existing database with data
- [ ] No data loss or corruption
- [ ] All foreign key constraints preserved
- [ ] RLS policies still function correctly

**⚠️ High-Risk Areas:**

- Changing column types (especially with existing data)
- Adding NOT NULL columns without defaults
- Dropping columns with foreign key references
- Modifying enum values that are in use

---

### **Phase 2: Zod Contracts (P0 - Must Do)**

#### 2.1 Update Base Table Schema

```typescript
// src/lib/schemas.ts - Update to match database
export const profileSchema = z.object({
  id: z.string().min(1),
  plantId: z.string().min(1),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  jobTitle: z.string().nullable(),
  department: z.string().nullable(), // 🆕 Match database nullability
  status: userStatusSchema.default("active"),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
```

#### 2.2 Update CRUD Operation Schemas

```typescript
// Create schema (for POST requests)
export const createProfileSchema = z.object({
  id: z.string().min(1),
  plantId: z.string().min(1),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  jobTitle: z.string().optional(),
  department: z.string().optional(), // 🆕 Optional in create
  status: userStatusSchema.default("active").optional(),
});

// Update schema (for PATCH requests)
export const updateProfileSchema = z.object({
  plantId: z.string().min(1).optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(), // 🆕 Optional in updates
  status: userStatusSchema.optional(),
});
```

#### 2.3 Define API Response Schemas

```typescript
// For each API route, define request/response contracts
export const getUserResponseSchema = z.object({
  success: z.boolean(),
  data: profileSchema,
  message: z.string().optional(),
});

export const updateUserRequestSchema = updateProfileSchema;
export const updateUserResponseSchema = getUserResponseSchema;
```

**❓ Gaps to Double-Check:**

- Do all enum values match database exactly?
- Are nullable fields properly marked in Zod?
- Do validation rules make business sense?
- Are error messages user-friendly?

---

### **Phase 3: DTO Mapping Layer (P0 - Must Do)**

#### 3.1 Create/Update DTO Mappers

```typescript
// src/lib/mappers/profile-mapper.ts
import type { Profile as DrizzleProfile } from "@/lib/db/schema";
import type { Profile as ProfileDTO } from "@/lib/schemas";

export class ProfileMapper {
  /**
   * Convert Drizzle row to API DTO
   * Handle nullability, renames, and redactions in one place
   */
  static toDTO(drizzleRow: DrizzleProfile): ProfileDTO {
    return {
      id: drizzleRow.id,
      plantId: drizzleRow.plantId,
      firstName: drizzleRow.firstName,
      lastName: drizzleRow.lastName,
      email: drizzleRow.email,
      jobTitle: drizzleRow.jobTitle,
      department: drizzleRow.department, // 🆕 Pass through nullable field
      status: drizzleRow.status,
      createdAt: drizzleRow.createdAt,
      updatedAt: drizzleRow.updatedAt,
    };
  }

  /**
   * Convert DTO to Drizzle insert/update data
   */
  static fromDTO(dto: Partial<ProfileDTO>): Partial<DrizzleProfile> {
    return {
      plantId: dto.plantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      jobTitle: dto.jobTitle,
      department: dto.department, // 🆕 Handle new field
      status: dto.status,
    };
  }
}
```

#### 3.2 Validate Responses in API Routes

```typescript
// src/app/api/users/[id]/route.ts
import { ProfileMapper } from "@/lib/mappers/profile-mapper";
import { getUserResponseSchema } from "@/lib/schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const drizzleRow = await db.query.profiles.findFirst({
        where: eq(profiles.id, params.id),
      });

      if (!drizzleRow) {
        return RouteUtils.createErrorResponse("User not found", 404);
      }

      // Map to DTO and validate response
      const dto = ProfileMapper.toDTO(drizzleRow);
      const validatedResponse = getUserResponseSchema.parse({
        success: true,
        data: dto,
      });

      return RouteUtils.createSuccessResponse(validatedResponse.data);
    },
    {
      requireAuth: true,
    },
  );
}
```

**⚠️ High-Risk Areas:**

- Forgetting to validate outgoing responses
- Exposing sensitive database fields in DTOs
- Inconsistent null handling between database and API

---

### **Phase 4: Contracts Barrel (P1 - Should Do)**

#### 4.1 Update Type Exports

```typescript
// src/types/database.ts - Contracts barrel
export type {
  // Drizzle types (server-only)
  Profile as DrizzleProfile,
  CreateProfile as DrizzleCreateProfile,
  UpdateProfile as DrizzleUpdateProfile,
} from "@/lib/db/schema";

export type {
  // DTO types (for UI/hooks)
  Profile,
  CreateProfile,
  UpdateProfile,
  ProfileWithPlant,
  // 🆕 Export new types as they're added
} from "@/lib/schemas";
```

#### 4.2 Replace Local Types

```bash
# Find and replace hand-rolled types
grep -r "interface.*Profile" src/components/
grep -r "type.*Profile" src/hooks/

# Replace with imports from contracts barrel
import type { Profile } from '@/types/database';
```

**❓ Gaps to Double-Check:**

- Are all local type definitions removed?
- Do components import from contracts barrel?
- Are server-only types properly isolated?

---

### **Phase 5: Hook Updates (P1 - Should Do)**

#### 5.1 Ensure Standard Return Shape

```typescript
// src/hooks/useProfile.ts
import { useUnifiedApi } from "@/hooks/useUnifiedApi";
import { profileSchema } from "@/lib/schemas";
import type { Profile } from "@/types/database";

export function useProfile(userId: string) {
  return useUnifiedApi<Profile>({
    endpoint: `/api/users/${userId}`,
    queryKey: ["profile", userId],
    schema: profileSchema,
    enabled: !!userId,
  });
  // Returns: { data, isLoading, error, refetch }
}

export function useUpdateProfile() {
  return useUnifiedMutation<Profile, UpdateProfile>({
    endpoint: (userId: string) => `/api/users/${userId}`,
    method: "PATCH",
    invalidateKeys: ["profile"],
    schema: profileSchema,
  });
  // Returns: { mutate, isPending, error, reset }
}
```

#### 5.2 Create Adapters for Legacy Components

```typescript
// src/hooks/adapters/legacy-profile-adapter.ts
import { useProfile } from "@/hooks/useProfile";

/**
 * Adapter for components expecting legacy hook shape
 * @deprecated Use useProfile directly with new shape
 */
export function useLegacyProfile(userId: string) {
  const { data, isLoading, error, refetch } = useProfile(userId);

  // Transform to legacy shape
  return {
    profile: data,
    loading: isLoading,
    error: error?.message || null,
    refresh: refetch,
  };
}
```

**❓ Gaps to Double-Check:**

- Do all hooks return `{ data, loading, error }` shape?
- Are legacy adapters temporary and documented?
- Do hooks use proper Zod schemas for validation?

---

### **Phase 6: Consumer Updates (P1 - Should Do)**

#### 6.1 Update Components to Use DTOs

```typescript
// src/components/UserProfile.tsx
import type { Profile } from '@/types/database'; // DTO, not Drizzle row
import { useProfile } from '@/hooks/useProfile';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { data: profile, isLoading, error } = useProfile(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <h2>{profile.firstName} {profile.lastName}</h2>
      <p>Email: {profile.email}</p>
      <p>Job Title: {profile.jobTitle || 'Not specified'}</p>
      <p>Department: {profile.department || 'Not specified'}</p> {/* 🆕 New field */}
    </div>
  );
}
```

#### 6.2 Remove Direct Database Column References

```typescript
// ❌ BAD - Direct database column reference
const userName = `${user.first_name} ${user.last_name}`;

// ✅ GOOD - Use DTO properties
const userName = `${user.firstName} ${user.lastName}`;
```

**⚠️ High-Risk Areas:**

- Components directly importing Drizzle types
- Database column names (snake_case) in UI code
- Missing null checks for nullable fields

---

### **Phase 7: RLS & Testing (P0 - Must Do)**

#### 7.1 Verify RLS Policies

```sql
-- Test RLS policies still work with new columns
-- In Supabase SQL Editor or via psql

-- Test tenant isolation
SELECT * FROM profiles WHERE plant_id = 'other-tenant-id';
-- Should return empty for non-admin users

-- Test column-level security if applicable
SELECT department FROM profiles WHERE id = 'user-id';
-- Should respect any column-level RLS
```

#### 7.2 Run Schema Validation Scripts

```bash
# Run alignment validation
pnpm tsx scripts/test-drizzle-zod.ts

# Run contract tests
pnpm test src/__tests__/contracts/

# Run type checking
pnpm tsc --noEmit
```

#### 7.3 Test API Endpoints

```bash
# Test new field in API responses
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/users/123

# Verify response includes new field and validates
```

**❓ Gaps to Double-Check:**

- Do RLS policies cover new columns?
- Are tenant boundaries still enforced?
- Do all tests pass with new schema?

---

### **Phase 8: CI Guardrails (P2 - Nice to Have)**

#### 8.1 Add Build-Time Checks

```typescript
// scripts/validate-contracts.ts
import { z } from "zod";
import { profileSchema } from "@/lib/schemas";

// Ensure routes return proper schemas
function validateApiRoute(routePath: string) {
  // Check that route uses ResponseSchema.parse()
  // Check that route doesn't return raw Drizzle rows
}

// Ensure no local types duplicate contracts
function validateNoDuplicateTypes() {
  // Scan for interface/type definitions that should use contracts
}
```

#### 8.2 Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm run validate:contracts && pnpm run test:contracts"
    }
  }
}
```

---

## 🚀 Mini Example: Adding Department Column

Let's walk through adding a nullable `department` column to the `profiles` table:

### Step 1: Update Drizzle Schema

```typescript
// drizzle/schema.ts
export const profiles = pgTable("profiles", {
  // ... existing fields ...
  department: text("department"), // 🆕 Nullable column
  // ... rest of fields ...
});
```

### Step 2: Generate & Apply Migration

```bash
pnpm drizzle-kit generate
# Review migration file
pnpm drizzle-kit push
```

### Step 3: Update Zod Schemas

```typescript
// src/lib/schemas.ts
export const profileSchema = z.object({
  // ... existing fields ...
  department: z.string().nullable(), // 🆕 Match database nullability
  // ... rest of fields ...
});

export const updateProfileSchema = z.object({
  // ... existing fields ...
  department: z.string().optional(), // 🆕 Optional in updates
  // ... rest of fields ...
});
```

### Step 4: Update DTO Mapper

```typescript
// src/lib/mappers/profile-mapper.ts
export class ProfileMapper {
  static toDTO(drizzleRow: DrizzleProfile): ProfileDTO {
    return {
      // ... existing fields ...
      department: drizzleRow.department, // 🆕 Pass through
      // ... rest of fields ...
    };
  }
}
```

### Step 5: Update API Route

```typescript
// src/app/api/users/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = await request.json();
      const validatedData = updateProfileSchema.parse(body);

      const updated = await db
        .update(profiles)
        .set({
          ...validatedData,
          department: validatedData.department, // 🆕 Include new field
          updatedAt: new Date().toISOString(),
        })
        .where(eq(profiles.id, params.id))
        .returning();

      const dto = ProfileMapper.toDTO(updated[0]);
      const response = getUserResponseSchema.parse({
        success: true,
        data: dto,
      });

      return RouteUtils.createSuccessResponse(response.data);
    },
    {
      requireAuth: true,
      validateBody: updateProfileSchema,
    },
  );
}
```

### Step 6: Update Hook (Already Works!)

```typescript
// src/hooks/useProfile.ts - No changes needed!
// The hook automatically gets the new field via the updated schema
```

### Step 7: Update Component

```typescript
// src/components/UserProfile.tsx
export function UserProfile({ userId }: UserProfileProps) {
  const { data: profile, isLoading, error } = useProfile(userId);

  return (
    <div>
      {/* ... existing fields ... */}
      <p>Department: {profile.department || 'Not specified'}</p> {/* 🆕 New field */}
    </div>
  );
}
```

### Step 8: Test & Validate

```bash
# Run validation scripts
pnpm tsx scripts/test-drizzle-zod.ts

# Test API endpoint
curl -X PATCH http://localhost:3000/api/users/123 \
  -H "Content-Type: application/json" \
  -d '{"department": "Engineering"}'
```

---

## 🔒 Deployment Safety

### Staging Changes

- [ ] Use feature flags for breaking changes
- [ ] Test migrations on staging database first
- [ ] Verify RLS policies work with new schema
- [ ] Run full test suite including E2E tests

### Rollback Plan

- [ ] Tag release before deployment
- [ ] Have database rollback script ready
- [ ] Document rollback procedure
- [ ] Test rollback on staging first

### Monitoring

- [ ] Monitor API error rates after deployment
- [ ] Check database performance with new columns
- [ ] Verify no RLS policy violations in logs

---

## 📚 Priority Levels

**P0 (Must Do)** - Required for system stability:

- Database schema updates
- Zod schema alignment
- DTO mapping
- RLS verification
- Basic testing

**P1 (Should Do)** - Important for maintainability:

- Contracts barrel updates
- Hook standardization
- Component updates
- Comprehensive testing

**P2 (Nice to Have)** - Improves developer experience:

- CI guardrails
- Advanced tooling
- Documentation updates
- Performance optimizations

---

## 🎯 Success Criteria

After completing a contract update, you should have:

- [ ] Database and Zod schemas perfectly aligned
- [ ] All API routes validate responses with `ResponseSchema.parse()`
- [ ] No components importing raw Drizzle types
- [ ] All hooks returning standard `{ data, loading, error }` shape
- [ ] RLS policies working correctly
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Successful deployment to staging

**Remember:** This is a living document. Update it as our patterns evolve and new challenges emerge.
