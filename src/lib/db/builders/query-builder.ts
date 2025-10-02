import { and, or, eq, desc, asc, count, sql } from 'drizzle-orm';
import type { PaginatedResult } from '@/contracts';
import type { PaginationOptions } from './pagination-builder';
import type { PgSelect, PgSelectBase } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';

// Database query types using proper Drizzle types
export type DatabaseQuery = PgSelectBase<any, any, any, any, false, never, any[], any>;

type JoinCondition = {
  table: any; // Drizzle table type
  condition: SQL<unknown>;
};

/**
 * Filter condition interface for query building
 */
export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'notIn' | 'between';
  value: unknown;
  joinOperator?: 'and' | 'or';
}

/**
 * Sort condition interface for query building
 */
export interface SortCondition {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Generic QueryBuilder class for standardized database query construction
 * Provides a fluent interface for building complex queries with filters, sorting, and pagination
 */
export class QueryBuilder<T> {
  private baseQuery: DatabaseQuery;
  private filters: FilterCondition[] = [];
  private sorts: SortCondition[] = [];
  private pagination?: PaginationOptions;
  private joins: JoinCondition[] = [];

  constructor(baseQuery: DatabaseQuery) {
    this.baseQuery = baseQuery;
  }

  /**
   * Add a filter condition to the query
   */
  where(condition: FilterCondition): QueryBuilder<T> {
    this.filters.push(condition);
    return this;
  }

  /**
   * Add multiple filter conditions
   */
  whereMany(conditions: FilterCondition[]): QueryBuilder<T> {
    this.filters.push(...conditions);
    return this;
  }

  /**
   * Add a join to the query
   */
  join(table: any, condition: SQL<unknown>): QueryBuilder<T> {
    this.joins.push({ table, condition });
    return this;
  }

  /**
   * Add sorting to the query
   */
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    this.sorts.push({ field, direction });
    return this;
  }

  /**
   * Add multiple sorting conditions
   */
  orderByMany(sorts: SortCondition[]): QueryBuilder<T> {
    this.sorts.push(...sorts);
    return this;
  }

  /**
   * Add pagination to the query
   */
  paginate(page: number, limit: number, maxLimit: number = 100): QueryBuilder<T> {
    this.pagination = {
      page: Math.max(1, page),
      limit: Math.min(Math.max(1, limit), maxLimit),
      maxLimit
    };
    return this;
  }

  /**
   * Execute the query and return paginated results
   */
  async execute(): Promise<PaginatedResult<T>> {
    let query = this.baseQuery as any;

    // Apply joins
    this.joins.forEach(({ table, condition }) => {
      if (query.leftJoin) {
        query = query.leftJoin(table, condition);
      }
    });

    // Apply filters
    if (this.filters.length > 0) {
      const whereConditions = this.buildWhereConditions();
      if (whereConditions && query.where) {
        query = query.where(whereConditions);
      }
    }

    // Apply sorting
    if (this.sorts.length > 0) {
      const orderByConditions = this.buildOrderByConditions();
      if (query.orderBy) {
        query = query.orderBy(...orderByConditions);
      }
    }

    // Apply pagination
    if (this.pagination) {
      const offset = (this.pagination.page - 1) * this.pagination.limit;
      if (query.limit && query.offset) {
        query = query.limit(this.pagination.limit).offset(offset);
      }
    }

    // Execute the main query
    const results = await query;

    // Get total count for pagination
    const total = await this.getTotalCount();

    return {
      items: results as T[],
      total,
      page: this.pagination?.page || 1,
      limit: this.pagination?.limit || results.length,
      totalPages: this.pagination 
        ? Math.ceil(total / this.pagination.limit)
        : 1
    };
  }

  /**
   * Execute query without pagination (for simple queries)
   */
  async executeSimple(): Promise<T[]> {
    let query = this.baseQuery as any;

    // Apply joins
    this.joins.forEach(({ table, condition }) => {
      if (query.leftJoin) {
        query = query.leftJoin(table, condition);
      }
    });

    // Apply filters
    if (this.filters.length > 0) {
      const whereConditions = this.buildWhereConditions();
      if (whereConditions && query.where) {
        query = query.where(whereConditions);
      }
    }

    // Apply sorting
    if (this.sorts.length > 0) {
      const orderByConditions = this.buildOrderByConditions();
      if (query.orderBy) {
        query = query.orderBy(...orderByConditions);
      }
    }

    const results = await query;
    return results as T[];
  }

  /**
   * Build WHERE conditions from filters
   */
  private buildWhereConditions(): SQL<unknown> | undefined {
    if (this.filters.length === 0) return undefined;

    const conditions = this.filters.map(filter => {
      const { field, operator, value } = filter;
      
      switch (operator) {
        case 'eq':
          return sql`${sql.identifier(field)} = ${value}`;
        case 'ne':
          return sql`${sql.identifier(field)} != ${value}`;
        case 'gt':
          return sql`${sql.identifier(field)} > ${value}`;
        case 'gte':
          return sql`${sql.identifier(field)} >= ${value}`;
        case 'lt':
          return sql`${sql.identifier(field)} < ${value}`;
        case 'lte':
          return sql`${sql.identifier(field)} <= ${value}`;
        case 'like':
          return sql`${sql.identifier(field)} LIKE ${value}`;
        case 'in':
          return sql`${sql.identifier(field)} IN (${value})`;
        case 'notIn':
          return sql`${sql.identifier(field)} NOT IN (${value})`;
        case 'between':
          return sql`${sql.identifier(field)} BETWEEN ${(value as any).start} AND ${(value as any).end}`;
        default:
          return sql`${sql.identifier(field)} = ${value}`;
      }
    });

    // Group conditions by join operator
    const andConditions: unknown[] = [];
    const orConditions: unknown[] = [];

    this.filters.forEach((filter, index) => {
      const condition = conditions[index];
      if (filter.joinOperator === 'or') {
        orConditions.push(condition);
      } else {
        andConditions.push(condition);
      }
    });

    // Combine conditions
    const finalConditions: unknown[] = [];
    
    if (andConditions.length > 0) {
      finalConditions.push(andConditions.length === 1 ? andConditions[0] : and(...andConditions as any[]));
    }
    
    if (orConditions.length > 0) {
      finalConditions.push(orConditions.length === 1 ? orConditions[0] : or(...orConditions as any[]));
    }

    return finalConditions.length === 1 ? finalConditions[0] as SQL<unknown> : and(...finalConditions as any[]) as SQL<unknown>;
  }

  /**
   * Build ORDER BY conditions from sorts
   */
  private buildOrderByConditions(): unknown[] {
    return this.sorts.map(sort => {
      const direction = sort.direction === 'desc' ? desc : asc;
      return direction(sort.field as any);
    });
  }

  /**
   * Get total count for pagination
   */
  private async getTotalCount(): Promise<number> {
    // Create a count query based on the base query
    let countQuery = this.baseQuery as any;

    // Apply joins
    this.joins.forEach(({ table, condition }) => {
      if (countQuery.leftJoin) {
        countQuery = countQuery.leftJoin(table, condition);
      }
    });

    // Apply filters
    if (this.filters.length > 0) {
      const whereConditions = this.buildWhereConditions();
      if (whereConditions && countQuery.where) {
        countQuery = countQuery.where(whereConditions);
      }
    }

    // Execute count query
    const countResult = await countQuery.select({ count: count() });
    return countResult[0]?.count || 0;
  }

  /**
   * Clone the query builder for reuse
   */
  clone(): QueryBuilder<T> {
    const cloned = new QueryBuilder<T>(this.baseQuery);
    cloned.filters = [...this.filters];
    cloned.sorts = [...this.sorts];
    cloned.pagination = this.pagination ? { ...this.pagination } : undefined;
    cloned.joins = [...this.joins];
    return cloned;
  }
}

/**
 * Factory function to create a new QueryBuilder
 */
export function createQueryBuilder<T>(baseQuery: DatabaseQuery): QueryBuilder<T> {
  return new QueryBuilder<T>(baseQuery);
}
