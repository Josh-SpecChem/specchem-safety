import { describe, it, expect, vi } from 'vitest'
import { TestHelpers } from '../setup'
import { createComponentTest, EssentialPatterns } from '../templates/unit-test-template'
import { ApiRoutePatterns } from '../templates/api-route-template'
import { DatabasePatterns } from '../templates/database-template'

// Example: Simplified Component Test
export const ButtonTestExample = () => {
  createComponentTest('Button', [
    {
      name: 'should render with correct text',
      props: { children: 'Click me' },
      test: ({ getByText }) => {
        expect(getByText('Click me')).toBeInTheDocument()
      }
    },
    {
      name: 'should handle click events',
      props: { onClick: vi.fn(), children: 'Click me' },
      test: ({ getByRole }) => {
        const button = getByRole('button')
        button.click()
        expect(button).toBeInTheDocument()
      }
    },
    {
      name: 'should be disabled when disabled prop is true',
      props: { disabled: true, children: 'Disabled' },
      test: ({ getByRole }) => {
        const button = getByRole('button')
        expect(button).toBeDisabled()
      }
    }
  ])
}

// Example: Simplified API Route Test
export const UsersApiTestExample = () => {
  const mockHandler = vi.fn()
  
  createApiRouteTest('Users API', mockHandler, [
    {
      name: 'should handle GET request',
      method: 'GET',
      expectedStatus: 200,
      expectedData: { success: true, data: [] }
    },
    {
      name: 'should handle POST request',
      method: 'POST',
      body: { name: 'Test User', email: 'test@example.com' },
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

// Example: Simplified Database Test
export const UserDatabaseTestExample = () => {
  createDatabaseTest('User', [
    {
      name: 'should create user',
      operation: async () => {
        const userData = TestHelpers.createTestUser()
        // Simulate database create operation
        return { ...userData, id: 'created-id' }
      },
      expectedResult: { id: 'created-id', email: expect.any(String) }
    },
    {
      name: 'should read user by id',
      operation: async () => {
        // Simulate database read operation
        return TestHelpers.createTestUser({ id: 'test-id' })
      },
      expectedResult: { id: 'test-id', email: expect.any(String) }
    },
    {
      name: 'should update user',
      operation: async () => {
        // Simulate database update operation
        return TestHelpers.createTestUser({ id: 'test-id', firstName: 'Updated' })
      },
      expectedResult: { id: 'test-id', firstName: 'Updated' }
    },
    {
      name: 'should delete user',
      operation: async () => {
        // Simulate database delete operation
        return null
      },
      expectedResult: null
    }
  ])
}

// Example: Using Essential Patterns
export const EssentialPatternsExample = () => {
  describe('Essential Patterns Examples', () => {
    it('should test API route using pattern', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
      const request = TestHelpers.createTestRequest('GET')
      
      const response = await EssentialPatterns.testApiRoute(mockHandler, request, 200)
      expect(response.status).toBe(200)
    })
    
    it('should test database operation using pattern', async () => {
      const operation = async () => {
        return TestHelpers.createTestUser()
      }
      
      const result = await EssentialPatterns.testDatabaseOperation(operation)
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
    })
    
    it('should test error scenario using pattern', () => {
      const errorFn = () => {
        throw new Error('Test error')
      }
      
      EssentialPatterns.testErrorScenario(errorFn, 'Test error')
    })
    
    it('should test async operation using pattern', async () => {
      const operation = async () => {
        return 'success'
      }
      
      const result = await EssentialPatterns.testAsyncOperation(operation, 'success')
      expect(result).toBe('success')
    })
  })
}

// Example: Using API Route Patterns
export const ApiRoutePatternsExample = () => {
  describe('API Route Patterns Examples', () => {
    it('should test GET request using pattern', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
      
      const response = await ApiRoutePatterns.testGet(mockHandler, 200)
      expect(response.status).toBe(200)
    })
    
    it('should test POST request using pattern', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 201 }))
      const body = { name: 'Test User' }
      
      const response = await ApiRoutePatterns.testPost(mockHandler, body, 201)
      expect(response.status).toBe(201)
    })
    
    it('should test authentication using pattern', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
      
      const response = await ApiRoutePatterns.testAuth(mockHandler, 'valid-token', 200)
      expect(response.status).toBe(200)
    })
    
    it('should test error scenario using pattern', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 }))
      
      const response = await ApiRoutePatterns.testError(mockHandler, 'POST', { name: '' }, 400)
      expect(response.status).toBe(400)
    })
  })
}

// Example: Using Database Patterns
export const DatabasePatternsExample = () => {
  describe('Database Patterns Examples', () => {
    it('should test create operation using pattern', async () => {
      const createFn = async () => {
        return TestHelpers.createTestUser({ id: 'new-id' })
      }
      
      const result = await DatabasePatterns.testCreate(createFn)
      expect(result).toHaveProperty('id')
      expect(result.id).toBe('new-id')
    })
    
    it('should test read operation using pattern', async () => {
      const readFn = async () => {
        return TestHelpers.createTestUser({ id: 'test-id' })
      }
      
      const result = await DatabasePatterns.testRead(readFn)
      expect(result).toHaveProperty('id')
      expect(result.id).toBe('test-id')
    })
    
    it('should test update operation using pattern', async () => {
      const updateFn = async () => {
        return TestHelpers.createTestUser({ id: 'test-id', firstName: 'Updated' })
      }
      
      const result = await DatabasePatterns.testUpdate(updateFn)
      expect(result.firstName).toBe('Updated')
    })
    
    it('should test delete operation using pattern', async () => {
      const deleteFn = async () => {
        return null
      }
      
      const result = await DatabasePatterns.testDelete(deleteFn)
      expect(result).toBeNull()
    })
  })
}
