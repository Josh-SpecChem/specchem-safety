# Plan 08: Migrate Frontend Hooks to Contract DTOs

**Status**: Ready for Implementation  
**Priority**: P1 - High  
**Estimated Time**: 1-2 days  
**Dependencies**: API routes migrated to contracts (Plan 07)

## 🎯 Objective

Migrate all frontend hooks from raw database types and local type definitions to standardized contract DTOs, ensuring type safety and consistency between frontend and backend data structures.

## 📋 Implementation Prompt

### Context

You are migrating React hooks in a Next.js application to use contract DTOs instead of raw database types or local type definitions. The application uses:

- Contract DTOs exported from `@/contracts`
- Custom hooks for data fetching and state management
- React Query/SWR patterns for caching
- TypeScript for type safety

The goal is to ensure all hooks return standardized shapes and use contract DTOs for complete type safety from database to UI components.

### Current State Analysis Required

1. **Audit existing hooks**:

   ```bash
   find src/hooks -name "*.ts" -o -name "*.tsx" | xargs grep -l "type\|interface"
   ```

2. **Identify hook patterns**:
   - Hooks using raw Drizzle types
   - Hooks with custom local types
   - Hooks with inconsistent return shapes
   - Hooks missing error handling

3. **Categorize by data entity**:
   - User/Profile hooks
   - Course hooks
   - Enrollment hooks
   - Progress hooks
   - Analytics hooks

### Step-by-Step Migration Process

#### Phase 1: Hook Inventory and Standardization (1 hour)

1. **Create hook inventory**:

   ```typescript
   // Create: docs/hook-migration-inventory.md
   interface HookInventory {
     hookName: string;
     filePath: string;
     currentReturnType: string;
     targetContractType: string;
     usesRawTypes: boolean;
     hasStandardShape: boolean;
     priority: "high" | "medium" | "low";
   }
   ```

2. **Define standard hook shape**:

   ```typescript
   // All hooks MUST return this standardized shape
   interface StandardHookResult<T> {
     data: T | null;
     loading: boolean;
     error: Error | null;
     refetch: () => Promise<void>;
   }

   // For paginated data
   interface PaginatedHookResult<T> {
     data: {
       items: T[];
       total: number;
       page: number;
       limit: number;
       totalPages: number;
     } | null;
     loading: boolean;
     error: Error | null;
     refetch: () => Promise<void>;
     loadMore: () => Promise<void>;
     hasNextPage: boolean;
   }

   // For mutations
   interface MutationHookResult<TData, TVariables> {
     mutate: (variables: TVariables) => Promise<TData>;
     data: TData | null;
     loading: boolean;
     error: Error | null;
     reset: () => void;
   }
   ```

#### Phase 2: Update Core Entity Hooks (3 hours)

For each hook, follow this exact pattern:

3. **Import contract dependencies**:

   ```typescript
   import { useState, useEffect, useCallback } from "react";
   import {
     type Profile,
     type CreateProfile,
     type UpdateProfile,
     type ProfileFilter,
     type PaginatedResponse,
     ProfileSchema,
     CreateProfileSchema,
     UpdateProfileSchema,
   } from "@/contracts";
   ```

4. **Implement single entity hooks**:

   ```typescript
   // Example: useProfile hook
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

     const fetchProfile = useCallback(async () => {
       try {
         setLoading(true);
         setError(null);

         const response = await fetch(`/api/profiles/${profileId}`, {
           headers: {
             "Content-Type": "application/json",
           },
         });

         if (!response.ok) {
           throw new Error(`Failed to fetch profile: ${response.statusText}`);
         }

         const result = await response.json();

         if (!result.success) {
           throw new Error(result.error || "Failed to fetch profile");
         }

         // Validate response with contract schema
         const validatedData = ProfileSchema.parse(result.data);
         setData(validatedData);
       } catch (err) {
         console.error("Profile fetch error:", err);
         setError(err instanceof Error ? err : new Error("Unknown error"));
         setData(null);
       } finally {
         setLoading(false);
       }
     }, [profileId]);

     useEffect(() => {
       if (profileId) {
         fetchProfile();
       }
     }, [profileId, fetchProfile]);

     return {
       data,
       loading,
       error,
       refetch: fetchProfile,
     };
   }
   ```

5. **Implement list/paginated hooks**:

   ```typescript
   // Example: useProfiles hook with pagination
   interface UseProfilesResult {
     data: {
       items: Profile[];
       total: number;
       page: number;
       limit: number;
       totalPages: number;
     } | null;
     loading: boolean;
     error: Error | null;
     refetch: () => Promise<void>;
     loadMore: () => Promise<void>;
     hasNextPage: boolean;
   }

   export function useProfiles(filters?: ProfileFilter): UseProfilesResult {
     const [data, setData] = useState<UseProfilesResult["data"]>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);

     const fetchProfiles = useCallback(
       async (page = 1, append = false) => {
         try {
           if (!append) {
             setLoading(true);
           }
           setError(null);

           const searchParams = new URLSearchParams({
             page: page.toString(),
             limit: filters?.limit?.toString() || "50",
             ...(filters?.plantId && { plantId: filters.plantId }),
             ...(filters?.status && { status: filters.status }),
             ...(filters?.search && { search: filters.search }),
           });

           const response = await fetch(`/api/profiles?${searchParams}`, {
             headers: {
               "Content-Type": "application/json",
             },
           });

           if (!response.ok) {
             throw new Error(
               `Failed to fetch profiles: ${response.statusText}`,
             );
           }

           const result = await response.json();

           if (!result.success) {
             throw new Error(result.error || "Failed to fetch profiles");
           }

           // Validate response structure
           const responseData = result.data;
           const validatedItems = responseData.items.map((item: unknown) =>
             ProfileSchema.parse(item),
           );

           const newData = {
             items: validatedItems,
             total: responseData.total,
             page: responseData.page,
             limit: responseData.limit,
             totalPages: responseData.totalPages,
           };

           if (append && data) {
             // Append for pagination
             setData({
               ...newData,
               items: [...data.items, ...newData.items],
             });
           } else {
             // Replace for initial load or refetch
             setData(newData);
           }
         } catch (err) {
           console.error("Profiles fetch error:", err);
           setError(err instanceof Error ? err : new Error("Unknown error"));
           if (!append) {
             setData(null);
           }
         } finally {
           if (!append) {
             setLoading(false);
           }
         }
       },
       [filters, data],
     );

     const loadMore = useCallback(async () => {
       if (data && data.page < data.totalPages) {
         await fetchProfiles(data.page + 1, true);
       }
     }, [data, fetchProfiles]);

     useEffect(() => {
       fetchProfiles();
     }, [fetchProfiles]);

     return {
       data,
       loading,
       error,
       refetch: () => fetchProfiles(),
       loadMore,
       hasNextPage: data ? data.page < data.totalPages : false,
     };
   }
   ```

6. **Implement mutation hooks**:

   ```typescript
   // Example: useCreateProfile hook
   interface UseCreateProfileResult {
     mutate: (data: CreateProfile) => Promise<Profile>;
     data: Profile | null;
     loading: boolean;
     error: Error | null;
     reset: () => void;
   }

   export function useCreateProfile(): UseCreateProfileResult {
     const [data, setData] = useState<Profile | null>(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<Error | null>(null);

     const mutate = useCallback(
       async (createData: CreateProfile): Promise<Profile> => {
         try {
           setLoading(true);
           setError(null);

           // Validate input data
           const validatedInput = CreateProfileSchema.parse(createData);

           const response = await fetch("/api/profiles", {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(validatedInput),
           });

           if (!response.ok) {
             throw new Error(
               `Failed to create profile: ${response.statusText}`,
             );
           }

           const result = await response.json();

           if (!result.success) {
             throw new Error(result.error || "Failed to create profile");
           }

           // Validate response
           const validatedData = ProfileSchema.parse(result.data);
           setData(validatedData);

           return validatedData;
         } catch (err) {
           console.error("Profile creation error:", err);
           const error =
             err instanceof Error ? err : new Error("Unknown error");
           setError(error);
           throw error;
         } finally {
           setLoading(false);
         }
       },
       [],
     );

     const reset = useCallback(() => {
       setData(null);
       setError(null);
       setLoading(false);
     }, []);

     return {
       mutate,
       data,
       loading,
       error,
       reset,
     };
   }

   // Example: useUpdateProfile hook
   interface UseUpdateProfileResult {
     mutate: (id: string, data: UpdateProfile) => Promise<Profile>;
     data: Profile | null;
     loading: boolean;
     error: Error | null;
     reset: () => void;
   }

   export function useUpdateProfile(): UseUpdateProfileResult {
     const [data, setData] = useState<Profile | null>(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<Error | null>(null);

     const mutate = useCallback(
       async (id: string, updateData: UpdateProfile): Promise<Profile> => {
         try {
           setLoading(true);
           setError(null);

           // Validate input data
           const validatedInput = UpdateProfileSchema.parse(updateData);

           const response = await fetch(`/api/profiles/${id}`, {
             method: "PATCH",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(validatedInput),
           });

           if (!response.ok) {
             throw new Error(
               `Failed to update profile: ${response.statusText}`,
             );
           }

           const result = await response.json();

           if (!result.success) {
             throw new Error(result.error || "Failed to update profile");
           }

           // Validate response
           const validatedData = ProfileSchema.parse(result.data);
           setData(validatedData);

           return validatedData;
         } catch (err) {
           console.error("Profile update error:", err);
           const error =
             err instanceof Error ? err : new Error("Unknown error");
           setError(error);
           throw error;
         } finally {
           setLoading(false);
         }
       },
       [],
     );

     const reset = useCallback(() => {
       setData(null);
       setError(null);
       setLoading(false);
     }, []);

     return {
       mutate,
       data,
       loading,
       error,
       reset,
     };
   }
   ```

#### Phase 3: Update Specialized Hooks (2 hours)

7. **Handle analytics hooks**:

   ```typescript
   // Example: useAnalytics hook
   import { type AnalyticsData, type DashboardStats } from "@/contracts";

   interface UseAnalyticsResult {
     data: AnalyticsData | null;
     loading: boolean;
     error: Error | null;
     refetch: () => Promise<void>;
   }

   export function useAnalytics(filters?: {
     plantId?: string;
     courseId?: string;
   }): UseAnalyticsResult {
     // Similar pattern but with analytics-specific validation
   }
   ```

8. **Handle composite data hooks**:

   ```typescript
   // Example: useEnrollmentWithDetails hook
   import { type EnrollmentWithRelations } from "@/contracts";

   interface UseEnrollmentWithDetailsResult {
     data: EnrollmentWithRelations | null;
     loading: boolean;
     error: Error | null;
     refetch: () => Promise<void>;
   }

   export function useEnrollmentWithDetails(
     enrollmentId: string,
   ): UseEnrollmentWithDetailsResult {
     // Handle complex data with relations
   }
   ```

#### Phase 4: Create Hook Utilities (1 hour)

9. **Create reusable hook utilities**:

   ```typescript
   // src/hooks/utils/api-hooks.ts
   import { z } from "zod";

   /**
    * Generic fetch hook factory
    */
   export function createFetchHook<T>(endpoint: string, schema: z.ZodType<T>) {
     return function useFetch(id?: string): StandardHookResult<T> {
       // Generic implementation
     };
   }

   /**
    * Generic list hook factory
    */
   export function createListHook<T, F>(
     endpoint: string,
     itemSchema: z.ZodType<T>,
   ) {
     return function useList(filters?: F): PaginatedHookResult<T> {
       // Generic implementation
     };
   }

   /**
    * Generic mutation hook factory
    */
   export function createMutationHook<TData, TInput>(
     endpoint: string,
     method: "POST" | "PATCH" | "DELETE",
     inputSchema: z.ZodType<TInput>,
     outputSchema: z.ZodType<TData>,
   ) {
     return function useMutation(): MutationHookResult<TData, TInput> {
       // Generic implementation
     };
   }
   ```

10. **Create hook barrel exports**:

    ```typescript
    // src/hooks/index.ts
    // Profile hooks
    export { useProfile } from "./use-profile";
    export { useProfiles } from "./use-profiles";
    export { useCreateProfile } from "./use-create-profile";
    export { useUpdateProfile } from "./use-update-profile";

    // Course hooks
    export { useCourse } from "./use-course";
    export { useCourses } from "./use-courses";

    // Enrollment hooks
    export { useEnrollment } from "./use-enrollment";
    export { useEnrollments } from "./use-enrollments";
    export { useEnrollmentWithDetails } from "./use-enrollment-with-details";

    // Progress hooks
    export { useProgress } from "./use-progress";
    export { useUpdateProgress } from "./use-update-progress";

    // Analytics hooks
    export { useAnalytics } from "./use-analytics";
    export { useDashboardStats } from "./use-dashboard-stats";

    // Types
    export type {
      StandardHookResult,
      PaginatedHookResult,
      MutationHookResult,
    } from "./types";
    ```

#### Phase 5: Update Hook Consumers (2 hours)

11. **Update components to use new hook shapes**:

    ```typescript
    // Before: Inconsistent hook usage
    const { profile, loading, error } = useProfile(id); // Different shape

    // After: Standardized hook usage
    const { data: profile, loading, error, refetch } = useProfile(id);

    // Handle the standardized shape
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;
    if (!profile) return <NotFound />;

    return <ProfileDisplay profile={profile} />;
    ```

12. **Update error handling patterns**:

    ```typescript
    // Standardized error handling component
    interface ErrorBoundaryProps {
      error: Error | null;
      onRetry?: () => void;
      fallback?: React.ReactNode;
    }

    function ErrorBoundary({ error, onRetry, fallback }: ErrorBoundaryProps) {
      if (!error) return null;

      return (
        <div className="error-boundary">
          <h3>Something went wrong</h3>
          <p>{error.message}</p>
          {onRetry && (
            <button onClick={onRetry}>Try Again</button>
          )}
          {fallback}
        </div>
      );
    }
    ```

#### Phase 6: Testing and Validation (1 hour)

13. **Test hook type safety**:

    ```typescript
    // Create test file: src/hooks/__tests__/type-safety.test.ts
    import { useProfile, useProfiles } from "@/hooks";
    import type { Profile } from "@/contracts";

    // Test that hooks return correct types
    function testHookTypes() {
      const profileResult = useProfile("test-id");

      // TypeScript should enforce these types
      const profile: Profile | null = profileResult.data;
      const loading: boolean = profileResult.loading;
      const error: Error | null = profileResult.error;
      const refetch: () => Promise<void> = profileResult.refetch;
    }
    ```

14. **Validate hook behavior**:
    ```typescript
    // Test that hooks handle errors correctly
    // Test that hooks validate responses
    // Test that hooks maintain consistent state
    ```

### Critical Requirements

#### MUST HAVE:

- [ ] All hooks return standardized shapes (`{ data, loading, error, refetch }`)
- [ ] All hooks use contract DTOs for type safety
- [ ] All hooks validate API responses with contract schemas
- [ ] All hooks handle errors consistently
- [ ] All hooks support refetch functionality

#### MUST NOT:

- [ ] Use raw Drizzle types in hook return values
- [ ] Return inconsistent shapes across hooks
- [ ] Skip response validation
- [ ] Expose internal API errors to components

### Validation Checklist

Before marking this complete, verify:

- [ ] `pnpm type-check` passes with no errors
- [ ] All hooks return standardized shapes
- [ ] No raw database types are used in hook interfaces
- [ ] All API responses are validated with contract schemas
- [ ] Error handling is consistent across all hooks
- [ ] Components can use hooks without type assertions
- [ ] Hook documentation is updated

### Success Criteria

1. **Type Safety**: All hooks use contract DTOs exclusively
2. **Consistency**: All hooks follow the same return shape pattern
3. **Validation**: All API responses are validated before returning
4. **Error Handling**: Consistent error handling across all hooks
5. **Maintainability**: No duplicate type definitions
6. **Developer Experience**: Clear, predictable hook interfaces

### Files to Update

Priority order for migration:

1. `src/hooks/use-profile.ts` - User profile management
2. `src/hooks/use-profiles.ts` - User list management
3. `src/hooks/use-enrollment.ts` - Enrollment management
4. `src/hooks/use-progress.ts` - Progress tracking
5. `src/hooks/use-analytics.ts` - Analytics data
6. All remaining hooks in `src/hooks/`

Create new hooks following the patterns above, then update components to use the standardized interfaces. Remove any local type definitions that duplicate contract DTOs.
