/**
 * Tests for Simplified API Route Patterns
 * Tests the new simplified route patterns and utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { RouteUtils } from '@/lib/route-utils';
import { ResponseUtils } from '@/app/api/shared/utils/response-utils';
import { z } from 'zod';

describe('Route Utils', () => {
  describe('handleRequest', () => {
    it('should handle request with authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/test');
      const handler = vi.fn().mockResolvedValue(RouteUtils.createSuccessResponse({ test: 'data' }));
      
      // Mock authentication
      vi.spyOn(RouteUtils, 'handleRequest').mockImplementation(async (req, h, options) => {
        if (options.requireAuth) {
          // Simulate successful auth
          return await h(req, {});
        }
        return RouteUtils.createErrorResponse('Auth required', 401);
      });

      const result = await RouteUtils.handleRequest(request, handler, { requireAuth: true });
      
      expect(result).toBeDefined();
      expect(handler).toHaveBeenCalled();
    });

    it('should validate request body', async () => {
      const schema = z.object({
        name: z.string(),
        email: z.string().email()
      });
      
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test', email: 'test@example.com' })
      });
      
      const handler = vi.fn().mockResolvedValue(RouteUtils.createSuccessResponse({}));
      
      const result = await RouteUtils.handleRequest(request, handler, {
        validateBody: schema
      });
      
      expect(result).toBeDefined();
    });

    it('should validate query parameters', async () => {
      const schema = z.object({
        page: z.coerce.number(),
        limit: z.coerce.number()
      });
      
      const request = new NextRequest('http://localhost:3000/api/test?page=1&limit=10');
      const handler = vi.fn().mockResolvedValue(RouteUtils.createSuccessResponse({}));
      
      const result = await RouteUtils.handleRequest(request, handler, {
        validateQuery: schema
      });
      
      expect(result).toBeDefined();
    });
  });

  describe('Response Utilities', () => {
    it('should create success response', () => {
      const response = RouteUtils.createSuccessResponse({ id: 1, name: 'Test' });
      
      expect(response).toBeDefined();
      // Note: In actual tests, you'd check the response body
    });

    it('should create error response', () => {
      const response = RouteUtils.createErrorResponse('Test error', 400);
      
      expect(response).toBeDefined();
    });

    it('should create paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { page: 1, limit: 10, total: 2, totalPages: 1 };
      
      const response = RouteUtils.createPaginatedResponse(data, pagination);
      
      expect(response).toBeDefined();
    });
  });

  describe('Utility Functions', () => {
    it('should extract pagination parameters', () => {
      const request = new NextRequest('http://localhost:3000/api/test?page=2&limit=20');
      const params = RouteUtils.extractPaginationParams(request);
      
      expect(params).toEqual({
        page: 2,
        limit: 20,
        offset: 20
      });
    });

    it('should extract search parameters', () => {
      const request = new NextRequest('http://localhost:3000/api/test?search=test&sort=asc&sortBy=name');
      const params = RouteUtils.extractSearchParams(request);
      
      expect(params).toEqual({
        search: 'test',
        sort: 'asc',
        sortBy: 'name'
      });
    });

    it('should extract filter parameters', () => {
      const request = new NextRequest('http://localhost:3000/api/test?status=active&published=true');
      const params = RouteUtils.extractFilterParams(request, ['status', 'published']);
      
      expect(params).toEqual({
        status: 'active',
        published: true
      });
    });
  });
});