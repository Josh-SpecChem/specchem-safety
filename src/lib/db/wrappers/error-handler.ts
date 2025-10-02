import { DatabaseOperationError } from './operation-wrapper';

/**
 * Custom error classes for different database operation failures
 */
export class ConflictError extends Error {
  constructor(message: string, public code: string = 'CONFLICT_ERROR') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string, public code: string = 'BAD_REQUEST_ERROR') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string, public code: string = 'NOT_FOUND_ERROR') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class InternalServerError extends Error {
  constructor(message: string, public code: string = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = 'InternalServerError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string, public code: string = 'UNAUTHORIZED_ERROR') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string, public code: string = 'FORBIDDEN_ERROR') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * DatabaseErrorHandler class for consistent error handling across database operations
 * Maps database errors to appropriate application errors with proper HTTP status codes
 */
export class DatabaseErrorHandler {
  /**
   * Handle database errors and convert them to appropriate application errors
   */
  static handle(error: Error): never {
    // Re-throw custom errors as-is
    if (error instanceof ConflictError ||
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof InternalServerError ||
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError) {
      throw error;
    }

    // Handle DatabaseOperationError
    if (error instanceof DatabaseOperationError) {
      throw DatabaseErrorHandler.mapDatabaseOperationError(error);
    }

    // Handle specific database error patterns
    const errorMessage = error.message.toLowerCase();
    const errorCode = (error as any).code;

    // Duplicate key errors
    if (errorMessage.includes('duplicate key') || 
        errorMessage.includes('unique constraint') ||
        errorCode === '23505') {
      throw new ConflictError('Resource already exists');
    }

    // Foreign key constraint errors
    if (errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('referential integrity') ||
        errorCode === '23503') {
      throw new BadRequestError('Referenced resource does not exist');
    }

    // Not null constraint errors
    if (errorMessage.includes('not null') ||
        errorMessage.includes('null value') ||
        errorCode === '23502') {
      throw new ValidationError('Required field is missing');
    }

    // Check constraint errors
    if (errorMessage.includes('check constraint') ||
        errorCode === '23514') {
      throw new ValidationError('Invalid data provided');
    }

    // Connection errors
    if (errorMessage.includes('connection') ||
        errorMessage.includes('timeout') ||
        errorCode === 'ECONNREFUSED' ||
        errorCode === 'ETIMEDOUT') {
      throw new InternalServerError('Database connection failed');
    }

    // Authentication errors
    if (errorMessage.includes('authentication') ||
        errorMessage.includes('permission denied') ||
        errorCode === '28P01') {
      throw new UnauthorizedError('Database authentication failed');
    }

    // Authorization errors
    if (errorMessage.includes('insufficient privilege') ||
        errorMessage.includes('permission denied') ||
        errorCode === '42501') {
      throw new ForbiddenError('Insufficient database privileges');
    }

    // Not found errors
    if (errorMessage.includes('not found') ||
        errorMessage.includes('no rows')) {
      throw new NotFoundError('Resource not found');
    }

    // Generic database error
    throw new InternalServerError('Database operation failed');
  }

  /**
   * Map DatabaseOperationError to appropriate application error
   */
  private static mapDatabaseOperationError(error: DatabaseOperationError): Error {
    switch (error.code) {
      case 'TIMEOUT_ERROR':
        return new InternalServerError('Database operation timed out');
      
      case 'CONNECTION_ERROR':
        return new InternalServerError('Database connection failed');
      
      case 'DUPLICATE_ERROR':
        return new ConflictError('Resource already exists');
      
      case 'FOREIGN_KEY_ERROR':
        return new BadRequestError('Referenced resource does not exist');
      
      case 'NOT_FOUND_ERROR':
        return new NotFoundError('Resource not found');
      
      case 'VALIDATION_ERROR':
        return new ValidationError('Invalid data provided');
      
      default:
        return new InternalServerError('Database operation failed');
    }
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(message: string, field?: string): never {
    const errorMessage = field ? `${field}: ${message}` : message;
    throw new ValidationError(errorMessage);
  }

  /**
   * Handle not found errors
   */
  static handleNotFoundError(resource: string, id?: string): never {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    throw new NotFoundError(message);
  }

  /**
   * Handle conflict errors
   */
  static handleConflictError(resource: string, reason?: string): never {
    const message = reason || `${resource} already exists`;
    throw new ConflictError(message);
  }

  /**
   * Handle unauthorized errors
   */
  static handleUnauthorizedError(action?: string): never {
    const message = action ? `Unauthorized to ${action}` : 'Unauthorized access';
    throw new UnauthorizedError(message);
  }

  /**
   * Handle forbidden errors
   */
  static handleForbiddenError(action?: string): never {
    const message = action ? `Forbidden to ${action}` : 'Access forbidden';
    throw new ForbiddenError(message);
  }

  /**
   * Handle bad request errors
   */
  static handleBadRequestError(message: string): never {
    throw new BadRequestError(message);
  }

  /**
   * Handle internal server errors
   */
  static handleInternalError(message: string = 'Internal server error'): never {
    throw new InternalServerError(message);
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: Error): boolean {
    if (error instanceof ConflictError ||
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError) {
      return false;
    }

    if (error instanceof InternalServerError) {
      return true;
    }

    // Check for specific retryable patterns
    const errorMessage = error.message.toLowerCase();
    return errorMessage.includes('timeout') ||
           errorMessage.includes('connection') ||
           errorMessage.includes('deadlock');
  }

  /**
   * Get HTTP status code for error
   */
  static getStatusCode(error: Error): number {
    if (error instanceof BadRequestError || error instanceof ValidationError) {
      return 400;
    }
    
    if (error instanceof UnauthorizedError) {
      return 401;
    }
    
    if (error instanceof ForbiddenError) {
      return 403;
    }
    
    if (error instanceof NotFoundError) {
      return 404;
    }
    
    if (error instanceof ConflictError) {
      return 409;
    }
    
    if (error instanceof InternalServerError) {
      return 500;
    }
    
    return 500; // Default to internal server error
  }

  /**
   * Format error for API response
   */
  static formatError(error: Error): {
    error: string;
    code: string;
    statusCode: number;
    timestamp: string;
  } {
    return {
      error: error.message,
      code: (error as any).code || 'UNKNOWN_ERROR',
      statusCode: DatabaseErrorHandler.getStatusCode(error),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log error with appropriate level
   */
  static logError(error: Error, context?: string): void {
    const statusCode = DatabaseErrorHandler.getStatusCode(error);
    const logLevel = statusCode >= 500 ? 'error' : 'warn';
    
    const logMessage = context 
      ? `[${context}] ${error.name}: ${error.message}`
      : `${error.name}: ${error.message}`;
    
    if (logLevel === 'error') {
      console.error(logMessage, error);
    } else {
      console.warn(logMessage);
    }
  }

  /**
   * Create error from database result
   */
  static fromDatabaseResult<T>(result: { success: false; error: string; code?: string }): never {
    const error = new Error(result.error);
    (error as any).code = result.code || 'DATABASE_ERROR';
    DatabaseErrorHandler.handle(error);
  }
}
