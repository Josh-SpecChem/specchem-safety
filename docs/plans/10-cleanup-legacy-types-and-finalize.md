# Plan 10: Clean Up Legacy Types and Finalize Contract Migration

**Status**: Ready for Implementation  
**Priority**: P2 - Medium  
**Estimated Time**: 1 day  
**Dependencies**: All previous contract migration plans (07-09) completed

## 🎯 Objective

Complete the contract system migration by removing all legacy type definitions, cleaning up obsolete files, updating documentation, and ensuring the codebase is fully standardized on the contract system with no remaining technical debt.

## 📋 Implementation Prompt

### Context

You are completing the final phase of migrating to a contract-based type system. At this point:

- API routes use contract validation
- Frontend hooks use contract DTOs
- Legacy validation has been replaced with contract utilities

The remaining work is cleanup, optimization, and finalization to ensure a clean, maintainable codebase with no legacy remnants.

### Current State Analysis Required

1. **Audit remaining legacy code**:

   ```bash
   # Find remaining type definitions outside contracts
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "interface\|type" | grep -v contracts | grep -v node_modules

   # Find remaining custom schemas
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "z\." | grep -v contracts

   # Find files importing from old locations
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "@/types\|@/lib/schemas"

   # Find unused files
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -L "export\|import"
   ```

2. **Identify cleanup categories**:
   - Obsolete type definition files
   - Unused utility functions
   - Duplicate documentation
   - Inconsistent import patterns
   - Legacy configuration files

### Step-by-Step Cleanup Process

#### Phase 1: Type System Cleanup (2 hours)

1. **Remove duplicate type files**:

   ```typescript
   // Files to evaluate for removal:
   // src/types/database.ts - Check if fully replaced by contracts
   // src/types/api.ts - Check if fully replaced by contracts
   // src/types/ui.ts - Keep UI-specific types, remove data types
   // src/types/domain.ts - Check if fully replaced by contracts
   // src/types/utils.ts - Keep utility types, remove data types

   // Before removal, verify no unique types are lost
   interface TypeAudit {
     filePath: string;
     exportedTypes: string[];
     contractEquivalent: string | null;
     shouldKeep: boolean;
     reason: string;
   }
   ```

2. **Consolidate remaining types**:

   ```typescript
   // Keep only UI-specific and utility types
   // src/types/ui.ts - Clean version
   export interface ComponentProps {
     className?: string;
     children?: React.ReactNode;
   }

   export interface LoadingState {
     loading: boolean;
     error: Error | null;
   }

   export interface PaginationState {
     page: number;
     limit: number;
     total: number;
   }

   // Remove any types that duplicate contracts
   // Remove: Profile, Course, Enrollment, etc. (use contracts instead)
   ```

3. **Update type barrel exports**:

   ```typescript
   // src/types/index.ts - Minimal version
   // Only export types that don't exist in contracts
   export type { ComponentProps, LoadingState, PaginationState } from "./ui";
   export type { UtilityType1, UtilityType2 } from "./utils";

   // Remove all data model exports (use @/contracts instead)
   // Add comment directing to contracts:
   /**
    * For data model types (Profile, Course, Enrollment, etc.),
    * import from @/contracts instead of this file.
    *
    * Example:
    * import { Profile, Course } from '@/contracts';
    */
   ```

#### Phase 2: Import Standardization (2 hours)

4. **Standardize contract imports**:

   ```bash
   # Create script to find and replace imports
   # scripts/standardize-imports.ts
   ```

   ```typescript
   #!/usr/bin/env tsx

   import { readFileSync, writeFileSync } from "fs";
   import { glob } from "glob";

   interface ImportReplacement {
     from: RegExp;
     to: string;
     description: string;
   }

   const replacements: ImportReplacement[] = [
     {
       from: /import\s+{([^}]+)}\s+from\s+['"]@\/types['"];?/g,
       to: "import { $1 } from '@/contracts';",
       description: "Replace @/types imports with @/contracts",
     },
     {
       from: /import\s+{([^}]+)}\s+from\s+['"]@\/lib\/schemas['"];?/g,
       to: "import { $1 } from '@/contracts';",
       description: "Replace @/lib/schemas imports with @/contracts",
     },
     {
       from: /import\s+type\s+{([^}]+)}\s+from\s+['"]@\/types['"];?/g,
       to: "import type { $1 } from '@/contracts';",
       description: "Replace type imports from @/types",
     },
   ];

   async function standardizeImports() {
     const files = await glob("src/**/*.{ts,tsx}", {
       ignore: ["src/contracts/**"],
     });

     let totalReplacements = 0;

     for (const file of files) {
       let content = readFileSync(file, "utf-8");
       let fileReplacements = 0;

       for (const replacement of replacements) {
         const matches = content.match(replacement.from);
         if (matches) {
           content = content.replace(replacement.from, replacement.to);
           fileReplacements += matches.length;
         }
       }

       if (fileReplacements > 0) {
         writeFileSync(file, content);
         console.log(`✅ ${file}: ${fileReplacements} replacements`);
         totalReplacements += fileReplacements;
       }
     }

     console.log(`\n🎉 Total replacements: ${totalReplacements}`);
   }

   standardizeImports().catch(console.error);
   ```

5. **Run import standardization**:

   ```bash
   # Add to package.json
   "scripts": {
     "standardize-imports": "tsx scripts/standardize-imports.ts"
   }

   # Run the script
   pnpm standardize-imports
   ```

6. **Verify import consistency**:

   ```bash
   # Check for remaining old imports
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -n "@/types" | grep -v "@/types/ui"
   find src -name "*.ts" -o -name "*.tsx" | xargs grep -n "@/lib/schemas"

   # Should return minimal results (only legitimate UI types)
   ```

#### Phase 3: File Cleanup and Organization (1 hour)

7. **Remove obsolete files**:

   ```bash
   # Create cleanup checklist
   # Files to evaluate for removal:

   # Database/API types (if fully replaced by contracts)
   # - src/types/database.ts
   # - src/types/api.ts
   # - src/types/domain.ts

   # Legacy schemas (if fully replaced by contracts)
   # - src/lib/schemas.ts (check if anything unique remains)

   # Legacy validation utilities (if replaced by contracts)
   # - src/lib/validation.ts
   # - src/lib/route-utils.ts (if fully replaced)

   # Duplicate documentation
   # - Any README files that duplicate contract docs
   ```

8. **Archive vs delete decision**:

   ```typescript
   // For each file, decide:
   interface CleanupDecision {
     filePath: string;
     action: "delete" | "archive" | "keep" | "merge";
     reason: string;
     backupLocation?: string;
   }

   const cleanupPlan: CleanupDecision[] = [
     {
       filePath: "src/lib/schemas.ts",
       action: "archive",
       reason: "Large file with potential unique schemas",
       backupLocation: "docs/archive/legacy-schemas.md",
     },
     {
       filePath: "src/types/database.ts",
       action: "delete",
       reason: "Fully replaced by contracts",
     },
     // ... etc
   ];
   ```

9. **Create archive documentation**:

   ````markdown
   # docs/archive/legacy-migration-notes.md

   ## Contract Migration Archive

   **Date**: [Current Date]
   **Migration**: Legacy types to contract system

   ### Files Removed

   - `src/types/database.ts` - Replaced by `@/contracts` DTOs
   - `src/types/api.ts` - Replaced by `@/contracts` API types
   - `src/lib/validation.ts` - Replaced by `@/contracts` validation utilities

   ### Files Archived

   - `src/lib/schemas.ts` → `docs/archive/legacy-schemas.md`

   ### Migration Notes

   - All data model types now come from `@/contracts`
   - Validation logic centralized in contract system
   - Error handling standardized across application

   ### Rollback Information

   If rollback needed, restore files from git history:

   ```bash
   git checkout [commit-hash] -- src/types/database.ts
   ```
   ````

   ```

   ```

#### Phase 4: Documentation Updates (2 hours)

10. **Update main documentation**:

    ```markdown
    # Update docs/README.md

    ### Type System Documentation

    - **[Contract System](./contracts-workflow-implementation.md)** - Complete type safety system
    - **[Contract Workflow](./contracts-workflow.md)** - Development workflow guide
    - **[Migration History](./MIGRATION-HISTORY.md)** - Contract migration notes
    - ~~[Types Guide](./types-guide.md)~~ - DEPRECATED: Use contract system
    ```

11. **Create developer onboarding guide**:

    ````markdown
    # docs/developer-onboarding-contracts.md

    ## Contract System Quick Start

    ### For New Developers

    #### Data Types

    ```typescript
    // ✅ CORRECT: Import from contracts
    import { Profile, Course, Enrollment } from "@/contracts";

    // ❌ WRONG: Don't create custom types for data models
    interface User {
      id: string;
      name: string;
    } // Use Profile instead
    ```
    ````

    #### API Validation

    ```typescript
    // ✅ CORRECT: Use contract validation
    import { validateRequestBody, ProfileSchema } from "@/contracts";

    const validation = await validateRequestBody(request, ProfileSchema);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }
    ```

    #### Hook Usage

    ```typescript
    // ✅ CORRECT: Standardized hook shape
    const { data: profile, loading, error, refetch } = useProfile(id);
    ```

    ### Common Patterns
    - Always validate API inputs and outputs
    - Use contract DTOs for all data models
    - Follow standardized error handling
    - Include tenant isolation in all queries

    ```

    ```

12. **Update API documentation**:

    ````markdown
    # Update docs/API.md

    ## Request/Response Validation

    All API endpoints use contract validation:

    ### Request Validation

    ```typescript
    // All requests are validated with contract schemas
    const validation = await validateRequestBody(request, CreateProfileSchema);
    ```
    ````

    ### Response Format

    ```typescript
    // All responses follow this standard format
    {
      "success": boolean,
      "data": T | null,
      "message"?: string,
      "error"?: string
    }
    ```

    ### Error Handling
    - 400: Validation errors
    - 401: Authentication required
    - 403: Access denied
    - 404: Resource not found
    - 500: Internal server error

    ```

    ```

#### Phase 5: Performance and Optimization (1 hour)

13. **Optimize contract imports**:

    ```typescript
    // Check for unnecessary imports
    // src/contracts/index.ts - Ensure tree-shaking friendly exports

    // ✅ GOOD: Named exports for tree-shaking
    export { ProfileSchema, type Profile } from "./base";
    export { mapProfileToDTO } from "./mappers";

    // ❌ BAD: Barrel exports that import everything
    export * from "./base"; // Only if truly needed
    ```

14. **Bundle size analysis**:

    ```bash
    # Check bundle impact of contract system
    pnpm build

    # Analyze bundle size
    npx @next/bundle-analyzer

    # Ensure contract system doesn't significantly increase bundle size
    ```

15. **Runtime performance check**:
    ```typescript
    // Verify validation performance is acceptable
    // Create performance test for contract validation
    // Ensure no performance regressions from migration
    ```

#### Phase 6: Final Testing and Validation (1 hour)

16. **Comprehensive testing**:

    ```bash
    # Run all tests
    pnpm test:contracts
    pnpm type-check
    pnpm lint
    pnpm test
    pnpm test:e2e

    # All should pass without errors
    ```

17. **Manual verification checklist**:

    ```typescript
    // Create final verification checklist
    interface FinalVerification {
      category: string;
      checks: string[];
      status: "pending" | "complete";
    }

    const verificationChecklist: FinalVerification[] = [
      {
        category: "Type Safety",
        checks: [
          "No TypeScript errors in entire codebase",
          "All data models use contract types",
          "No raw Drizzle types in components",
          "All API responses validated with contracts",
        ],
        status: "pending",
      },
      {
        category: "Validation",
        checks: [
          "All API routes use contract validation",
          "All forms use contract schemas",
          "Error handling is consistent",
          "No duplicate validation logic",
        ],
        status: "pending",
      },
      {
        category: "Security",
        checks: [
          "Tenant isolation enforced everywhere",
          "No cross-tenant data leaks possible",
          "All queries include plantId filtering",
          "Error messages don't leak sensitive data",
        ],
        status: "pending",
      },
      {
        category: "Maintainability",
        checks: [
          "No duplicate type definitions",
          "Imports are standardized",
          "Documentation is up to date",
          "Legacy files are removed or archived",
        ],
        status: "pending",
      },
    ];
    ```

18. **Create migration completion report**:

    ````markdown
    # docs/contract-migration-completion-report.md

    ## Contract System Migration - Completion Report

    **Date**: [Current Date]
    **Status**: ✅ Complete

    ### Migration Summary

    - **API Routes**: 100% migrated to contract validation
    - **Frontend Hooks**: 100% using contract DTOs
    - **Type Definitions**: Consolidated to contract system
    - **Validation Logic**: Centralized in contracts
    - **Legacy Code**: Removed or archived

    ### Metrics

    - Files removed: [X]
    - Lines of code reduced: [X]
    - Type safety coverage: 100%
    - Validation consistency: 100%

    ### Benefits Achieved

    1. **Type Safety**: End-to-end type safety from DB to UI
    2. **Consistency**: Standardized patterns across codebase
    3. **Maintainability**: Single source of truth for data contracts
    4. **Security**: Enforced tenant isolation
    5. **Developer Experience**: Clear, predictable APIs

    ### Next Steps

    - Monitor for any issues in production
    - Continue using contract workflow for new features
    - Regular contract validation in CI/CD

    ### Rollback Plan (if needed)

    Contract migration is reversible via git history:

    ```bash
    # Restore specific files if needed
    git checkout [pre-migration-commit] -- [file-path]
    ```
    ````

    ```

    ```

### Critical Requirements

#### MUST HAVE:

- [ ] All legacy type files are removed or archived
- [ ] All imports use standardized contract imports
- [ ] Documentation reflects current contract system
- [ ] No duplicate validation logic remains
- [ ] All tests pass after cleanup

#### MUST NOT:

- [ ] Break existing functionality
- [ ] Remove types that are still needed
- [ ] Leave orphaned imports
- [ ] Delete files without proper backup/archive

### Validation Checklist

Before marking this complete, verify:

- [ ] `pnpm type-check` passes with zero errors
- [ ] `pnpm test:contracts` passes all tests
- [ ] `pnpm lint` passes with no warnings
- [ ] All API endpoints return standardized responses
- [ ] No duplicate type definitions exist
- [ ] All imports are standardized to use @/contracts
- [ ] Documentation is updated and accurate
- [ ] Legacy files are properly archived or removed

### Success Criteria

1. **Clean Codebase**: No legacy type definitions or duplicate code
2. **Standardized Imports**: All imports follow contract patterns
3. **Complete Documentation**: All docs reflect contract system
4. **Type Safety**: 100% type safety with no regressions
5. **Maintainability**: Clear, consistent patterns throughout
6. **Performance**: No performance impact from migration

### Cleanup Priority Order

#### Phase 1 (Critical):

1. Remove duplicate type definitions
2. Standardize all imports to use @/contracts
3. Update main documentation

#### Phase 2 (Important):

1. Remove obsolete validation files
2. Archive legacy schemas with unique content
3. Update developer guides

#### Phase 3 (Nice to Have):

1. Optimize bundle size
2. Create migration completion report
3. Final performance verification

The goal is a completely clean, standardized codebase with no legacy remnants and comprehensive documentation for future developers.
