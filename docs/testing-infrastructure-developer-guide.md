# Testing Infrastructure Simplification - Developer Guide

## Overview

This guide provides comprehensive documentation for the simplified testing infrastructure. The new system reduces complexity, improves maintainability, and provides consistent patterns across all test types.

## Quick Start

### Basic Test Setup

```typescript
import { describe, it, expect } from "vitest";
import { TestHelpers, TestPatterns } from "../setup";

describe("My Component", () => {
  it("should work correctly", () => {
    const testData = TestHelpers.createTestUser();
    expect(testData).toHaveProperty("id");
    expect(testData).toHaveProperty("email");
  });
});
```

### Using Test Patterns

```typescript
import { TestPatterns } from "../setup";

// Test API route
const response = await TestPatterns.testApiRoute(handler, request, 200);

// Test database operation
const result = await TestPatterns.testDatabaseOperation(() =>
  createUser(userData),
);

// Test component
TestPatterns.testComponent(MyComponent, { prop: "value" }, "renders correctly");
```

## Core Components

### 1. Test Setup (`src/__tests__/setup.ts`)

The centralized test setup provides:

- **TestHelpers**: Utilities for creating test data and rendering components
- **TestPatterns**: Essential testing patterns for common scenarios
- **Mock utilities**: API response mocking and error handling
- **Environment setup**: Automatic test environment configuration

#### TestHelpers

```typescript
// Create test data
const user = TestHelpers.createTestUser({ firstName: 'John' })
const course = TestHelpers.createTestCourse({ title: 'Safety 101' })
const enrollment = TestHelpers.createTestEnrollment({ status: 'enrolled' })

// Create authentication context
const authContext = TestHelpers.createTestAuthContext('admin')

// Create API request
const request = TestHelpers.createTestRequest('POST', { data: 'test' })

// Render with providers
const { getByText } = TestHelpers.renderWithProviders(<MyComponent />)
```

#### TestPatterns

```typescript
// API route testing
const response = await TestPatterns.testApiRoute(handler, request, 200);

// Database operation testing
const result = await TestPatterns.testDatabaseOperation(
  operation,
  expectedResult,
);

// Component testing
TestPatterns.testComponent(Component, props, "test name");

// Form testing
TestPatterns.testForm(FormComponent, formData, "test name");
```

### 2. Test Templates

#### Unit Test Template (`src/__tests__/templates/unit-test-template.ts`)

```typescript
import {
  createComponentTest,
  createHookTest,
  createUtilityTest,
} from "../templates/unit-test-template";

// Component testing
createComponentTest("Button", [
  {
    name: "should render correctly",
    props: { children: "Click me" },
    test: ({ getByText }) => {
      expect(getByText("Click me")).toBeInTheDocument();
    },
  },
]);

// Hook testing
createHookTest("useApi", [
  {
    name: "should return loading state",
    test: () => {
      // Test hook behavior
    },
  },
]);

// Utility testing
createUtilityTest("formatDate", [
  {
    name: "should format date correctly",
    input: new Date("2024-01-01"),
    expected: "2024-01-01",
  },
]);
```

#### API Route Template (`src/__tests__/templates/api-route-template.ts`)

```typescript
import {
  createApiRouteTest,
  ApiRoutePatterns,
} from "../templates/api-route-template";

// Full API route test
createApiRouteTest("Users API", handler, [
  {
    name: "should handle GET request",
    method: "GET",
    expectedStatus: 200,
    expectedData: { success: true, data: [] },
  },
  {
    name: "should handle POST request",
    method: "POST",
    body: { name: "Test User" },
    expectedStatus: 201,
  },
]);

// Using patterns
const response = await ApiRoutePatterns.testGet(handler, 200);
const response = await ApiRoutePatterns.testPost(handler, data, 201);
const response = await ApiRoutePatterns.testAuth(handler, token, 200);
```

#### Database Template (`src/__tests__/templates/database-template.ts`)

```typescript
import {
  createDatabaseTest,
  DatabasePatterns,
} from "../templates/database-template";

// Full database test
createDatabaseTest("User", [
  {
    name: "should create user",
    operation: async () => {
      return TestHelpers.createTestUser();
    },
    expectedResult: { id: expect.any(String), email: expect.any(String) },
  },
]);

// Using patterns
const result = await DatabasePatterns.testCreate(createFn);
const result = await DatabasePatterns.testRead(readFn);
const result = await DatabasePatterns.testUpdate(updateFn);
const result = await DatabasePatterns.testDelete(deleteFn);
```

### 3. Migration Utilities (`src/__tests__/utils/migration-utils.ts`)

```typescript
import { MigrationHelpers } from "../utils/migration-utils";

// Migrate existing tests
MigrationHelpers.migrateComponentTest("Button", existingTests);
MigrationHelpers.migrateApiRouteTest("Users API", handler, existingTests);
MigrationHelpers.migrateDatabaseTest("User", existingTests);
```

## Testing Patterns

### 1. Component Testing

```typescript
import { createComponentTest } from "../templates/unit-test-template";

createComponentTest("MyComponent", [
  {
    name: "should render with props",
    props: { title: "Test Title" },
    test: ({ getByText }) => {
      expect(getByText("Test Title")).toBeInTheDocument();
    },
  },
  {
    name: "should handle user interaction",
    props: { onClick: vi.fn() },
    test: ({ getByRole }) => {
      const button = getByRole("button");
      button.click();
      expect(button).toBeInTheDocument();
    },
  },
]);
```

### 2. API Route Testing

```typescript
import { createApiRouteTest } from "../templates/api-route-template";

createApiRouteTest("Users API", handler, [
  {
    name: "should handle GET request",
    method: "GET",
    expectedStatus: 200,
    expectedData: { success: true, data: [] },
  },
  {
    name: "should handle POST request",
    method: "POST",
    body: { name: "Test User" },
    expectedStatus: 201,
  },
  {
    name: "should handle authentication",
    method: "GET",
    headers: { Authorization: "Bearer token" },
    expectedStatus: 200,
  },
  {
    name: "should handle validation error",
    method: "POST",
    body: { name: "" },
    expectedStatus: 400,
  },
]);
```

### 3. Database Testing

```typescript
import { createDatabaseTest } from "../templates/database-template";

createDatabaseTest("User", [
  {
    name: "should create user",
    operation: async () => {
      const userData = TestHelpers.createTestUser();
      return await createUser(userData);
    },
    expectedResult: { id: expect.any(String), email: expect.any(String) },
  },
  {
    name: "should read user by id",
    operation: async () => {
      return await getUserById("user-123");
    },
    expectedResult: { id: "user-123", email: expect.any(String) },
  },
]);
```

### 4. Business Logic Testing

```typescript
import { TestPatterns } from "../setup";

describe("User Management", () => {
  it("should validate user data", async () => {
    const validateUser = async (userData: any) => {
      if (!userData.email || !userData.firstName) {
        throw new Error("Email and first name are required");
      }
      return userData;
    };

    const validData = { email: "test@example.com", firstName: "John" };
    const result = await TestPatterns.testDatabaseOperation(() =>
      validateUser(validData),
    );

    expect(result.email).toBe("test@example.com");
  });

  it("should handle validation errors", async () => {
    const validateUser = async (userData: any) => {
      if (!userData.email) {
        throw new Error("Email is required");
      }
      return userData;
    };

    await expect(
      TestPatterns.testDatabaseOperation(() => validateUser({})),
    ).rejects.toThrow("Email is required");
  });
});
```

## Best Practices

### 1. Test Organization

```
src/__tests__/
├── setup.ts                    # Centralized test setup
├── templates/                  # Test templates
│   ├── unit-test-template.ts
│   ├── api-route-template.ts
│   └── database-template.ts
├── utils/                      # Test utilities
│   └── migration-utils.ts
├── examples/                   # Example tests
│   └── simplified-test-examples.ts
├── business-logic/            # Business logic tests
│   └── critical-business-logic.test.ts
├── api-routes/               # API route tests
│   └── critical-api-routes.test.ts
└── components/               # Component tests
    └── ui-components.test.tsx
```

### 2. Naming Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Test descriptions: Use descriptive names
- Test data: Use `TestHelpers.createTest*()` functions
- Mocks: Use `vi.fn()` for function mocks

### 3. Test Structure

```typescript
describe("Component/Feature Name", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should do something specific", () => {
    // Arrange
    const testData = TestHelpers.createTestUser();

    // Act
    const result = someFunction(testData);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
```

### 4. Error Testing

```typescript
// Test error scenarios
it("should handle validation errors", async () => {
  await expect(
    TestPatterns.testDatabaseOperation(() => validateInvalidData()),
  ).rejects.toThrow("Validation failed");
});

// Test error responses
it("should return error response", async () => {
  const response = await TestPatterns.testApiRoute(handler, request, 400);
  expect(response.status).toBe(400);
});
```

## Migration Guide

### From Old Testing System

1. **Replace test utilities**:

   ```typescript
   // Old
   import { testUtils } from "../setup";
   const user = testUtils.createMockUser();

   // New
   import { TestHelpers } from "../setup";
   const user = TestHelpers.createTestUser();
   ```

2. **Use test patterns**:

   ```typescript
   // Old
   const response = await handler(request);
   expect(response.status).toBe(200);

   // New
   const response = await TestPatterns.testApiRoute(handler, request, 200);
   ```

3. **Use templates**:

   ```typescript
   // Old
   describe("Component", () => {
     it("should work", () => {
       // Complex test setup
     });
   });

   // New
   createComponentTest("Component", [
     {
       name: "should work",
       test: () => {
         // Simple test
       },
     },
   ]);
   ```

### Migration Utilities

```typescript
import { MigrationHelpers } from "../utils/migration-utils";

// Migrate existing tests
const migratedTest = MigrationHelpers.migrateComponentTest(
  "Button",
  existingTests,
);
```

## Performance Considerations

### Test Execution Time

- Use `TestPatterns.testDatabaseOperation()` for async operations
- Mock external dependencies
- Use `vi.clearAllMocks()` in `beforeEach`

### Memory Management

- Clean up test data after each test
- Use `afterEach(() => cleanup())` for component tests
- Avoid creating large test datasets

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure to import from the correct paths
2. **Mock issues**: Use `vi.clearAllMocks()` in `beforeEach`
3. **Async issues**: Use `await` with `TestPatterns.testDatabaseOperation()`

### Debug Tips

- Use `console.log()` for debugging test data
- Check test setup with `TestHelpers.createTestUser()`
- Verify mock functions with `vi.mocked()`

## Examples

See the following files for complete examples:

- `src/__tests__/examples/simplified-test-examples.ts`
- `src/__tests__/business-logic/critical-business-logic.test.ts`
- `src/__tests__/api-routes/critical-api-routes.test.ts`

## Support

For questions or issues with the testing infrastructure:

1. Check this documentation
2. Review example tests
3. Use migration utilities for existing tests
4. Follow the established patterns

The simplified testing infrastructure is designed to be intuitive and maintainable. Follow the patterns and templates provided for consistent, reliable tests.
