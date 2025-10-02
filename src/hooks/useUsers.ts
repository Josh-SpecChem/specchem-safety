import { CACHE_STRATEGY } from '@/lib/cache-strategy';
import { userWithDetailsSchema } from '@/lib/schemas';
import type { UseUsersReturn, UserFilter, UserWithDetails } from '@/types';
import { useEffect, useState } from 'react';
import { useApiGet } from './useStandardizedApi';

export function useUsers(filters: UserFilter): UseUsersReturn {
  const [page, setPage] = useState(filters.page || 1);
  const [currentFilters, setCurrentFilters] = useState(filters);
  
  // Update filters when page changes
  useEffect(() => {
    setCurrentFilters({ ...filters, page });
  }, [filters, page]);

  const apiResult = useApiGet(
    '/api/admin/users',
    userWithDetailsSchema.array(),
    {
      cacheKey: `users-${JSON.stringify(currentFilters)}`,
      cacheTTL: CACHE_STRATEGY.userData,
    }
  );

  // Mock pagination data - in real implementation this would come from API response
  const dataLength = Array.isArray(apiResult.data) ? apiResult.data.length : 0;
  const pagination = {
    page,
    total: dataLength,
    totalPages: Math.ceil(dataLength / (filters.limit || 50)),
    hasNext: page < Math.ceil(dataLength / (filters.limit || 50)),
    hasPrev: page > 1,
  };

  return {
    data: apiResult.data as UserWithDetails[] | null,
    loading: apiResult.loading,
    error: apiResult.error,
    refetch: apiResult.refetch,
    pagination,
    setPage,
  };
}

export function useUser(userId: string) {
  return useApiGet(
    `/api/admin/users/${userId}`,
    userWithDetailsSchema,
    {
      cacheKey: `user-${userId}`,
      cacheTTL: CACHE_STRATEGY.userData,
      enabled: !!userId,
    }
  );
}