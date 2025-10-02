# Breaking Order Triage: Systematic Workspace Review Guide

**Last Updated**: October 1, 2025  
**Purpose**: Comprehensive guide for iteratively reviewing and testing a multi-tenant Next.js application using a systematic outside-in approach.

## Overview

This document provides a structured methodology for reviewing and validating a workspace/application, focusing on the most critical systems first. The approach follows a "Breaking Order Triage" pattern that prioritizes foundational systems before moving to higher-level concerns.

## The Breaking-Order Triage Flow (Outside → In)

### 0) Platform & Config (Gate 0 — Does the app boot?)

**Why first**: If environment/config is wrong, nothing else matters.

**What to verify**:

- Required environment variables present and sane (URLs, keys, secrets, redirect URIs)
- Build/start succeeds in a production-like environment (staging)
- One health endpoint responds; time skew/clock is OK

**Outcome**: App boots reliably in CI/staging. If this fails, stop and fix before anything else.

#### Prompt for Gate 0 Review

```
You are reviewing a Next.js 15 multi-tenant application for platform and configuration issues.

**Context**: This is a production-ready application using:
- Next.js 15 with App Router and Turbopack
- Supabase for authentication and database
- Drizzle ORM with PostgreSQL
- Multi-tenant architecture with RLS
- TypeScript with Zod validation

**Your task**: Review the platform configuration and ensure the application can boot reliably in production-like environments.

**Focus areas**:
1. Environment variable configuration and validation
2. Build process and deployment readiness
3. Health check endpoints and monitoring
4. Database connection and migration status
5. Authentication provider configuration

**Success criteria**:
- All required environment variables are documented and validated
- Build process completes without errors
- Health endpoints respond correctly
- Database migrations apply cleanly
- Authentication providers are properly configured

Please provide a comprehensive analysis with specific recommendations for any issues found.
```

#### Context Files for Gate 0

**Required Files**:

- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `drizzle.config.ts` - Database configuration
- `tailwind.config.ts` - Styling configuration
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Testing configuration
- `eslint.config.mjs` - Linting configuration
- `postcss.config.mjs` - PostCSS configuration

**Environment Files**:

- `.env.local` (if exists)
- `.env.example` (if exists)
- Environment variable documentation in README or docs

**Health Check Files**:

- `src/app/api/health/route.ts` (if exists)
- `src/app/api/status/route.ts` (if exists)
- Any monitoring or health check endpoints

**Build/Deploy Files**:

- `vercel.json` (if exists)
- `Dockerfile` (if exists)
- CI/CD configuration files

---

### 1) Identity & Access (Auth + RLS) (Gate 1 — Can anyone safely log in & see only their data?)

**Why**: Auth/RLS mistakes can both brick the app (nobody logs in) or leak data across tenants.

**What to verify**:

- Login for each role works (Admin, Editor, Contributor, Viewer)
- Protected pages reject anonymous users with correct redirect
- RLS: per-tenant reads/writes are isolated (allow/deny matrix)
- One canonical auth path is enforced (no legacy bypass)

**Outcome**: Users can authenticate and are confined to the right data. If not, stop here.

#### Prompt for Gate 1 Review

```
You are reviewing the authentication and row-level security (RLS) system of a multi-tenant Next.js application.

**Context**: This application uses:
- Supabase Auth for authentication
- Row-level security (RLS) for tenant isolation
- Role-based access control (Admin, Editor, Contributor, Viewer)
- Multi-tenant architecture with tenant_id in all tables
- Unified authentication middleware system

**Your task**: Verify that authentication works correctly and tenant data isolation is properly enforced.

**Focus areas**:
1. Authentication flow completeness and security
2. Role-based access control implementation
3. Row-level security policies and tenant isolation
4. Middleware authentication enforcement
5. Session management and token handling
6. Protected route access control

**Success criteria**:
- All user roles can authenticate successfully
- Protected routes properly redirect unauthenticated users
- Tenant data is completely isolated (no cross-tenant access)
- RLS policies are correctly implemented
- Authentication middleware works consistently
- Session management is secure and reliable

Please provide a detailed analysis with specific test cases and recommendations for any security issues found.
```

#### Context Files for Gate 1

**Authentication System**:

- `src/lib/auth/index.ts` - Main auth exports
- `src/lib/auth/core/auth-types.ts` - Auth type definitions
- `src/lib/auth/core/auth-context.ts` - Auth context and hooks
- `src/lib/auth/services/auth-service.ts` - Auth service implementation
- `src/lib/auth/services/session-service.ts` - Session management
- `src/lib/auth/middleware/auth-middleware.ts` - Auth middleware
- `src/lib/auth/middleware/route-guard.ts` - Route protection
- `src/lib/auth/providers/auth-provider.tsx` - Auth provider component

**Tenant System**:

- `src/lib/tenant/resolver.ts` - Tenant resolution logic
- `src/lib/tenant/validation.ts` - Tenant validation
- `src/lib/tenant/context.tsx` - Tenant context provider
- `src/lib/tenant/middleware.ts` - Tenant middleware

**Database Security**:

- `src/lib/db/tenant-client.ts` - Tenant-aware database client
- `src/lib/db/tenant-queries.ts` - Tenant-scoped queries
- `drizzle/schema.ts` - Database schema with RLS

**Middleware**:

- `src/middleware.ts` - Main middleware configuration
- `src/lib/middleware/core/auth.ts` - Auth middleware core
- `src/lib/middleware/core/tenant.ts` - Tenant middleware core

**Supabase Configuration**:

- `src/lib/supabase/client.ts` - Supabase client
- `src/lib/supabase/server.ts` - Supabase server client

---

### 2) Contracts & Schema (Drizzle + Zod) (Gate 2 — Do our "truths" line up?)

**Why**: If DB schema and runtime contracts disagree, the UI will get wrong shapes or crash.

**What to verify**:

- Tables, enums, required columns match Zod input/output schemas
- Migrations apply cleanly to a fresh DB and to a clone of prod
- Invariants hold (e.g., completion requires completed_at, tenant_id present everywhere it must be)

**Outcome**: DB and Zod are aligned; migrations are trustworthy. If misaligned, don't proceed.

#### Prompt for Gate 2 Review

```
You are reviewing the database schema and validation contracts of a multi-tenant application.

**Context**: This application uses:
- Drizzle ORM with PostgreSQL
- Zod schemas for runtime validation
- Multi-tenant architecture with tenant_id in all tables
- Comprehensive database schema with 17+ tables
- Migration system with Drizzle Kit

**Your task**: Verify that database schema and Zod validation contracts are perfectly aligned.

**Focus areas**:
1. Database schema completeness and consistency
2. Zod schema alignment with database tables
3. Migration system reliability and safety
4. Data invariants and constraints
5. Tenant isolation at schema level
6. Enum consistency between DB and Zod

**Success criteria**:
- All database tables have corresponding Zod schemas
- Zod schemas match database column types exactly
- Migrations apply cleanly to fresh and existing databases
- All tenant tables have proper tenant_id constraints
- Data invariants are enforced at both DB and Zod levels
- Enum values are consistent across systems

Please provide a comprehensive analysis with specific alignment issues and migration safety recommendations.
```

#### Context Files for Gate 2

**Database Schema**:

- `drizzle/schema.ts` - Main database schema
- `src/contracts/schema.app.ts` - Application schema definitions
- `drizzle/migrations/` - All migration files
- `drizzle.config.ts` - Drizzle configuration

**Zod Contracts**:

- `src/contracts/index.ts` - Contract exports
- `src/contracts/base.ts` - Base schemas
- `src/contracts/content.ts` - Content-related schemas
- `src/contracts/book.ts` - Book and chapter schemas
- `src/contracts/commerce.ts` - Commerce schemas
- `src/contracts/analytics.ts` - Analytics schemas
- `src/contracts/video.ts` - Video schemas

**Validation System**:

- `src/lib/validation/index.ts` - Validation exports
- `src/lib/validation/core/schema-validator.ts` - Schema validation
- `src/lib/validation/schemas/api-schemas.ts` - API schemas
- `src/lib/validation/schemas/business-schemas.ts` - Business schemas
- `src/lib/validation/schemas/response-schemas.ts` - Response schemas

**Migration Tools**:

- `scripts/check-db-schema.ts` - Schema validation script
- `scripts/verify-schema.ts` - Schema verification
- `scripts/monitor-migrations.ts` - Migration monitoring

---

### 3) Data Access Layer (Queries/Operations) (Gate 3 — Can we fetch/update data safely?)

**Why**: Even with good schema, bad queries cause empty screens, wrong tenant data, or timeouts.

**What to verify**:

- All reads/writes apply the single tenant-filter helper (no manual scatter)
- Common queries return correct counts for two different tenants
- Pagination/sorting behave consistently across endpoints
- Indexes exist for main filters/sorts

**Outcome**: Data access is consistent and tenant-safe.

#### Prompt for Gate 3 Review

```
You are reviewing the data access layer of a multi-tenant application for query safety and performance.

**Context**: This application uses:
- Drizzle ORM with tenant-aware database client
- Comprehensive query helpers and utilities
- Multi-tenant data access patterns
- Performance monitoring and optimization
- Caching and data management systems

**Your task**: Verify that data access is safe, performant, and properly tenant-isolated.

**Focus areas**:
1. Tenant isolation in all database queries
2. Query performance and indexing
3. Data access patterns and consistency
4. Caching strategy and invalidation
5. Error handling in data operations
6. Query monitoring and optimization

**Success criteria**:
- All queries automatically apply tenant filtering
- No manual tenant_id scattering in queries
- Proper indexing for common query patterns
- Consistent pagination and sorting behavior
- Effective caching with proper invalidation
- Comprehensive error handling

Please provide a detailed analysis with specific query examples and performance recommendations.
```

#### Context Files for Gate 3

**Database Client**:

- `src/lib/db/tenant-client.ts` - Tenant-aware database client
- `src/lib/db/tenant-queries.ts` - Tenant-scoped queries
- `src/lib/db/query-helpers.ts` - Query utilities
- `src/lib/db/middleware.ts` - Database middleware
- `src/lib/db/monitoring.ts` - Query monitoring

**Data Services**:

- `src/lib/services/data/books-service.ts` - Books data service
- `src/lib/services/data/chapters-service.ts` - Chapters data service
- `src/lib/services/data/videos-service.ts` - Videos data service
- `src/lib/services/business/blog-service.ts` - Blog service
- `src/lib/services/business/analytics-service.ts` - Analytics service

**Data Management**:

- `src/lib/data/data-manager.ts` - Data management utilities
- `src/lib/data/config-loader.ts` - Configuration loading
- `src/lib/data/content-loader.ts` - Content loading
- `src/lib/data/validation.ts` - Data validation

**Caching**:

- `src/lib/data-fetching/services/cache-service.ts` - Cache service
- `src/lib/data-fetching/services/query-service.ts` - Query service
- `src/lib/data-fetching/utils/query-keys.ts` - Query key management

**Query Hooks**:

- `src/lib/data-fetching/hooks/use-books.ts` - Books query hooks
- `src/lib/data-fetching/hooks/use-chapters.ts` - Chapters query hooks
- `src/lib/data-fetching/hooks/use-blog-posts.ts` - Blog query hooks
- `src/lib/data-fetching/hooks/use-pagination.ts` - Pagination hooks

---

### 4) API Routes & Middleware (Gate 4 — Is the contract stable?)

**Why**: Inconsistent status/error shapes break the UI in subtle ways. Middleware races cause flakiness.

**What to verify**:

- Standard error/status contract across representative routes
- Middleware chain is linear, deterministic, and logged (no duplicate auth in two places)
- One route template/utility style—unused templates removed

**Outcome**: APIs behave predictably; middleware doesn't fight itself.

#### Prompt for Gate 4 Review

```
You are reviewing the API routes and middleware system of a multi-tenant Next.js application.

**Context**: This application uses:
- Next.js App Router with API routes
- Unified middleware system for auth and tenant resolution
- Comprehensive error handling and response formatting
- Type-safe API contracts with Zod validation
- Multi-tenant API patterns

**Your task**: Verify that API routes are consistent, middleware is stable, and error handling is comprehensive.

**Focus areas**:
1. API route consistency and error handling
2. Middleware chain stability and performance
3. Response format standardization
4. Error contract consistency
5. Authentication middleware integration
6. Tenant resolution in API routes

**Success criteria**:
- Consistent error/status response format across all routes
- Linear, deterministic middleware chain
- Comprehensive error handling with proper status codes
- Type-safe API contracts
- Proper tenant context in all API operations
- No middleware conflicts or race conditions

Please provide a detailed analysis with specific API examples and middleware flow recommendations.
```

#### Context Files for Gate 4

**API Routes**:

- `src/app/api/` - All API route implementations
- API route files for health, auth, content, etc.

**Middleware System**:

- `src/middleware.ts` - Main middleware configuration
- `src/lib/middleware/index.ts` - Middleware exports
- `src/lib/middleware/core/auth.ts` - Auth middleware core
- `src/lib/middleware/core/tenant.ts` - Tenant middleware core
- `src/lib/middleware/core/error-handling.ts` - Error handling middleware
- `src/lib/middleware/core/validation.ts` - Validation middleware
- `src/lib/middleware/composable/api-middleware.ts` - API middleware
- `src/lib/middleware/composable/page-middleware.ts` - Page middleware
- `src/lib/middleware/composer.ts` - Middleware composition

**API Utilities**:

- `src/lib/api/index.ts` - API utilities
- `src/lib/api/response.ts` - Response formatting
- `src/lib/api/errors.ts` - Error handling
- `src/lib/api/validation.ts` - API validation
- `src/lib/api/middleware.ts` - API middleware utilities

**Error Handling**:

- `src/lib/errors/index.ts` - Error system exports
- `src/lib/errors/core/api-error.ts` - API error types
- `src/lib/errors/core/validation-error.ts` - Validation errors
- `src/lib/errors/handlers/api-error-handler.ts` - API error handlers
- `src/lib/errors/middleware/error-middleware.ts` - Error middleware

---

### 5) Client Hooks & Caching (Gate 5 — Do screens stay in sync?)

**Why**: Legacy + new hooks cause stale views, double fetch, or mismatched retries.

**What to verify**:

- Only the standardized hook family is used (legacy imports = 0)
- After a mutation, the relevant list/detail views refresh reliably
- Loading/error states are consistent (single spinner/toast conventions)

**Outcome**: Data feels live and uniform across the app.

#### Prompt for Gate 5 Review

```
You are reviewing the client-side data fetching and caching system of a multi-tenant application.

**Context**: This application uses:
- Custom data fetching hooks with caching
- React Query patterns for server state management
- Comprehensive error handling and loading states
- Multi-tenant data fetching with proper invalidation
- Type-safe data operations

**Your task**: Verify that data fetching is consistent, caching works properly, and UI stays in sync.

**Focus areas**:
1. Data fetching hook consistency and standardization
2. Cache invalidation and synchronization
3. Loading and error state consistency
4. Mutation handling and UI updates
5. Performance optimization and deduplication
6. Type safety in data operations

**Success criteria**:
- Standardized hook family with no legacy imports
- Reliable cache invalidation after mutations
- Consistent loading/error states across components
- Proper UI updates after data changes
- Efficient data fetching with minimal duplication
- Type-safe data operations throughout

Please provide a detailed analysis with specific hook examples and caching strategy recommendations.
```

#### Context Files for Gate 5

**Data Fetching Hooks**:

- `src/lib/data-fetching/hooks/use-books.ts` - Books fetching
- `src/lib/data-fetching/hooks/use-chapters.ts` - Chapters fetching
- `src/lib/data-fetching/hooks/use-blog-posts.ts` - Blog posts fetching
- `src/lib/data-fetching/hooks/use-videos.ts` - Videos fetching
- `src/lib/data-fetching/hooks/use-pagination.ts` - Pagination hooks
- `src/lib/data-fetching/hooks/use-mutation.ts` - Mutation hooks
- `src/lib/data-fetching/hooks/use-query.ts` - Generic query hooks
- `src/lib/data-fetching/hooks/use-data.ts` - Data management hooks

**Caching System**:

- `src/lib/data-fetching/services/cache-service.ts` - Cache service
- `src/lib/data-fetching/services/query-service.ts` - Query service
- `src/lib/data-fetching/services/error-service.ts` - Error service
- `src/lib/data-fetching/utils/query-keys.ts` - Query key management
- `src/lib/data-fetching/utils/data-transformers.ts` - Data transformation

**Providers**:

- `src/lib/data-fetching/providers/data-provider.tsx` - Data provider
- `src/lib/data-fetching/providers/error-provider.tsx` - Error provider

**Tenant Hooks**:

- `src/lib/tenant/hooks.ts` - Tenant-specific hooks
- `src/hooks/` - Custom application hooks

---

### 6) Components & Forms (Gate 6 — Is the UX consistent?)

**Why**: Broken forms and divergent validation sour the experience even if data is correct.

**What to verify**:

- One form pattern and one validation/display pattern
- Shared UI helpers replace duplicated badge/format logic
- Two or three admin flows (filters → paginate → mutate) feel identical

**Outcome**: Predictable UX across modules.

#### Prompt for Gate 6 Review

```
You are reviewing the component library and form system of a multi-tenant application.

**Context**: This application uses:
- shadcn/ui component library with "new-york" style
- React Hook Form with Zod validation
- Comprehensive form patterns and validation
- Consistent UI patterns across the application
- Multi-tenant aware components

**Your task**: Verify that components and forms provide a consistent, predictable user experience.

**Focus areas**:
1. Component library consistency and standardization
2. Form patterns and validation consistency
3. UI helper utilities and shared logic
4. Admin flow consistency and usability
5. Accessibility and responsive design
6. Component composition and reusability

**Success criteria**:
- Single form pattern used throughout the application
- Consistent validation and error display
- Shared UI helpers eliminate code duplication
- Identical admin flows across different modules
- Proper accessibility implementation
- Responsive design consistency

Please provide a detailed analysis with specific component examples and UX consistency recommendations.
```

#### Context Files for Gate 6

**Component Library**:

- `src/components/ui/` - shadcn/ui components
- `src/components/` - Custom application components
- `components.json` - shadcn/ui configuration

**Form System**:

- Form components in `src/components/`
- Form validation patterns
- React Hook Form integration

**UI Utilities**:

- `src/lib/utils.ts` - Utility functions
- UI helper components and utilities

**Design System**:

- `docs/DESIGN_SYSTEM.md` - Design system documentation
- `tailwind.config.ts` - Tailwind configuration
- CSS and styling patterns

**Component Standards**:

- `docs/COMPONENT_STANDARDS.md` - Component standards
- Component documentation and examples

---

### 7) Tests & Docs (Gate 7 — Do we keep it stable?)

**Why**: Without guardrails, fixes won't stick.

**What to verify**:

- Smoke tests for Gates 1–5 exist and run in CI
- Lint/CI rules forbid legacy imports/paths
- Docs (Schema Guide, RLS Playbook, Query Cookbook, ADRs) updated to match reality

**Outcome**: The system stays aligned; drift is caught early.

#### Prompt for Gate 7 Review

```
You are reviewing the testing strategy and documentation system of a multi-tenant application.

**Context**: This application uses:
- Vitest for unit testing
- Playwright for E2E testing
- Comprehensive test coverage across all layers
- Extensive documentation system
- CI/CD integration with testing

**Your task**: Verify that testing and documentation provide adequate guardrails for system stability.

**Focus areas**:
1. Test coverage and quality across all gates
2. CI/CD integration and automated testing
3. Documentation accuracy and completeness
4. Linting and code quality rules
5. Test maintenance and reliability
6. Documentation maintenance processes

**Success criteria**:
- Comprehensive smoke tests for Gates 1-5
- CI rules prevent legacy patterns
- Documentation matches implementation reality
- Test suite is reliable and maintainable
- Code quality rules are enforced
- Documentation is kept up-to-date

Please provide a detailed analysis with specific test examples and documentation quality recommendations.
```

#### Context Files for Gate 7

**Testing System**:

- `tests/` - All test files
- `vitest.config.ts` - Vitest configuration
- `tests/setup.ts` - Test setup
- Test files for API, components, database, etc.

**Documentation**:

- `docs/` - All documentation files
- `README.md` - Main documentation
- Architecture and implementation docs

**CI/CD**:

- GitHub Actions or CI configuration
- Linting and formatting rules
- Build and deployment scripts

**Code Quality**:

- `eslint.config.mjs` - ESLint configuration
- Prettier configuration
- TypeScript configuration

---

## How to Apply This Tomorrow (Compact Playbook)

### 1. Pick the cluster with largest blast radius that's still red

Usually: Auth/RLS → Contracts/Schema → Data Access

### 2. Run its hotspot scan and produce:

- A one-page diagnosis
- A burn-down checklist
- Acceptance checks matching the gate above

### 3. Enforce a gate

Add a tiny CI job for that gate (e.g., fail if legacy auth imports; run an RLS allow/deny test). Make passing the gate a merge requirement.

### 4. Only then move inward

Don't refactor hooks if Gate 2 is red; don't tweak components if Gate 4 is flaky.

---

## Quick Severity Matrix (What to Fix First)

- **Auth/RLS**: blocks access or risks leaks → fix immediately
- **Schema/Zod mismatch**: runtime failures or silent corruption → fix immediately
- **Data access tenant filter**: wrong rows in UI → fix immediately
- **API/middleware contract**: inconsistent 4xx/5xx/error shape → fix soon (UI pain)
- **Hooks/cache duplication**: stale/duplicated UI work → fix soon
- **Components/forms**: UX consistency → fix after above
- **Config/test/doc complexity**: guardrail quality → fix last (but add minimal CI guard now)

---

## Stop Rules (Avoid Endless Audits)

- If Gate 0–3 are green for two consecutive sprints, stop full scans of those layers; keep their CI guards
- Only re-open a gate if a change touches that layer (e.g., new tenancy, new auth role, schema change)
- For inner layers (hooks/components), switch to PR-level checks once standardized

---

## Implementation Notes

This triage system is designed specifically for the Alan Hirsch multi-tenant platform, which includes:

- **Multi-tenant architecture** with row-level security
- **Comprehensive authentication system** with role-based access control
- **Drizzle ORM** with PostgreSQL and Supabase
- **Next.js 15** with App Router and TypeScript
- **Zod validation** throughout the application
- **shadcn/ui** component library
- **Comprehensive testing** with Vitest and Playwright

Each gate builds upon the previous one, ensuring that foundational systems are solid before moving to higher-level concerns. The prompts and context files are tailored to this specific application's architecture and requirements.
