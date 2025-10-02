# Gate 0: Platform & Config Review

**Order**: 0 (Execute First)  
**Purpose**: Verify the application can boot reliably in production-like environments  
**Why First**: If environment/config is wrong, nothing else matters

## Context

This is a production-ready Next.js 15 multi-tenant application using:

- Next.js 15 with App Router and Turbopack
- Supabase for authentication and database
- Drizzle ORM with PostgreSQL
- Multi-tenant architecture with RLS
- TypeScript with Zod validation

## Task

Review the platform configuration and ensure the application can boot reliably in production-like environments.

## Focus Areas

1. **Environment variable configuration and validation**
2. **Build process and deployment readiness**
3. **Health check endpoints and monitoring**
4. **Database connection and migration status**
5. **Authentication provider configuration**

## Success Criteria

- All required environment variables are documented and validated
- Build process completes without errors
- Health endpoints respond correctly
- Database migrations apply cleanly
- Authentication providers are properly configured

## Required Files to Review

### Configuration Files

- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `drizzle.config.ts` - Database configuration
- `tailwind.config.ts` - Styling configuration
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Testing configuration
- `eslint.config.mjs` - Linting configuration
- `postcss.config.mjs` - PostCSS configuration

### Environment Files

- `.env.local` (if exists)
- `.env.example` (if exists)
- Environment variable documentation in README or docs

### Health Check Files

- `src/app/api/health/route.ts` (if exists)
- `src/app/api/status/route.ts` (if exists)
- Any monitoring or health check endpoints

### Build/Deploy Files

- `vercel.json` (if exists)
- `Dockerfile` (if exists)
- CI/CD configuration files

## What to Verify

- Required environment variables present and sane (URLs, keys, secrets, redirect URIs)
- Build/start succeeds in a production-like environment (staging)
- One health endpoint responds; time skew/clock is OK

## Expected Outcome

App boots reliably in CI/staging. If this fails, stop and fix before anything else.

## Instructions

Please provide a comprehensive analysis with specific recommendations for any issues found. Focus on identifying configuration problems that would prevent the application from starting or running properly in production.
