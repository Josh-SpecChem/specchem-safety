# Plan 07: Migrate API Routes to Contract System

**Status**: Ready for Implementation  
**Priority**: P0 - Critical  
**Estimated Time**: 2-3 days  
**Dependencies**: Contract system foundation (completed)

## 🎯 Objective

Migrate all existing API routes from legacy validation patterns to the new contract system, ensuring type safety, tenant isolation, and standardized response formats across the entire API surface.

## 📋 Implementation Prompt

### Context

You are migrating API routes in a Next.js application from legacy validation to a new contract system. The contract system provides:

- Drizzle database schemas in `src/contracts/schema.app.ts`
- Zod validation schemas in `src/contracts/base.ts`
- Mapping functions in `src/contracts/mappers.ts`
- Validation utilities in `src/contracts/validation.ts`

The application is a multi-tenant LMS with plant-based tenant isolation. Every tenant-scoped query MUST include `plantId` filtering.

### Current State Analysis Required

1. **Audit existing API routes**:

   ```bash
   find src/app/api -name "route.ts" -type f
   ```

2. **Identify validation patterns**:
   - Routes using legacy `RouteUtils`
   - Routes with custom Zod schemas
   - Routes without validation
   - Routes missing tenant isolation

3. **Categorize by complexity**:
   - Simple CRUD operations
   - Complex queries with relations
   - Analytics/reporting endpoints
   - Authentication endpoints

### Step-by-Step Migration Process

#### Phase 1: Inventory and Planning (30 minutes)

1. **Create route inventory**:

   ```typescript
   // Create: docs/api-route-migration-inventory.md
   interface RouteInventory {
     path: string;
     methods: string[];
     currentValidation: "none" | "custom" | "route-utils";
     tenantScoped: boolean;
     complexity: "simple" | "medium" | "complex";
     priority: "high" | "medium" | "low";
   }
   ```

2. **Identify high-priority routes**:
   - User profile management
   - Course enrollment
   - Progress tracking
   - Admin user management

#### Phase 2: Update Core CRUD Routes (2 hours)

For each route, follow this exact pattern:

3. **Import contract dependencies**:

   ```typescript
   import { NextRequest } from 'next/server';
   import { eq, and } from 'drizzle-orm';
   import { z } from 'zod';
   import { db } from '@/lib/db';
   import { [tableName] } from '@/contracts/schema.app';
   import {
     [EntitySchema],
     [CreateEntitySchema],
     [UpdateEntitySchema],
     validateRequestBody,
     validateRouteParams,
     validateSearchParams,
     validateResponse,
     createSuccessResponse,
     createValidationErrorResponse,
     createPaginatedResponse,
     map[Entity]ToDTO,
     map[Entity]sToDTO,
     UuidSchema,
     type [Entity],
     type Create[Entity],
     type Update[Entity]
   } from '@/contracts';
   ```

4. **Implement GET endpoints**:

   ```typescript
   export async function GET(
     request: NextRequest,
     context?: { params: Record<string, string> }
   ) {
     try {
       // 1. Validate route parameters (if any)
       if (context?.params) {
         const paramsValidation = validateRouteParams(context.params, ParamsSchema);
         if (!paramsValidation.success) {
           return createValidationErrorResponse(paramsValidation.error);
         }
       }

       // 2. Validate query parameters
       const url = new URL(request.url);
       const queryValidation = validateSearchParams(url.searchParams, QuerySchema);
       if (!queryValidation.success) {
         return createValidationErrorResponse(queryValidation.error);
       }

       // 3. Get tenant context from auth middleware
       const plantId = request.headers.get('x-plant-id');
       const userId = request.headers.get('x-user-id');

       if (!plantId || !userId) {
         return new Response(
           JSON.stringify({ success: false, error: 'Authentication required' }),
           { status: 401, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // 4. Query database with tenant isolation
       const dbResults = await db
         .select()
         .from([tableName])
         .where(and(
           // Add specific filters based on query params
           eq([tableName].plantId, plantId) // ← CRITICAL: Tenant isolation
         ))
         .limit(queryValidation.data.limit)
         .offset((queryValidation.data.page - 1) * queryValidation.data.limit);

       // 5. Get total count for pagination
       const totalCount = await db
         .select({ count: count() })
         .from([tableName])
         .where(eq([tableName].plantId, plantId));

       // 6. Map to DTOs
       const dtos = map[Entity]sToDTO(dbResults);

       // 7. Validate response
       const responseValidation = validateResponse(z.array([EntitySchema]), dtos);
       if (!responseValidation.success) {
         console.error('Response validation failed:', responseValidation.error);
         return new Response(
           JSON.stringify({ success: false, error: 'Internal server error' }),
           { status: 500, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // 8. Return paginated response
       return createPaginatedResponse(
         responseValidation.data,
         totalCount[0].count,
         queryValidation.data.page,
         queryValidation.data.limit,
         '[Entity] list retrieved successfully'
       );

     } catch (error) {
       console.error('[Entity] GET failed:', error);
       return new Response(
         JSON.stringify({ success: false, error: 'Internal server error' }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
       );
     }
   }
   ```

5. **Implement POST endpoints**:

   ```typescript
   export async function POST(request: NextRequest) {
     try {
       // 1. Validate request body
       const bodyValidation = await validateRequestBody(request, Create[Entity]Schema);
       if (!bodyValidation.success) {
         return createValidationErrorResponse(bodyValidation.error);
       }

       // 2. Get tenant context
       const plantId = request.headers.get('x-plant-id');
       const userId = request.headers.get('x-user-id');

       if (!plantId || !userId) {
         return new Response(
           JSON.stringify({ success: false, error: 'Authentication required' }),
           { status: 401, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // 3. Add tenant context to data
       const createData = {
         ...bodyValidation.data,
         plantId, // ← Ensure tenant isolation
         // Add other required fields (createdAt, etc.)
       };

       // 4. Insert into database
       const dbResults = await db
         .insert([tableName])
         .values(createData)
         .returning();

       // 5. Map to DTO
       const dto = map[Entity]ToDTO(dbResults[0]);

       // 6. Validate response
       const responseValidation = validateResponse([EntitySchema], dto);
       if (!responseValidation.success) {
         console.error('Response validation failed:', responseValidation.error);
         return new Response(
           JSON.stringify({ success: false, error: 'Internal server error' }),
           { status: 500, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // 7. Return success response
       return createSuccessResponse(
         responseValidation.data,
         '[Entity] created successfully',
         201
       );

     } catch (error) {
       console.error('[Entity] POST failed:', error);
       return new Response(
         JSON.stringify({ success: false, error: 'Internal server error' }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
       );
     }
   }
   ```

6. **Implement PATCH endpoints**:

   ```typescript
   export async function PATCH(
     request: NextRequest,
     { params }: { params: { id: string } }
   ) {
     try {
       // 1. Validate route parameters
       const paramsValidation = validateRouteParams(params, z.object({ id: UuidSchema }));
       if (!paramsValidation.success) {
         return createValidationErrorResponse(paramsValidation.error);
       }

       // 2. Validate request body
       const bodyValidation = await validateRequestBody(request, Update[Entity]Schema);
       if (!bodyValidation.success) {
         return createValidationErrorResponse(bodyValidation.error);
       }

       // 3. Get tenant context
       const plantId = request.headers.get('x-plant-id');
       const userId = request.headers.get('x-user-id');

       if (!plantId || !userId) {
         return new Response(
           JSON.stringify({ success: false, error: 'Authentication required' }),
           { status: 401, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // 4. Update database with tenant isolation
       const dbResults = await db
         .update([tableName])
         .set({
           ...bodyValidation.data,
           updatedAt: new Date().toISOString(),
         })
         .where(and(
           eq([tableName].id, paramsValidation.data.id),
           eq([tableName].plantId, plantId) // ← CRITICAL: Tenant isolation
         ))
         .returning();

       if (!dbResults[0]) {
         return new Response(
           JSON.stringify({ success: false, error: '[Entity] not found or access denied' }),
           { status: 404, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // 5. Map to DTO and validate response
       const dto = map[Entity]ToDTO(dbResults[0]);
       const responseValidation = validateResponse([EntitySchema], dto);
       if (!responseValidation.success) {
         console.error('Response validation failed:', responseValidation.error);
         return new Response(
           JSON.stringify({ success: false, error: 'Internal server error' }),
           { status: 500, headers: { 'Content-Type': 'application/json' } }
         );
       }

       // 6. Return success response
       return createSuccessResponse(
         responseValidation.data,
         '[Entity] updated successfully'
       );

     } catch (error) {
       console.error('[Entity] PATCH failed:', error);
       return new Response(
         JSON.stringify({ success: false, error: 'Internal server error' }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
       );
     }
   }
   ```

7. **Implement DELETE endpoints**:

   ```typescript
   export async function DELETE(
     request: NextRequest,
     { params }: { params: { id: string } },
   ) {
     try {
       // 1. Validate route parameters
       const paramsValidation = validateRouteParams(
         params,
         z.object({ id: UuidSchema }),
       );
       if (!paramsValidation.success) {
         return createValidationErrorResponse(paramsValidation.error);
       }

       // 2. Get tenant context and check permissions
       const plantId = request.headers.get("x-plant-id");
       const userRole = request.headers.get("x-user-role");

       if (!plantId || !["hr_admin", "dev_admin"].includes(userRole || "")) {
         return new Response(
           JSON.stringify({ success: false, error: "Admin access required" }),
           { status: 403, headers: { "Content-Type": "application/json" } },
         );
       }

       // 3. Delete from database with tenant isolation
       const dbResults = await db
         .delete([tableName])
         .where(
           and(
             eq([tableName].id, paramsValidation.data.id),
             eq([tableName].plantId, plantId), // ← CRITICAL: Tenant isolation
           ),
         )
         .returning();

       if (!dbResults[0]) {
         return new Response(
           JSON.stringify({
             success: false,
             error: "[Entity] not found or access denied",
           }),
           { status: 404, headers: { "Content-Type": "application/json" } },
         );
       }

       // 4. Return success response (no data for delete)
       return createSuccessResponse(null, "[Entity] deleted successfully");
     } catch (error) {
       console.error("[Entity] DELETE failed:", error);
       return new Response(
         JSON.stringify({ success: false, error: "Internal server error" }),
         { status: 500, headers: { "Content-Type": "application/json" } },
       );
     }
   }
   ```

#### Phase 3: Update Complex Routes (3 hours)

8. **Handle routes with relations**:

   ```typescript
   // For routes that need to include related data
   const dbResults = await db
     .select()
     .from([tableName])
     .leftJoin(relatedTable, eq([tableName].relatedId, relatedTable.id))
     .where(and(
       eq([tableName].plantId, plantId),
       // other conditions
     ));

   // Use composite mappers
   const dtos = dbResults.map(row => map[Entity]WithRelationsToDTO({
     ...[tableName]: row.[tableName],
     relatedEntity: row.relatedTable
   }));
   ```

9. **Handle analytics routes**:
   ```typescript
   // Use aggregation queries with proper tenant isolation
   const stats = await db
     .select({
       total: count(),
       completed: count(case(eq([tableName].status, 'completed'), 1)),
       // other aggregations
     })
     .from([tableName])
     .where(eq([tableName].plantId, plantId))
     .groupBy([tableName].someField);
   ```

#### Phase 4: Testing and Validation (1 hour)

10. **Test each migrated route**:

    ```bash
    # Run contract validation
    pnpm test:contracts

    # Test API endpoints
    curl -X GET "http://localhost:3000/api/[endpoint]" \
      -H "x-plant-id: test-plant-id" \
      -H "x-user-id: test-user-id"
    ```

11. **Verify tenant isolation**:
    ```typescript
    // Create test script to verify no cross-tenant data leaks
    // Test with different plant IDs
    // Verify 404s for cross-tenant access attempts
    ```

#### Phase 5: Cleanup (30 minutes)

12. **Remove legacy validation**:
    - Delete custom Zod schemas that are now in contracts
    - Remove RouteUtils usage where replaced
    - Update imports to use contract exports

13. **Update error handling**:
    - Ensure all routes use standardized error responses
    - Add proper logging with tenant context
    - Verify error messages don't leak sensitive information

### Critical Requirements

#### MUST HAVE:

- [ ] All routes validate requests with contract schemas
- [ ] All routes validate responses before sending
- [ ] All tenant-scoped routes include `plantId` filtering
- [ ] All routes use standardized response format
- [ ] All routes handle errors consistently

#### MUST NOT:

- [ ] Return raw Drizzle rows to clients
- [ ] Allow queries without tenant isolation
- [ ] Use inconsistent response formats
- [ ] Expose internal error details to clients

### Validation Checklist

Before marking this complete, verify:

- [ ] `pnpm test:contracts` passes
- [ ] `pnpm type-check` passes with no errors
- [ ] All API routes return standardized response format
- [ ] No raw database types are exported to client
- [ ] All tenant-scoped operations include plantId filtering
- [ ] Error responses are consistent and don't leak information
- [ ] All routes validate both input and output
- [ ] Documentation is updated for any API changes

### Success Criteria

1. **Type Safety**: All API routes use contract DTOs
2. **Validation**: All requests and responses are validated
3. **Security**: Tenant isolation is enforced everywhere
4. **Consistency**: All routes follow the same patterns
5. **Maintainability**: No duplicate validation logic
6. **Testing**: All routes can be validated automatically

### Files to Update

Priority order for migration:

1. `src/app/api/user/profile/route.ts` - User profile management
2. `src/app/api/admin/users/route.ts` - Admin user management
3. `src/app/api/admin/enrollments/route.ts` - Enrollment management
4. `src/app/api/courses/[course]/progress/route.ts` - Progress tracking
5. `src/app/api/admin/analytics/route.ts` - Analytics endpoints
6. All remaining routes in `src/app/api/`

Start with the highest priority routes and work systematically through the list. Each route should follow the exact patterns shown above for consistency and maintainability.
