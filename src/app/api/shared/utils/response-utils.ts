/**
 * Response Utilities for API Route Standardization
 * Provides consistent response formatting across all API routes
 */

import { NextResponse } from 'next/server';

export class ResponseUtils {
  /**
   * Create a successful response with data
   */
  static success<T>(data: T, message?: string) {
    return NextResponse.json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Create an error response
   */
  static error(
    message: string,
    status: number = 500,
    code?: string,
    details?: Record<string, unknown>
  ) {
    return NextResponse.json({
      success: false,
      error: {
        message,
        code,
        details,
        timestamp: new Date().toISOString()
      }
    }, { status });
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  ) {
    return NextResponse.json({
      success: true,
      data,
      pagination,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Create a created response (201)
   */
  static created<T>(data: T, message: string = 'Resource created successfully') {
    return NextResponse.json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    }, { status: 201 });
  }

  /**
   * Create an updated response
   */
  static updated<T>(data: T, message: string = 'Resource updated successfully') {
    return NextResponse.json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Create a deleted response
   */
  static deleted(message: string = 'Resource deleted successfully') {
    return NextResponse.json({
      success: true,
      message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Create a not found response (404)
   */
  static notFound(resource: string = 'Resource') {
    return this.error(
      `${resource} not found`,
      404,
      'NOT_FOUND'
    );
  }

  /**
   * Create an unauthorized response (401)
   */
  static unauthorized(message: string = 'Unauthorized access') {
    return this.error(
      message,
      401,
      'UNAUTHORIZED'
    );
  }

  /**
   * Create a forbidden response (403)
   */
  static forbidden(message: string = 'Insufficient permissions') {
    return this.error(
      message,
      403,
      'FORBIDDEN'
    );
  }

  /**
   * Create a bad request response (400)
   */
  static badRequest(message: string = 'Bad request', details?: Record<string, unknown>) {
    return this.error(
      message,
      400,
      'BAD_REQUEST',
      details
    );
  }

  /**
   * Create an internal server error response (500)
   */
  static internalError(message: string = 'Internal server error') {
    return this.error(
      message,
      500,
      'INTERNAL_ERROR'
    );
  }

  /**
   * Create a conflict response (409)
   */
  static conflict(message: string = 'Resource conflict') {
    return this.error(
      message,
      409,
      'CONFLICT'
    );
  }

  /**
   * Create a validation error response (422)
   */
  static validationError(message: string = 'Validation failed', details?: Record<string, unknown>) {
    return this.error(
      message,
      422,
      'VALIDATION_ERROR',
      details
    );
  }

  /**
   * Create a service unavailable response (503)
   */
  static serviceUnavailable(message: string = 'Service temporarily unavailable') {
    return this.error(
      message,
      503,
      'SERVICE_UNAVAILABLE'
    );
  }
}
