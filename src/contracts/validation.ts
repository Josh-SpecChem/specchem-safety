/**
 * Validation Utilities - Request/Response Validation Helpers
 * 
 * Provides standardized validation functions for API routes and data processing.
 * All API routes should use these utilities for consistent validation behavior.
 */

import type { NextRequest } from 'next/server';
import { z } from 'zod';

// ========================================
// VALIDATION RESULT TYPES
// ========================================

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  success: false;
  error: {
    message: string;
    field?: string;
    code?: string;
    issues?: z.ZodIssue[];
  };
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

// ========================================
// REQUEST VALIDATION
// ========================================

/**
 * Validates request body against a Zod schema
 */
export function validateRequest<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      error: {
        message: 'Validation failed',
        issues: result.error.issues,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown validation error',
        code: 'VALIDATION_ERROR',
      },
    };
  }
}

/**
 * Validates and parses JSON request body
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    return validateRequest(schema, body);
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Invalid JSON in request body',
        code: 'INVALID_JSON',
      },
    };
  }
}

/**
 * Validates URL search parameters against a Zod schema
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>
): ValidationResult<T> {
  try {
    const params = Object.fromEntries(searchParams.entries());
    return validateRequest(schema, params);
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Invalid search parameters',
        code: 'INVALID_PARAMS',
      },
    };
  }
}

/**
 * Validates route parameters (e.g., /api/users/[id])
 */
export function validateRouteParams<T>(
  params: Record<string, string | string[]>,
  schema: z.ZodType<T>
): ValidationResult<T> {
  return validateRequest(schema, params);
}

// ========================================
// RESPONSE VALIDATION
// ========================================

/**
 * Validates response data before sending to client
 */
export function validateResponse<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationResult<T> {
  return validateRequest(schema, data);
}

/**
 * Validates and formats API response
 */
export function validateApiResponse<T>(
  schema: z.ZodType<T>,
  data: unknown,
  message?: string
): ValidationResult<{
  success: boolean;
  data: T;
  message?: string;
}> {
  const validation = validateResponse(schema, data);
  
  if (!validation.success) {
    return validation as ValidationError;
  }

  return {
    success: true,
    data: {
      success: true,
      data: validation.data,
      message,
    },
  };
}

// ========================================
// TENANT VALIDATION
// ========================================

/**
 * Validates tenant isolation for resources
 */
export function validateTenantAccess(
  resourcePlantId: string,
  userPlantId: string
): ValidationResult<void> {
  if (resourcePlantId !== userPlantId) {
    return {
      success: false,
      error: {
        message: 'Access denied: Resource belongs to different tenant',
        code: 'TENANT_ISOLATION_VIOLATION',
      },
    };
  }

  return {
    success: true,
    data: undefined,
  };
}

/**
 * Validates that a user has access to a specific plant
 */
export function validatePlantAccess(
  requestedPlantId: string,
  userPlantIds: string[]
): ValidationResult<void> {
  if (!userPlantIds.includes(requestedPlantId)) {
    return {
      success: false,
      error: {
        message: 'Access denied: User does not have access to this plant',
        code: 'PLANT_ACCESS_DENIED',
      },
    };
  }

  return {
    success: true,
    data: undefined,
  };
}

// ========================================
// FIELD VALIDATION HELPERS
// ========================================

/**
 * Validates UUID format
 */
export function validateUUID(value: string, fieldName = 'id'): ValidationResult<string> {
  const uuidSchema = z.string().uuid(`Invalid ${fieldName} format`);
  return validateRequest(uuidSchema, value);
}

/**
 * Validates email format
 */
export function validateEmail(value: string): ValidationResult<string> {
  const emailSchema = z.string().email('Invalid email format');
  return validateRequest(emailSchema, value);
}

/**
 * Validates progress percentage (0-100)
 */
export function validateProgress(value: number): ValidationResult<number> {
  const progressSchema = z.number().int().min(0).max(100);
  return validateRequest(progressSchema, value);
}

/**
 * Validates pagination parameters
 */
export function validatePagination(
  page?: string | number,
  limit?: string | number
): ValidationResult<{ page: number; limit: number }> {
  const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(50),
  });

  return validateRequest(paginationSchema, { page, limit });
}

// ========================================
// BULK VALIDATION
// ========================================

/**
 * Validates an array of items against a schema
 */
export function validateArray<T>(
  schema: z.ZodType<T>,
  items: unknown[]
): ValidationResult<T[]> {
  const arraySchema = z.array(schema);
  return validateRequest(arraySchema, items);
}

/**
 * Validates each item in an array and returns both successes and failures
 */
export function validateArrayWithPartialFailures<T>(
  schema: z.ZodType<T>,
  items: unknown[]
): {
  successes: { index: number; data: T }[];
  failures: { index: number; error: ValidationError['error'] }[];
} {
  const successes: { index: number; data: T }[] = [];
  const failures: { index: number; error: ValidationError['error'] }[] = [];

  items.forEach((item, index) => {
    const result = validateRequest(schema, item);
    if (result.success) {
      successes.push({ index, data: result.data });
    } else {
      failures.push({ index, error: (result as ValidationError).error });
    }
  });

  return { successes, failures };
}

// ========================================
// ERROR FORMATTING
// ========================================

/**
 * Formats Zod validation errors for API responses
 */
export function formatValidationError(error: z.ZodError): {
  message: string;
  field?: string;
  issues: Array<{
    field: string;
    message: string;
    code: string;
  }>;
} {
  const issues = error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

  const firstIssue = issues[0];
  
  return {
    message: firstIssue ? `${firstIssue.field}: ${firstIssue.message}` : 'Validation failed',
    field: firstIssue?.field,
    issues,
  };
}

/**
 * Creates a standardized validation error response
 */
export function createValidationErrorResponse(
  error: ValidationError['error'],
  statusCode = 400
) {
  return new Response(
    JSON.stringify({
      success: false,
      error: error.message,
      details: error.issues ? formatValidationError({ issues: error.issues } as z.ZodError) : undefined,
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// ========================================
// SUCCESS RESPONSE HELPERS
// ========================================

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode = 200
) {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      message,
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Creates a standardized paginated response
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
) {
  return createSuccessResponse({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }, message);
}

// ========================================
// MIDDLEWARE HELPERS
// ========================================

/**
 * Middleware function to validate request body
 */
export function withBodyValidation<T>(schema: z.ZodType<T>) {
  return async (request: NextRequest): Promise<ValidationResult<T>> => {
    return validateRequestBody(request, schema);
  };
}

/**
 * Middleware function to validate search parameters
 */
export function withParamsValidation<T>(schema: z.ZodType<T>) {
  return (searchParams: URLSearchParams): ValidationResult<T> => {
    return validateSearchParams(searchParams, schema);
  };
}

// ========================================
// CUSTOM VALIDATION RULES
// ========================================

/**
 * Custom validation for enrollment status transitions
 */
export function validateEnrollmentStatusTransition(
  currentStatus: string,
  newStatus: string
): ValidationResult<void> {
  const validTransitions: Record<string, string[]> = {
    enrolled: ['in_progress', 'completed'],
    in_progress: ['completed'],
    completed: [], // No transitions from completed
  };

  const allowedTransitions = validTransitions[currentStatus] || [];
  
  if (!allowedTransitions.includes(newStatus)) {
    return {
      success: false,
      error: {
        message: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        code: 'INVALID_STATUS_TRANSITION',
      },
    };
  }

  return {
    success: true,
    data: undefined,
  };
}

/**
 * Custom validation for progress updates
 */
export function validateProgressUpdate(
  currentProgress: number,
  newProgress: number
): ValidationResult<void> {
  if (newProgress < currentProgress) {
    return {
      success: false,
      error: {
        message: 'Progress cannot decrease',
        code: 'PROGRESS_CANNOT_DECREASE',
      },
    };
  }

  return {
    success: true,
    data: undefined,
  };
}

