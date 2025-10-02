# Gate 4: API Routes & Middleware Review

**Order**: 4 (Execute After Gate 3)  
**Purpose**: Verify that API routes are consistent, middleware is stable, and error handling is comprehensive  
**Why Fifth**: Inconsistent status/error shapes break the UI in subtle ways. Middleware races cause flakiness

## Context

This application uses:

- Next.js App Router with API routes
- Unified middleware system for auth and tenant resolution
- Comprehensive error handling and response formatting
- Type-safe API contracts with Zod validation
- Multi-tenant API patterns

## Task

Verify that API routes are consistent, middleware is stable, and error handling is comprehensive.

## Focus Areas

1. **API route consistency and error handling**
2. **Middleware chain stability and performance**
3. **Response format standardization**
4. **Error contract consistency**
5. **Authentication middleware integration**
6. **Tenant resolution in API routes**

## Success Criteria

- Consistent error/status response format across all routes
- Linear, deterministic middleware chain
- Comprehensive error handling with proper status codes
- Type-safe API contracts
- Proper tenant context in all API operations
- No middleware conflicts or race conditions

## Required Files to Review

### API Routes

- `src/app/api/` - All API route implementations
- API route files for health, auth, content, etc.

### Middleware System

- `src/middleware.ts` - Main middleware configuration
- `src/lib/middleware/index.ts` - Middleware exports
- `src/lib/middleware/core/auth.ts` - Auth middleware core
- `src/lib/middleware/core/tenant.ts` - Tenant middleware core
- `src/lib/middleware/core/error-handling.ts` - Error handling middleware
- `src/lib/middleware/core/validation.ts` - Validation middleware
- `src/lib/middleware/composable/api-middleware.ts` - API middleware
- `src/lib/middleware/composable/page-middleware.ts` - Page middleware
- `src/lib/middleware/composer.ts` - Middleware composition

### API Utilities

- `src/lib/api/index.ts` - API utilities
- `src/lib/api/response.ts` - Response formatting
- `src/lib/api/errors.ts` - Error handling
- `src/lib/api/validation.ts` - API validation
- `src/lib/api/middleware.ts` - API middleware utilities

### Error Handling

- `src/lib/errors/index.ts` - Error system exports
- `src/lib/errors/core/api-error.ts` - API error types
- `src/lib/errors/core/validation-error.ts` - Validation errors
- `src/lib/errors/handlers/api-error-handler.ts` - API error handlers
- `src/lib/errors/middleware/error-middleware.ts` - Error middleware

## What to Verify

- Standard error/status contract across representative routes
- Middleware chain is linear, deterministic, and logged (no duplicate auth in two places)
- One route template/utility style—unused templates removed

## Expected Outcome

APIs behave predictably; middleware doesn't fight itself.

## Instructions

Please provide a detailed analysis with specific API examples and middleware flow recommendations. Focus on identifying inconsistencies in error handling, middleware conflicts, and API contract violations that could break the UI or cause unpredictable behavior.
