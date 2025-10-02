# API Route Template Migration Guide

## Overview

This guide helps you migrate from the old complex template system to the new simplified API route patterns.

## What Changed

### Removed Components

- `CrudRouteTemplate` class
- `ListRouteTemplate` class
- `AnalyticsRouteTemplate` class
- `AuthMiddleware` wrapper class
- `ValidationMiddleware` wrapper class
- `ErrorMiddleware` wrapper class

### New Components

- `RouteUtils.handleRequest()` - Single method for all route handling
- `RouteUtils.createSuccessResponse()` - Consistent response formatting
- `RouteUtils.createErrorResponse()` - Consistent error formatting
- Simplified validation and authentication options

## Migration Steps

### Step 1: Update Imports

**Before:**

```typescript
import { CrudRouteTemplate } from "@/app/api/shared/templates/crud-route-template";
import { AuthMiddleware } from "@/app/api/shared/middleware/auth-middleware";
import { ValidationMiddleware } from "@/app/api/shared/middleware/validation-middleware";
```

**After:**

```typescript
import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
```

### Step 2: Replace Template Classes

#### CRUD Template Migration

**Before:**

```typescript
const userOperations = {
  list: async (params: any) => {
    const result = await UserOperationsCompat.getUsersWithDetails(params);
    if (!result.success) {
      throw new Error(result.error);
    }
    return { data: result.data };
  },
  create: async (data: CreateProfile) => {
    const result = await UserOperationsCompat.createUser(data);
    if (!result.success) {
      throw new Error(result.error);
    }
    return result.data;
  },
};

const userSchemas = {
  list: CommonSchemas.userFilters,
  create: CommonSchemas.createUser,
};

const userRoutes = new CrudRouteTemplate(userOperations, userSchemas);
export const { GET, POST } = userRoutes.createRoutes();
```

**After:**

```typescript
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req) || {};
      const result = await UserOperationsCompat.getUsersWithDetails(query);

      if (!result.success) {
        throw new Error(result.error);
      }

      return RouteUtils.createSuccessResponse(result.data);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: CommonSchemas.userFilters,
    },
  );
}

export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody<CreateProfile>(req);
      if (!body) {
        throw new Error("Request body required");
      }

      const result = await UserOperationsCompat.createUser(body);

      if (!result.success) {
        throw new Error(result.error);
      }

      return RouteUtils.createCreatedResponse(
        result.data,
        "User created successfully",
      );
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateBody: CommonSchemas.createUser,
    },
  );
}
```

#### List Template Migration

**Before:**

```typescript
const courseListOperation = async (params: any) => {
  const coursesWithStats = await db
    .select({...})
    .from(courses)
    .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
    .groupBy(courses.id);

  return {
    data: {
      courses: formattedCourses,
      statistics: { ... }
    }
  };
};

const courseRoutes = new ListRouteTemplate(courseListOperation, courseListSchema);
export const { GET } = courseRoutes.createRoute();
```

**After:**

```typescript
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    const coursesWithStats = await db
      .select({...})
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .groupBy(courses.id);

    return RouteUtils.createSuccessResponse({
      courses: formattedCourses,
      statistics: { ... }
    });
  }, {
    requireAuth: true,
    requireRole: 'hr_admin',
    validateQuery: CommonSchemas.courseFilters
  });
}
```

#### Analytics Template Migration

**Before:**

```typescript
const analyticsOperation = async (params: any) => {
  let analytics = {};

  if (params.plantId) {
    const plantStats = await getPlantStats(params.plantId);
    analytics = { ...analytics, plantStats };
  }

  return analytics;
};

const analyticsRoutes = new AnalyticsRouteTemplate(
  analyticsOperation,
  analyticsSchema,
);
export const { GET } = analyticsRoutes.createRoute();
```

**After:**

```typescript
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req) || {};

      let analytics = {};

      if (query.plantId) {
        const plantStats = await getPlantStats(query.plantId);
        analytics = { ...analytics, plantStats };
      }

      return RouteUtils.createSuccessResponse(analytics);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: CommonSchemas.analyticsFilters,
    },
  );
}
```

### Step 3: Update Authentication Patterns

**Before:**

```typescript
export async function GET(request: NextRequest) {
  return await UnifiedAuthMiddleware.withAdminAuth(
    request,
    async (profile, adminRoles) => {
      // Route logic
      return data;
    },
    "hr_admin",
  );
}
```

**After:**

```typescript
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      // Route logic
      return RouteUtils.createSuccessResponse(data);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
    },
  );
}
```

### Step 4: Update Validation Patterns

**Before:**

```typescript
export async function POST(request: NextRequest) {
  return ValidationMiddleware.validateBody(
    createUserSchema,
    async (req, context, body) => {
      const result = await createUser(body);
      return ResponseUtils.success(result);
    },
  );
}
```

**After:**

```typescript
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody(req);
      const result = await createUser(body);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      validateBody: createUserSchema,
    },
  );
}
```

### Step 5: Update Error Handling

**Before:**

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);
    const result = await createUser(validatedData);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const errorResponse = formatErrorResponse(error as Error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.statusCode,
    });
  }
}
```

**After:**

```typescript
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody(req);
      const result = await createUser(body);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      validateBody: createUserSchema,
    },
  );
}
```

## Common Migration Patterns

### 1. Simple GET Route

**Before:**

```typescript
export async function GET(request: NextRequest) {
  const authResult = await authenticateAdmin("hr_admin");
  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status);
  }

  const data = await getData();
  return NextResponse.json({ success: true, data });
}
```

**After:**

```typescript
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const data = await getData();
      return RouteUtils.createSuccessResponse(data);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
    },
  );
}
```

### 2. POST Route with Validation

**Before:**

```typescript
export async function POST(request: NextRequest) {
  const authResult = await authenticateAdmin("hr_admin");
  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status);
  }

  try {
    const body = await request.json();
    const validatedData = createSchema.parse(body);
    const result = await createResource(validatedData);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return formatErrorResponse(error);
  }
}
```

**After:**

```typescript
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody(req);
      const result = await createResource(body);
      return RouteUtils.createCreatedResponse(
        result,
        "Resource created successfully",
      );
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateBody: createSchema,
    },
  );
}
```

### 3. Route with Query Parameters

**Before:**

```typescript
export async function GET(request: NextRequest) {
  const authResult = await authenticateAdmin("hr_admin");
  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status);
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");

  const result = await getPaginatedData({ page, limit });
  return NextResponse.json({ success: true, data: result });
}
```

**After:**

```typescript
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req);
      const result = await getPaginatedData(query);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: paginationSchema,
    },
  );
}
```

## Testing Migration

### Update Test Files

**Before:**

```typescript
import { CrudRouteTemplate } from "@/app/api/shared/templates/crud-route-template";
import { AuthMiddleware } from "@/app/api/shared/middleware/auth-middleware";

describe("User Routes", () => {
  it("should create user", async () => {
    const template = new CrudRouteTemplate(operations, schemas);
    const routes = template.createRoutes();
    // Test template...
  });
});
```

**After:**

```typescript
import { RouteUtils } from "@/lib/route-utils";

describe("User Routes", () => {
  it("should create user", async () => {
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "test@example.com" }),
    });

    const handler = vi
      .fn()
      .mockResolvedValue(RouteUtils.createSuccessResponse({ id: 1 }));

    const result = await RouteUtils.handleRequest(request, handler, {
      validateBody: createUserSchema,
    });

    expect(result).toBeDefined();
  });
});
```

## Benefits of Migration

### Before Migration

- Complex template classes with multiple layers
- Inconsistent patterns across routes
- Difficult to understand and debug
- Hard to test individual components
- High learning curve for new developers

### After Migration

- Simple, consistent patterns
- Easy to understand and debug
- Straightforward testing
- Low learning curve
- Better maintainability

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure to update all imports to use the new `RouteUtils`
2. **Validation Errors**: Ensure Zod schemas are properly defined
3. **Authentication Issues**: Check that `requireAuth` and `requireRole` options are set correctly
4. **Response Format**: Use the appropriate response utility methods

### Getting Help

If you encounter issues during migration:

1. Check the simplified API route patterns documentation
2. Look at existing migrated routes for examples
3. Use the migration utilities in `src/lib/route-migration-utils.ts`
4. Run tests to verify your changes work correctly

## Migration Checklist

- [ ] Update imports to use `RouteUtils`
- [ ] Replace template classes with `RouteUtils.handleRequest`
- [ ] Update authentication patterns
- [ ] Update validation patterns
- [ ] Update error handling
- [ ] Update response formatting
- [ ] Update tests
- [ ] Verify functionality works correctly
- [ ] Remove old template imports
- [ ] Clean up unused code

This migration will result in cleaner, more maintainable API routes that are easier to understand and test.
