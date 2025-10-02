/**
 * Route Migration Utilities
 * Tools to help migrate from complex templates to simplified patterns
 */

import { NextRequest, NextResponse } from 'next/server';
import { RouteUtils } from './route-utils';
import { z } from 'zod';

/**
 * Migration helper for CRUD operations
 */
export class CrudMigrationHelper {
  /**
   * Migrate GET (list) operation
   */
  static async migrateList<T>(
    request: NextRequest,
    operation: (params: any) => Promise<{ data: T[]; pagination?: any }>,
    querySchema?: z.ZodSchema<any>,
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ): Promise<NextResponse> {
    return RouteUtils.handleRequest(request, async (req) => {
      const query = RouteUtils.getValidatedQuery(req) || {};
      const result = await operation(query);
      
      if (result.pagination) {
        return RouteUtils.createPaginatedResponse(result.data, result.pagination);
      }
      
      return RouteUtils.createSuccessResponse(result.data);
    }, {
      ...options,
      validateQuery: querySchema
    });
  }

  /**
   * Migrate POST (create) operation
   */
  static async migrateCreate<T, CreateT>(
    request: NextRequest,
    operation: (data: CreateT) => Promise<T>,
    bodySchema: z.ZodSchema<CreateT>,
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ): Promise<NextResponse> {
    return RouteUtils.handleRequest(request, async (req) => {
      const body = RouteUtils.getValidatedBody<CreateT>(req);
      if (!body) {
        return RouteUtils.createErrorResponse('Request body required', 400);
      }
      
      const result = await operation(body);
      return RouteUtils.createCreatedResponse(result, 'Resource created successfully');
    }, {
      ...options,
      validateBody: bodySchema
    });
  }

  /**
   * Migrate PUT (update) operation
   */
  static async migrateUpdate<T, UpdateT>(
    request: NextRequest,
    operation: (id: string, data: UpdateT) => Promise<T>,
    bodySchema: z.ZodSchema<UpdateT>,
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ): Promise<NextResponse> {
    return RouteUtils.handleRequest(request, async (req) => {
      const body = RouteUtils.getValidatedBody<UpdateT>(req);
      if (!body) {
        return RouteUtils.createErrorResponse('Request body required', 400);
      }
      
      // Extract ID from URL path
      const pathSegments = req.nextUrl.pathname.split('/');
      const id = pathSegments[pathSegments.length - 1];
      
      if (!id) {
        return RouteUtils.createErrorResponse('Resource ID required', 400);
      }
      
      const result = await operation(id, body);
      return RouteUtils.createUpdatedResponse(result, 'Resource updated successfully');
    }, {
      ...options,
      validateBody: bodySchema
    });
  }

  /**
   * Migrate DELETE operation
   */
  static async migrateDelete(
    request: NextRequest,
    operation: (id: string) => Promise<void>,
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ): Promise<NextResponse> {
    return RouteUtils.handleRequest(request, async (req) => {
      // Extract ID from URL path
      const pathSegments = req.nextUrl.pathname.split('/');
      const id = pathSegments[pathSegments.length - 1];
      
      if (!id) {
        return RouteUtils.createErrorResponse('Resource ID required', 400);
      }
      
      await operation(id);
      return RouteUtils.createDeletedResponse('Resource deleted successfully');
    }, options);
  }
}

/**
 * Migration helper for analytics operations
 */
export class AnalyticsMigrationHelper {
  /**
   * Migrate analytics GET operation
   */
  static async migrateAnalytics<T>(
    request: NextRequest,
    operation: (params: any) => Promise<T>,
    querySchema?: z.ZodSchema<any>,
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ): Promise<NextResponse> {
    return RouteUtils.handleRequest(request, async (req) => {
      const query = RouteUtils.getValidatedQuery(req) || {};
      const result = await operation(query);
      return RouteUtils.createSuccessResponse(result);
    }, {
      ...options,
      validateQuery: querySchema
    });
  }
}

/**
 * Template conversion utilities
 */
export class TemplateConverter {
  /**
   * Convert CrudRouteTemplate to simplified handlers
   */
  static convertCrudTemplate<T, CreateT, UpdateT>(
    operations: {
      list: (params: any) => Promise<{ data: T[]; pagination?: any }>;
      get: (id: string) => Promise<T>;
      create: (data: CreateT) => Promise<T>;
      update: (id: string, data: UpdateT) => Promise<T>;
      delete: (id: string) => Promise<void>;
    },
    schemas: {
      list: z.ZodSchema<any>;
      create: z.ZodSchema<CreateT>;
      update: z.ZodSchema<UpdateT>;
    },
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ) {
    return {
      GET: (request: NextRequest) => 
        CrudMigrationHelper.migrateList(request, operations.list, schemas.list, options),
      
      POST: (request: NextRequest) => 
        CrudMigrationHelper.migrateCreate(request, operations.create, schemas.create, options),
      
      PUT: (request: NextRequest) => 
        CrudMigrationHelper.migrateUpdate(request, operations.update, schemas.update, options),
      
      DELETE: (request: NextRequest) => 
        CrudMigrationHelper.migrateDelete(request, operations.delete, options)
    };
  }

  /**
   * Convert ListRouteTemplate to simplified handler
   */
  static convertListTemplate<T>(
    operation: (params: any) => Promise<{ data: T[]; pagination?: any }>,
    schema: z.ZodSchema<any>,
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ) {
    return {
      GET: (request: NextRequest) => 
        CrudMigrationHelper.migrateList(request, operation, schema, options)
    };
  }

  /**
   * Convert AnalyticsRouteTemplate to simplified handler
   */
  static convertAnalyticsTemplate<T>(
    operation: (params: any) => Promise<T>,
    schema: z.ZodSchema<any>,
    options: {
      requireAuth?: boolean;
      requireRole?: 'hr_admin' | 'dev_admin' | 'plant_manager';
    } = {}
  ) {
    return {
      GET: (request: NextRequest) => 
        AnalyticsMigrationHelper.migrateAnalytics(request, operation, schema, options)
    };
  }
}

/**
 * Validation utilities for migration
 */
export class MigrationValidator {
  /**
   * Validate that a route follows the new simplified pattern
   */
  static validateRoutePattern(routeFile: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for template usage
    if (routeFile.includes('CrudRouteTemplate') || 
        routeFile.includes('ListRouteTemplate') || 
        routeFile.includes('AnalyticsRouteTemplate')) {
      issues.push('Uses complex template classes');
      suggestions.push('Replace with RouteUtils.handleRequest pattern');
    }

    // Check for old middleware usage
    if (routeFile.includes('AuthMiddleware') && 
        !routeFile.includes('UnifiedAuthMiddleware')) {
      issues.push('Uses old AuthMiddleware');
      suggestions.push('Use UnifiedAuthMiddleware directly');
    }

    // Check for manual error handling
    if (routeFile.includes('try/catch') && 
        routeFile.includes('formatErrorResponse')) {
      issues.push('Manual error handling');
      suggestions.push('Use RouteUtils.handleRequest for automatic error handling');
    }

    // Check for manual validation
    if (routeFile.includes('.parse(') && 
        !routeFile.includes('RouteUtils.getValidated')) {
      issues.push('Manual validation');
      suggestions.push('Use RouteUtils validation options');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Generate migration suggestions for a route file
   */
  static generateMigrationSuggestions(routeFile: string): string[] {
    const suggestions: string[] = [];

    if (routeFile.includes('CrudRouteTemplate')) {
      suggestions.push('Replace CrudRouteTemplate with TemplateConverter.convertCrudTemplate');
    }

    if (routeFile.includes('ListRouteTemplate')) {
      suggestions.push('Replace ListRouteTemplate with TemplateConverter.convertListTemplate');
    }

    if (routeFile.includes('AnalyticsRouteTemplate')) {
      suggestions.push('Replace AnalyticsRouteTemplate with TemplateConverter.convertAnalyticsTemplate');
    }

    if (routeFile.includes('withAdminAuth')) {
      suggestions.push('Replace withAdminAuth with RouteUtils.handleRequest options');
    }

    if (routeFile.includes('ValidationMiddleware')) {
      suggestions.push('Replace ValidationMiddleware with RouteUtils validation options');
    }

    return suggestions;
  }
}
