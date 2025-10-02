# Simplified API Route Patterns Documentation

## Overview

The API route template system has been simplified to provide a more straightforward, maintainable approach to building API routes. This replaces the complex template classes with simple utility functions that are easier to understand and use.

## Key Benefits

- **Simplified**: Single `RouteUtils.handleRequest` method handles all common patterns
- **Consistent**: All routes follow the same structure and patterns
- **Maintainable**: Less code, fewer abstractions, easier to debug
- **Flexible**: Easy to customize for specific needs
- **Testable**: Simple patterns are easier to test

## Core Concepts

### RouteUtils.handleRequest

The main utility function that consolidates:

- Authentication (user/admin)
- Validation (body/query)
- Error handling
- Response formatting

### Route Options

Simple options object to configure route behavior:

- `requireAuth`: Require user authentication
- `requireRole`: Require specific admin role
- `validateBody`: Validate request body with Zod schema
- `validateQuery`: Validate query parameters with Zod schema

## Basic Usage

### Simple GET Route

```typescript
import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";

export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      // Your route logic here
      const data = await getSomeData();
      return RouteUtils.createSuccessResponse(data);
    },
    {
      requireAuth: true,
    },
  );
}
```

### POST Route with Validation

```typescript
import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { z } from "zod";

const createSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

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

### Admin Route with Query Validation

```typescript
import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";
import { z } from "zod";

const filtersSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(50),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req);
      const result = await getResources(query);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: filtersSchema,
    },
  );
}
```

## Response Utilities

### Success Responses

```typescript
// Basic success response
RouteUtils.createSuccessResponse(data);

// Success with message
RouteUtils.createSuccessResponse(data, "Operation completed");

// Created response (201)
RouteUtils.createCreatedResponse(data, "Resource created");

// Updated response
RouteUtils.createUpdatedResponse(data, "Resource updated");

// Deleted response
RouteUtils.createDeletedResponse("Resource deleted");
```

### Paginated Responses

```typescript
const data = [...];
const pagination = {
  page: 1,
  limit: 50,
  total: 100,
  totalPages: 2
};

return RouteUtils.createPaginatedResponse(data, pagination);
```

### Error Responses

```typescript
// Basic error
RouteUtils.createErrorResponse("Something went wrong", 500);

// Validation error
RouteUtils.createErrorResponse("Validation failed", 400);

// Not found
RouteUtils.createErrorResponse("Resource not found", 404);
```

## Authentication Patterns

### User Authentication

```typescript
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      // User is authenticated, get user ID from headers
      const userId = req.headers.get("x-user-id");
      const data = await getUserData(userId);
      return RouteUtils.createSuccessResponse(data);
    },
    {
      requireAuth: true,
    },
  );
}
```

### Admin Authentication

```typescript
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      // Admin is authenticated with required role
      const data = await createAdminResource();
      return RouteUtils.createSuccessResponse(data);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
    },
  );
}
```

## Validation Patterns

### Body Validation

```typescript
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18),
});

export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody(req); // Already validated
      const result = await createUser(body);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      validateBody: schema,
    },
  );
}
```

### Query Validation

```typescript
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  search: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req); // Already validated
      const result = await searchUsers(query);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      validateQuery: querySchema,
    },
  );
}
```

## Utility Functions

### Pagination

```typescript
const pagination = RouteUtils.extractPaginationParams(request);
// Returns: { page: 1, limit: 50, offset: 0 }
```

### Search Parameters

```typescript
const search = RouteUtils.extractSearchParams(request);
// Returns: { search: 'term', sort: 'desc', sortBy: 'name' }
```

### Filter Parameters

```typescript
const filters = RouteUtils.extractFilterParams(request, [
  "status",
  "published",
]);
// Returns: { status: 'active', published: true }
```

## Migration from Templates

### Before (Complex Template)

```typescript
import { CrudRouteTemplate } from "@/app/api/shared/templates/crud-route-template";

const userRoutes = new CrudRouteTemplate(userOperations, userSchemas);
export const { GET, POST } = userRoutes.createRoutes();
```

### After (Simplified)

```typescript
import { RouteUtils } from "@/lib/route-utils";

export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req);
      const result = await getUserList(query);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: userFiltersSchema,
    },
  );
}

export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody(req);
      const result = await createUser(body);
      return RouteUtils.createCreatedResponse(result);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateBody: createUserSchema,
    },
  );
}
```

## Error Handling

All errors are automatically handled by `RouteUtils.handleRequest`:

- **Validation errors**: Zod validation errors are caught and returned as 400 responses
- **Authentication errors**: Auth failures return 401/403 responses
- **Generic errors**: Unexpected errors return 500 responses

```typescript
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      // Any error thrown here will be automatically handled
      const body = RouteUtils.getValidatedBody(req);

      if (body.email === "admin@example.com") {
        throw new Error("Admin email not allowed"); // Will return 500 error
      }

      const result = await createUser(body);
      return RouteUtils.createSuccessResponse(result);
    },
    {
      validateBody: createUserSchema,
    },
  );
}
```

## Testing

### Unit Testing Routes

```typescript
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { RouteUtils } from "@/lib/route-utils";

describe("User API", () => {
  it("should create user with valid data", async () => {
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
    expect(handler).toHaveBeenCalled();
  });
});
```

## Best Practices

### 1. Keep Routes Simple

```typescript
// Good: Simple, focused route
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const users = await getUserList();
      return RouteUtils.createSuccessResponse(users);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
    },
  );
}

// Avoid: Complex logic in route handler
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(request, async (req) => {
    // Don't put complex business logic here
    // Move it to service functions
    const users = await UserService.getUsersWithComplexLogic();
    return RouteUtils.createSuccessResponse(users);
  });
}
```

### 2. Use Proper Validation

```typescript
// Good: Comprehensive validation
const createUserSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
  plantId: z.string().uuid().optional(),
});

// Avoid: Weak validation
const createUserSchema = z.object({
  firstName: z.string(),
  email: z.string(),
});
```

### 3. Consistent Error Messages

```typescript
// Good: Clear, consistent error messages
throw new Error("User with this email already exists");
throw new Error("Invalid plant ID provided");
throw new Error("Insufficient permissions for this operation");

// Avoid: Generic or unclear errors
throw new Error("Error");
throw new Error("Something went wrong");
```

### 4. Proper Response Types

```typescript
// Good: Use appropriate response methods
return RouteUtils.createCreatedResponse(data, "User created successfully");
return RouteUtils.createUpdatedResponse(data, "User updated successfully");
return RouteUtils.createDeletedResponse("User deleted successfully");

// Avoid: Generic success responses for all operations
return RouteUtils.createSuccessResponse(data);
```

## Common Patterns

### CRUD Operations

```typescript
// GET /api/users - List users
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req);
      const users = await UserService.getUsers(query);
      return RouteUtils.createSuccessResponse(users);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: userFiltersSchema,
    },
  );
}

// POST /api/users - Create user
export async function POST(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody(req);
      const user = await UserService.createUser(body);
      return RouteUtils.createCreatedResponse(
        user,
        "User created successfully",
      );
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateBody: createUserSchema,
    },
  );
}

// PUT /api/users/[id] - Update user
export async function PUT(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const body = RouteUtils.getValidatedBody(req);
      const userId = extractUserIdFromPath(req);
      const user = await UserService.updateUser(userId, body);
      return RouteUtils.createUpdatedResponse(
        user,
        "User updated successfully",
      );
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateBody: updateUserSchema,
    },
  );
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const userId = extractUserIdFromPath(req);
      await UserService.deleteUser(userId);
      return RouteUtils.createDeletedResponse("User deleted successfully");
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
    },
  );
}
```

### Analytics Routes

```typescript
// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  return RouteUtils.handleRequest(
    request,
    async (req) => {
      const query = RouteUtils.getValidatedQuery(req);
      const analytics = await AnalyticsService.getAnalytics(query);
      return RouteUtils.createSuccessResponse(analytics);
    },
    {
      requireAuth: true,
      requireRole: "hr_admin",
      validateQuery: analyticsFiltersSchema,
    },
  );
}
```

This simplified approach makes API routes much easier to understand, maintain, and test while providing all the functionality of the previous complex template system.
