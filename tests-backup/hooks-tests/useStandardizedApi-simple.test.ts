import { describe, it, expect, beforeEach } from 'vitest'
import { HookMigrationHelper, validateHookMigration, analyzeHookUsage } from '../migration-helper'
import { createHookTest } from '../../__tests__/templates/unit-test-template'

describe('useStandardizedApi - Simplified Tests', () => {
  beforeEach(() => {
    // Reset any mocks or state
  })

  createHookTest('Migration Helper', [
    {
      name: 'should create migration guide',
      test: () => {
        const guide = HookMigrationHelper.createMigrationGuide()
        
        expect(guide).toHaveProperty('useApi.useApiList')
        expect(guide).toHaveProperty('useApi.useApiMutation')
        expect(guide['useApi.useApiList'].replacement).toBe('useStandardizedApi.useApiList')
      }
    },

    {
      name: 'should validate migration needs',
      test: () => {
        const componentCode = `
          import { useApi } from '@/hooks/useApi';
          
          export function MyComponent() {
            const { data } = useApi.useApiList({
              endpoint: '/api/users',
              queryKey: ['users']
            });
            
            return <div>...</div>;
          }
        `
        
        const warnings = HookMigrationHelper.validateMigration(componentCode)
        expect(warnings.length).toBeGreaterThan(0)
      }
    },

    {
      name: 'should analyze hook usage',
      test: () => {
        const codebase = [
          'useApi.useApiList useApi.useApiMutation',
          'useStandardizedApi.useApiList useStandardizedApi.useApiMutation',
          'useApi.useApiQuery'
        ]
        
        const analysis = analyzeHookUsage(codebase)
        
        expect(analysis.legacyHooks['useApi.useApiList']).toBe(1)
        expect(analysis.legacyHooks['useApi.useApiMutation']).toBe(1)
        expect(analysis.standardizedHooks['useStandardizedApi.useApiList']).toBe(1)
        expect(analysis.standardizedHooks['useStandardizedApi.useApiMutation']).toBe(1)
      }
    }
  ])

  createHookTest('Hook Validation', [
    {
      name: 'should identify files needing migration',
      test: () => {
        const filePath = 'src/components/UserManagement.tsx'
        const content = `
          import { useApi } from '@/hooks/useApi';
          
          export function UserManagement() {
            const { data } = useApi.useApiList({
              endpoint: '/api/users',
              queryKey: ['users']
            });
            
            return <div>...</div>;
          }
        `
        
        const result = validateHookMigration(filePath, content)
        
        expect(result.needsMigration).toBe(true)
        expect(result.warnings.length).toBeGreaterThan(0)
        expect(result.suggestions.length).toBeGreaterThan(0)
      }
    },

    {
      name: 'should not flag migrated files',
      test: () => {
        const filePath = 'src/components/UserManagement.tsx'
        const content = `
          import { useApiList } from '@/hooks/useStandardizedApi';
          
          export function UserManagement() {
            const { data } = useApiList({
              endpoint: '/api/users',
              queryKey: ['users']
            });
            
            return <div>...</div>;
          }
        `
        
        const result = validateHookMigration(filePath, content)
        
        expect(result.needsMigration).toBe(false)
        expect(result.warnings.length).toBe(0)
        expect(result.suggestions.length).toBe(0)
      }
    }
  ])

  createHookTest('Migration Report Generation', [
    {
      name: 'should generate migration report',
      test: () => {
        const hookUsages = {
          'useApi.useApiList': 5,
          'useApi.useApiMutation': 3,
          'useApi.useApiQuery': 2,
          'useApi.useOptimisticUpdate': 1
        }
        
        const report = HookMigrationHelper.generateMigrationReport(hookUsages)
        
        expect(report).toContain('# Hook Migration Report')
        expect(report).toContain('## Current Usage')
        expect(report).toContain('## Migration Recommendations')
        expect(report).toContain('useApi.useApiList: 5 usages')
        expect(report).toContain('useApi.useApiMutation: 3 usages')
      }
    }
  ])
})
