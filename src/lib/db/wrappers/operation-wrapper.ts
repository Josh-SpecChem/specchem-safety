import type { DatabaseResponse } from '@/types/database';

/**
 * Operation options interface
 */
export interface OperationOptions {
  timeout?: number;
  retries?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  retryDelay?: number;
  maxRetryDelay?: number;
  stopOnError?: boolean;
}

/**
 * Operation result interface
 */
export interface OperationResult<T> {
  data: T;
  success: true;
  attempts: number;
  duration: number;
}

export interface OperationErrorResult {
  success: false;
  error: string;
  code?: string;
  attempts: number;
  duration: number;
  originalError?: Error;
}

export type OperationResponse<T> = OperationResult<T> | OperationErrorResult;

/**
 * DatabaseOperationError class for enhanced error handling
 */
export class DatabaseOperationError extends Error {
  constructor(
    message: string, 
    public originalError: Error,
    public code: string = 'DATABASE_ERROR',
    public retryable: boolean = true
  ) {
    super(message);
    this.name = 'DatabaseOperationError';
  }
}

/**
 * OperationWrapper class for standardized database operations
 * Provides retry logic, timeout handling, and consistent error handling
 */
export class OperationWrapper {
  /**
   * Default operation options
   */
  static readonly DEFAULT_OPTIONS: Required<OperationOptions> = {
    timeout: 30000, // 30 seconds
    retries: 3,
    logLevel: 'info',
    retryDelay: 1000, // 1 second
    maxRetryDelay: 10000, // 10 seconds
    stopOnError: true
  };

  /**
   * Wrap database operations with standardized error handling and retry logic
   */
  static async withDatabaseOperation<T>(
    operation: () => Promise<T>,
    options: OperationOptions = {}
  ): Promise<OperationResponse<T>> {
    const opts = { ...OperationWrapper.DEFAULT_OPTIONS, ...options };
    const startTime = Date.now();
    let lastError: Error;
    
    for (let attempt = 1; attempt <= opts.retries; attempt++) {
      try {
        const result = await Promise.race([
          operation(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Operation timeout')), opts.timeout)
          )
        ]);
        
        const duration = Date.now() - startTime;
        
        if (opts.logLevel === 'debug') {
          console.log(`Database operation succeeded on attempt ${attempt} in ${duration}ms`);
        }
        
        return {
          data: result,
          success: true,
          attempts: attempt,
          duration
        };
      } catch (error) {
        lastError = error as Error;
        const duration = Date.now() - startTime;
        
        if (opts.logLevel === 'warn' || opts.logLevel === 'error') {
          console.warn(`Database operation failed on attempt ${attempt}:`, error);
        }
        
        // Check if this is a retryable error
        if (!OperationWrapper.isRetryableError(error as Error) || attempt === opts.retries) {
          return {
            success: false,
            error: lastError.message,
            code: OperationWrapper.getErrorCode(lastError),
            attempts: attempt,
            duration,
            originalError: lastError
          };
        }
        
        // Calculate exponential backoff delay
        const delay = Math.min(
          opts.retryDelay * Math.pow(2, attempt - 1),
          opts.maxRetryDelay
        );
        
        if (opts.logLevel === 'debug') {
          console.log(`Retrying operation in ${delay}ms (attempt ${attempt + 1}/${opts.retries})`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    const duration = Date.now() - startTime;
    return {
      success: false,
      error: lastError!.message,
      code: OperationWrapper.getErrorCode(lastError!),
      attempts: opts.retries,
      duration,
      originalError: lastError!
    };
  }

  /**
   * Wrap database operations with legacy DatabaseResponse format
   */
  static async withLegacyWrapper<T>(
    operation: () => Promise<T>,
    options: OperationOptions = {}
  ): Promise<DatabaseResponse<T>> {
    const result = await OperationWrapper.withDatabaseOperation(operation, options);
    
    if (result.success) {
      return { data: result.data, success: true };
    } else {
      return {
        success: false,
        error: result.error,
        code: result.code
      };
    }
  }

  /**
   * Check if an error is retryable
   */
  private static isRetryableError(error: Error): boolean {
    // Network/connection errors are retryable
    if (error.message?.includes('timeout') || 
        error.message?.includes('connection') ||
        error.message?.includes('network')) {
      return true;
    }
    
    // Database connection errors are retryable
    const errorWithCode = error as Error & { code?: string };
    if (errorWithCode.code === 'ECONNREFUSED' || 
        errorWithCode.code === 'ETIMEDOUT' ||
        errorWithCode.code === 'ENOTFOUND') {
      return true;
    }
    
    // Deadlock errors are retryable
    if (error.message?.includes('deadlock') || 
        error.message?.includes('lock timeout')) {
      return true;
    }
    
    // Validation errors are not retryable
    if (error.message?.includes('validation') ||
        error.message?.includes('duplicate key') ||
        error.message?.includes('foreign key constraint')) {
      return false;
    }
    
    // Default to retryable for unknown errors
    return true;
  }

  /**
   * Get error code from error
   */
  private static getErrorCode(error: Error): string {
    if (error instanceof DatabaseOperationError) {
      return error.code;
    }
    
    // Map common error patterns to codes
    if (error.message?.includes('timeout')) {
      return 'TIMEOUT_ERROR';
    }
    
    if (error.message?.includes('connection')) {
      return 'CONNECTION_ERROR';
    }
    
    if (error.message?.includes('duplicate key')) {
      return 'DUPLICATE_ERROR';
    }
    
    if (error.message?.includes('foreign key constraint')) {
      return 'FOREIGN_KEY_ERROR';
    }
    
    if (error.message?.includes('not found')) {
      return 'NOT_FOUND_ERROR';
    }
    
    return 'UNKNOWN_ERROR';
  }

  /**
   * Create a timeout promise
   */
  static createTimeoutPromise<T>(timeoutMs: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
    });
  }

  /**
   * Execute operation with custom timeout
   */
  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      operation(),
      OperationWrapper.createTimeoutPromise<T>(timeoutMs)
    ]);
  }

  /**
   * Execute operation with retry only (no timeout)
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retries) {
          throw lastError;
        }
        
        // Exponential backoff
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Execute multiple operations in parallel with individual error handling
   */
  static async executeParallel<T>(
    operations: Array<() => Promise<T>>,
    options: OperationOptions = {}
  ): Promise<Array<OperationResponse<T>>> {
    const promises = operations.map(operation => 
      OperationWrapper.withDatabaseOperation(operation, options)
    );
    
    return Promise.all(promises);
  }

  /**
   * Execute operations sequentially with error handling
   */
  static async executeSequential<T>(
    operations: Array<() => Promise<T>>,
    options: OperationOptions = {}
  ): Promise<Array<OperationResponse<T>>> {
    const results: Array<OperationResponse<T>> = [];
    
    for (const operation of operations) {
      const result = await OperationWrapper.withDatabaseOperation(operation, options);
      results.push(result);
      
      // Stop on first failure if configured
      if (!result.success && options.stopOnError !== false) {
        break;
      }
    }
    
    return results;
  }

  /**
   * Create a circuit breaker pattern wrapper
   */
  static createCircuitBreaker(
    failureThreshold: number = 5,
    resetTimeout: number = 60000
  ) {
    let failures = 0;
    let lastFailureTime = 0;
    let state: 'closed' | 'open' | 'half-open' = 'closed';
    
    return async function<T>(
      operation: () => Promise<T>,
      options: OperationOptions = {}
    ): Promise<OperationResponse<T>> {
      const now = Date.now();
      
      // Check circuit breaker state
      if (state === 'open') {
        if (now - lastFailureTime > resetTimeout) {
          state = 'half-open';
        } else {
          return {
            success: false,
            error: 'Circuit breaker is open',
            code: 'CIRCUIT_BREAKER_OPEN',
            attempts: 0,
            duration: 0
          };
        }
      }
      
      const result = await OperationWrapper.withDatabaseOperation(operation, options);
      
      if (result.success) {
        if (state === 'half-open') {
          state = 'closed';
          failures = 0;
        }
      } else {
        failures++;
        lastFailureTime = now;
        
        if (failures >= failureThreshold) {
          state = 'open';
        }
      }
      
      return result;
    };
  }
}
