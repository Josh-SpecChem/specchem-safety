import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHookWithProviders, waitForHookToLoad, mockCourseWithStats } from './test-utils';
import { useCourses, useCreateCourse, useUpdateCourse } from '../useCourses';
import { apiGet, apiPost, apiPatch } from '@/lib/api-utils';

const mockApiGet = apiGet as vi.MockedFunction<typeof apiGet>;
const mockApiPost = apiPost as vi.MockedFunction<typeof apiPost>;
const mockApiPatch = apiPatch as vi.MockedFunction<typeof apiPatch>;

describe('useCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch courses successfully', async () => {
    mockApiGet.mockResolvedValue({
      success: true,
      data: mockCourseWithStats,
    });

    const { result } = renderHookWithProviders(() => useCourses());

    await waitForHookToLoad(result);

    expect(result.current.data).toEqual(mockCourseWithStats);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    mockApiGet.mockResolvedValue({
      success: false,
      error: 'Failed to fetch courses',
    });

    const { result } = renderHookWithProviders(() => useCourses());

    await waitForHookToLoad(result);

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch courses');
  });
});

describe('useCreateCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create course successfully', async () => {
    const courseData = {
      title: 'New Course',
      slug: 'new-course',
      version: '1.0',
      isPublished: false,
    };

    mockApiPost.mockResolvedValue({
      success: true,
      data: mockCourseWithStats,
    });

    const { result } = renderHookWithProviders(() => useCreateCourse());

    const success = await result.current.mutate(courseData);

    expect(success).toBe(true);
    expect(result.current.data).toEqual(mockCourseWithStats);
    expect(result.current.mutating).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle creation errors', async () => {
    const courseData = {
      title: 'New Course',
      slug: 'new-course',
    };

    mockApiPost.mockResolvedValue({
      success: false,
      error: 'Failed to create course',
    });

    const { result } = renderHookWithProviders(() => useCreateCourse());

    const success = await result.current.mutate(courseData);

    expect(success).toBe(false);
    expect(result.current.error).toBe('Failed to create course');
  });
});

describe('useUpdateCourse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update course successfully', async () => {
    const courseId = 'course-1';
    const updateData = {
      title: 'Updated Course',
      isPublished: true,
    };

    mockApiPatch.mockResolvedValue({
      success: true,
      data: { ...mockCourseWithStats, ...updateData },
    });

    const { result } = renderHookWithProviders(() => useUpdateCourse(courseId));

    const success = await result.current.mutate(updateData);

    expect(success).toBe(true);
    expect(result.current.data).toEqual({ ...mockCourseWithStats, ...updateData });
    expect(result.current.mutating).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
