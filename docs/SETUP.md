# Development Setup Guide

**Date:** 2025-01-10  
**Purpose:** Complete development environment setup  
**Status:** Complete  
**Audience:** Developers  

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account
- PostgreSQL (or use Supabase)

## Environment Setup

### 1. Clone Repository
```bash
git clone [repository-url]
cd specchem-safety
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in your values:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database Configuration
DATABASE_URL=your_database_url
```

### 4. Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Verify setup
npm run db:verify
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Verification

Run the integration tests to verify everything is working:
```bash
npm run test:integrations
```

## Troubleshooting

See [Technical References](./technical/) for detailed guides on specific systems.
