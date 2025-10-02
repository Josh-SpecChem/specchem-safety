/**
 * Route Utilities for API Route Standardization
 * Provides common utilities for extracting and validating request data
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';

export class RouteUtils {
  /**
   * Extract and validate query parameters from request
   */
  static extractQueryParams<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
  ): T {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    
    try {
      return schema.parse(params);
    } catch (error) {
      throw new ValidationError('Invalid query parameters', error as Error);
    }
  }

  /**
   * Extract and validate path parameters from request
   */
  static extractPathParams<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
  ): T {
    const pathname = request.nextUrl.pathname;
    const segments = pathname.split('/');
    
    // Extract dynamic segments (e.g., [id])
    const params: Record<string, string> = {};
    const routeSegments = request.nextUrl.pathname.split('/');
    
    // This would need to be customized based on route structure
    // For now, assuming standard patterns
    if (routeSegments.includes('users') && routeSegments.length > 4) {
      const lastSegment = routeSegments[routeSegments.length - 1];
      if (lastSegment) {
        params.id = lastSegment;
      }
    }
    
    if (routeSegments.includes('courses') && routeSegments.length > 4) {
      const lastSegment = routeSegments[routeSegments.length - 1];
      if (lastSegment) {
        params.id = lastSegment;
      }
    }
    
    if (routeSegments.includes('enrollments') && routeSegments.length > 4) {
      const lastSegment = routeSegments[routeSegments.length - 1];
      if (lastSegment) {
        params.id = lastSegment;
      }
    }
    
    try {
      return schema.parse(params);
    } catch (error) {
      throw new ValidationError('Invalid path parameters', error as Error);
    }
  }

  /**
   * Extract and validate request body
   */
  static extractBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    return request.json().then(body => {
      try {
        return schema.parse(body);
      } catch (error) {
        throw new ValidationError('Invalid request body', error as Error);
      }
    });
  }

  /**
   * Extract pagination parameters with defaults
   */
  static extractPaginationParams(request: NextRequest) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    return {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
      offset: (page - 1) * limit
    };
  }

  /**
   * Extract search parameters
   */
  static extractSearchParams(request: NextRequest) {
    const url = new URL(request.url);
    return {
      search: url.searchParams.get('search') || undefined,
      sort: url.searchParams.get('sort') || 'desc',
      sortBy: url.searchParams.get('sortBy') || undefined
    };
  }

  /**
   * Extract filter parameters
   */
  static extractFilterParams(request: NextRequest, allowedFilters: string[]) {
    const url = new URL(request.url);
    const filters: Record<string, any> = {};
    
    allowedFilters.forEach(filter => {
      const value = url.searchParams.get(filter);
      if (value !== null) {
        // Handle boolean values
        if (value === 'true') {
          filters[filter] = true;
        } else if (value === 'false') {
          filters[filter] = false;
        } else {
          filters[filter] = value;
        }
      }
    });
    
    return filters;
  }
}

export class ValidationError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'ValidationError';
  }
}
