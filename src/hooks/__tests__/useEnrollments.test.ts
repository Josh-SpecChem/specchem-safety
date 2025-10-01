import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHookWithProviders, waitForHookToLoad, mockEnrollmentWithDetails, mockEnrollmentStats } from './test-utils';
import { useEnrollments, useEnrollmentStats } from '../useEnrollments';
import { apiGet } from '@/lib/api-utils';

const mockApiGet = apiGet as vi.MockedFunction<typeof apiGet>;

describe('useEnrollments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch enrollments successfully', async () => {
    const mockEnrollments = [mockEnrollmentWithDetails];

    mockApiGet.mockResolvedValue({
      success: true,
      data: mockEnrollments,
    });

    const { result } = renderHookWithProviders(() => useEnrollments());

    await waitForHookToLoad(result);

    expect(result.current.data).toEqual(mockEnrollments);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    mockApiGet.mockResolvedValue({
      success: false,
      error: 'Failed to fetch enrollments',
    });

    const { result } = renderHookWithProviders(() => useEnrollments());

    await waitForHookToLoad(result);

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch enrollments');
  });

  it('should apply filters correctly', async () => {
    const filters = { plantId: 'plant-1', status: 'in_progress' };
    
    mockApiGet.mockResolvedValue({
      success: true,
      data: [mockEnrollmentWithDetails],
    });

    const { result } = renderHookWithProviders(() => useEnrollments(filters));

    await waitForHookToLoad(result);

    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('plantId=plant-1'),
      expect.any(Object)
    );
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('status=in_progress'),
      expect.any(Object)
    );
  });
});

describe('useEnrollmentStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch enrollment stats successfully', async () => {
    mockApiGet.mockResolvedValue({
      success: true,
      data: mockEnrollmentStats,
    });

    const { result } = renderHookWithProviders(() => useEnrollmentStats());

    await waitForHookToLoad(result);

    expect(result.current.data).toEqual(mockEnrollmentStats);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    mockApiGet.mockResolvedValue({
      success: false,
      error: 'Failed to fetch enrollment stats',
    });

    const { result } = renderHookWithProviders(() => useEnrollmentStats());

    await waitForHookToLoad(result);

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch enrollment stats');
  });
});
