import { TestHelpers, TestPatterns } from '../setup'
import { createComponentTest, createHookTest, createUtilityTest } from '../templates/unit-test-template'
import { createApiRouteTest, ApiRoutePatterns } from '../templates/api-route-template'
import { createDatabaseTest, DatabasePatterns } from '../templates/database-template'

// Migration utilities for existing tests
export const MigrationHelpers = {
  // Migrate component tests to simplified patterns
  migrateComponentTest: (componentName: string, existingTests: Array<{ name?: string; props?: Record<string, unknown>; setup?: () => void; test: () => void }>) => {
    return createComponentTest(componentName, existingTests.map(test => ({
      name: test.name || 'should work',
      props: test.props || {},
      setup: test.setup,
      test: test.test
    })))
  },
  
  // Migrate hook tests to simplified patterns
  migrateHookTest: (hookName: string, existingTests: Array<{ name?: string; setup?: () => void; test: () => void }>) => {
    return createHookTest(hookName, existingTests.map(test => ({
      name: test.name || 'should work',
      setup: test.setup,
      test: test.test
    })))
  },
  
  // Migrate utility tests to simplified patterns
  migrateUtilityTest: (utilityName: string, existingTests: Array<{ name?: string; input?: unknown; expected?: unknown; setup?: () => void }>) => {
    return createUtilityTest(utilityName, existingTests.map(test => ({
      name: test.name || 'should work',
      input: test.input,
      expected: test.expected,
      setup: test.setup
    })))
  },
  
  // Migrate API route tests to simplified patterns
  migrateApiRouteTest: (routeName: string, handler: (request: Request) => Promise<Response>, existingTests: Array<{ name?: string; method?: string; body?: unknown; expectedStatus?: number; setup?: () => void }>) => {
    return createApiRouteTest(routeName, handler, existingTests.map(test => ({
      name: test.name || 'should work',
      method: test.method || 'GET',
      body: test.body,
      headers: test.headers,
      expectedStatus: test.expectedStatus || 200,
      expectedData: test.expectedData,
      setup: test.setup
    })))
  },
  
  // Migrate database tests to simplified patterns
  migrateDatabaseTest: (entityName: string, existingTests: Array<{ name?: string; operation?: () => Promise<unknown>; expectedResult?: unknown; setup?: () => void; teardown?: () => void }>) => {
    return createDatabaseTest(entityName, existingTests.map(test => ({
      name: test.name || 'should work',
      operation: test.operation,
      expectedResult: test.expectedResult,
      setup: test.setup,
      teardown: test.teardown
    })))
  }
}

// Test validation utilities
export const TestValidation = {
  // Validate test structure
  validateTestStructure: (test: Record<string, unknown>) => {
    const errors = []
    
    if (!test.name) {
      errors.push('Test must have a name')
    }
    
    if (!test.test && !test.operation) {
      errors.push('Test must have a test function or operation')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },
  
  // Validate test data
  validateTestData: (data: Record<string, unknown>) => {
    const errors = []
    
    if (typeof data !== 'object' || data === null) {
      errors.push('Test data must be an object')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },
  
  // Validate test patterns
  validateTestPatterns: (patterns: Record<string, unknown>) => {
    const errors = []
    
    if (!patterns.testApiRoute) {
      errors.push('Missing testApiRoute pattern')
    }
    
    if (!patterns.testDatabaseOperation) {
      errors.push('Missing testDatabaseOperation pattern')
    }
    
    if (!patterns.testComponent) {
      errors.push('Missing testComponent pattern')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Test coverage utilities
export const TestCoverage = {
  // Calculate test coverage
  calculateCoverage: (totalLines: number, testedLines: number) => {
    return (testedLines / totalLines) * 100
  },
  
  // Check if coverage meets threshold
  meetsThreshold: (coverage: number, threshold: number = 80) => {
    return coverage >= threshold
  },
  
  // Generate coverage report
  generateCoverageReport: (coverage: Record<string, unknown>) => {
    return {
      overall: coverage.overall,
      branches: coverage.branches,
      functions: coverage.functions,
      lines: coverage.lines,
      statements: coverage.statements,
      meetsThreshold: TestCoverage.meetsThreshold(coverage.overall)
    }
  }
}

// Test performance utilities
export const TestPerformance = {
  // Measure test execution time
  measureExecutionTime: async (testFn: () => Promise<unknown>) => {
    const startTime = Date.now()
    await testFn()
    const endTime = Date.now()
    return endTime - startTime
  },
  
  // Check if test execution time is acceptable
  isAcceptableExecutionTime: (executionTime: number, maxTime: number = 1000) => {
    return executionTime <= maxTime
  },
  
  // Generate performance report
  generatePerformanceReport: (executionTimes: number[]) => {
    const totalTime = executionTimes.reduce((sum, time) => sum + time, 0)
    const averageTime = totalTime / executionTimes.length
    const maxTime = Math.max(...executionTimes)
    const minTime = Math.min(...executionTimes)
    
    return {
      totalTime,
      averageTime,
      maxTime,
      minTime,
      testCount: executionTimes.length
    }
  }
}

// Migration examples
export const migrationExamples = {
  // Example: Migrate existing component test
  migrateComponentExample: () => {
    const existingTests = [
      {
        name: 'should render correctly',
        props: { children: 'Test' },
        test: ({ getByText }: { getByText: (text: string) => HTMLElement }) => {
          expect(getByText('Test')).toBeInTheDocument()
        }
      },
      {
        name: 'should handle click',
        props: { onClick: vi.fn() },
        test: ({ getByRole }: { getByRole: (role: string) => HTMLElement }) => {
          const button = getByRole('button')
          button.click()
          expect(button).toBeInTheDocument()
        }
      }
    ]
    
    return MigrationHelpers.migrateComponentTest('Button', existingTests)
  },
  
  // Example: Migrate existing API route test
  migrateApiRouteExample: () => {
    const existingTests = [
      {
        name: 'should handle GET request',
        method: 'GET',
        expectedStatus: 200,
        expectedData: { success: true }
      },
      {
        name: 'should handle POST request',
        method: 'POST',
        body: { name: 'Test' },
        expectedStatus: 201
      }
    ]
    
    return MigrationHelpers.migrateApiRouteTest('Users API', handler, existingTests)
  }
}
