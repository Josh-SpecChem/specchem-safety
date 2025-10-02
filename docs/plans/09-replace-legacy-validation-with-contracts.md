# Plan 09: Replace Legacy Validation with Contract System

**Status**: Ready for Implementation  
**Priority**: P1 - High  
**Estimated Time**: 1-2 days  
**Dependencies**: API routes and hooks migrated to contracts (Plans 07-08)

## 🎯 Objective

Replace all legacy validation patterns, custom Zod schemas, and RouteUtils usage with the standardized contract validation system, eliminating duplicate validation logic and ensuring consistency across the application.

## 📋 Implementation Prompt

### Context

You are consolidating validation logic in a Next.js application by replacing legacy patterns with a unified contract system. The application currently has:

- Custom Zod schemas scattered across files
- RouteUtils with custom validation logic
- Duplicate type definitions
- Inconsistent error handling patterns

The goal is to centralize all validation through the contract system and remove redundant code.

### Current State Analysis Required

1. **Audit legacy validation patterns**:

   ```bash
   # Find custom Zod schemas
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "z\." | grep -v contracts

   # Find RouteUtils usage
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "RouteUtils"

   # Find duplicate type definitions
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "interface.*Schema\|type.*Schema"

   # Find custom validation functions
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "validate\|schema"
   ```

2. **Identify validation categories**:
   - Form validation schemas
   - API route validation
   - Component prop validation
   - Utility validation functions
   - Error handling patterns

3. **Map to contract equivalents**:
   - Which schemas can be replaced with contract schemas
   - Which validation logic can use contract utilities
   - Which error patterns can be standardized

### Step-by-Step Migration Process

#### Phase 1: Inventory and Analysis (1 hour)

1. **Create validation inventory**:

   ```typescript
   // Create: docs/validation-migration-inventory.md
   interface ValidationInventory {
     filePath: string;
     validationType: "schema" | "function" | "route-utils" | "error-handling";
     currentPattern: string;
     contractReplacement: string;
     complexity: "simple" | "medium" | "complex";
     canAutoReplace: boolean;
   }
   ```

2. **Categorize by replacement strategy**:

   ```typescript
   // Direct replacement - existing contract schema
   const directReplacements = [
     { from: "profileSchema", to: "ProfileSchema" },
     { from: "courseSchema", to: "CourseSchema" },
     { from: "enrollmentSchema", to: "EnrollmentSchema" },
   ];

   // Utility replacement - use contract validation functions
   const utilityReplacements = [
     { from: "validateUUID", to: "validateUUID from @/contracts" },
     { from: "validateEmail", to: "validateEmail from @/contracts" },
     {
       from: "RouteUtils.validateRequest",
       to: "validateRequestBody from @/contracts",
     },
   ];

   // Custom logic - needs manual migration
   const customMigrations = [
     "Complex form validation with business rules",
     "Multi-step validation workflows",
     "Conditional validation logic",
   ];
   ```

#### Phase 2: Replace Direct Schema Usage (2 hours)

3. **Update form validation schemas**:

   ```typescript
   // Before: Custom form schema
   // src/components/ProfileForm.tsx
   import { z } from "zod";

   const profileFormSchema = z.object({
     firstName: z.string().min(1, "First name is required"),
     lastName: z.string().min(1, "Last name is required"),
     email: z.string().email("Invalid email"),
     jobTitle: z.string().optional(),
   });

   type ProfileFormData = z.infer<typeof profileFormSchema>;

   // After: Use contract schema
   import { UpdateProfileSchema, type UpdateProfile } from "@/contracts";

   // Use contract schema directly for form validation
   type ProfileFormData = UpdateProfile;

   function ProfileForm() {
     const form = useForm<ProfileFormData>({
       resolver: zodResolver(UpdateProfileSchema),
       // ...
     });
   }
   ```

4. **Update component prop validation**:

   ```typescript
   // Before: Custom prop types
   interface ProfileDisplayProps {
     profile: {
       id: string;
       firstName: string;
       lastName: string;
       email: string;
       // ... other fields
     };
   }

   // After: Use contract types
   import { type Profile } from "@/contracts";

   interface ProfileDisplayProps {
     profile: Profile;
   }
   ```

5. **Replace utility validation functions**:

   ```typescript
   // Before: Custom validation utilities
   // src/lib/validation.ts
   export function validateUUID(value: string): boolean {
     const uuidRegex =
       /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
     return uuidRegex.test(value);
   }

   export function validateEmail(value: string): boolean {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(value);
   }

   // After: Use contract utilities
   // Delete src/lib/validation.ts and update imports
   import { isValidUuid, isValidEmail } from "@/contracts";
   ```

#### Phase 3: Migrate RouteUtils Usage (3 hours)

6. **Replace RouteUtils.handleRequest**:

   ```typescript
   // Before: RouteUtils pattern
   import { RouteUtils } from "@/lib/route-utils";

   export async function GET(request: NextRequest) {
     return RouteUtils.handleRequest(
       request,
       async (req) => {
         // Business logic
         const data = await someOperation();
         return RouteUtils.createSuccessResponse(data);
       },
       {
         requireAuth: true,
         validateQuery: someSchema,
       },
     );
   }

   // After: Contract validation pattern
   import {
     validateSearchParams,
     createSuccessResponse,
     createValidationErrorResponse,
   } from "@/contracts";

   export async function GET(request: NextRequest) {
     try {
       // 1. Validate query parameters
       const url = new URL(request.url);
       const queryValidation = validateSearchParams(
         url.searchParams,
         QuerySchema,
       );
       if (!queryValidation.success) {
         return createValidationErrorResponse(queryValidation.error);
       }

       // 2. Get auth context (would come from middleware)
       const plantId = request.headers.get("x-plant-id");
       if (!plantId) {
         return new Response(
           JSON.stringify({ success: false, error: "Authentication required" }),
           { status: 401, headers: { "Content-Type": "application/json" } },
         );
       }

       // 3. Business logic with validated data
       const data = await someOperation(queryValidation.data, plantId);

       // 4. Return standardized response
       return createSuccessResponse(data, "Operation successful");
     } catch (error) {
       console.error("Operation failed:", error);
       return new Response(
         JSON.stringify({ success: false, error: "Internal server error" }),
         { status: 500, headers: { "Content-Type": "application/json" } },
       );
     }
   }
   ```

7. **Replace RouteUtils.validateQuery**:

   ```typescript
   // Before: RouteUtils query validation
   const query = RouteUtils.getValidatedQuery(request, querySchema);

   // After: Contract validation
   const url = new URL(request.url);
   const queryValidation = validateSearchParams(url.searchParams, QuerySchema);
   if (!queryValidation.success) {
     return createValidationErrorResponse(queryValidation.error);
   }
   const query = queryValidation.data;
   ```

8. **Replace RouteUtils.validateBody**:

   ```typescript
   // Before: RouteUtils body validation
   const body = await RouteUtils.getValidatedBody(request, bodySchema);

   // After: Contract validation
   const bodyValidation = await validateRequestBody(request, BodySchema);
   if (!bodyValidation.success) {
     return createValidationErrorResponse(bodyValidation.error);
   }
   const body = bodyValidation.data;
   ```

#### Phase 4: Consolidate Error Handling (2 hours)

9. **Standardize error response patterns**:

   ```typescript
   // Before: Inconsistent error handling
   // File 1:
   return NextResponse.json({ error: "Something went wrong" }, { status: 500 });

   // File 2:
   return new Response(JSON.stringify({ success: false, message: "Error" }), {
     status: 400,
   });

   // File 3:
   throw new Error("Validation failed");

   // After: Standardized contract error handling
   import {
     createValidationErrorResponse,
     createErrorResponse,
   } from "@/contracts";

   // For validation errors
   return createValidationErrorResponse(validationError);

   // For general errors
   return new Response(
     JSON.stringify({ success: false, error: "Internal server error" }),
     { status: 500, headers: { "Content-Type": "application/json" } },
   );
   ```

10. **Update error handling utilities**:

    ```typescript
    // Before: Custom error classes and handlers
    // src/lib/errors.ts
    export class ValidationError extends Error {
      constructor(
        message: string,
        public field?: string,
      ) {
        super(message);
        this.name = "ValidationError";
      }
    }

    export function handleApiError(error: unknown) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      // ... other error types
    }

    // After: Use contract error handling
    import {
      ContractValidationError,
      createValidationErrorResponse,
    } from "@/contracts";

    // Contract system provides standardized error handling
    // Remove custom error classes that duplicate contract functionality
    ```

#### Phase 5: Remove Duplicate Type Definitions (1 hour)

11. **Audit and remove duplicate types**:

    ```typescript
    // Before: Duplicate type definitions across files
    // src/types/user.ts
    export interface User {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      // ...
    }

    // src/components/UserCard.tsx
    interface UserData {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      // ...
    }

    // After: Use contract types exclusively
    import { type Profile } from "@/contracts";

    // Remove duplicate type files and interfaces
    // Update all imports to use contract types
    ```

12. **Update barrel exports**:

    ```typescript
    // Before: Local type exports
    // src/types/index.ts
    export type { User } from "./user";
    export type { Course } from "./course";
    export type { Enrollment } from "./enrollment";

    // After: Re-export contract types (if needed)
    // src/types/index.ts
    export type {
      Profile,
      Course,
      Enrollment,
      Plant,
      Progress,
      ActivityEvent,
      QuestionEvent,
    } from "@/contracts";

    // Or better: Import directly from contracts
    // Remove src/types/index.ts and update imports to use @/contracts
    ```

#### Phase 6: Update Validation Middleware (1 hour)

13. **Replace custom validation middleware**:

    ```typescript
    // Before: Custom validation middleware
    // src/lib/middleware/validation.ts
    export function withValidation<T>(schema: z.ZodType<T>) {
      return (handler: (data: T) => Promise<Response>) => {
        return async (request: NextRequest) => {
          try {
            const body = await request.json();
            const validatedData = schema.parse(body);
            return handler(validatedData);
          } catch (error) {
            return NextResponse.json(
              { error: "Validation failed" },
              { status: 400 },
            );
          }
        };
      };
    }

    // After: Use contract validation utilities
    import { withBodyValidation } from "@/contracts";

    // Contract system provides standardized middleware
    // Remove custom validation middleware
    ```

14. **Update auth middleware integration**:
    ```typescript
    // Ensure auth middleware works with contract validation
    // Update to set standard headers that contract validation expects
    // x-plant-id, x-user-id, x-user-role, etc.
    ```

#### Phase 7: Clean Up Legacy Files (30 minutes)

15. **Remove obsolete validation files**:

    ```bash
    # Files to review for removal:
    # - src/lib/validation.ts (if replaced by contracts)
    # - src/lib/route-utils.ts (if fully replaced)
    # - src/types/[entity].ts (if duplicating contracts)
    # - Custom schema files in components
    # - Duplicate error handling utilities
    ```

16. **Update imports across codebase**:

    ```bash
    # Use find/replace to update imports
    # From: import { validateUUID } from '@/lib/validation'
    # To: import { isValidUuid } from '@/contracts'

    # From: import { User } from '@/types'
    # To: import { Profile } from '@/contracts'
    ```

#### Phase 8: Testing and Validation (1 hour)

17. **Verify no duplicate validation logic**:

    ```bash
    # Search for remaining custom validation
    find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "z\." | grep -v contracts | grep -v node_modules

    # Should return minimal results (only legitimate custom validation)
    ```

18. **Test validation consistency**:
    ```typescript
    // Create test to verify all validation uses contracts
    // Test that error responses are consistent
    // Test that type safety is maintained
    ```

### Critical Requirements

#### MUST HAVE:

- [ ] All validation uses contract schemas or utilities
- [ ] No duplicate type definitions exist
- [ ] Error handling is consistent across the application
- [ ] All RouteUtils usage is replaced with contract patterns
- [ ] Type safety is maintained throughout migration

#### MUST NOT:

- [ ] Keep duplicate validation logic
- [ ] Use inconsistent error response formats
- [ ] Leave orphaned validation files
- [ ] Break existing functionality during migration

### Validation Checklist

Before marking this complete, verify:

- [ ] `pnpm type-check` passes with no errors
- [ ] `pnpm test:contracts` passes
- [ ] No duplicate schemas exist outside contracts
- [ ] All error responses follow standard format
- [ ] No RouteUtils usage remains (unless intentional)
- [ ] All validation imports come from @/contracts
- [ ] Legacy validation files are removed or documented

### Success Criteria

1. **Consolidation**: All validation logic uses contract system
2. **Consistency**: Error handling is standardized across application
3. **Type Safety**: No type safety regressions during migration
4. **Maintainability**: No duplicate validation code remains
5. **Performance**: No performance regressions from migration
6. **Documentation**: Clear migration notes for future reference

### Migration Strategy

#### High Priority (Replace First):

1. **API Route Validation**: Replace RouteUtils in all API routes
2. **Form Validation**: Update all form schemas to use contracts
3. **Component Props**: Replace custom types with contract types
4. **Error Handling**: Standardize all error response patterns

#### Medium Priority (Replace Second):

1. **Utility Functions**: Replace custom validation utilities
2. **Middleware**: Update validation middleware patterns
3. **Type Exports**: Remove duplicate type definitions
4. **Test Utilities**: Update test helpers to use contracts

#### Low Priority (Replace Last):

1. **Legacy Files**: Remove obsolete validation files
2. **Documentation**: Update validation documentation
3. **Code Comments**: Update comments referencing old patterns
4. **Import Cleanup**: Final pass on import standardization

### Files to Update

Systematic approach:

1. **Start with API routes** - Replace RouteUtils usage
2. **Update form components** - Replace custom schemas
3. **Update type definitions** - Remove duplicates
4. **Update utilities** - Replace custom validation functions
5. **Clean up files** - Remove obsolete validation code
6. **Update imports** - Standardize all imports to use @/contracts

### Rollback Plan

If issues arise during migration:

1. **Keep git commits small** - Easy to revert individual changes
2. **Test incrementally** - Verify each phase before proceeding
3. **Document changes** - Clear notes on what was replaced
4. **Maintain backwards compatibility** - Don't break existing APIs during transition

The goal is a clean, consistent validation system with no duplicate code and standardized error handling throughout the application.
