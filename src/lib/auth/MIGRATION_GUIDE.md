# Authentication Migration Guide

## Overview

This guide helps migrate from the old scattered authentication patterns to the new unified authentication system.

## Migration Steps

### 1. Update Imports

**Before:**
```typescript
import { checkAdminRole, hasAdminRole } from '@/lib/auth';
import { authenticateAdmin } from '@/lib/api-auth';
import { hasAdminRole as rlsHasAdminRole } from '@/lib/rls';
```

**After:**
```typescript
import { 
  AuthService, 
  RoleService, 
  PermissionService,
  hasAdminRole,
  hasRole,
  hasPermission 
} from '@/lib/auth';
```

### 2. Replace Function Calls

#### Admin Role Checking

**Before:**
```typescript
// Multiple different functions
const isAdmin = await checkAdminRole(userId);
const hasRole = await hasAdminRole('hr_admin');
const rlsCheck = await rlsHasAdminRole('dev_admin', plantId);
```

**After:**
```typescript
// Unified approach
const authService = new AuthService();
const isAdmin = await authService.hasAdminRole(userId);
const hasRole = await authService.hasAdminRole(userId, 'hr_admin');
const hasPlantRole = await authService.hasAdminRole(userId, 'dev_admin', plantId);
```

#### User Authentication

**Before:**
```typescript
const authResult = await authenticateUser();
if (!authResult.success) {
  return createErrorResponse(authResult.error, authResult.status);
}
```

**After:**
```typescript
const authResult = await authenticateUser();
const errorResponse = handleAuthResult(authResult);
if (errorResponse) return errorResponse;
```

#### API Route Wrappers

**Before:**
```typescript
export async function GET(request: NextRequest) {
  const authResult = await authenticateAdmin('hr_admin');
  if (!authResult.success) {
    return createErrorResponse(authResult.error, authResult.status);
  }
  
  // Route logic
}
```

**After:**
```typescript
export async function GET(request: NextRequest) {
  return withAdminAuth(async (profile, adminRoles) => {
    // Route logic
  }, 'hr_admin');
}
```

### 3. Middleware Updates

**Before:**
```typescript
// Multiple middleware files with overlapping concerns
import { authMiddleware } from '@/lib/middleware/auth';
import { authorizationMiddleware } from '@/lib/middleware/authorization';
```

**After:**
```typescript
// Unified middleware
import { AuthMiddleware, AdminMiddleware, UserMiddleware } from '@/lib/auth';

const authMiddleware = new AuthMiddleware();
const adminMiddleware = new AdminMiddleware();
const userMiddleware = new UserMiddleware();

// Use specific middleware for specific needs
export const middleware = authMiddleware.requireAuth();
export const adminMiddleware = adminMiddleware.requireHRAdmin();
export const userMiddleware = userMiddleware.requireUserWithContext();
```

### 4. Error Handling

**Before:**
```typescript
// Inconsistent error handling
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
if (!hasRole) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

**After:**
```typescript
// Standardized error handling
import { AuthenticationError, AuthorizationError } from '@/lib/auth';

try {
  await requireAuth();
} catch (error) {
  if (error instanceof AuthenticationError) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
}
```

## Function Mapping

| Old Function | New Function | Notes |
|-------------|-------------|-------|
| `checkAdminRole()` | `authService.hasAdminRole()` | More flexible with plant restrictions |
| `hasAdminRole()` (rls.ts) | `authService.hasAdminRole()` | Unified implementation |
| `authenticateAdmin()` | `authenticateAdmin()` | Updated to use new auth service |
| `requireAdminRole()` | `roleService.requireAdminRole()` | Throws standardized errors |
| `authenticateUser()` | `authenticateUser()` | Updated to use new auth service |
| `getCurrentUserContext()` | `authService.getUserContext()` | Enhanced with better error handling |

## Benefits of Migration

1. **Consistency**: All auth operations use the same patterns
2. **Security**: Standardized error handling prevents information leakage
3. **Maintainability**: Single source of truth for auth logic
4. **Performance**: Optimized database queries and caching
5. **Testing**: Comprehensive test coverage for all auth scenarios

## Testing Migration

After migration, run the test suite to ensure everything works:

```bash
npm test src/lib/auth
```

## Rollback Plan

If issues arise, you can temporarily revert by:

1. Keeping old files as `.backup` extensions
2. Updating imports to use backup files
3. Gradually migrating back to new system

## Support

For questions or issues during migration, refer to:
- Authentication system documentation
- Test examples in `src/lib/auth/__tests__/`
- Error handling patterns in `src/lib/auth/utils/error-handler.ts`
