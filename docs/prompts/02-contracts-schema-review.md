# Gate 2: Contracts & Schema (Drizzle + Zod) Review

**Order**: 2 (Execute After Gate 1)  
**Purpose**: Verify that database schema and Zod validation contracts are perfectly aligned  
**Why Third**: If DB schema and runtime contracts disagree, the UI will get wrong shapes or crash

## Context

This application uses:

- Drizzle ORM with PostgreSQL
- Zod schemas for runtime validation
- Multi-tenant architecture with tenant_id in all tables
- Comprehensive database schema with 17+ tables
- Migration system with Drizzle Kit

## Task

Verify that database schema and Zod validation contracts are perfectly aligned.

## Focus Areas

1. **Database schema completeness and consistency**
2. **Zod schema alignment with database tables**
3. **Migration system reliability and safety**
4. **Data invariants and constraints**
5. **Tenant isolation at schema level**
6. **Enum consistency between DB and Zod**

## Success Criteria

- All database tables have corresponding Zod schemas
- Zod schemas match database column types exactly
- Migrations apply cleanly to fresh and existing databases
- All tenant tables have proper tenant_id constraints
- Data invariants are enforced at both DB and Zod levels
- Enum values are consistent across systems

## Required Files to Review

### Database Schema

- `drizzle/schema.ts` - Main database schema with all table definitions
- `drizzle/relations.ts` - Relationship mappings between tables
- `drizzle/migrations/` - All migration files
- `drizzle.config.ts` - Drizzle configuration

### Zod Validation Schemas

- `src/lib/schemas.ts` - Comprehensive validation schemas aligned with database
- `src/types/database.ts` - TypeScript types inferred from Zod schemas
- `src/types/api.ts` - API request/response types
- `src/types/domain.ts` - Business domain types

### Validation Integration

- All API routes use Zod schemas for request validation
- Database operations are fully typed with Drizzle ORM
- Runtime validation ensures data integrity at all levels

### Testing and Validation Tools

- `scripts/test-drizzle-zod.ts` - Schema alignment validation
- API test endpoints for validation testing

## What to Verify

- Tables, enums, required columns match Zod input/output schemas
- Migrations apply cleanly to a fresh DB and to a clone of prod
- Invariants hold (e.g., completion requires completed_at, tenant_id present everywhere it must be)

## Expected Outcome

DB and Zod are aligned; migrations are trustworthy. If misaligned, don't proceed.

## Instructions

Please provide a comprehensive analysis with specific alignment issues and migration safety recommendations. Focus on identifying schema mismatches that could cause runtime failures or silent data corruption.
