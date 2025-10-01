import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { 
  apiGet, 
  apiPost, 
  apiPatch, 
  withRetryEnhanced, 
  enhancedCache,
  handleApiError,
  type HookState,
  type MutatingHookState,
  type ApiResponse
} from '@/lib/api-utils';

// ========================================
// STANDARDIZED GET HOOK PATTERN
// ========================================

export function useApiGet<T>(
  url: string,
  schema: z.ZodType<T>,
  options: {
    cacheKey?: string;
    cacheTTL?: number;
    enabled?: boolean;
    dependencies?: unknown[];
  } = {}
): HookState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return;

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (options.cacheKey) {
        const cached = enhancedCache.get<T>(options.cacheKey);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      const result = await withRetryEnhanced(() => apiGet(url, schema));

      if (result.success && result.data) {
        setData(result.data);
        
        // Cache the result
        if (options.cacheKey) {
          enhancedCache.set(options.cacheKey, result.data, {
            ttl: options.cacheTTL || 5 * 60 * 1000, // 5 minutes default
            key: options.cacheKey,
          });
        }
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [url, options.cacheKey, options.enabled, ...(options.dependencies || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// ========================================
// STANDARDIZED MUTATION HOOK PATTERN
// ========================================

export function useApiMutation<T, U>(
  url: string,
  schema: z.ZodType<T>,
  options: {
    method: 'POST' | 'PATCH';
    invalidateCache?: string[];
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  }
): MutatingHookState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (payload: U): Promise<boolean> => {
    try {
      setMutating(true);
      setError(null);

      const result = await withRetryEnhanced(() => {
        if (options.method === 'POST') {
          return apiPost(url, payload, schema);
        } else {
          return apiPatch(url, payload, schema);
        }
      });

      if (result.success && result.data) {
        setData(result.data);
        
        // Invalidate related caches
        if (options.invalidateCache) {
          enhancedCache.invalidate(options.invalidateCache);
        }
        
        options.onSuccess?.(result.data);
        return true;
      } else {
        setError(result.error || 'Operation failed');
        options.onError?.(result.error || 'Operation failed');
        return false;
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      options.onError?.(errorMessage);
      return false;
    } finally {
      setMutating(false);
    }
  }, [url, options.method, options.invalidateCache]);

  return {
    data,
    loading,
    mutating,
    error,
    refetch: async () => {}, // Not applicable for mutations
    mutate,
  };
}

// ========================================
// STANDARDIZED LIST HOOK WITH PAGINATION
// ========================================

export function useApiList<T>(
  url: string,
  schema: z.ZodType<T[]>,
  filters: Record<string, unknown> = {},
  options: {
    cacheKey?: string;
    cacheTTL?: number;
    pageSize?: number;
  } = {}
): HookState<T[]> & {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  setPage: (page: number) => void;
} {
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const listState = useApiGet(
    `${url}?${new URLSearchParams({
      ...filters,
      page: page.toString(),
      limit: (options.pageSize || 20).toString(),
    })}`,
    schema,
    {
      cacheKey: options.cacheKey,
      cacheTTL: options.cacheTTL,
      dependencies: [page, ...Object.values(filters)],
    }
  );

  // Update pagination when data changes
  useEffect(() => {
    if (listState.data) {
      // Assuming the API returns pagination info
      // This would need to be adjusted based on actual API response format
      setPagination(prev => ({
        ...prev,
        page,
        hasNext: page < prev.totalPages,
        hasPrev: page > 1,
      }));
    }
  }, [listState.data, page]);

  return {
    ...listState,
    pagination,
    setPage,
  };
}

// ========================================
// OPTIMISTIC UPDATES UTILITY
// ========================================

export function useOptimisticUpdate<T>(
  currentData: T | null,
  updateFn: (data: T, updates: Partial<T>) => T
) {
  const [optimisticData, setOptimisticData] = useState<T | null>(currentData);

  useEffect(() => {
    setOptimisticData(currentData);
  }, [currentData]);

  const applyOptimisticUpdate = useCallback((updates: Partial<T>) => {
    if (optimisticData) {
      setOptimisticData(updateFn(optimisticData, updates));
    }
  }, [optimisticData, updateFn]);

  const revertOptimisticUpdate = useCallback(() => {
    setOptimisticData(currentData);
  }, [currentData]);

  return {
    data: optimisticData,
    applyOptimisticUpdate,
    revertOptimisticUpdate,
  };
}
