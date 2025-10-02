import { useState, useCallback, useMemo } from 'react';

export interface FilterState {
  search: string;
  role?: string;
  status?: string;
  department?: string;
  plantId?: string;
  courseId?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface FilterOptions {
  searchFields: string[];
  filterFields: string[];
  dateFields: string[];
}

export function useAdminFilters<T>(
  initialFilters: Partial<FilterState> = {},
  options?: FilterOptions
) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    limit: 50,
    offset: 0,
    ...initialFilters
  });

  const updateFilter = useCallback((key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset pagination when filters change (except for limit/offset)
      ...(key !== 'limit' && key !== 'offset' ? { offset: 0 } : {})
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      limit: 50,
      offset: 0,
      ...initialFilters
    });
  }, [initialFilters]);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      limit: 50,
      offset: 0,
      ...initialFilters
    });
  }, [initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'search') return value !== '';
      if (key === 'limit' || key === 'offset') return false; // Don't count pagination as filters
      if (key === 'dateRange') return value && (value.start || value.end);
      return value !== undefined && value !== null && value !== '';
    });
  }, [filters]);

  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.role) count++;
    if (filters.status) count++;
    if (filters.department) count++;
    if (filters.plantId) count++;
    if (filters.courseId) count++;
    if (filters.isActive !== undefined) count++;
    if (filters.dateRange) count++;
    return count;
  }, [filters]);

  const buildQueryParams = useCallback(() => {
    const params: Record<string, string> = {};
    
    if (filters.search) {
      params.search = filters.search;
    }
    
    if (filters.role) {
      params.role = filters.role;
    }
    
    if (filters.status) {
      params.status = filters.status;
    }
    
    if (filters.department) {
      params.department = filters.department;
    }
    
    if (filters.plantId) {
      params.plantId = filters.plantId;
    }
    
    if (filters.courseId) {
      params.courseId = filters.courseId;
    }
    
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive.toString();
    }
    
    if (filters.limit) {
      params.limit = filters.limit.toString();
    }
    
    if (filters.offset) {
      params.offset = filters.offset.toString();
    }
    
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        params.startDate = filters.dateRange.start.toISOString();
      }
      if (filters.dateRange.end) {
        params.endDate = filters.dateRange.end.toISOString();
      }
    }
    
    return params;
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    resetFilters,
    hasActiveFilters,
    filterCount,
    buildQueryParams
  };
}
