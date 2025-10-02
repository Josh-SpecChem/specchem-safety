# Prompt 03: Implement Staging Environment Configuration

**Priority**: P1 - HIGH  
**Order**: 3 (Execute Third)  
**Purpose**: Create staging environment configuration for production deployment readiness  
**Why Third**: Required for safe production deployment after P0 issues resolved

## Context

The SpecChem Safety Training Platform currently only has development configuration. A staging environment is needed to test production-like deployments before going live.

## Task

Implement comprehensive staging environment configuration with proper environment separation and deployment pipeline.

## Focus Areas

1. **Environment-specific configuration**
2. **Staging deployment setup**
3. **Environment variable management**
4. **Feature flag configuration**

## Success Criteria

- Staging environment fully configured and deployable
- Environment-specific settings properly separated
- Staging deployment pipeline functional
- Feature flags configurable per environment

## Required Files to Create/Modify

### Environment Configuration

- `.env.staging` - Staging environment variables
- `.env.production` - Production environment variables
- `env.staging.example` - Staging environment template
- `env.production.example` - Production environment template

### Configuration Files

- `src/lib/configuration.ts` - Add environment-specific logic
- `next.config.ts` - Environment-specific optimizations
- `drizzle.config.ts` - Environment-specific database config

### Deployment Files

- `vercel.staging.json` - Staging deployment configuration
- `vercel.production.json` - Production deployment configuration
- `.github/workflows/deploy-staging.yml` - Staging deployment workflow
- `.github/workflows/deploy-production.yml` - Production deployment workflow

## Specific Features to Implement

1. **Environment Separation**
   - Separate database instances for staging/production
   - Different Supabase projects for each environment
   - Environment-specific API keys and secrets

2. **Feature Flags**
   - Environment-based feature toggles
   - Staging-specific debugging features
   - Production-specific optimizations

3. **Deployment Pipeline**
   - Automated staging deployment on PR merge
   - Manual production deployment with approval
   - Environment-specific build configurations

4. **Monitoring & Logging**
   - Environment-specific logging levels
   - Staging-specific monitoring dashboards
   - Production-specific alerting

## Expected Outcome

Complete staging environment setup with automated deployment pipeline. Safe production deployment process with proper environment separation.

## Instructions

1. **Create Environment Files**

   ```bash
   # Create staging environment file
   cp env.example .env.staging

   # Create production environment file
   cp env.example .env.production

   # Update with environment-specific values
   ```

2. **Configure Environment-Specific Settings**
   - Update `ConfigurationService` to handle multiple environments
   - Add environment detection logic
   - Implement environment-specific feature flags

3. **Set Up Deployment Pipeline**
   - Configure Vercel projects for staging and production
   - Create GitHub Actions workflows
   - Set up environment-specific secrets

4. **Test Staging Deployment**

   ```bash
   # Deploy to staging
   npm run deploy:staging

   # Verify staging environment
   curl https://staging.specchem-safety.vercel.app/api/health
   ```

## Validation

```bash
# Verify staging environment
npm run validate-env:staging

# Test staging deployment
npm run deploy:staging

# Should deploy successfully to staging URL
# Health endpoint should respond correctly
```

## Environment Variables by Environment

### Staging

- `NODE_ENV=staging`
- `NEXT_PUBLIC_APP_URL=https://staging.specchem-safety.vercel.app`
- `DATABASE_URL=postgresql://staging_user:password@staging-host:5432/staging_db`
- `ENABLE_DEBUG=true`
- `ENABLE_TESTING=true`

### Production

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://specchem-safety.vercel.app`
- `DATABASE_URL=postgresql://prod_user:password@prod-host:5432/prod_db`
- `ENABLE_DEBUG=false`
- `ENABLE_TESTING=false`
