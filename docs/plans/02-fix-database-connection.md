# Prompt 02: Fix Database Connection Configuration

**Priority**: P0 - CRITICAL  
**Order**: 2 (Execute Second)  
**Purpose**: Resolve database connection issues preventing health checks and potential production problems  
**Why Second**: Required for application functionality and health monitoring

## Context

The SpecChem Safety Training Platform has database connection issues in development environment. The health check endpoint shows "Database health check failed: error: role 'username' does not exist", indicating incorrect database credentials are being used.

## Task

Configure proper database connection credentials and verify database connectivity.

## Focus Areas

1. **Environment variable configuration**
2. **Database connection string validation**
3. **Health check endpoint functionality**
4. **Database migration verification**

## Success Criteria

- Database health check passes successfully
- Application can connect to database
- Database migrations can be applied
- Health endpoint shows healthy database status

## Required Files to Review

### Environment Configuration

- `.env.local` - Current environment variables
- `env.example` - Reference configuration
- `src/lib/configuration.ts` - Configuration service
- `src/lib/db/connection.ts` - Database connection manager

### Database Files

- `drizzle/schema.ts` - Database schema
- `drizzle.config.ts` - Drizzle configuration
- `supabase/` - Database initialization files

### Health Check Files

- `src/app/api/health/route.ts` - Health endpoint
- `scripts/validate-env.ts` - Environment validation

## Specific Issues to Resolve

1. **Database Credentials**
   - Current `.env.local` contains placeholder values
   - `DATABASE_URL` uses example credentials
   - Database role "username" does not exist

2. **Connection Validation**
   - Health check failing with connection errors
   - Database connection manager not properly configured
   - Missing actual database instance

3. **Environment Setup**
   - Need to configure actual database connection
   - Verify Supabase database configuration
   - Ensure proper connection string format

## Expected Outcome

Database connection established successfully with health checks passing. Application can perform database operations and migrations.

## Instructions

1. **Review Current Configuration**

   ```bash
   # Check current environment variables
   npm run validate-env

   # Review database configuration
   cat .env.local | grep DATABASE
   ```

2. **Configure Database Connection**
   - Set up actual database instance (Supabase or local PostgreSQL)
   - Update `DATABASE_URL` with correct credentials
   - Verify connection string format

3. **Test Database Connectivity**

   ```bash
   # Test database connection
   npm run db:verify

   # Run migrations
   npm run db:migrate

   # Test health endpoint
   curl http://localhost:3000/api/health
   ```

4. **Verify Health Checks**
   - Database health check should return "healthy"
   - Connection pool should initialize successfully
   - Migrations should apply without errors

## Validation

```bash
# Verify database connection
npm run db:verify

# Check health endpoint
curl http://localhost:3000/api/health

# Should show:
# "database": {"status": "healthy", "details": "Connected"}
```

## Notes

- If using Supabase, ensure project is properly configured
- If using local PostgreSQL, ensure service is running
- Connection string format: `postgresql://user:password@host:port/database`
