// src/hooks/__tests__/migration-helper.test.ts
import { HookMigrationHelper, validateHookMigration, analyzeHookUsage } from '../migration-helper';

describe('HookMigrationHelper', () => {
  describe('createMigrationGuide', () => {
    it('should return a complete migration guide', () => {
      const guide = HookMigrationHelper.createMigrationGuide();
      
      expect(guide).toHaveProperty('useApi.useApiList');
      expect(guide).toHaveProperty('useApi.useApiMutation');
      expect(guide).toHaveProperty('useApi.useApiQuery');
      expect(guide).toHaveProperty('useApi.useOptimisticUpdate');
      
      expect(guide['useApi.useApiList']).toHaveProperty('replacement');
      expect(guide['useApi.useApiList']).toHaveProperty('migration');
      expect(guide['useApi.useApiList'].replacement).toBe('useStandardizedApi.useApiList');
    });
  });

  describe('validateMigration', () => {
    it('should detect legacy hook usage', () => {
      const componentCode = `
        import { useApi } from '@/hooks/useApi';
        
        export function MyComponent() {
          const { data, isLoading, error } = useApi.useApiList({
            endpoint: '/api/users',
            queryKey: ['users']
          });
          
          const { mutate } = useApi.useApiMutation({
            endpoint: '/api/users',
            method: 'POST'
          });
          
          return <div>...</div>;
        }
      `;
      
      const warnings = HookMigrationHelper.validateMigration(componentCode);
      
      expect(warnings).toContain('Consider migrating to useStandardizedApi.useApiList for better features');
      expect(warnings).toContain('Consider migrating to useStandardizedApi.useApiMutation for better error handling');
    });

    it('should not warn for standardized hooks', () => {
      const componentCode = `
        import { useApiList, useApiMutation } from '@/hooks/useStandardizedApi';
        
        export function MyComponent() {
          const { data, isLoading, error } = useApiList({
            endpoint: '/api/users',
            queryKey: ['users']
          });
          
          const { mutate } = useApiMutation({
            endpoint: '/api/users',
            method: 'POST'
          });
          
          return <div>...</div>;
        }
      `;
      
      const warnings = HookMigrationHelper.validateMigration(componentCode);
      
      expect(warnings).toHaveLength(0);
    });
  });

  describe('generateMigrationReport', () => {
    it('should generate a comprehensive migration report', () => {
      const hookUsages = {
        'useApi.useApiList': 5,
        'useApi.useApiMutation': 3,
        'useApi.useApiQuery': 2,
        'useApi.useOptimisticUpdate': 1
      };
      
      const report = HookMigrationHelper.generateMigrationReport(hookUsages);
      
      expect(report).toContain('# Hook Migration Report');
      expect(report).toContain('## Current Usage');
      expect(report).toContain('## Migration Recommendations');
      expect(report).toContain('useApi.useApiList: 5 usages');
      expect(report).toContain('useApi.useApiMutation: 3 usages');
    });
  });
});

describe('validateHookMigration', () => {
  it('should identify files that need migration', () => {
    const filePath = 'src/components/UserManagement.tsx';
    const content = `
      import { useApi } from '@/hooks/useApi';
      
      export function UserManagement() {
        const { data } = useApi.useApiList({
          endpoint: '/api/users',
          queryKey: ['users']
        });
        
        return <div>...</div>;
      }
    `;
    
    const result = validateHookMigration(filePath, content);
    
    expect(result.needsMigration).toBe(true);
    expect(result.warnings).toHaveLength(1);
    expect(result.suggestions).toHaveLength(1);
    expect(result.suggestions[0]).toContain('useStandardizedApi.useApiList');
  });

  it('should not flag files that are already migrated', () => {
    const filePath = 'src/components/UserManagement.tsx';
    const content = `
      import { useApiList } from '@/hooks/useStandardizedApi';
      
      export function UserManagement() {
        const { data } = useApiList({
          endpoint: '/api/users',
          queryKey: ['users']
        });
        
        return <div>...</div>;
      }
    `;
    
    const result = validateHookMigration(filePath, content);
    
    expect(result.needsMigration).toBe(false);
    expect(result.warnings).toHaveLength(0);
    expect(result.suggestions).toHaveLength(0);
  });
});

describe('analyzeHookUsage', () => {
  it('should analyze hook usage across codebase', () => {
    const codebase = [
      'useApi.useApiList useApi.useApiMutation',
      'useStandardizedApi.useApiList useStandardizedApi.useApiMutation',
      'useApi.useApiQuery'
    ];
    
    const analysis = analyzeHookUsage(codebase);
    
    expect(analysis.legacyHooks).toEqual({
      'useApi.useApiList': 1,
      'useApi.useApiMutation': 1,
      'useApi.useApiQuery': 1
    });
    
    expect(analysis.standardizedHooks).toEqual({
      'useStandardizedApi.useApiList': 1,
      'useStandardizedApi.useApiMutation': 1
    });
    
    expect(analysis.migrationPriority).toEqual([
      'useApi.useApiList',
      'useApi.useApiMutation',
      'useApi.useApiQuery'
    ]);
  });

  it('should handle empty codebase', () => {
    const codebase: string[] = [];
    
    const analysis = analyzeHookUsage(codebase);
    
    expect(analysis.legacyHooks).toEqual({});
    expect(analysis.standardizedHooks).toEqual({});
    expect(analysis.migrationPriority).toEqual([]);
  });

  it('should prioritize hooks by usage frequency', () => {
    const codebase = [
      'useApi.useApiMutation', // 1 usage
      'useApi.useApiMutation', // 2nd usage
      'useApi.useApiMutation', // 3rd usage
      'useApi.useApiList',     // 1 usage
      'useApi.useApiQuery'     // 1 usage
    ];
    
    const analysis = analyzeHookUsage(codebase);
    
    expect(analysis.migrationPriority[0]).toBe('useApi.useApiMutation');
    expect(analysis.legacyHooks['useApi.useApiMutation']).toBe(3);
  });
});
