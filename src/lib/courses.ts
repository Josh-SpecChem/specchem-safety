/**
 * Course mapping utilities for SpecChem Safety Training
 * Maps database courses to existing route structure (ebook/ and ebook-spanish/)
 */

export const COURSE_ROUTES = {
  ENGLISH_HAZMAT: '/ebook',
  SPANISH_HAZMAT: '/ebook-spanish',
} as const;

export const COURSE_SLUGS = {
  ENGLISH_HAZMAT: 'function-specific-hazmat-training',
  SPANISH_HAZMAT: 'function-specific-hazmat-training-spanish',
} as const;

export const COURSE_IDS = {
  ENGLISH_HAZMAT: '660e8400-e29b-41d4-a716-446655440001',
  SPANISH_HAZMAT: '660e8400-e29b-41d4-a716-446655440002',
} as const;

/**
 * Map route path to course information
 */
export function getCourseByRoute(route: string) {
  switch (route) {
    case COURSE_ROUTES.ENGLISH_HAZMAT:
      return {
        id: COURSE_IDS.ENGLISH_HAZMAT,
        slug: COURSE_SLUGS.ENGLISH_HAZMAT,
        title: 'Function-Specific HazMat Training',
        language: 'en',
        route: COURSE_ROUTES.ENGLISH_HAZMAT,
      };
    case COURSE_ROUTES.SPANISH_HAZMAT:
      return {
        id: COURSE_IDS.SPANISH_HAZMAT,
        slug: COURSE_SLUGS.SPANISH_HAZMAT,
        title: 'Capacitación Específica de HazMat por Función',
        language: 'es',
        route: COURSE_ROUTES.SPANISH_HAZMAT,
      };
    default:
      return null;
  }
}

/**
 * Map course ID to route information
 */
export function getRouteByConfigurationId(courseId: string) {
  switch (courseId) {
    case COURSE_IDS.ENGLISH_HAZMAT:
      return {
        route: COURSE_ROUTES.ENGLISH_HAZMAT,
        slug: COURSE_SLUGS.ENGLISH_HAZMAT,
        language: 'en',
      };
    case COURSE_IDS.SPANISH_HAZMAT:
      return {
        route: COURSE_ROUTES.SPANISH_HAZMAT,
        slug: COURSE_SLUGS.SPANISH_HAZMAT,
        language: 'es',
      };
    default:
      return null;
  }
}

/**
 * Get all available courses
 */
export function getAllCourses() {
  return [
    {
      id: COURSE_IDS.ENGLISH_HAZMAT,
      slug: COURSE_SLUGS.ENGLISH_HAZMAT,
      title: 'Function-Specific HazMat Training',
      language: 'en',
      route: COURSE_ROUTES.ENGLISH_HAZMAT,
    },
    {
      id: COURSE_IDS.SPANISH_HAZMAT,
      slug: COURSE_SLUGS.SPANISH_HAZMAT,
      title: 'Capacitación Específica de HazMat por Función',
      language: 'es',
      route: COURSE_ROUTES.SPANISH_HAZMAT,
    },
  ];
}

/**
 * Check if a route is a valid course route
 */
export function isValidCourseRoute(route: string): boolean {
  return Object.values(COURSE_ROUTES).includes(route as any); // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Get course language from route
 */
export function getCourseLanguage(route: string): 'en' | 'es' | null {
  const course = getCourseByRoute(route);
  return (course?.language as 'en' | 'es') || null;
}

/**
 * Get the opposite language course route
 */
export function getAlternateLanguageRoute(route: string): string | null {
  switch (route) {
    case COURSE_ROUTES.ENGLISH_HAZMAT:
      return COURSE_ROUTES.SPANISH_HAZMAT;
    case COURSE_ROUTES.SPANISH_HAZMAT:
      return COURSE_ROUTES.ENGLISH_HAZMAT;
    default:
      return null;
  }
}