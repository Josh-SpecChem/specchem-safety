// src/hooks/useUnifiedMigration.ts
import { 
  useUnifiedApiGet, 
  useUnifiedApiPost
} from './useUnifiedApi';

// ========================================
// MIGRATION COMPATIBILITY LAYER
// ========================================

/**
 * Migration compatibility layer for legacy hooks
 * This provides a bridge between old and new hook systems
 */

// Legacy hook state interfaces for compatibility
export interface LegacyHookState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface LegacyMutatingHookState<T> extends LegacyHookState<T> {
  mutating: boolean;
  mutate: (data: unknown) => Promise<boolean>;
}

// ========================================
// MIGRATION UTILITIES
// ========================================

/**
 * Converts unified hook result to legacy format
 */
export function toLegacyFormat<T>(
  unifiedResult: ReturnType<typeof useUnifiedApiGet<T>>
): LegacyHookState<T> {
  return {
    data: unifiedResult.data,
    loading: unifiedResult.loading,
    error: unifiedResult.error || null,
    refetch: async () => {
      unifiedResult.refetch();
    },
  };
}

/**
 * Converts unified mutation result to legacy format
 */
export function toLegacyMutationFormat<T>(
  unifiedResult: ReturnType<typeof useUnifiedApiPost<T, any>>
): LegacyMutatingHookState<T> {
  return {
    data: null, // POST hooks don't return data directly
    loading: unifiedResult.loading,
    mutating: unifiedResult.loading,
    error: unifiedResult.error || null,
    refetch: async () => {
      // Not applicable for mutations
    },
    mutate: async (data: unknown) => {
      try {
        const result = await unifiedResult.postData(data as T);
        return result !== null;
      } catch (error) {
        return false;
      }
    },
  };
}

// ========================================
// MIGRATION WRAPPER HOOKS
// ========================================

/**
 * Wrapper for migrating from useApi.useProgress to unified system
 */
export function useProgressLegacy() {
  const unified = useUnifiedApiGet<any>('/api/progress');
  
  return toLegacyFormat(unified);
}

/**
 * Wrapper for migrating from useApi.useCourseProgress to unified system
 */
export function useCourseProgressLegacy(courseRoute: string) {
  const coursePath = courseRoute.replace('/', '');
  
  const progressQuery = useUnifiedApiGet<any>(
    `/api/courses/${coursePath}/progress`,
    undefined,
    { enabled: !!coursePath }
  );

  const updateProgressMutation = useUnifiedApiPost<any, any>(
    `/api/courses/${coursePath}/progress`
  );

  const updateProgress = async (
    progressPercent: number,
    currentSection?: string,
    eventType?: 'view_section' | 'start_course' | 'complete_course'
  ) => {
    try {
      const result = await updateProgressMutation.postData({
        progressPercent,
        currentSection,
        eventType,
      });
      return result !== null;
    } catch (error) {
      return false;
    }
  };

  return {
    progress: progressQuery.data,
    loading: progressQuery.loading,
    updating: updateProgressMutation.loading,
    error: progressQuery.error || updateProgressMutation.error,
    updateProgress,
    refetch: progressQuery.refetch,
  };
}

/**
 * Wrapper for migrating from useApi.useQuestionEvents to unified system
 */
export function useQuestionEventsLegacy(courseRoute: string) {
  const coursePath = courseRoute.replace('/', '');
  
  const recordQuestionMutation = useUnifiedApiPost<any, any>(
    `/api/courses/${coursePath}/questions`
  );

  const recordQuestion = async (
    sectionKey: string,
    questionKey: string,
    isCorrect: boolean,
    attemptIndex: number = 1,
    responseMeta?: Record<string, string | number | boolean | null>
  ) => {
    try {
      const result = await recordQuestionMutation.postData({
        sectionKey,
        questionKey,
        isCorrect,
        attemptIndex,
        responseMeta,
      });
      return result !== null;
    } catch (error) {
      return false;
    }
  };

  return {
    recordQuestion,
    submitting: recordQuestionMutation.loading,
    error: recordQuestionMutation.error,
  };
}

/**
 * Wrapper for migrating from useApi.useUserProfile to unified system
 */
export function useUserProfileLegacy() {
  const profileQuery = useUnifiedApiGet<any>('/api/user/profile');

  const updateProfileMutation = useUnifiedApiPost<any, any>('/api/user/profile');

  const updateProfile = async (updates: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
  }) => {
    try {
      const result = await updateProfileMutation.postData(updates);
      return result !== null;
    } catch (error) {
      return false;
    }
  };

  return {
    profile: profileQuery.data,
    loading: profileQuery.loading,
    updating: updateProfileMutation.loading,
    error: profileQuery.error || updateProfileMutation.error,
    updateProfile,
    refetch: profileQuery.refetch,
  };
}

// ========================================
// MIGRATION VALIDATION
// ========================================

/**
 * Validates that a component is ready for migration
 */
export function validateMigrationReadiness(componentCode: string): {
  isReady: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Check for legacy hook usage
  if (componentCode.includes('useApi.useProgress')) {
    warnings.push('Using deprecated useApi.useProgress hook');
    suggestions.push('Replace with useUnifiedProgress.useProgress()');
  }
  
  if (componentCode.includes('useApi.useCourseProgress')) {
    warnings.push('Using deprecated useApi.useCourseProgress hook');
    suggestions.push('Replace with useUnifiedProgress.useCourseProgress()');
  }
  
  if (componentCode.includes('useApi.useQuestionEvents')) {
    warnings.push('Using deprecated useApi.useQuestionEvents hook');
    suggestions.push('Replace with useUnifiedProgress.useQuestionEvents()');
  }
  
  if (componentCode.includes('useApi.useUserProfile')) {
    warnings.push('Using deprecated useApi.useUserProfile hook');
    suggestions.push('Replace with useUnifiedProgress.useUserProfile()');
  }
  
  // Check for standardized hook usage (good!)
  if (componentCode.includes('useStandardizedProgress')) {
    suggestions.push('Consider migrating to useUnifiedProgress for better performance');
  }
  
  return {
    isReady: warnings.length === 0,
    warnings,
    suggestions
  };
}

// ========================================
// MIGRATION PROGRESS TRACKING
// ========================================

export interface MigrationProgress {
  totalComponents: number;
  migratedComponents: number;
  legacyComponents: number;
  progressPercentage: number;
}

export function calculateMigrationProgress(
  componentFiles: string[]
): MigrationProgress {
  let migratedComponents = 0;
  let legacyComponents = 0;
  
  componentFiles.forEach(fileContent => {
    const validation = validateMigrationReadiness(fileContent);
    if (validation.isReady) {
      migratedComponents++;
    } else {
      legacyComponents++;
    }
  });
  
  const totalComponents = componentFiles.length;
  const progressPercentage = totalComponents > 0 ? 
    Math.round((migratedComponents / totalComponents) * 100) : 0;
  
  return {
    totalComponents,
    migratedComponents,
    legacyComponents,
    progressPercentage
  };
}
