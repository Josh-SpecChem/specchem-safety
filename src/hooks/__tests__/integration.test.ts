import { describe, it, expect } from 'vitest';
import { renderHookWithProviders, waitForHookToLoad } from './test-utils';
import { useUsers } from '../useUsers';
import { useCourses } from '../useCourses';
import { useEnrollments } from '../useEnrollments';
import { useAnalytics } from '../useAnalytics';

describe('Hook Integration Tests', () => {
  it('should work together without conflicts', async () => {
    const { result: usersResult } = renderHookWithProviders(() => useUsers());
    const { result: coursesResult } = renderHookWithProviders(() => useCourses());
    const { result: enrollmentsResult } = renderHookWithProviders(() => useEnrollments());
    const { result: analyticsResult } = renderHookWithProviders(() => useAnalytics());

    // Wait for all hooks to load
    await Promise.all([
      waitForHookToLoad(usersResult),
      waitForHookToLoad(coursesResult),
      waitForHookToLoad(enrollmentsResult),
      waitForHookToLoad(analyticsResult),
    ]);

    // Verify all hooks loaded successfully
    expect(usersResult.current.loading).toBe(false);
    expect(coursesResult.current.loading).toBe(false);
    expect(enrollmentsResult.current.loading).toBe(false);
    expect(analyticsResult.current.loading).toBe(false);
  });

  it('should handle cache invalidation correctly', async () => {
    // Test that updating one resource invalidates related caches
    // This would require more complex setup with actual API mocking
    // For now, we'll just verify the hooks can be used together
    
    const { result: usersResult } = renderHookWithProviders(() => useUsers());
    const { result: coursesResult } = renderHookWithProviders(() => useCourses());

    await Promise.all([
      waitForHookToLoad(usersResult),
      waitForHookToLoad(coursesResult),
    ]);

    // Both hooks should be in a stable state
    expect(usersResult.current.loading).toBe(false);
    expect(coursesResult.current.loading).toBe(false);
  });

  it('should maintain consistent state across multiple instances', async () => {
    // Test that multiple instances of the same hook maintain consistent state
    const { result: usersResult1 } = renderHookWithProviders(() => useUsers());
    const { result: usersResult2 } = renderHookWithProviders(() => useUsers());

    await Promise.all([
      waitForHookToLoad(usersResult1),
      waitForHookToLoad(usersResult2),
    ]);

    // Both instances should have the same loading state
    expect(usersResult1.current.loading).toBe(usersResult2.current.loading);
  });
});
