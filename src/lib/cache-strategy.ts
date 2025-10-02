export interface CacheStrategy {
  // Different TTLs for different data types
  default: number;          // 2 minutes - general default
  userData: number;        // 5 minutes - relatively stable
  courseData: number;       // 3 minutes - moderate changes
  enrollmentData: number;   // 2 minutes - frequent updates
  analyticsData: number;    // 1 minute - real-time data
  progressData: number;     // 30 seconds - very dynamic
}

export const CACHE_STRATEGY: CacheStrategy = {
  default: 2 * 60 * 1000,       // 2 minutes
  userData: 5 * 60 * 1000,      // 5 minutes
  courseData: 3 * 60 * 1000,    // 3 minutes
  enrollmentData: 2 * 60 * 1000, // 2 minutes
  analyticsData: 1 * 60 * 1000, // 1 minute
  progressData: 30 * 1000,      // 30 seconds
};

// Cache invalidation patterns
export const CACHE_INVALIDATION = {
  // When user data changes, invalidate related caches
  onUserUpdate: ['users', 'enrollments', 'analytics'],
  
  // When course data changes, invalidate related caches
  onCourseUpdate: ['courses', 'enrollments', 'analytics'],
  
  // When enrollment changes, invalidate related caches
  onEnrollmentUpdate: ['enrollments', 'analytics', 'dashboard-stats'],
  
  // When progress changes, invalidate related caches
  onProgressUpdate: ['progress', 'analytics', 'dashboard-stats'],
};
