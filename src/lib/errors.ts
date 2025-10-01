/**
 * Standardized error handling for SpecChem Safety Training system
 * Provides consistent error types and response formatting across all operations
 */

export class DatabaseError extends Error {
  constructor(
    message: string, 
    public code: string = 'DATABASE_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TenantAccessError extends Error {
  constructor(
    message: string = 'Access denied: insufficient tenant permissions',
    public code: string = 'TENANT_ACCESS_DENIED'
  ) {
    super(message);
    this.name = 'TenantAccessError';
  }
}

export class NotFoundError extends Error {
  constructor(
    message: string = 'Resource not found',
    public code: string = 'NOT_FOUND'
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(
    message: string = 'Resource conflict',
    public code: string = 'CONFLICT'
  ) {
    super(message);
    this.name = 'ConflictError';
  }
}

// Error response formatter
export function formatErrorResponse(error: Error) {
  if (error instanceof DatabaseError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }
  
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      field: error.field,
      statusCode: 400,
    };
  }
  
  if (error instanceof TenantAccessError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: 403,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: 404,
    };
  }

  if (error instanceof ConflictError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: 409,
    };
  }
  
  // Generic error
  return {
    success: false,
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}
