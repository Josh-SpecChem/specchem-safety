import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

// Mock API utilities
vi.mock('@/lib/api-utils', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
  withRetryEnhanced: vi.fn((fn) => fn()),
  enhancedCache: {
    get: vi.fn(),
    set: vi.fn(),
    clear: vi.fn(),
    invalidate: vi.fn(),
  },
  handleApiError: vi.fn((error) => error.message || 'An error occurred'),
}));

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

export function renderHookWithProviders<T>(
  hook: () => T,
  options: { queryClient?: QueryClient } = {}
) {
  const queryClient = options.queryClient || createTestQueryClient();
  
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return renderHook(hook, { wrapper });
}

export async function waitForHookToLoad(result: { current: { loading: boolean } }) {
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
}

// Mock data factories
export const mockUserWithDetails = {
  id: '1',
  plantId: 'plant-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  jobTitle: 'Safety Manager',
  status: 'active' as const,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  plant: {
    id: 'plant-1',
    name: 'Main Plant',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  adminRoles: [],
  enrollments: [],
};

export const mockCourseWithStats = {
  id: 'course-1',
  slug: 'safety-basics',
  title: 'Safety Basics',
  version: '1.0',
  isPublished: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  totalEnrollments: 100,
  completedEnrollments: 75,
  avgProgress: 80,
  completionRate: 75,
};

export const mockEnrollmentWithDetails = {
  id: 'enrollment-1',
  userId: '1',
  courseId: 'course-1',
  plantId: 'plant-1',
  status: 'in_progress' as const,
  enrolledAt: '2023-01-01T00:00:00Z',
  completedAt: null,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  profile: mockUserWithDetails,
  course: mockCourseWithStats,
};

export const mockAnalyticsData = {
  plantStats: {
    plantId: 'plant-1',
    plantName: 'Main Plant',
    totalUsers: 50,
    activeEnrollments: 30,
    completionRate: 75,
    averageProgress: 80,
    overdueCount: 5,
  },
  courseStats: {
    courseId: 'course-1',
    courseName: 'Safety Basics',
    totalEnrollments: 100,
    completions: 75,
    averageScore: 85,
    averageTimeSpent: 120,
  },
};

export const mockDashboardStats = {
  totalUsers: 100,
  activeEnrollments: 50,
  completionRate: 75,
  overdueTraining: 10,
  totalPlants: 5,
  activePlants: 5,
};

export const mockEnrollmentStats = {
  total: 100,
  completed: 75,
  inProgress: 20,
  overdue: 5,
};
