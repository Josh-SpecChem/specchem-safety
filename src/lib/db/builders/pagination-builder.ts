import type { PaginationParams, PaginatedResult } from '@/types/database';

/**
 * Pagination options interface
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  maxLimit?: number;
}

/**
 * Pagination result interface
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * PaginationBuilder utility class for consistent pagination handling
 * Provides validation, calculation, and result formatting for pagination
 */
export class PaginationBuilder {
  /**
   * Default pagination limits
   */
  static readonly DEFAULT_LIMIT = 20;
  static readonly MAX_LIMIT = 100;
  static readonly MIN_LIMIT = 1;
  static readonly MIN_PAGE = 1;

  /**
   * Validate and normalize pagination options
   */
  static validate(options: PaginationOptions): PaginationOptions {
    const { page, limit, maxLimit = PaginationBuilder.MAX_LIMIT } = options;
    
    return {
      page: Math.max(PaginationBuilder.MIN_PAGE, page),
      limit: Math.min(Math.max(PaginationBuilder.MIN_LIMIT, limit), maxLimit),
      maxLimit
    };
  }

  /**
   * Validate pagination parameters from API requests
   */
  static validateParams(params: Partial<PaginationParams>): PaginationOptions {
    const page = Math.max(PaginationBuilder.MIN_PAGE, params.page || PaginationBuilder.MIN_PAGE);
    const limit = Math.min(
      Math.max(PaginationBuilder.MIN_LIMIT, params.limit || PaginationBuilder.DEFAULT_LIMIT),
      PaginationBuilder.MAX_LIMIT
    );

    return {
      page,
      limit,
      maxLimit: PaginationBuilder.MAX_LIMIT
    };
  }

  /**
   * Calculate offset for database queries
   */
  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Calculate total pages
   */
  static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  /**
   * Create pagination result object
   */
  static createResult(
    page: number,
    limit: number,
    total: number
  ): PaginationResult {
    const totalPages = PaginationBuilder.calculateTotalPages(total, limit);
    
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > PaginationBuilder.MIN_PAGE
    };
  }

  /**
   * Create paginated result for database operations
   */
  static createPaginatedResult<T>(
    items: T[],
    page: number,
    limit: number,
    total: number
  ): PaginatedResult<T> {
    const pagination = PaginationBuilder.createResult(page, limit, total);
    
    return {
      items,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages
    };
  }

  /**
   * Get pagination metadata for API responses
   */
  static getMetadata(page: number, limit: number, total: number) {
    const totalPages = PaginationBuilder.calculateTotalPages(total, limit);
    
    return {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > PaginationBuilder.MIN_PAGE
      }
    };
  }

  /**
   * Validate page number
   */
  static isValidPage(page: number): boolean {
    return Number.isInteger(page) && page >= PaginationBuilder.MIN_PAGE;
  }

  /**
   * Validate limit number
   */
  static isValidLimit(limit: number, maxLimit: number = PaginationBuilder.MAX_LIMIT): boolean {
    return Number.isInteger(limit) && 
           limit >= PaginationBuilder.MIN_LIMIT && 
           limit <= maxLimit;
  }

  /**
   * Get default pagination options
   */
  static getDefault(): PaginationOptions {
    return {
      page: PaginationBuilder.MIN_PAGE,
      limit: PaginationBuilder.DEFAULT_LIMIT,
      maxLimit: PaginationBuilder.MAX_LIMIT
    };
  }

  /**
   * Create pagination options from query parameters
   */
  static fromQuery(query: Record<string, string | string[] | undefined>): PaginationOptions {
    const page = query.page ? parseInt(String(query.page), 10) : PaginationBuilder.MIN_PAGE;
    const limit = query.limit ? parseInt(String(query.limit), 10) : PaginationBuilder.DEFAULT_LIMIT;
    
    return PaginationBuilder.validate({ page, limit });
  }

  /**
   * Create pagination options for large datasets
   */
  static forLargeDataset(page: number = 1, limit: number = 50): PaginationOptions {
    return PaginationBuilder.validate({ 
      page, 
      limit: Math.min(limit, 50), // Cap at 50 for large datasets
      maxLimit: 50 
    });
  }

  /**
   * Create pagination options for small datasets
   */
  static forSmallDataset(page: number = 1, limit: number = 10): PaginationOptions {
    return PaginationBuilder.validate({ 
      page, 
      limit: Math.min(limit, 25), // Cap at 25 for small datasets
      maxLimit: 25 
    });
  }

  /**
   * Check if pagination is needed
   */
  static needsPagination(total: number, limit: number): boolean {
    return total > limit;
  }

  /**
   * Get next page number
   */
  static getNextPage(currentPage: number, totalPages: number): number | null {
    return currentPage < totalPages ? currentPage + 1 : null;
  }

  /**
   * Get previous page number
   */
  static getPrevPage(currentPage: number): number | null {
    return currentPage > PaginationBuilder.MIN_PAGE ? currentPage - 1 : null;
  }

  /**
   * Calculate page range for pagination UI
   */
  static getPageRange(currentPage: number, totalPages: number, rangeSize: number = 5): number[] {
    const halfRange = Math.floor(rangeSize / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, start + rangeSize - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < rangeSize) {
      start = Math.max(1, end - rangeSize + 1);
    }
    
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
