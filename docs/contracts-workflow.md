# Contract Workflow: Safe Contract Updates Guide

**Purpose**: Step-by-step guide for safely performing contract updates in our Next.js + Supabase + Drizzle + Zod application.

**Context**: Multi-tenant LMS/CRM system with strict tenant isolation, RLS enforcement, and comprehensive type safety.

---

## 🎯 Overview

Our contract system consists of three layers that must stay synchronized:

1. **Database Schema** (Drizzle) - Source of truth for data structure
2. **Zod Contracts** - Runtime validation and DTO definitions
3. **API Layer** - Request/response validation with standardized shapes

**Golden Rule**: Always start with the database schema, then cascade changes through Zod contracts, then update consumers.

---

## 📋 Contract Update Checklist

### **P0: Must Do (Breaking Changes)**

#### 1. **Database Schema Changes**

- [ ] **Update Drizzle schema** in `src/contracts/schema.app.ts`
- [ ] **Generate migration**: `pnpm drizzle:gen`
- [ ] **Review generated SQL** in `drizzle/migrations/`
- [ ] **Test on fresh DB**: Verify migration works on empty database
- [ ] **Test on existing DB**: Verify migration preserves existing data
- [ ] **Apply to dev DB**: `pnpm drizzle:push`

```typescript
// Example: Adding nullable department column to profiles
// src/contracts/schema.app.ts
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    plantId: uuid("plant_id")
      .notNull()
      .references(() => plants.id),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    jobTitle: text("job_title"),
    department: text("department"), // ← New nullable column
    // ... existing fields
  },
  (table) => ({
    plantIdx: index("profiles_plant_idx").on(table.plantId),
  }),
);
```

#### 2. **Zod Contract Updates**

- [ ] **Update base schemas** in `src/contracts/base.ts`
- [ ] **Create RequestSchema** for API endpoints that need it
- [ ] **Create ResponseSchema** for API endpoints that need it
- [ ] **Export DTO types** via `z.infer<typeof Schema>`
- [ ] **Update contracts barrel** in `src/contracts/index.ts`

```typescript
// Example: Update ProfileSchema to include department
// src/contracts/base.ts
export const ProfileSchema = z.object({
  id: UuidSchema,
  plantId: UuidSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: EmailSchema,
  jobTitle: z.string().nullable(),
  department: z.string().optional().nullable(), // ← New field
  // ... existing fields
});

// Create/Update request schemas
export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional().nullable(), // ← New field
});

// Export types
export type Profile = z.infer<typeof ProfileSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;
```

#### 3. **Mapping Layer Updates**

- [ ] **Create/update mappers** that convert Drizzle rows → DTOs
- [ ] **Handle nullability** and field transformations in one place
- [ ] **Ensure tenant isolation** is preserved in all queries

```typescript
// Example: Profile mapper
// src/contracts/mappers.ts
function mapProfileToDTO(dbProfile: typeof profiles.$inferSelect): Profile {
  return {
    id: dbProfile.id,
    plantId: dbProfile.plantId,
    firstName: dbProfile.firstName,
    lastName: dbProfile.lastName,
    email: dbProfile.email,
    jobTitle: dbProfile.jobTitle,
    department: dbProfile.department, // ← Handle new field
    createdAt: dbProfile.createdAt,
    updatedAt: dbProfile.updatedAt,
  };
}
```

#### 4. **API Route Updates**

- [ ] **Add RequestSchema validation** to route handlers
- [ ] **Add ResponseSchema validation** to route responses
- [ ] **Use mappers** to convert DB rows to DTOs
- [ ] **Never return raw Drizzle rows** to clients

```typescript
// Example: API route with proper validation
// src/app/api/profiles/[id]/route.ts
import { UpdateProfileSchema, ProfileSchema } from "@/contracts";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Validate request
    const body = await request.json();
    const validation = validateRequest(UpdateProfileSchema, body);
    if (!validation.success) {
      return createErrorResponse(validation.error, 400);
    }

    // Business logic with tenant isolation
    const db = await getTenantDb(plantId);
    const updatedProfile = await db
      .update(profiles)
      .set(validation.data)
      .where(
        and(
          eq(profiles.id, params.id),
          eq(profiles.plantId, plantId), // ← Tenant isolation
        ),
      )
      .returning();

    // Map to DTO and validate response
    const profileDTO = mapProfileToDTO(updatedProfile[0]);
    const validatedResponse = ProfileSchema.parse(profileDTO); // ← Validate outgoing data

    return createSuccessResponse(
      validatedResponse,
      "Profile updated successfully",
    );
  } catch (error) {
    console.error("Profile update failed:", error);
    return createErrorResponse(new InternalServerError(), 500);
  }
}
```

#### 5. **Hook Updates**

- [ ] **Update hooks** to return standard shape: `{ data, loading, error }`
- [ ] **Import DTOs** from contracts, not raw Drizzle types
- [ ] **Handle new fields** in hook logic

```typescript
// Example: Standard hook shape
// src/hooks/use-profile.ts
import { Profile } from "@/contracts";

interface UseProfileResult {
  data: Profile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProfile(profileId: string): UseProfileResult {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Implementation...

  return { data, loading, error, refetch };
}
```

### **P1: Should Do (Non-Breaking Enhancements)**

#### 6. **Component Updates**

- [ ] **Update components** to handle new fields
- [ ] **Import DTOs** from contracts barrel, not local types
- [ ] **Remove any hand-rolled types** that duplicate contracts

#### 7. **Test Updates**

- [ ] **Update contract tests** in `scripts/test-contracts.ts`
- [ ] **Run schema validation**: `pnpm test:contracts`
- [ ] **Verify RLS still works**: Check tenant isolation tests
- [ ] **Test API endpoints**: Verify request/response validation

### **P2: Nice to Have (Future-Proofing)**

#### 8. **Documentation Updates**

- [ ] **Update API docs** if public endpoints changed
- [ ] **Update component docs** if props changed
- [ ] **Add migration notes** for breaking changes

---

## ⚠️ High-Risk Areas & Safety Checks

### **RLS Verification**

```sql
-- Always verify RLS policies after schema changes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'your_table_name';
```

### **Tenant Isolation Verification**

```typescript
// Test that queries are properly tenant-scoped
const db = await getTenantDb(plantId);
const results = await db
  .select()
  .from(yourTable)
  .where(eq(yourTable.plantId, plantId)); // ← Must be present
```

### **Migration Safety**

- **Always backup production** before applying migrations
- **Test migrations on copy of production data**
- **Verify rollback plan** exists for breaking changes
- **Use feature flags** for breaking API changes

---

## 🚨 CI Guardrails

Our CI pipeline **MUST FAIL** if:

### **Schema Validation**

```bash
# Run in CI
pnpm test:contracts  # Validates Drizzle ↔ Zod alignment
```

### **API Response Validation**

```typescript
// All API routes must validate responses
const validatedResponse = ResponseSchema.parse(dto);
return createSuccessResponse(validatedResponse);
```

### **Type Safety Checks**

```bash
# TypeScript must pass with strict mode
pnpm type-check
```

### **Contract Tests**

```bash
# All contract tests must pass
pnpm test:contracts
```

---

## 📝 Mini Example: Adding Department Field

Let's walk through adding a nullable `department` field to the `profiles` table:

### **Step 1: Update Database Schema**

```typescript
// src/contracts/schema.app.ts
export const profiles = pgTable("profiles", {
  // ... existing fields
  department: text("department"), // ← Add nullable field
});
```

### **Step 2: Generate & Apply Migration**

```bash
pnpm drizzle:gen  # Creates migration file
pnpm drizzle:push # Applies to dev DB
```

### **Step 3: Update Zod Contract**

```typescript
// src/contracts/base.ts
export const ProfileSchema = z.object({
  // ... existing fields
  department: z.string().optional().nullable(),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional().nullable(),
});
```

### **Step 4: Update Mapper**

```typescript
// src/contracts/mappers.ts
function mapProfileToDTO(dbProfile: typeof profiles.$inferSelect): Profile {
  return {
    // ... existing fields
    department: dbProfile.department,
  };
}
```

### **Step 5: Update API Route**

```typescript
// src/app/api/profiles/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Validate request with UpdateProfileSchema
  // Update database with tenant isolation
  // Map result with mapProfileToDTO
  // Validate response with ProfileSchema.parse()
  // Return standardized response
}
```

### **Step 6: Update Hook**

```typescript
// src/hooks/use-profile.ts
// Hook automatically gets new field via Profile DTO type
// No changes needed if using proper typing
```

### **Step 7: Update Components**

```typescript
// src/components/ProfileForm.tsx
import { Profile, UpdateProfileRequest } from "@/contracts";

// Component now has access to department field via DTO types
```

### **Step 8: Test Everything**

```bash
pnpm test:contracts  # Verify contract alignment
pnpm test:api       # Verify API endpoints
pnpm type-check     # Verify TypeScript
```

---

## 🔍 Troubleshooting

### **"Type mismatch between Drizzle and Zod"**

- Ensure Zod schema matches Drizzle column types exactly
- Check nullable vs required field mismatches
- Verify enum values are identical

### **"RLS policy violation"**

- Ensure all queries include `plantId` filter
- Check that new columns don't break existing RLS policies
- Verify tenant context is properly passed through

### **"Migration failed"**

- Check for foreign key constraint violations
- Verify column names don't conflict with reserved words
- Ensure data types are compatible with existing data

### **"API returns raw Drizzle rows"**

- Always use mappers to convert DB rows → DTOs
- Validate responses with `ResponseSchema.parse()`
- Never export Drizzle types to client components

---

## 📚 Quick Reference

### **Key Files**

- `src/contracts/schema.app.ts` - Drizzle database schema
- `src/contracts/base.ts` - Zod validation schemas
- `src/contracts/mappers.ts` - Database row → DTO mappers
- `src/contracts/validation.ts` - Request/response validation utilities
- `src/contracts/index.ts` - Contracts barrel export
- `drizzle/migrations/` - Generated migration files

### **Key Commands**

- `pnpm drizzle:gen` - Generate migration
- `pnpm drizzle:push` - Apply migration to dev
- `pnpm test:contracts` - Validate contract alignment
- `pnpm type-check` - TypeScript validation

### **Standard Patterns**

- **Request validation**: `validateRequest(Schema, data)`
- **Response validation**: `ResponseSchema.parse(dto)`
- **Error handling**: `createErrorResponse(error, statusCode)`
- **Success response**: `createSuccessResponse(data, message)`
- **Hook shape**: `{ data, loading, error, refetch }`

---

**Remember**: Contracts are the foundation of type safety. When in doubt, be more explicit rather than less. The extra validation catches bugs before they reach production.
