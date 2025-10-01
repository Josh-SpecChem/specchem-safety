# Production Deployment Guide

**Date:** 2025-01-10  
**Purpose:** Production deployment instructions  
**Status:** Complete  
**Audience:** DevOps, Technical Leads  

## Deployment Overview

The SpecChem Safety Training Platform is deployed on Vercel with Supabase as the backend.

## Prerequisites

- Vercel account
- Supabase project
- Domain name (optional)

## Deployment Steps

### 1. Vercel Configuration
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 2. Environment Variables
Set these in Vercel dashboard:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
DATABASE_URL=your_production_database_url
```

### 3. Supabase Configuration
1. Update Site URL in Supabase Auth settings
2. Add production domain to allowed origins
3. Configure email templates for production

### 4. Database Migration
```bash
# Run production migrations
npm run db:migrate
```

### 5. Verification
1. Test authentication flows
2. Verify database connections
3. Check all API endpoints
4. Test admin functionality

## Monitoring

- Vercel Analytics for performance
- Supabase Dashboard for database metrics
- Application logs for error tracking

## Rollback Procedure

1. Revert to previous deployment in Vercel
2. Restore database backup if needed
3. Verify functionality

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Database RLS policies active
- [ ] Admin access properly configured
- [ ] Error handling in place
