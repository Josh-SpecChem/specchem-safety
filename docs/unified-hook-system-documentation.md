# Unified Hook System Documentation

## Overview

The Unified Hook System provides a consistent, performant, and maintainable approach to data fetching and state management in the SpecChem Safety Training application. This system replaces the fragmented legacy hook implementations with a single, cohesive architecture.

## Architecture

### Core Components

1. **`useUnifiedApi`** - Base hook for single resource fetching
2. **`useUnifiedList`** - Hook for paginated list data
3. **`useUnifiedMutation`** - Hook for data mutations
4. **`useUnifiedOptimisticUpdate`** - Hook for optimistic updates
5. **Domain-specific hooks** - Specialized hooks for specific business logic

### Key Features

- **Consistent API**: All hooks follow the same patterns and interfaces
- **React Query Integration**: Built on top of React Query for caching and synchronization
- **TypeScript Support**: Full type safety with Zod schema validation
- **Error Handling**: Comprehensive error handling with retry logic
- **Caching Strategy**: Intelligent caching with data-specific TTLs
- **Optimistic Updates**: Support for optimistic UI updates
- **Request Deduplication**: Automatic deduplication of identical requests

## Usage Guide

### Basic Data Fetching

```typescript
import { useUnifiedApi } from '@/hooks/useUnifiedApi'
import { courseProgressSchema } from '@/lib/schemas'

function CourseProgressComponent({ courseId }: { courseId: string }) {
  const { data, isLoading, error, refetch } = useUnifiedApi({
    endpoint: `/api/courses/${courseId}/progress`,
    queryKey: ['course-progress', courseId],
    schema: courseProgressSchema,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Course Progress</h2>
      <p>Completion: {data?.progressPercent}%</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

### List Data with Pagination

```typescript
import { useUnifiedList } from '@/hooks/useUnifiedApi'
import { userSchema } from '@/lib/schemas'

function UserListComponent() {
  const {
    data: users,
    isLoading,
    error,
    pagination,
    hasNextPage,
    hasPreviousPage,
    updateParams,
    refetch
  } = useUnifiedList({
    endpoint: '/api/users',
    queryKey: ['users'],
    params: { page: 1, limit: 20 },
    schema: userSchema.array(),
  })

  const handlePageChange = (page: number) => {
    updateParams({ page })
  }

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Users ({pagination.total})</h2>
      <div>
        {users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
      <div>
        <button
          disabled={!hasPreviousPage}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button
          disabled={!hasNextPage}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

### Data Mutations

```typescript
import { useUnifiedMutation } from '@/hooks/useUnifiedApi'
import { courseSchema } from '@/lib/schemas'

function CreateCourseComponent() {
  const {
    mutate: createCourse,
    isLoading,
    error,
    isSuccess,
    data: newCourse
  } = useUnifiedMutation({
    endpoint: '/api/courses',
    method: 'POST',
    queryKey: ['courses'],
    schema: courseSchema,
    invalidateQueries: [
      ['courses'],
      ['dashboard-stats']
    ],
    onSuccess: (data) => {
      console.log('Course created:', data)
      // Redirect or show success message
    },
    onError: (error) => {
      console.error('Failed to create course:', error)
    }
  })

  const handleSubmit = (formData: CreateCourseData) => {
    createCourse(formData)
  }

  if (isSuccess) {
    return <div>Course created successfully!</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Course'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </form>
  )
}
```

### Optimistic Updates

```typescript
import { useUnifiedOptimisticUpdate } from '@/hooks/useUnifiedApi'

function OptimisticUpdateExample() {
  const {
    mutate: updateUser,
    isLoading,
    error
  } = useUnifiedOptimisticUpdate({
    queryKey: ['user', userId],
    mutationFn: async (variables) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(variables)
      })
      return response.json()
    },
    updater: (oldData, variables) => ({
      ...oldData,
      ...variables,
      updatedAt: new Date().toISOString()
    }),
    onSuccess: (data) => {
      console.log('User updated:', data)
    },
    onError: (error) => {
      console.error('Update failed:', error)
    }
  })

  const handleUpdate = (updates: Partial<User>) => {
    updateUser(updates)
  }

  return (
    <button onClick={() => handleUpdate({ name: 'New Name' })}>
      Update Name
    </button>
  )
}
```

## Domain-Specific Hooks

### Progress Management

```typescript
import { useProgress, useCourseProgress, useQuestionEvents } from '@/hooks/useUnifiedProgress'

function TrainingComponent({ courseId }: { courseId: string }) {
  // Get all user progress
  const { data: allProgress, isLoading: progressLoading } = useProgress()

  // Get specific course progress
  const {
    progress,
    updateProgress,
    loading: courseLoading
  } = useCourseProgress(`/${courseId}`)

  // Record question responses
  const { recordQuestion, submitting } = useQuestionEvents(`/${courseId}`)

  const handleSectionComplete = async () => {
    await updateProgress(100, 'section1', 'complete_course')
  }

  const handleQuestionAnswer = async (questionId: string, isCorrect: boolean) => {
    await recordQuestion('section1', questionId, isCorrect, 1)
  }

  return (
    <div>
      <h2>Training Progress</h2>
      <p>Course Progress: {progress?.progressPercent}%</p>
      <button onClick={handleSectionComplete}>
        Complete Section
      </button>
    </div>
  )
}
```

### Admin Management

```typescript
import { useUsers, useCourses, useEnrollments } from '@/hooks/useUnifiedAdmin'

function AdminDashboard() {
  const { data: users, isLoading: usersLoading } = useUsers({ limit: 10 })
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments()

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <h3>Users ({users?.length})</h3>
        {usersLoading ? <div>Loading...</div> : (
          users?.map(user => <div key={user.id}>{user.name}</div>)
        )}
      </div>
      <div>
        <h3>Courses ({courses?.length})</h3>
        {coursesLoading ? <div>Loading...</div> : (
          courses?.map(course => <div key={course.id}>{course.title}</div>)
        )}
      </div>
    </div>
  )
}
```

## Configuration

### Cache Strategy

The unified hook system uses intelligent caching with data-specific TTLs:

```typescript
export const UNIFIED_CACHE_CONFIG = {
  userData: 5 * 60 * 1000, // 5 minutes
  courseData: 3 * 60 * 1000, // 3 minutes
  progressData: 30 * 1000, // 30 seconds
  analyticsData: 1 * 60 * 1000, // 1 minute
  enrollmentData: 2 * 60 * 1000, // 2 minutes
};
```

### Cache Invalidation

Automatic cache invalidation based on data relationships:

```typescript
export const CACHE_INVALIDATION = {
  onUserUpdate: ["users", "enrollments", "analytics"],
  onCourseUpdate: ["courses", "enrollments", "analytics"],
  onEnrollmentUpdate: ["enrollments", "analytics", "dashboard-stats"],
  onProgressUpdate: ["progress", "analytics", "dashboard-stats"],
};
```

## Migration Guide

### From Legacy Hooks

**Before (Legacy):**

```typescript
import { useProgress } from "@/hooks/useApi";

function Component() {
  const { progress, loading, error, refetch } = useProgress();
  // ...
}
```

**After (Unified):**

```typescript
import { useProgress } from "@/hooks/useUnifiedProgress";

function Component() {
  const { data: progress, isLoading: loading, error, refetch } = useProgress();
  // ...
}
```

### From Standardized Hooks

**Before (Standardized):**

```typescript
import { useApiList } from "@/hooks/useStandardizedApi";

function Component() {
  const { data, isLoading, error, refetch } = useApiList({
    endpoint: "/api/users",
    queryKey: ["users"],
  });
  // ...
}
```

**After (Unified):**

```typescript
import { useUnifiedList } from "@/hooks/useUnifiedApi";

function Component() {
  const { data, isLoading, error, refetch, pagination } = useUnifiedList({
    endpoint: "/api/users",
    queryKey: ["users"],
  });
  // ...
}
```

## Best Practices

### 1. Use Appropriate Hook Types

- **`useUnifiedApi`** for single resources
- **`useUnifiedList`** for paginated lists
- **`useUnifiedMutation`** for data changes
- **Domain-specific hooks** for business logic

### 2. Implement Proper Error Handling

```typescript
function Component() {
  const { data, isLoading, error, refetch } = useUnifiedApi({
    endpoint: '/api/data',
    queryKey: ['data'],
    onError: (error) => {
      // Log error for monitoring
      console.error('API Error:', error)
      // Show user-friendly message
      toast.error('Failed to load data')
    }
  })

  if (error) {
    return (
      <div>
        <p>Something went wrong: {error.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    )
  }

  // Component content
}
```

### 3. Optimize Caching

```typescript
// Use appropriate cache times based on data volatility
const { data } = useUnifiedApi({
  endpoint: "/api/user-profile",
  queryKey: ["user-profile"],
  staleTime: 10 * 60 * 1000, // 10 minutes - user data changes infrequently
  cacheTime: 30 * 60 * 1000, // 30 minutes
});

const { data: analytics } = useUnifiedApi({
  endpoint: "/api/analytics",
  queryKey: ["analytics"],
  staleTime: 1 * 60 * 1000, // 1 minute - analytics change frequently
  cacheTime: 5 * 60 * 1000, // 5 minutes
});
```

### 4. Use Optimistic Updates for Better UX

```typescript
const { mutate: updateUser } = useUnifiedOptimisticUpdate({
  queryKey: ["user", userId],
  mutationFn: updateUserApi,
  updater: (oldData, variables) => ({
    ...oldData,
    ...variables,
    updatedAt: new Date().toISOString(),
  }),
});

// UI updates immediately, reverts on error
const handleUpdate = (updates) => {
  updateUser(updates);
};
```

## Testing

### Unit Tests

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useUnifiedApi } from "@/hooks/useUnifiedApi";

describe("useUnifiedApi", () => {
  it("should fetch data successfully", async () => {
    const { result } = renderHook(() =>
      useUnifiedApi({
        endpoint: "/api/test",
        queryKey: ["test"],
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.isError).toBe(false);
  });
});
```

### Integration Tests

```typescript
import { renderHook } from "@testing-library/react";
import { useProgress } from "@/hooks/useUnifiedProgress";

describe("useProgress Integration", () => {
  it("should work with real API", async () => {
    const { result } = renderHook(() => useProgress());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## Performance Considerations

### 1. Request Deduplication

The system automatically deduplicates identical requests:

```typescript
// Multiple components requesting same data
const Component1 = () => {
  const { data } = useUnifiedApi({
    endpoint: "/api/users",
    queryKey: ["users"],
  });
  // ...
};

const Component2 = () => {
  const { data } = useUnifiedApi({
    endpoint: "/api/users",
    queryKey: ["users"],
  });
  // ...
};

// Only one request is made, both components receive the same data
```

### 2. Intelligent Caching

```typescript
// Data is cached and reused across components
const { data } = useUnifiedApi({
  endpoint: "/api/courses",
  queryKey: ["courses"],
  staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  cacheTime: 10 * 60 * 1000, // Data kept in cache for 10 minutes
});
```

### 3. Background Refetching

```typescript
// Data is automatically refetched in the background when stale
const { data } = useUnifiedApi({
  endpoint: "/api/analytics",
  queryKey: ["analytics"],
  refetchOnWindowFocus: true, // Refetch when window regains focus
  refetchOnMount: true, // Refetch when component mounts
});
```

## Troubleshooting

### Common Issues

1. **Stale Data**: Check cache configuration and invalidation patterns
2. **Infinite Loops**: Ensure query keys are stable and don't change on every render
3. **Memory Leaks**: Use proper cleanup in useEffect hooks
4. **Type Errors**: Ensure Zod schemas match API response structure

### Debug Tools

```typescript
// Enable React Query DevTools in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Offline Support**: Service worker integration for offline functionality
3. **Advanced Caching**: Redis integration for server-side caching
4. **Performance Monitoring**: Built-in performance metrics and monitoring
5. **A/B Testing**: Support for feature flags and A/B testing

This unified hook system provides a solid foundation for scalable, maintainable data management in the SpecChem Safety Training application.
