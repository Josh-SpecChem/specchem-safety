# TypeScript Type Checking Guide

This document outlines the comprehensive TypeScript type checking setup for the SpecChem Safety Training project.

## Overview

Our type checking setup follows industry best practices with multiple configurations for different environments and use cases.

## Available Commands

### Basic Type Checking

```bash
# Standard type checking
npm run type-check

# Watch mode (re-runs on file changes)
npm run type-check:watch

# Verbose output with detailed information
npm run type-check:verbose
```

### Advanced Type Checking

```bash
# Strict type checking with additional rules
npm run type-check:strict

# CI-friendly output (no colors, minimal output)
npm run type-check:ci
```

### Verification Commands

```bash
# Run type checking + linting
npm run verify

# Run strict type checking + strict linting
npm run verify:strict

# CI verification (strict type checking + linting)
npm run verify:ci
```

## TypeScript Configurations

### 1. `tsconfig.json` (Main Configuration)

- Standard configuration for development
- Includes all source files and Next.js specific settings
- Optimized for development experience

### 2. `tsconfig.strict.json` (Strict Configuration)

- Enhanced type checking with stricter rules
- Includes `noUnusedLocals`, `noUnusedParameters`, etc.
- Used for code quality enforcement

### 3. `tsconfig.build.json` (Build Configuration)

- Configuration for production builds
- Generates declaration files and source maps
- Excludes test files and development-only code

## Enhanced Type Checking Script

Our custom type checking script (`scripts/type-check.ts`) provides:

- **Better Error Reporting**: Detailed statistics and error counts
- **Multiple Modes**: Standard, strict, watch, CI, and verbose modes
- **Performance Metrics**: Execution time tracking
- **File Statistics**: Count of TypeScript files being checked

### Script Options

```bash
# Show help
tsx scripts/type-check.ts --help

# Use specific config
tsx scripts/type-check.ts --config=tsconfig.strict.json

# Strict mode
tsx scripts/type-check.ts --strict

# Watch mode
tsx scripts/type-check.ts --watch

# CI mode (no colors, minimal output)
tsx scripts/type-check.ts --ci

# Verbose mode
tsx scripts/type-check.ts --verbose
```

## IDE Integration

### VS Code Settings

The project includes optimized VS Code settings (`.vscode/settings.json`) for:

- TypeScript IntelliSense
- Auto-imports and import organization
- Inlay hints for better code understanding
- Format on save with Prettier
- ESLint integration

### Recommended Extensions

- TypeScript and JavaScript Language Features (built-in)
- ESLint
- Prettier
- Tailwind CSS IntelliSense

## Git Hooks

### Pre-commit Hook

Automatically runs type checking before each commit:

- Prevents commits with TypeScript errors
- Runs fast pre-commit checks (linting + type checking)
- Can be bypassed with `git commit --no-verify` if needed

## CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/type-check.yml`) that:

- Runs on push and pull requests
- Tests multiple Node.js versions
- Runs both standard and strict type checking
- Uploads artifacts on failure for debugging

### Integration with Build Process

Type checking is integrated into the build process:

- `npm run build` includes type checking
- Build fails if type errors are present
- Ensures production deployments are type-safe

## Best Practices

### 1. Regular Type Checking

- Run `npm run type-check` before committing
- Use `npm run type-check:watch` during development
- Address type errors promptly

### 2. Strict Mode Usage

- Use `npm run type-check:strict` for code reviews
- Gradually migrate to stricter settings
- Use strict mode for critical code paths

### 3. CI/CD Integration

- Always use `npm run type-check:ci` in automated environments
- Set up notifications for type checking failures
- Block deployments on type errors

### 4. IDE Configuration

- Use the provided VS Code settings
- Enable TypeScript strict mode in your editor
- Configure auto-save and format-on-save

## Troubleshooting

### Common Issues

1. **Module Not Found Errors**
   - Check `tsconfig.json` paths configuration
   - Ensure all dependencies are installed
   - Verify import statements

2. **Slow Type Checking**
   - Use `--skipLibCheck` for faster checking
   - Consider using project references for large codebases
   - Check for circular dependencies

3. **Memory Issues**
   - Increase Node.js memory limit: `NODE_OPTIONS="--max-old-space-size=4096"`
   - Use incremental compilation
   - Consider splitting large files

### Performance Optimization

- Use `incremental: true` in tsconfig.json (already enabled)
- Leverage TypeScript's build cache
- Use project references for monorepos
- Consider using `skipLibCheck: true` for faster builds

## Current Status

As of the last check, the project has:

- **58 TypeScript errors** remaining
- **20 files** with type issues
- **Main error categories**: Database type mismatches, API response types, form validation

### Priority Areas for Improvement

1. Database operation return types
2. API response type consistency
3. Form validation type safety
4. Migration strategy type alignment

## Contributing

When contributing to the project:

1. Run `npm run type-check` before submitting PRs
2. Fix any new type errors introduced
3. Consider using strict mode for new code
4. Update this documentation if adding new type checking features

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [Next.js TypeScript Guide](https://nextjs.org/docs/basic-features/typescript)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
