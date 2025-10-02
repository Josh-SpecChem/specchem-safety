# Configuration Management Guide

## Overview

The SpecChem Safety Training system now uses a unified configuration management system that consolidates all environment variable validation, error handling, and configuration access into a single, maintainable service.

## Key Features

- **Single Source of Truth**: All configuration validation happens in one place
- **Comprehensive Validation**: Enhanced Zod schemas with custom validation rules
- **Simplified Error Handling**: Unified error messages and handling patterns
- **Backward Compatibility**: Legacy exports maintain existing code compatibility
- **Type Safety**: Full TypeScript support with inferred types
- **Health Monitoring**: Built-in configuration health checks and warnings

## Architecture

### ConfigurationService Class

The `ConfigurationService` is the main class that handles all configuration operations:

```typescript
import { ConfigurationService } from "@/lib/configuration";

// Initialize the service (done automatically in non-test environments)
ConfigurationService.initialize();

// Access configuration
const config = ConfigurationService.getConfig();
const dbConfig = ConfigurationService.getDatabaseConfig();
const supabaseConfig = ConfigurationService.getSupabaseConfig();
```

### Configuration Schema

All environment variables are validated using a comprehensive Zod schema with:

- **Required Variables**: Database URL, Supabase URL and keys
- **Optional Variables**: SMTP settings, API keys, feature flags
- **Custom Validation**: URL formats, key patterns, port ranges
- **Environment-Specific Rules**: Production vs development requirements

## Usage Patterns

### Modern Approach (Recommended)

```typescript
import { ConfigurationService } from "@/lib/configuration";

// Get specific configuration sections
const dbConfig = ConfigurationService.getDatabaseConfig();
const supabaseConfig = ConfigurationService.getSupabaseConfig();
const features = ConfigurationService.getFeatureFlags();

// Check feature flags
if (ConfigurationService.isFeatureEnabled("analytics")) {
  // Enable analytics
}

// Get health status
const health = ConfigurationService.getHealthStatus();
if (health.status === "error") {
  console.error("Configuration issues:", health.issues);
}
```

### Legacy Compatibility

```typescript
import { config, isDevelopment, getDatabaseConfig } from "@/lib/configuration";

// Legacy config object (deprecated but still works)
const dbUrl = config.database.url;

// Legacy helper functions (deprecated but still works)
if (isDevelopment()) {
  // Development-specific code
}

// Legacy getter functions (deprecated but still works)
const dbConfig = getDatabaseConfig();
```

## Environment Variables

### Required Variables

| Variable                        | Description                  | Validation                                                       |
| ------------------------------- | ---------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`                  | PostgreSQL connection string | Must be valid URL starting with `postgresql://` or `postgres://` |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL         | Must be valid URL containing `supabase.co`                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key       | Minimum 20 characters                                            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key    | Minimum 20 characters                                            |

### Optional Variables

| Variable                 | Description             | Default       | Validation                                     |
| ------------------------ | ----------------------- | ------------- | ---------------------------------------------- |
| `NODE_ENV`               | Environment mode        | `development` | Must be `development`, `production`, or `test` |
| `NEXT_PUBLIC_APP_URL`    | Application URL         | -             | Must be valid URL if provided                  |
| `NEXTAUTH_SECRET`        | NextAuth secret         | -             | Minimum 32 characters (required in production) |
| `NEXTAUTH_URL`           | NextAuth URL            | -             | Must be valid URL if provided                  |
| `SMTP_HOST`              | SMTP server host        | -             | String if provided                             |
| `SMTP_PORT`              | SMTP server port        | -             | Number between 1-65535 if provided             |
| `SMTP_USER`              | SMTP username           | -             | String if provided                             |
| `SMTP_PASSWORD`          | SMTP password           | -             | String if provided                             |
| `ENABLE_ANALYTICS`       | Enable analytics        | `false`       | Boolean                                        |
| `ENABLE_DEBUG`           | Enable debug mode       | `false`       | Boolean                                        |
| `ENABLE_TESTING`         | Enable testing features | `false`       | Boolean                                        |
| `ENABLE_LMS`             | Enable LMS features     | -             | String (always true in dev/test)               |
| `OPENAI_API_KEY`         | OpenAI API key          | -             | Must start with `sk-` if provided              |
| `STRIPE_SECRET_KEY`      | Stripe secret key       | -             | Must start with `sk_` if provided              |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key  | -             | Must start with `pk_` if provided              |
| `CUSTOM_KEY`             | Custom configuration    | -             | String if provided                             |

## Error Handling

### ConfigurationError Class

```typescript
import { ConfigurationError } from "@/lib/configuration";

try {
  ConfigurationService.initialize();
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.error("Configuration error:", error.message);
    process.exit(1);
  }
  throw error;
}
```

### Error Types

1. **Missing Required Variables**: Thrown when required environment variables are not set
2. **Invalid Format**: Thrown when variables don't match expected formats
3. **Validation Failures**: Thrown when custom validation rules fail

## Health Monitoring

### Health Status

```typescript
const health = ConfigurationService.getHealthStatus();

// Status can be: 'healthy', 'warning', or 'error'
if (health.status === "warning") {
  console.warn("Configuration warnings:", health.warnings);
}

if (health.status === "error") {
  console.error("Configuration errors:", health.issues);
}
```

### Common Warnings

- Missing `NEXTAUTH_SECRET` in production
- Missing `NEXTAUTH_URL` in production
- Debug mode enabled in production
- Incomplete SMTP configuration

### Configuration Summary

```typescript
const summary = ConfigurationService.getConfigSummary();
console.log("Database:", summary.database.url); // "✓ Set" or "✗ Missing"
console.log("Supabase:", summary.supabase.url); // "✓ Set" or "✗ Missing"
```

## Testing

### Test Environment Setup

The configuration service automatically detects test environments and skips auto-initialization to prevent errors during testing.

```typescript
// In tests, set NODE_ENV=test and provide required variables
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/testdb";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key-minimum-20-chars";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key-minimum-20-chars";

// Then initialize manually
ConfigurationService.initialize();
```

### Environment-Specific Validation

```typescript
// Validate configuration for specific environments
const isValidDev = ConfigurationService.validateForEnvironment("development");
const isValidProd = ConfigurationService.validateForEnvironment("production");
const isValidTest = ConfigurationService.validateForEnvironment("test");
```

## Migration Guide

### From Old System

If you're migrating from the old dual-configuration system:

1. **Replace imports**:

   ```typescript
   // Old
   import { config } from "@/lib/config";
   import { ConfigValidationService } from "@/lib/config-validation";

   // New
   import { ConfigurationService } from "@/lib/configuration";
   ```

2. **Update configuration access**:

   ```typescript
   // Old
   const dbConfig = config.database;
   const isValid = ConfigValidationService.validateDatabaseConfig();

   // New
   const dbConfig = ConfigurationService.getDatabaseConfig();
   const health = ConfigurationService.getHealthStatus();
   ```

3. **Update error handling**:

   ```typescript
   // Old
   try {
     ConfigValidationService.validateAllConfigs();
   } catch (error) {
     console.error("Validation failed:", error);
   }

   // New
   try {
     ConfigurationService.initialize();
   } catch (error) {
     if (error instanceof ConfigurationError) {
       console.error("Configuration error:", error.message);
     }
   }
   ```

## Best Practices

### 1. Use Modern API

Prefer the `ConfigurationService` methods over legacy exports:

```typescript
// Good
const features = ConfigurationService.getFeatureFlags();
if (ConfigurationService.isFeatureEnabled("analytics")) {
  // Enable analytics
}

// Avoid (legacy)
const features = config.features;
if (features.analytics) {
  // Enable analytics
}
```

### 2. Handle Errors Gracefully

Always wrap configuration access in try-catch blocks:

```typescript
try {
  const config = ConfigurationService.getConfig();
  // Use configuration
} catch (error) {
  if (error instanceof ConfigurationError) {
    // Handle configuration errors
    console.error("Configuration error:", error.message);
    process.exit(1);
  }
  throw error;
}
```

### 3. Check Health Status

Monitor configuration health in production:

```typescript
const health = ConfigurationService.getHealthStatus();
if (health.status !== "healthy") {
  // Log warnings or errors
  if (health.warnings.length > 0) {
    console.warn("Configuration warnings:", health.warnings);
  }
  if (health.issues.length > 0) {
    console.error("Configuration issues:", health.issues);
  }
}
```

### 4. Environment-Specific Configuration

Use environment-specific validation when needed:

```typescript
// Validate for production before deployment
if (process.env.NODE_ENV === "production") {
  const isValid = ConfigurationService.validateForEnvironment("production");
  if (!isValid) {
    throw new Error("Production configuration validation failed");
  }
}
```

## Troubleshooting

### Common Issues

1. **"Configuration validation failed"**
   - Check that all required environment variables are set
   - Verify variable formats match expected patterns
   - Check for typos in variable names

2. **"Missing required environment variables"**
   - Ensure `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are set
   - Check `.env` file is loaded correctly

3. **"Invalid environment variables"**
   - Verify URL formats (must be valid URLs)
   - Check API key formats (OpenAI keys start with `sk-`, Stripe keys start with `sk_` or `pk_`)
   - Ensure port numbers are within valid range (1-65535)

### Debug Configuration

Use the configuration summary to debug issues:

```typescript
const summary = ConfigurationService.getConfigSummary();
console.log("Configuration Summary:", JSON.stringify(summary, null, 2));
```

### Health Check

Use the health status to identify configuration issues:

```typescript
const health = ConfigurationService.getHealthStatus();
console.log("Health Status:", health.status);
if (health.issues.length > 0) {
  console.log("Issues:", health.issues);
}
if (health.warnings.length > 0) {
  console.log("Warnings:", health.warnings);
}
```

## API Reference

### ConfigurationService Methods

| Method                        | Description                             | Returns                  |
| ----------------------------- | --------------------------------------- | ------------------------ |
| `initialize()`                | Initialize the configuration service    | `void`                   |
| `getConfig()`                 | Get the full validated configuration    | `ValidatedConfiguration` |
| `getDatabaseConfig()`         | Get database configuration              | `DatabaseConfig`         |
| `getSupabaseConfig()`         | Get Supabase configuration              | `SupabaseConfig`         |
| `getNextJSConfig()`           | Get Next.js configuration               | `NextJSConfig`           |
| `getAuthConfig()`             | Get authentication configuration        | `AuthConfig`             |
| `getServicesConfig()`         | Get external services configuration     | `ServicesConfig`         |
| `getFeatureFlags()`           | Get feature flags                       | `FeaturesConfig`         |
| `getApiKeys()`                | Get API keys                            | `ApiKeysConfig`          |
| `getCustomConfig()`           | Get custom configuration                | `CustomConfig`           |
| `isFeatureEnabled(feature)`   | Check if a feature is enabled           | `boolean`                |
| `validateForEnvironment(env)` | Validate for specific environment       | `boolean`                |
| `getHealthStatus()`           | Get configuration health status         | `HealthStatus`           |
| `getConfigSummary()`          | Get configuration summary for debugging | `ConfigSummary`          |

### Types

```typescript
type ValidatedConfiguration = z.infer<typeof configurationSchema>;
type HealthStatus = {
  status: "healthy" | "warning" | "error";
  issues: string[];
  warnings: string[];
};
type ConfigSummary = Record<string, any>;
```

This unified configuration system provides a robust, maintainable, and type-safe way to manage all application configuration while maintaining backward compatibility with existing code.
