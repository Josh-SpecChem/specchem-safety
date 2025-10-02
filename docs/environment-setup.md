# Environment Setup Guide

This guide explains how to set up environment variables for the SpecChem Safety Training Platform.

## Required Environment Variables

### Database Configuration

- `DATABASE_URL` - PostgreSQL connection string (required)
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://postgres:password@localhost:5432/specchem_safety`

### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (required)
  - Format: `https://your-project.supabase.co`
  - Example: `https://abcdefghijklmnop.supabase.co`

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (required)
  - Found in Supabase dashboard under Settings > API
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (required)
  - Found in Supabase dashboard under Settings > API
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Environment Configuration

- `NODE_ENV` - Environment mode (required)
  - Values: `development`, `production`, or `test`
  - Example: `development`

## Optional Environment Variables

### Feature Flags

- `ENABLE_LMS` - Enable Learning Management System features
  - Values: `true` or `false`
  - Default: `true` in development, `false` in production

### External Services

- `OPENAI_API_KEY` - OpenAI API key for AI features
  - Format: `sk-...`
  - Example: `sk-1234567890abcdef...`

### Custom Configuration

- `CUSTOM_KEY` - Custom configuration key
  - Used for application-specific settings
  - Example: `custom-value`

## Environment Setup

### Local Development

1. **Create Environment File**

   ```bash
   cp .env.local.example .env.local
   ```

2. **Configure Variables**
   Edit `.env.local` with your actual values:

   ```env
   # Database
   DATABASE_URL=postgresql://postgres:password@localhost:5432/specchem_safety

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Environment
   NODE_ENV=development

   # Optional
   ENABLE_LMS=true
   OPENAI_API_KEY=your-openai-key
   CUSTOM_KEY=custom-value
   ```

3. **Verify Configuration**
   ```bash
   npm run dev
   ```

### Production (Vercel)

1. **Set Environment Variables**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add all required variables for Production environment

2. **Required Production Variables**
   ```env
   DATABASE_URL=postgresql://user:pass@host:port/db
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NODE_ENV=production
   ```

### Testing

1. **Test Environment Variables**
   ```env
   DATABASE_URL=postgresql://test:test@localhost:5432/test_db
   NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
   SUPABASE_SERVICE_ROLE_KEY=test-service-role-key
   NODE_ENV=test
   ```

## Configuration Validation

The application uses Zod schema validation to ensure all required environment variables are present and valid. If any required variables are missing or invalid, the application will fail to start with a clear error message.

### Common Validation Errors

1. **Missing Required Variables**

   ```
   Environment configuration validation failed:
   DATABASE_URL: Required
   NEXT_PUBLIC_SUPABASE_URL: Required
   ```

2. **Invalid URL Format**

   ```
   Environment configuration validation failed:
   DATABASE_URL: DATABASE_URL must be a valid URL
   ```

3. **Invalid NODE_ENV**
   ```
   Environment configuration validation failed:
   NODE_ENV: NODE_ENV must be development, production, or test
   ```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct and accessible
- Check database server is running
- Ensure SSL configuration matches environment

### Supabase Connection Issues

- Verify Supabase project URL and keys
- Check Supabase project is active
- Ensure RLS policies are configured

### Environment Variable Not Loading

- Restart development server after changing `.env.local`
- Check for typos in variable names
- Ensure no spaces around `=` in environment file

## Security Notes

- Never commit `.env.local` to version control
- Use different Supabase projects for development and production
- Rotate API keys regularly
- Use environment-specific database instances
