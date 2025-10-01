import { useState, useEffect, useCallback } from 'react';
import { useOptimisticUpdate } from './useStandardizedApi';
import { useCourses, useUpdateCourse } from './useCourses';
import type { UpdateCourseData } from '@/types/hooks';

// ========================================
// OPTIMISTIC UPDATE EXAMPLES
// ========================================

// Example usage in course hooks
export function useUpdateCourseOptimistic(courseId: string) {
  const { data: courses, refetch } = useCourses();
  const mutation = useUpdateCourse(courseId);
  
  const optimisticUpdate = useOptimisticUpdate(
    courses,
    (currentCourses, updates) => ({
      ...currentCourses,
      courses: currentCourses?.courses?.map(course =>
        course.id === courseId ? { ...course, ...updates } : course
      ) || [],
    })
  );

  const updateCourse = useCallback(async (updates: UpdateCourseData) => {
    // Apply optimistic update immediately
    optimisticUpdate.applyOptimisticUpdate(updates);
    
    try {
      const success = await mutation.mutate(updates);
      if (!success) {
        // Revert on failure
        optimisticUpdate.revertOptimisticUpdate();
      }
      return success;
    } catch (error) {
      // Revert on error
      optimisticUpdate.revertOptimisticUpdate();
      throw error;
    }
  }, [mutation, optimisticUpdate]);

  return {
    ...mutation,
    mutate: updateCourse,
    data: optimisticUpdate.data,
  };
}
