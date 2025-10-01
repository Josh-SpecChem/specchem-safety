import { useApiList, useApiGet } from './useStandardizedApi';
import { userWithDetailsSchema } from '@/lib/schemas';
import { CACHE_STRATEGY } from '@/lib/cache-strategy';
import type { UserFilters, UseUsersReturn } from '@/types/hooks';

export function useUsers(filters: UserFilters = {}): UseUsersReturn {
  return useApiList(
    '/api/admin/users',
    userWithDetailsSchema.array(),
    filters,
    {
      cacheKey: 'users',
      cacheTTL: CACHE_STRATEGY.userData,
      pageSize: 20,
    }
  );
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