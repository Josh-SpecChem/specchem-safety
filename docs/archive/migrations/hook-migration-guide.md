# Hook Migration Guide

## Overview

This guide helps you migrate from legacy `useApi` hooks to the new standardized `useStandardizedApi` hooks. The new hooks provide enhanced functionality, better error handling, and improved performance.

## Migration Benefits

- **Enhanced Pagination**: Built-in pagination support with `hasNextPage`, `hasPreviousPage`
- **Better Error Handling**: Consistent error handling across all hooks
- **Optimistic Updates**: Improved optimistic update patterns
- **Query Invalidation**: Automatic cache invalidation
- **Type Safety**: Better TypeScript support
- **Performance**: Optimized caching and state management

## Migration Patterns

### 1. List/Query Hooks

#### Before (Legacy)

```typescript
import { useApi } from "@/hooks/useApi";

const { data, loading, error, refetch } = useApi.useApiList({
  endpoint: "/api/users",
  queryKey: ["users"],
});
```

#### After (Standardized)

```typescript
import { useApiList } from "@/hooks/useStandardizedApi";

const {
  data,
  isLoading,
  error,
  refetch,
  updateParams,
  pagination,
  hasNextPage,
  hasPreviousPage,
} = useApiList({
  endpoint: "/api/users",
  queryKey: ["users"],
  params: { page: 1, limit: 10 },
});
```

### 2. Mutation Hooks

#### Before (Legacy)

```typescript
import { useApi } from "@/hooks/useApi";

const { mutate, isLoading, error } = useApi.useApiMutation({
  endpoint: "/api/users",
  method: "POST",
});
```

#### After (Standardized)

```typescript
import { useApiMutation } from "@/hooks/useStandardizedApi";

const { mutate, mutateAsync, isLoading, error, isSuccess, data, reset } =
  useApiMutation({
    endpoint: "/api/users",
    method: "POST",
    queryKey: ["users"],
    invalidateQueries: [["users"]],
    optimisticUpdate: {
      queryKey: ["users"],
      updater: (oldData, variables) => ({
        ...oldData,
        data: [...oldData.data, { ...variables, id: "temp-id" }],
      }),
    },
  });
```

### 3. Optimistic Updates

#### Before (Legacy)

```typescript
import { useOptimisticUpdate } from "@/hooks/useOptimisticUpdates";

const optimisticUpdate = useOptimisticUpdate(currentData, (data, updates) => ({
  ...data,
  ...updates,
}));
```

#### After (Standardized)

```typescript
import { useOptimisticUpdate } from "@/hooks/useStandardizedApi";

const { mutate, mutateAsync, isLoading, error, isSuccess, data, reset } =
  useOptimisticUpdate({
    queryKey: ["users"],
    mutationFn: async (variables) => {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });
      return response.json();
    },
    updater: (oldData, variables) => ({
      ...oldData,
      data: oldData.data.map((user) =>
        user.id === variables.id ? { ...user, ...variables } : user,
      ),
    }),
  });
```

## Component Migration Examples

### User Management Component

#### Before

```typescript
import { useApi } from "@/hooks/useApi";

export function UserManagementContent() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useApi.useApiList({
    endpoint: "/api/admin/users",
    queryKey: ["users"],
  });

  const { mutate: createUser, isLoading: isCreating } = useApi.useApiMutation({
    endpoint: "/api/admin/users",
    method: "POST",
  });

  // ... component logic
}
```

#### After

```typescript
import { useApiList, useApiMutation } from "@/hooks/useStandardizedApi";

export function UserManagementContent() {
  const {
    data: users,
    isLoading,
    error,
    refetch,
    updateParams,
    pagination,
    hasNextPage,
    hasPreviousPage,
  } = useApiList({
    endpoint: "/api/admin/users",
    queryKey: ["users"],
    params: { page: 1, limit: 10 },
  });

  const {
    mutate: createUser,
    isLoading: isCreating,
    mutateAsync: createUserAsync,
  } = useApiMutation({
    endpoint: "/api/admin/users",
    method: "POST",
    queryKey: ["users"],
    invalidateQueries: [["users"]],
    optimisticUpdate: {
      queryKey: ["users"],
      updater: (oldData, variables) => ({
        ...oldData,
        data: [...oldData.data, { ...variables, id: "temp-id" }],
      }),
    },
  });

  // ... component logic with enhanced features
}
```

### Course Management Component

#### Before

```typescript
import { useApi } from "@/hooks/useApi";

export function CourseManagementContent() {
  const {
    data: courses,
    isLoading,
    error,
  } = useApi.useApiList({
    endpoint: "/api/admin/courses",
    queryKey: ["courses"],
  });

  const { mutate: updateCourse } = useApi.useApiMutation({
    endpoint: "/api/admin/courses",
    method: "PUT",
  });

  // ... component logic
}
```

#### After

```typescript
import { useApiList, useOptimisticUpdate } from "@/hooks/useStandardizedApi";

export function CourseManagementContent() {
  const {
    data: courses,
    isLoading,
    error,
    updateParams,
    pagination,
  } = useApiList({
    endpoint: "/api/admin/courses",
    queryKey: ["courses"],
    params: { page: 1, limit: 10, isActive: true },
  });

  const { mutate: updateCourse, isLoading: isUpdating } = useOptimisticUpdate({
    queryKey: ["courses"],
    mutationFn: async (variables) => {
      const response = await fetch(`/api/admin/courses/${variables.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });
      return response.json();
    },
    updater: (oldData, variables) => ({
      ...oldData,
      data: oldData.data.map((course) =>
        course.id === variables.id ? { ...course, ...variables } : course,
      ),
    }),
  });

  // ... component logic with optimistic updates
}
```

## API Changes

### New Features Available

1. **Pagination Support**
   - `pagination` object with page, limit, total, totalPages
   - `hasNextPage` and `hasPreviousPage` boolean flags
   - `updateParams` function to change query parameters

2. **Enhanced Error Handling**
   - Consistent error types across all hooks
   - Better error messages and handling

3. **Optimistic Updates**
   - Built-in optimistic update support
   - Automatic rollback on failure
   - Better performance for user interactions

4. **Query Invalidation**
   - Automatic cache invalidation after mutations
   - Configurable invalidation patterns

5. **Async Mutations**
   - `mutateAsync` for promise-based mutations
   - Better error handling and success callbacks

## Migration Checklist

- [ ] Update import statements to use `useStandardizedApi`
- [ ] Replace hook calls with new standardized versions
- [ ] Update destructuring to include new properties
- [ ] Add pagination support where needed
- [ ] Implement optimistic updates for better UX
- [ ] Update error handling to use new error patterns
- [ ] Test all functionality after migration
- [ ] Remove legacy hook imports

## Common Issues and Solutions

### Issue: Missing pagination data

**Solution**: Ensure your API returns pagination metadata in the response:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Issue: Optimistic updates not working

**Solution**: Make sure the `updater` function correctly modifies the data structure:

```typescript
updater: (oldData, variables) => ({
  ...oldData,
  data: oldData.data.map((item) =>
    item.id === variables.id ? { ...item, ...variables } : item,
  ),
});
```

### Issue: Cache not invalidating

**Solution**: Ensure `invalidateQueries` includes all relevant query keys:

```typescript
invalidateQueries: [["users"], ["users", "admin"], ["dashboard", "stats"]];
```

## Testing Migration

After migrating, test the following:

1. **Data Loading**: Verify data loads correctly
2. **Pagination**: Test pagination controls work
3. **Mutations**: Test create, update, delete operations
4. **Optimistic Updates**: Verify UI updates immediately
5. **Error Handling**: Test error scenarios
6. **Cache Invalidation**: Verify cache updates after mutations

## Support

If you encounter issues during migration:

1. Check the console for deprecation warnings
2. Review the migration examples above
3. Use the migration helper utilities
4. Test incrementally, one component at a time

The legacy hooks will continue to work during the transition period, but we recommend migrating as soon as possible to take advantage of the new features and better performance.
