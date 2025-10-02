import { useState, useCallback, useMemo } from 'react';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  offset: number;
}

export interface PaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  maxLimit?: number;
}

export function useAdminPagination(options: PaginationOptions = {}) {
  const {
    initialPage = 1,
    initialLimit = 50,
    maxLimit = 100
  } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    offset: 0
  });

  const updatePagination = useCallback((updates: Partial<PaginationState>) => {
    setPagination(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages)),
      offset: (page - 1) * prev.limit
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({
      ...prev,
      limit: Math.max(1, Math.min(limit, maxLimit)),
      page: 1, // Reset to first page when changing limit
      offset: 0
    }));
  }, [maxLimit]);

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages),
      offset: Math.min(prev.offset + prev.limit, (prev.totalPages - 1) * prev.limit)
    }));
  }, []);

  const previousPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
      offset: Math.max(prev.offset - prev.limit, 0)
    }));
  }, []);

  const hasNextPage = useMemo(() => {
    return pagination.page < pagination.totalPages;
  }, [pagination.page, pagination.totalPages]);

  const hasPreviousPage = useMemo(() => {
    return pagination.page > 1;
  }, [pagination.page]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, pagination.page - 2);
    const end = Math.min(pagination.totalPages, pagination.page + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [pagination.page, pagination.totalPages]);

  const buildPaginationParams = useCallback(() => {
    return {
      page: pagination.page,
      limit: pagination.limit,
      offset: pagination.offset
    };
  }, [pagination.page, pagination.limit, pagination.offset]);

  const updateTotal = useCallback((total: number) => {
    setPagination(prev => ({
      ...prev,
      total,
      totalPages: Math.ceil(total / prev.limit)
    }));
  }, []);

  return {
    pagination,
    updatePagination,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    pageNumbers,
    buildPaginationParams,
    updateTotal
  };
}
