# Gate 3: Data Access Layer Review

**Order**: 3 (Execute After Gate 2)  
**Purpose**: Verify that data access is safe, performant, and properly tenant-isolated  
**Why Fourth**: Even with good schema, bad queries cause empty screens, wrong tenant data, or timeouts

## Context

This application uses:

- Drizzle ORM with tenant-aware database client
- Comprehensive query helpers and utilities
- Multi-tenant data access patterns
- Performance monitoring and optimization
- Caching and data management systems

## Task

Verify that data access is safe, performant, and properly tenant-isolated.

## Focus Areas

1. **Tenant isolation in all database queries**
2. **Query performance and indexing**
3. **Data access patterns and consistency**
4. **Caching strategy and invalidation**
5. **Error handling in data operations**
6. **Query monitoring and optimization**

## Success Criteria

- All queries automatically apply tenant filtering
- No manual tenant_id scattering in queries
- Proper indexing for common query patterns
- Consistent pagination and sorting behavior
- Effective caching with proper invalidation
- Comprehensive error handling

## Required Files to Review

### Database Client

- `src/lib/db/tenant-client.ts` - Tenant-aware database client
- `src/lib/db/tenant-queries.ts` - Tenant-scoped queries
- `src/lib/db/query-helpers.ts` - Query utilities
- `src/lib/db/middleware.ts` - Database middleware
- `src/lib/db/monitoring.ts` - Query monitoring

### Data Services

- `src/lib/services/data/books-service.ts` - Books data service
- `src/lib/services/data/chapters-service.ts` - Chapters data service
- `src/lib/services/data/videos-service.ts` - Videos data service
- `src/lib/services/business/blog-service.ts` - Blog service
- `src/lib/services/business/analytics-service.ts` - Analytics service

### Data Management

- `src/lib/data/data-manager.ts` - Data management utilities
- `src/lib/data/config-loader.ts` - Configuration loading
- `src/lib/data/content-loader.ts` - Content loading
- `src/lib/data/validation.ts` - Data validation

### Caching

- `src/lib/data-fetching/services/cache-service.ts` - Cache service
- `src/lib/data-fetching/services/query-service.ts` - Query service
- `src/lib/data-fetching/utils/query-keys.ts` - Query key management

### Query Hooks

- `src/lib/data-fetching/hooks/use-books.ts` - Books query hooks
- `src/lib/data-fetching/hooks/use-chapters.ts` - Chapters query hooks
- `src/lib/data-fetching/hooks/use-blog-posts.ts` - Blog query hooks
- `src/lib/data-fetching/hooks/use-pagination.ts` - Pagination hooks

## What to Verify

- All reads/writes apply the single tenant-filter helper (no manual scatter)
- Common queries return correct counts for two different tenants
- Pagination/sorting behave consistently across endpoints
- Indexes exist for main filters/sorts

## Expected Outcome

Data access is consistent and tenant-safe.

## Instructions

Please provide a detailed analysis with specific query examples and performance recommendations. Focus on identifying tenant isolation issues, performance bottlenecks, and caching problems that could affect data integrity or application performance.
