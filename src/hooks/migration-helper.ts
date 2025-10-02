// src/hooks/migration-helper.ts
export class HookMigrationHelper {
  static createMigrationGuide() {
    return {
      'useApi.useApiList': {
        replacement: 'useStandardizedApi.useApiList',
        migration: `
// Before
const { data, isLoading, error, refetch } = useApi.useApiList({
  endpoint: '/api/users',
  queryKey: ['users']
});

// After
const { data, isLoading, error, refetch, updateParams, pagination } = useStandardizedApi.useApiList({
  endpoint: '/api/users',
  queryKey: ['users'],
  params: { page: 1, limit: 10 }
});
        `
      },
      'useApi.useApiMutation': {
        replacement: 'useStandardizedApi.useApiMutation',
        migration: `
// Before
const { mutate, isLoading, error } = useApi.useApiMutation({
  endpoint: '/api/users',
  method: 'POST'
});

// After
const { mutate, isLoading, error, mutateAsync } = useStandardizedApi.useApiMutation({
  endpoint: '/api/users',
  method: 'POST',
  queryKey: ['users'],
  invalidateQueries: [['users']]
});
        `
      },
      'useApi.useApiQuery': {
        replacement: 'useStandardizedApi.useApiList',
        migration: `
// Before
const { data, isLoading, error } = useApi.useApiQuery({
  endpoint: '/api/users',
  queryKey: ['users']
});

// After
const { data, isLoading, error, refetch, updateParams } = useStandardizedApi.useApiList({
  endpoint: '/api/users',
  queryKey: ['users']
});
        `
      },
      'useApi.useOptimisticUpdate': {
        replacement: 'useStandardizedApi.useOptimisticUpdate',
        migration: `
// Before
const { mutate, isLoading, error } = useApi.useOptimisticUpdate({
  queryKey: ['users'],
  mutationFn: async (variables) => { /* ... */ },
  updater: (oldData, variables) => { /* ... */ }
});

// After
const { mutate, isLoading, error, mutateAsync } = useStandardizedApi.useOptimisticUpdate({
  queryKey: ['users'],
  mutationFn: async (variables) => { /* ... */ },
  updater: (oldData, variables) => { /* ... */ }
});
        `
      }
    };
  }

  static validateMigration(componentCode: string): string[] {
    const warnings: string[] = [];
    
    if (componentCode.includes('useApi.useApiList')) {
      warnings.push('Consider migrating to useStandardizedApi.useApiList for better features');
    }
    
    if (componentCode.includes('useApi.useApiMutation')) {
      warnings.push('Consider migrating to useStandardizedApi.useApiMutation for better error handling');
    }
    
    if (componentCode.includes('useApi.useApiQuery')) {
      warnings.push('Consider migrating to useStandardizedApi.useApiList for enhanced functionality');
    }
    
    if (componentCode.includes('useApi.useOptimisticUpdate')) {
      warnings.push('Consider migrating to useStandardizedApi.useOptimisticUpdate for better performance');
    }
    
    return warnings;
  }

  static generateMigrationReport(hookUsages: Record<string, number>): string {
    const guide = this.createMigrationGuide();
    let report = '# Hook Migration Report\n\n';
    
    report += '## Current Usage\n';
    Object.entries(hookUsages).forEach(([hook, count]) => {
      report += `- ${hook}: ${count} usages\n`;
    });
    
    report += '\n## Migration Recommendations\n';
    Object.entries(guide).forEach(([legacyHook, migration]) => {
      if (hookUsages[legacyHook] && hookUsages[legacyHook] > 0) {
        report += `### ${legacyHook}\n`;
        report += `**Replacement**: ${migration.replacement}\n\n`;
        report += `**Migration Example**:\n\`\`\`typescript\n${migration.migration}\n\`\`\`\n\n`;
      }
    });
    
    return report;
  }
}

// Migration validation utility
export function validateHookMigration(filePath: string, content: string): {
  needsMigration: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings = HookMigrationHelper.validateMigration(content);
  const needsMigration = warnings.length > 0;
  
  const suggestions: string[] = [];
  
  if (content.includes('useApi.useApiList')) {
    suggestions.push('Replace useApi.useApiList with useStandardizedApi.useApiList for enhanced pagination and caching');
  }
  
  if (content.includes('useApi.useApiMutation')) {
    suggestions.push('Replace useApi.useApiMutation with useStandardizedApi.useApiMutation for better error handling and optimistic updates');
  }
  
  return {
    needsMigration,
    warnings,
    suggestions
  };
}

// Deprecation warning utility
export function createDeprecationWarning(hookName: string, replacement: string): string {
  return `⚠️ DEPRECATION WARNING: ${hookName} is deprecated and will be removed in a future version. Please migrate to ${replacement}. See migration guide: /docs/hook-migration-guide.md`;
}

// Hook usage analyzer
export function analyzeHookUsage(codebase: string[]): {
  legacyHooks: Record<string, number>;
  standardizedHooks: Record<string, number>;
  migrationPriority: string[];
} {
  const legacyHooks: Record<string, number> = {};
  const standardizedHooks: Record<string, number> = {};
  
  const legacyPatterns = [
    'useApi.useApiList',
    'useApi.useApiMutation', 
    'useApi.useApiQuery',
    'useApi.useOptimisticUpdate'
  ];
  
  const standardizedPatterns = [
    'useStandardizedApi.useApiList',
    'useStandardizedApi.useApiMutation',
    'useStandardizedApi.useOptimisticUpdate'
  ];
  
  codebase.forEach(fileContent => {
    legacyPatterns.forEach(pattern => {
      const matches = fileContent.match(new RegExp(pattern, 'g'));
      if (matches) {
        legacyHooks[pattern] = (legacyHooks[pattern] || 0) + matches.length;
      }
    });
    
    standardizedPatterns.forEach(pattern => {
      const matches = fileContent.match(new RegExp(pattern, 'g'));
      if (matches) {
        standardizedHooks[pattern] = (standardizedHooks[pattern] || 0) + matches.length;
      }
    });
  });
  
  // Calculate migration priority based on usage frequency
  const migrationPriority = Object.entries(legacyHooks)
    .sort(([, a], [, b]) => b - a)
    .map(([hook]) => hook);
  
  return {
    legacyHooks,
    standardizedHooks,
    migrationPriority
  };
}
