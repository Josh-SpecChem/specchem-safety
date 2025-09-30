import { z } from 'zod';
import { apiResponseSchema, type ApiResponse } from './validations';

/**
 * API utilities for handling requests, responses, and error management
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Validates API response using Zod schema
 */
export function validateApiResponse<T>(
  response: unknown,
  schema: z.ZodType<T>
): ApiResponse<T> {
  const responseSchema = apiResponseSchema(schema);
  
  try {
    return responseSchema.parse(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        `Invalid API response: ${error.issues.map((e: any) => e.message).join(', ')}`, // eslint-disable-line @typescript-eslint/no-explicit-any
        500,
        'VALIDATION_ERROR'
      );
    }
    throw error;
  }
}

/**
 * Generic API request handler with error handling
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  responseSchema?: z.ZodType<T>
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code
      );
    }

    const data = await response.json();
    
    if (responseSchema) {
      return validateApiResponse(data, responseSchema);
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error - please check your connection', 0, 'NETWORK_ERROR');
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * GET request helper
 */
export async function apiGet<T>(
  url: string,
  responseSchema?: z.ZodType<T>
): Promise<ApiResponse<T>> {
  return apiRequest(url, { method: 'GET' }, responseSchema);
}

/**
 * POST request helper
 */
export async function apiPost<T>(
  url: string,
  data: unknown,
  responseSchema?: z.ZodType<T>
): Promise<ApiResponse<T>> {
  return apiRequest(
    url,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    responseSchema
  );
}

/**
 * PATCH request helper
 */
export async function apiPatch<T>(
  url: string,
  data: unknown,
  responseSchema?: z.ZodType<T>
): Promise<ApiResponse<T>> {
  return apiRequest(
    url,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    responseSchema
  );
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(
  url: string,
  responseSchema?: z.ZodType<T>
): Promise<ApiResponse<T>> {
  return apiRequest(url, { method: 'DELETE' }, responseSchema);
}

/**
 * Builds query string from object parameters
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Handles API errors in React components
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case 'VALIDATION_ERROR':
        return 'The data provided was invalid. Please check your input and try again.';
      case 'UNAUTHORIZED':
        return 'You are not authorized to perform this action. Please log in and try again.';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action.';
      default:
        return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Retry utility for failed API requests
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry on certain error types
      if (error instanceof ApiError && [400, 401, 403, 404].includes(error.status)) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

/**
 * Debounce utility for API calls (useful for search)
 */
export function debounce<T extends (...args: any[]) => any>( // eslint-disable-line @typescript-eslint/no-explicit-any
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Local storage utilities for caching API responses
 */
export const cache = {
  set: (key: string, data: unknown, ttl: number = 5 * 60 * 1000): void => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(`api_cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`api_cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > parsed.ttl;
      
      if (isExpired) {
        localStorage.removeItem(`api_cache_${key}`);
        return null;
      }
      
      return parsed.data as T;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  },

  clear: (key?: string): void => {
    try {
      if (key) {
        localStorage.removeItem(`api_cache_${key}`);
      } else {
        // Clear all API cache
        Object.keys(localStorage)
          .filter(k => k.startsWith('api_cache_'))
          .forEach(k => localStorage.removeItem(k));
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  },
};

/**
 * Creates a cache key from URL and parameters
 */
export function createCacheKey(url: string, params?: Record<string, unknown>): string {
  const key = params ? `${url}_${JSON.stringify(params)}` : url;
  return key.replace(/[^a-zA-Z0-9_]/g, '_');
}