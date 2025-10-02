import type { FilterCondition } from './query-builder';
import type { UserFilter, EnrollmentFilter, ProgressFilter, CourseFilter, PlantFilter } from '@/contracts';

/**
 * FilterBuilder utility class for creating reusable filter patterns
 * Provides standardized filter creation for different entity types
 */
export class FilterBuilder {
  /**
   * Create user/profile filters
   */
  static createUserFilters(filters: UserFilter): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    
    if (filters.plantId) {
      conditions.push({
        field: 'plantId',
        operator: 'eq',
        value: filters.plantId
      });
    }
    
    if (filters.status) {
      conditions.push({
        field: 'status',
        operator: 'eq',
        value: filters.status
      });
    }
    
    if (filters.search) {
      conditions.push({
        field: 'firstName',
        operator: 'like',
        value: `%${filters.search}%`,
        joinOperator: 'or'
      });
      conditions.push({
        field: 'lastName',
        operator: 'like',
        value: `%${filters.search}%`,
        joinOperator: 'or'
      });
      conditions.push({
        field: 'email',
        operator: 'like',
        value: `%${filters.search}%`,
        joinOperator: 'or'
      });
    }
    
    return conditions;
  }

  /**
   * Create enrollment filters
   */
  static createEnrollmentFilters(filters: EnrollmentFilter): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    
    if (filters.plantId) {
      conditions.push({
        field: 'plantId',
        operator: 'eq',
        value: filters.plantId
      });
    }
    
    if (filters.courseId) {
      conditions.push({
        field: 'courseId',
        operator: 'eq',
        value: filters.courseId
      });
    }
    
    if (filters.userId) {
      conditions.push({
        field: 'userId',
        operator: 'eq',
        value: filters.userId
      });
    }
    
    if (filters.status) {
      conditions.push({
        field: 'status',
        operator: 'eq',
        value: filters.status
      });
    }

    // Date range filters
    if (filters.dateRange) {
      conditions.push({
        field: 'enrolledAt',
        operator: 'gte',
        value: filters.dateRange.startDate
      });
      conditions.push({
        field: 'enrolledAt',
        operator: 'lte',
        value: filters.dateRange.endDate
      });
    }
    
    return conditions;
  }

  /**
   * Create progress filters
   */
  static createProgressFilters(filters: ProgressFilter): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    
    if (filters.plantId) {
      conditions.push({
        field: 'plantId',
        operator: 'eq',
        value: filters.plantId
      });
    }
    
    if (filters.courseId) {
      conditions.push({
        field: 'courseId',
        operator: 'eq',
        value: filters.courseId
      });
    }
    
    if (filters.userId) {
      conditions.push({
        field: 'userId',
        operator: 'eq',
        value: filters.userId
      });
    }
    
    if (filters.minProgress !== undefined) {
      conditions.push({
        field: 'progressPercent',
        operator: 'gte',
        value: filters.minProgress
      });
    }
    
    if (filters.maxProgress !== undefined) {
      conditions.push({
        field: 'progressPercent',
        operator: 'lte',
        value: filters.maxProgress
      });
    }

    // Date range filters
    if (filters.dateRange) {
      conditions.push({
        field: 'lastActiveAt',
        operator: 'gte',
        value: filters.dateRange.startDate
      });
      conditions.push({
        field: 'lastActiveAt',
        operator: 'lte',
        value: filters.dateRange.endDate
      });
    }
    
    return conditions;
  }

  /**
   * Create course filters
   */
  static createCourseFilters(filters: CourseFilter): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    
    if (filters.isPublished !== undefined) {
      conditions.push({
        field: 'isPublished',
        operator: 'eq',
        value: filters.isPublished
      });
    }
    
    if (filters.version) {
      conditions.push({
        field: 'version',
        operator: 'eq',
        value: filters.version
      });
    }
    
    if (filters.search) {
      conditions.push({
        field: 'title',
        operator: 'like',
        value: `%${filters.search}%`,
        joinOperator: 'or'
      });
      conditions.push({
        field: 'slug',
        operator: 'like',
        value: `%${filters.search}%`,
        joinOperator: 'or'
      });
    }

    // Date range filters
    if (filters.dateRange) {
      conditions.push({
        field: 'createdAt',
        operator: 'gte',
        value: filters.dateRange.startDate
      });
      conditions.push({
        field: 'createdAt',
        operator: 'lte',
        value: filters.dateRange.endDate
      });
    }
    
    return conditions;
  }

  /**
   * Create plant filters
   */
  static createPlantFilters(filters: PlantFilter): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    
    if (filters.isActive !== undefined) {
      conditions.push({
        field: 'isActive',
        operator: 'eq',
        value: filters.isActive
      });
    }
    
    if (filters.search) {
      conditions.push({
        field: 'name',
        operator: 'like',
        value: `%${filters.search}%`
      });
    }

    // Date range filters
    if (filters.dateRange) {
      conditions.push({
        field: 'createdAt',
        operator: 'gte',
        value: filters.dateRange.startDate
      });
      conditions.push({
        field: 'createdAt',
        operator: 'lte',
        value: filters.dateRange.endDate
      });
    }
    
    return conditions;
  }

  /**
   * Create generic text search filters
   */
  static createTextSearchFilters(
    searchTerm: string, 
    fields: string[], 
    joinOperator: 'and' | 'or' = 'or'
  ): FilterCondition[] {
    return fields.map(field => ({
      field,
      operator: 'like' as const,
      value: `%${searchTerm}%`,
      joinOperator
    }));
  }

  /**
   * Create date range filters
   */
  static createDateRangeFilters(
    field: string,
    startDate: Date | string,
    endDate: Date | string
  ): FilterCondition[] {
    return [
      {
        field,
        operator: 'gte',
        value: startDate
      },
      {
        field,
        operator: 'lte',
        value: endDate
      }
    ];
  }

  /**
   * Create status filters
   */
  static createStatusFilters(field: string, status: string | string[]): FilterCondition[] {
    if (Array.isArray(status)) {
      return status.map(s => ({
        field,
        operator: 'eq' as const,
        value: s,
        joinOperator: 'or' as const
      }));
    }
    
    return [{
      field,
      operator: 'eq',
      value: status
    }];
  }

  /**
   * Create ID filters
   */
  static createIdFilters(field: string, ids: string | string[]): FilterCondition[] {
    if (Array.isArray(ids)) {
      return [{
        field,
        operator: 'in',
        value: ids
      }];
    }
    
    return [{
      field,
      operator: 'eq',
      value: ids
    }];
  }

  /**
   * Create numeric range filters
   */
  static createNumericRangeFilters(
    field: string,
    min?: number,
    max?: number
  ): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    
    if (min !== undefined) {
      conditions.push({
        field,
        operator: 'gte',
        value: min
      });
    }
    
    if (max !== undefined) {
      conditions.push({
        field,
        operator: 'lte',
        value: max
      });
    }
    
    return conditions;
  }

  /**
   * Create boolean filters
   */
  static createBooleanFilters(field: string, value: boolean): FilterCondition[] {
    return [{
      field,
      operator: 'eq',
      value
    }];
  }

  /**
   * Combine multiple filter arrays
   */
  static combineFilters(...filterArrays: FilterCondition[][]): FilterCondition[] {
    return filterArrays.flat();
  }

  /**
   * Filter out empty or invalid conditions
   */
  static sanitizeFilters(conditions: FilterCondition[]): FilterCondition[] {
    return conditions.filter(condition => {
      // Remove conditions with null/undefined values
      if (condition.value === null || condition.value === undefined) {
        return false;
      }
      
      // Remove empty string values for non-like operators
      if (condition.value === '' && condition.operator !== 'like') {
        return false;
      }
      
      // Remove empty arrays for in/notIn operators
      if (Array.isArray(condition.value) && condition.value.length === 0) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Create filters from query parameters
   */
  static fromQueryParams(
    query: Record<string, string | string[] | undefined>,
    fieldMappings: Record<string, string>
  ): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    
    Object.entries(query).forEach(([key, value]) => {
      const field = fieldMappings[key];
      if (!field || !value) return;
      
      const stringValue = Array.isArray(value) ? value[0] : value;
      
      // Handle different value types
      if (stringValue === 'true' || stringValue === 'false') {
        conditions.push({
          field,
          operator: 'eq',
          value: stringValue === 'true'
        });
      } else if (!isNaN(Number(stringValue))) {
        conditions.push({
          field,
          operator: 'eq',
          value: Number(stringValue)
        });
      } else {
        conditions.push({
          field,
          operator: 'like',
          value: `%${stringValue}%`
        });
      }
    });
    
    return FilterBuilder.sanitizeFilters(conditions);
  }
}
