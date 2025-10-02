# Database Layer Migration Guide

**Date:** January 25, 2025  
**Phase:** 3 - Gradual Migration  
**Status:** In Progress

## Overview

This guide provides step-by-step instructions for migrating from the complex database operation classes to the simplified `DatabaseService`. The migration uses a compatibility layer to ensure zero-downtime transitions.

## Migration Strategy

### Phase 1: Enable New Service (Gradual Rollout)

1. **Start with Legacy Service**

   ```typescript
   import { MigrationUtils } from "@/lib/db/operations";

   // Initially disabled - using legacy operations
   MigrationUtils.disableNewService();
   ```

2. **Enable Logging for Monitoring**

   ```typescript
   MigrationUtils.enableLogging();
   ```

3. **Enable New Service for Specific Operations**
   ```typescript
   // Enable new service
   MigrationUtils.enableNewService();
   ```

### Phase 2: Update API Routes

The API routes have been updated to use the compatibility layer:

```typescript
// Before (Direct legacy operations)
import { getUsersWithDetails, createProfile } from "@/lib/db/operations";

// After (Compatibility layer)
import { UserOperationsCompat } from "@/lib/db/operations";

// Operations automatically route to new or legacy service
const result = await UserOperationsCompat.getUsersWithDetails(
  filters,
  userContext,
);
```

### Phase 3: Update Components

Components should be updated to pass `userContext` for proper tenant filtering:

```typescript
// Before
const users = await db.users.getWithDetails(filters);

// After
const users = await db.users.getWithDetails(filters, userContext);
```

## Migration Steps

### Step 1: Enable New Service

```typescript
// In your application startup or configuration
import { MigrationUtils } from "@/lib/db/operations";

// Enable new service
MigrationUtils.enableNewService();

// Enable logging to monitor migration
MigrationUtils.enableLogging();
```

### Step 2: Update API Routes

The following API routes have been updated:

- ✅ `src/app/api/admin/users/route.ts` - Updated to use `UserOperationsCompat`
- ✅ `src/app/api/admin/enrollments/route.ts` - Updated to use `EnrollmentOperationsCompat`
- 🔄 `src/app/api/admin/courses/route.ts` - Needs update to use `CourseOperationsCompat`
- 🔄 `src/app/api/admin/analytics/route.ts` - Needs update to use `AnalyticsOperationsCompat`

### Step 3: Update Components

Components need to be updated to pass `userContext`:

```typescript
// Example: User management component
import { UserOperationsCompat } from "@/lib/db/operations";

const UserManagement = ({ userContext }) => {
  const [users, setUsers] = useState([]);

  const loadUsers = async (filters) => {
    const result = await UserOperationsCompat.getUsersWithDetails(
      filters,
      userContext,
    );
    if (result.success) {
      setUsers(result.data.data);
    }
  };

  // ... rest of component
};
```

### Step 4: Update Hooks

Custom hooks should be updated to use the new service:

```typescript
// Example: useUsers hook
import { UserOperationsCompat } from "@/lib/db/operations";

export const useUsers = (userContext) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async (filters) => {
    setLoading(true);
    try {
      const result = await UserOperationsCompat.getUsersWithDetails(
        filters,
        userContext,
      );
      if (result.success) {
        setUsers(result.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return { users, loadUsers, loading };
};
```

## Testing Migration

### 1. Enable Logging

```typescript
MigrationUtils.enableLogging();
```

### 2. Monitor Logs

Look for migration logs in the console:

```
Migration: getUsersWithDetails using new service
Migration: createUser using new service
```

### 3. Test Operations

Test each operation to ensure it works correctly:

```typescript
// Test user operations
const users = await UserOperationsCompat.getUsersWithDetails(
  filters,
  userContext,
);
const user = await UserOperationsCompat.getUserById(id, userContext);
const newUser = await UserOperationsCompat.createUser(userData);

// Test course operations
const courses = await CourseOperationsCompat.getCoursesWithDetails(
  filters,
  userContext,
);
const course = await CourseOperationsCompat.getCourseById(id, userContext);

// Test enrollment operations
const enrollments = await EnrollmentOperationsCompat.getEnrollmentsWithDetails(
  filters,
  userContext,
);
const enrollment =
  await EnrollmentOperationsCompat.createEnrollment(enrollmentData);
```

## Rollback Strategy

If issues are encountered, rollback to legacy service:

```typescript
// Disable new service
MigrationUtils.disableNewService();

// Disable logging
MigrationUtils.disableLogging();
```

## Performance Monitoring

### Before Migration

- Monitor query execution times
- Track database connection usage
- Monitor error rates

### During Migration

- Compare performance between new and legacy services
- Monitor error rates
- Track migration success rates

### After Migration

- Verify performance improvements
- Monitor error rates
- Track user experience metrics

## Success Metrics

### Code Quality

- ✅ Reduced from 4 operation classes to 1 service class
- ✅ Consistent API patterns across all operations
- ✅ Unified tenant filtering implementation

### Performance

- Target: 30% improvement in query execution time
- Target: Reduced memory usage from simplified queries
- Target: Faster response times from reduced abstraction overhead

### Maintainability

- ✅ Single service class for all database operations
- ✅ Consistent error handling patterns
- ✅ Simplified debugging with direct Drizzle queries

## Troubleshooting

### Common Issues

1. **Missing UserContext**

   ```typescript
   // Error: userContext is required for new service
   // Solution: Pass userContext to operations
   const result = await UserOperationsCompat.getUsersWithDetails(
     filters,
     userContext,
   );
   ```

2. **Tenant Access Denied**

   ```typescript
   // Error: Access denied
   // Solution: Ensure userContext has proper accessiblePlants
   const userContext = {
     accessiblePlants: ["plant-1", "plant-2"],
     roles: [],
   };
   ```

3. **Legacy Fallback Issues**
   ```typescript
   // Error: Legacy operation not found
   // Solution: Enable fallback in migration config
   MigrationManager.updateConfig({ fallbackToLegacy: true });
   ```

### Debugging

1. **Enable Detailed Logging**

   ```typescript
   MigrationUtils.enableLogging();
   ```

2. **Check Migration Status**

   ```typescript
   const status = MigrationUtils.getStatus();
   console.log("Migration status:", status);
   ```

3. **Test Individual Operations**
   ```typescript
   // Test specific operation
   const result = await UserOperationsCompat.getUserById(id, userContext);
   console.log("Operation result:", result);
   ```

## Next Steps

1. **Complete API Route Updates**
   - Update remaining course and analytics routes
   - Test all API endpoints

2. **Update Components**
   - Update all components to pass userContext
   - Test user interface functionality

3. **Performance Testing**
   - Run performance benchmarks
   - Compare before/after metrics

4. **Production Deployment**
   - Deploy with new service enabled
   - Monitor production metrics
   - Rollback if issues occur

This migration guide ensures a smooth transition from the complex database layer to the simplified unified service while maintaining backward compatibility and providing rollback capabilities.
