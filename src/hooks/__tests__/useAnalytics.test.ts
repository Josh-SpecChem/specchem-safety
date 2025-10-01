import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHookWithProviders, waitForHookToLoad, mockAnalyticsData, mockDashboardStats } from './test-utils';
import { useAnalytics, useDashboardStats } from '../useAnalytics';
import { apiGet } from '@/lib/api-utils';

const mockApiGet = apiGet as vi.MockedFunction<typeof apiGet>;

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch analytics successfully', async () => {
    mockApiGet.mockResolvedValue({
      success: true,
      data: mockAnalyticsData,
    });

    const { result } = renderHookWithProviders(() => useAnalytics('plant-1', 'course-1'));

    await waitForHookToLoad(result);

    expect(result.current.data).toEqual(mockAnalyticsData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    mockApiGet.mockResolvedValue({
      success: false,
      error: 'Failed to fetch analytics',
    });

    const { result } = renderHookWithProviders(() => useAnalytics());

    await waitForHookToLoad(result);

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch analytics');
  });

  it('should not fetch when no parameters provided', async () => {
    const { result } = renderHookWithProviders(() => useAnalytics());

    // Should not call API when no parameters provided
    expect(mockApiGet).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should include parameters in API call', async () => {
    mockApiGet.mockResolvedValue({
      success: true,
      data: mockAnalyticsData,
    });

    const { result } = renderHookWithProviders(() => useAnalytics('plant-1', 'course-1'));

    await waitForHookToLoad(result);

    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('plantId=plant-1'),
      expect.any(Object)
    );
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('courseId=course-1'),
      expect.any(Object)
    );
  });
});

describe('useDashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch dashboard stats successfully', async () => {
    mockApiGet.mockResolvedValue({
      success: true,
      data: mockDashboardStats,
    });

    const { result } = renderHookWithProviders(() => useDashboardStats());

    await waitForHookToLoad(result);

    expect(result.current.data).toEqual(mockDashboardStats);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    mockApiGet.mockResolvedValue({
      success: false,
      error: 'Failed to fetch dashboard stats',
    });

    const { result } = renderHookWithProviders(() => useDashboardStats());

    await waitForHookToLoad(result);

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch dashboard stats');
  });
});
