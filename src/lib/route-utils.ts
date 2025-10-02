/**
 * Simplified Route Utilities
 * Provides a unified, simple approach to API route handling
 * Replaces complex template classes with straightforward utility functions
 */

import { ResponseUtils } from '@/app/api/shared/utils/response-utils';
import type { AdminRole } from '@/contracts';
import { UnifiedAuthMiddleware } from '@/lib/auth/unified-auth-middleware';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Simplified route handler interface
 */
export interface RouteHandler {
  (request: NextRequest, context: any): Promise<NextResponse>;
}

/**
 * Route options for the handleRequest utility
 */
export interface RouteOptions<TBody = any, TQuery = any> {
  requireAuth?: boolean;
  requireRole?: AdminRole;
  plantId?: string;
  validateBody?: z.ZodSchema<TBody>;
  validateQuery?: z.ZodSchema<TQuery>;
}

/**
 * Unified Route Utilities
 * Single class that handles all route patterns with simple, consistent API
 */
export class RouteUtils {
  /**
   * Main route handler that consolidates authentication, validation, and error handling
   */
  static async handleRequest<TBody = any, TQuery = any>(
    request: NextRequest,
    handler: RouteHandler,
    options: RouteOptions<TBody, TQuery> = {}
  ): Promise<NextResponse> {
    try {
      // Authentication
      if (options.requireAuth) {
        const authResult = await UnifiedAuthMiddleware.authenticateUser(request);
        if (!authResult.success) {
          return RouteUtils.createErrorResponse(
            authResult.error || 'Authentication required', 
            authResult.status || 401
          );
        }
      }
      
      // Role-based access
      if (options.requireRole) {
        const adminResult = await UnifiedAuthMiddleware.authenticateAdmin(
          request, 
          options.requireRole as any, 
          options.plantId
        );
        if (!adminResult.success) {
          return RouteUtils.createErrorResponse(
            adminResult.error || 'Insufficient permissions', 
            adminResult.status || 403
          );
        }
      }
      
      // Body validation
      if (options.validateBody) {
        try {
          const body = await request.json();
          const validatedBody = options.validateBody.parse(body);
          // Store validated body in headers for handler access
          request.headers.set('x-validated-body', JSON.stringify(validatedBody));
        } catch (error) {
          if (error instanceof z.ZodError) {
            return RouteUtils.createErrorResponse(
              `Validation error: ${error.issues.map((e: z.ZodIssue) => e.message).join(', ')}`,
              400
            );
          }
          return RouteUtils.createErrorResponse('Invalid request body', 400);
        }
      }
      
      // Query validation
      if (options.validateQuery) {
        try {
          const url = new URL(request.url);
          const query = Object.fromEntries(url.searchParams);
          const validatedQuery = options.validateQuery.parse(query);
          // Store validated query in headers for handler access
          request.headers.set('x-validated-query', JSON.stringify(validatedQuery));
        } catch (error) {
          if (error instanceof z.ZodError) {
            return RouteUtils.createErrorResponse(
              `Validation error: ${error.issues.map((e: z.ZodIssue) => e.message).join(', ')}`,
              400
            );
          }
          return RouteUtils.createErrorResponse('Invalid query parameters', 400);
        }
      }
      
      // Execute handler
      return await handler(request, {});
      
    } catch (error) {
      return RouteUtils.createErrorResponse(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }
  
  /**
   * Create success response with data
   */
  static createSuccessResponse<T>(data: T, message?: string): NextResponse {
    return ResponseUtils.success(data, message);
  }
  
  /**
   * Create error response
   */
  static createErrorResponse(error: string, status: number = 500): NextResponse {
    return ResponseUtils.error(error, status);
  }
  
  /**
   * Create paginated response
   */
  static createPaginatedResponse<T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  ): NextResponse {
    return ResponseUtils.paginated(data, pagination);
  }

  /**
   * Create created response (201)
   */
  static createCreatedResponse<T>(data: T, message: string = 'Resource created successfully'): NextResponse {
    return ResponseUtils.created(data, message);
  }

  /**
   * Create updated response
   */
  static createUpdatedResponse<T>(data: T, message: string = 'Resource updated successfully'): NextResponse {
    return ResponseUtils.updated(data, message);
  }

  /**
   * Create deleted response
   */
  static createDeletedResponse(message: string = 'Resource deleted successfully'): NextResponse {
    return ResponseUtils.deleted(message);
  }

  /**
   * Extract validated body from request headers
   */
  static getValidatedBody<T>(request: NextRequest): T | null {
    const bodyHeader = request.headers.get('x-validated-body');
    if (!bodyHeader) return null;
    try {
      return JSON.parse(bodyHeader) as T;
    } catch {
      return null;
    }
  }

  /**
   * Extract validated query from request headers
   */
  static getValidatedQuery<T>(request: NextRequest): T | null {
    const queryHeader = request.headers.get('x-validated-query');
    if (!queryHeader) return null;
    try {
      return JSON.parse(queryHeader) as T;
    } catch {
      return null;
    }
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

/**
 * Error handling utility
 */
function handleRouteError(error: unknown): NextResponse {
  if (error instanceof z.ZodError) {
    return RouteUtils.createErrorResponse(
      `Validation error: ${error.issues.map(e => e.message).join(', ')}`,
      400
    );
  }
  
  if (error instanceof Error) {
    return RouteUtils.createErrorResponse(error.message, 500);
  }
  
  return RouteUtils.createErrorResponse('Unknown error', 500);
}

/**
 * Convenience functions for common patterns
 */

/**
 * Handle GET request with optional authentication and query validation
 */
export async function handleGet<TQuery = any>(
  request: NextRequest,
  handler: (request: NextRequest, query: TQuery | null) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    validateQuery?: z.ZodSchema<TQuery>;
  } = {}
): Promise<NextResponse> {
  return RouteUtils.handleRequest(request, async (req) => {
    const query = RouteUtils.getValidatedQuery<TQuery>(req);
    return await handler(req, query);
  }, options);
}

/**
 * Handle POST request with optional authentication and body validation
 */
export async function handlePost<TBody = any>(
  request: NextRequest,
  handler: (request: NextRequest, body: TBody | null) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    validateBody?: z.ZodSchema<TBody>;
  } = {}
): Promise<NextResponse> {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody<TBody>(req);
    return await handler(req, body);
  }, options);
}

/**
 * Handle PUT request with optional authentication and body validation
 */
export async function handlePut<TBody = any>(
  request: NextRequest,
  handler: (request: NextRequest, body: TBody | null) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    validateBody?: z.ZodSchema<TBody>;
  } = {}
): Promise<NextResponse> {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody<TBody>(req);
    return await handler(req, body);
  }, options);
}

/**
 * Handle PATCH request with optional authentication and body validation
 */
export async function handlePatch<TBody = any>(
  request: NextRequest,
  handler: (request: NextRequest, body: TBody | null) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    validateBody?: z.ZodSchema<TBody>;
  } = {}
): Promise<NextResponse> {
  return RouteUtils.handleRequest(request, async (req) => {
    const body = RouteUtils.getValidatedBody<TBody>(req);
    return await handler(req, body);
  }, options);
}

/**
 * Handle DELETE request with optional authentication
 */
export async function handleDelete(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
  } = {}
): Promise<NextResponse> {
  return RouteUtils.handleRequest(request, handler, options);
}
