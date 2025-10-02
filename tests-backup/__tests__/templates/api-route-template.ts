import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TestHelpers, TestPatterns } from '../setup'

// Simplified API route test template
export const createApiRouteTest = (
  routeName: string,
  handler: (request: Request) => Promise<Response>,
  testCases: Array<{
    name: string
    method: string
    body?: unknown
    headers?: Record<string, string>
    expectedStatus: number
    expectedData?: unknown
    setup?: () => void
  }>
) => {
  describe(`${routeName} API Route`, () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })
    
    testCases.forEach(({ name, method, body, headers, expectedStatus, expectedData, setup }) => {
      it(name, async () => {
        if (setup) setup()
        
        const request = TestHelpers.createTestRequest(method, body)
        
        // Add custom headers
        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            request.headers.set(key, value)
          })
        }
        
        const response = await TestPatterns.testApiRoute(handler, request, expectedStatus)
        
        if (expectedData) {
          const data = await response.json()
          expect(data).toEqual(expectedData)
        }
      })
    })
  })
}

// Essential API route patterns
export const ApiRoutePatterns = {
  // Test GET request
  testGet: (handler: (request: Request) => Promise<Response>, expectedStatus: number = 200) => {
    const request = TestHelpers.createTestRequest('GET')
    return TestPatterns.testApiRoute(handler, request, expectedStatus)
  },
  
  // Test POST request
  testPost: (handler: (request: Request) => Promise<Response>, body: unknown, expectedStatus: number = 200) => {
    const request = TestHelpers.createTestRequest('POST', body)
    return TestPatterns.testApiRoute(handler, request, expectedStatus)
  },
  
  // Test PATCH request
  testPatch: (handler: (request: Request) => Promise<Response>, body: unknown, expectedStatus: number = 200) => {
    const request = TestHelpers.createTestRequest('PATCH', body)
    return TestPatterns.testApiRoute(handler, request, expectedStatus)
  },
  
  // Test DELETE request
  testDelete: (handler: (request: Request) => Promise<Response>, expectedStatus: number = 200) => {
    const request = TestHelpers.createTestRequest('DELETE')
    return TestPatterns.testApiRoute(handler, request, expectedStatus)
  },
  
  // Test authentication
  testAuth: (handler: (request: Request) => Promise<Response>, token: string, expectedStatus: number = 200) => {
    const request = TestHelpers.createTestRequest('GET')
    request.headers.set('Authorization', `Bearer ${token}`)
    return TestPatterns.testApiRoute(handler, request, expectedStatus)
  },
  
  // Test error scenarios
  testError: (handler: (request: Request) => Promise<Response>, method: string, body?: unknown, expectedStatus: number = 400) => {
    const request = TestHelpers.createTestRequest(method, body)
    return TestPatterns.testApiRoute(handler, request, expectedStatus)
  }
}

// Example usage
export const exampleApiRouteTest = () => {
  createApiRouteTest('Users API', handler, [
    {
      name: 'should handle GET request',
      method: 'GET',
      expectedStatus: 200,
      expectedData: { success: true, data: [] }
    },
    {
      name: 'should handle POST request',
      method: 'POST',
      body: { name: 'Test User' },
      expectedStatus: 201,
      expectedData: { success: true, data: { id: expect.any(String), name: 'Test User' } }
    },
    {
      name: 'should handle authentication',
      method: 'GET',
      headers: { 'Authorization': 'Bearer valid-token' },
      expectedStatus: 200
    },
    {
      name: 'should handle validation error',
      method: 'POST',
      body: { name: '' },
      expectedStatus: 400,
      expectedData: { success: false, error: 'Validation failed' }
    }
  ])
}
