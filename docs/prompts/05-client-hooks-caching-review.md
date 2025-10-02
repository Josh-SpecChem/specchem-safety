# Gate 5: Client Hooks & Caching Review

**Order**: 5 (Execute After Gate 4)  
**Purpose**: Verify that data fetching is consistent, caching works properly, and UI stays in sync  
**Why Sixth**: Legacy + new hooks cause stale views, double fetch, or mismatched retries

## Context

This application uses:

- Custom data fetching hooks with caching
- React Query patterns for server state management
- Comprehensive error handling and loading states
- Multi-tenant data fetching with proper invalidation
- Type-safe data operations

## Task

Verify that data fetching is consistent, caching works properly, and UI stays in sync.

## Focus Areas

1. **Data fetching hook consistency and standardization**
2. **Cache invalidation and synchronization**
3. **Loading and error state consistency**
4. **Mutation handling and UI updates**
5. **Performance optimization and deduplication**
6. **Type safety in data operations**

## Success Criteria

- Standardized hook family with no legacy imports
- Reliable cache invalidation after mutations
- Consistent loading/error states across components
- Proper UI updates after data changes
- Efficient data fetching with minimal duplication
- Type-safe data operations throughout

## Required Files to Review

### Data Fetching Hooks

- `src/lib/data-fetching/hooks/use-books.ts` - Books fetching
- `src/lib/data-fetching/hooks/use-chapters.ts` - Chapters fetching
- `src/lib/data-fetching/hooks/use-blog-posts.ts` - Blog posts fetching
- `src/lib/data-fetching/hooks/use-videos.ts` - Videos fetching
- `src/lib/data-fetching/hooks/use-pagination.ts` - Pagination hooks
- `src/lib/data-fetching/hooks/use-mutation.ts` - Mutation hooks
- `src/lib/data-fetching/hooks/use-query.ts` - Generic query hooks
- `src/lib/data-fetching/hooks/use-data.ts` - Data management hooks

### Caching System

- `src/lib/data-fetching/services/cache-service.ts` - Cache service
- `src/lib/data-fetching/services/query-service.ts` - Query service
- `src/lib/data-fetching/services/error-service.ts` - Error service
- `src/lib/data-fetching/utils/query-keys.ts` - Query key management
- `src/lib/data-fetching/utils/data-transformers.ts` - Data transformation

### Providers

- `src/lib/data-fetching/providers/data-provider.tsx` - Data provider
- `src/lib/data-fetching/providers/error-provider.tsx` - Error provider

### Tenant Hooks

- `src/lib/tenant/hooks.ts` - Tenant-specific hooks
- `src/hooks/` - Custom application hooks

## What to Verify

- Only the standardized hook family is used (legacy imports = 0)
- After a mutation, the relevant list/detail views refresh reliably
- Loading/error states are consistent (single spinner/toast conventions)

## Expected Outcome

Data feels live and uniform across the app.

## Instructions

Please provide a detailed analysis with specific hook examples and caching strategy recommendations. Focus on identifying stale data issues, cache invalidation problems, and inconsistent loading states that could confuse users or cause UI inconsistencies.
