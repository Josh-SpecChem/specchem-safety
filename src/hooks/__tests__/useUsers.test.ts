import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHookWithProviders, waitForHookToLoad, mockUserWithDetails } from './test-utils';
import { useUsers, useUser } from '../useUsers';
import { apiGet } from '@/lib/api-utils';

const mockApiGet = apiGet as vi.MockedFunction<typeof apiGet>;

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users successfully', async () => {
    const mockUsers = [mockUserWithDetails];

    mockApiGet.mockResolvedValue({
      success: true,
      data: mockUsers,
    });

    const { result } = renderHookWithProviders(() => useUsers());

    await waitForHookToLoad(result);

    expect(result.current.data).toEqual(mockUsers);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    mockApiGet.mockResolvedValue({
      success: false,
      error: 'Failed to fetch users',
    });

    const { result } = renderHookWithProviders(() => useUsers());

    await waitForHookToLoad(result);

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch users');
  });

  it('should refetch data when refetch is called', async () => {
    const { result } = renderHookWithProviders(() => useUsers());

    await waitForHookToLoad(result);

    const initialCallCount = mockApiGet.mock.calls.length;

    await result.current.refetch();

    expect(mockApiGet.mock.calls.length).toBe(initialCallCount + 1);
  });

  it('should apply filters correctly', async () => {
    const filters = { search: 'john', plantId: 'plant-1' };
    
    mockApiGet.mockResolvedValue({
      success: true,
      data: [mockUserWithDetails],
    });

    const { result } = renderHookWithProviders(() => useUsers(filters));

    await waitForHookToLoad(result);

    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('search=john'),
      expect.any(Object)
    );
    expect(mockApiGet).toHaveBeenCalledWith(
      expect.stringContaining('plantId=plant-1'),
      expect.any(Object)
    );
  });
});

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch single user successfully', async () => {
    mockApiGet.mockResolvedValue({
      success: true,
      data: mockUserWithDetails,
    });

    const { result } = renderHookWithProviders(() => useUser('1'));

    await waitForHookToLoad(result);

    expect(result.current.data).toEqual(mockUserWithDetails);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should not fetch when userId is empty', async () => {
    const { result } = renderHookWithProviders(() => useUser(''));

    // Should not call API when userId is empty
    expect(mockApiGet).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
