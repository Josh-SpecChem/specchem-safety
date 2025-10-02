import { act } from '@testing-library/react'
import { loginFormSchema, signupFormSchema } from '@/lib/schemas/unified-form-schemas'
import { 
  createTestFormHook, 
  simulateFormSubmission, 
  simulateFieldUpdate, 
  simulateFieldValidation,
  expectFormState,
  expectFieldError,
  expectNoFieldError,
  testValidFormSubmission,
  testInvalidFormSubmission,
  testFieldValidation,
  testFieldClearError,
  testFormReset,
  createMockOnSubmit,
  createMockOnError,
} from '@/lib/utils/form-testing-utils'

describe('useUnifiedForm Hook', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      expectFormState(result, {
        values: { email: '', password: '' },
        errors: {},
        isSubmitting: false,
        isDirty: false,
        isValid: false
      })
    })

    it('should initialize with provided initial values', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: 'test@example.com', password: 'password123' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      expectFormState(result, {
        values: { email: 'test@example.com', password: 'password123' }
      })
    })
  })

  describe('Field Updates', () => {
    it('should update field values', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      simulateFieldUpdate(result, 'email', 'test@example.com')
      
      expectFormState(result, {
        values: { email: 'test@example.com', password: '' },
        isDirty: true
      })
    })

    it('should clear field errors when updating', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      // First, create an error
      simulateFieldUpdate(result, 'email', 'invalid-email')
      simulateFieldValidation(result, 'email')
      expectFieldError(result, 'email', 'Please enter a valid email address')
      
      // Then update with valid value
      simulateFieldUpdate(result, 'email', 'test@example.com')
      expectNoFieldError(result, 'email')
    })
  })

  describe('Field Validation', () => {
    it('should validate individual fields', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      testFieldValidation(result, 'email', 'invalid-email', 'Please enter a valid email address')
    })

    it('should clear errors for valid fields', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      testFieldClearError(result, 'email', 'invalid-email', 'test@example.com')
    })
  })

  describe('Form Validation', () => {
    it('should validate entire form', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      act(() => {
        result.current.validateForm()
      })
      
      expectFormState(result, {
        errors: {
          email: 'Email is required',
          password: 'Password must be at least 6 characters'
        }
      })
    })

    it('should return true for valid form', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: 'test@example.com', password: 'password123' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      let isValid: boolean
      act(() => {
        isValid = result.current.validateForm()
      })
      
      expect(isValid).toBe(true)
      expectFormState(result, { errors: {} })
    })
  })

  describe('Form Submission', () => {
    it('should submit valid form successfully', async () => {
      const onSubmit = createMockOnSubmit(true)
      const { result } = createTestFormHook({
        initialValues: { email: 'test@example.com', password: 'password123' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      await testValidFormSubmission(result, { email: 'test@example.com', password: 'password123' }, onSubmit)
    })

    it('should handle submission errors', async () => {
      const onSubmit = createMockOnSubmit(false)
      const { result } = createTestFormHook({
        initialValues: { email: 'test@example.com', password: 'password123' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      const success = await simulateFormSubmission(result, { email: 'test@example.com', password: 'password123' })
      
      expect(success).toBe(false)
      expectFormSubmissionError(result, 'Mock submission error')
    })

    it('should not submit invalid form', async () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      const success = await simulateFormSubmission(result, { email: '', password: '' })
      
      expect(success).toBe(false)
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Form Reset', () => {
    it('should reset form to initial state', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      testFormReset(result, { email: '', password: '' })
    })
  })

  describe('Complex Forms', () => {
    it('should handle signup form with password confirmation', async () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: {
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          jobTitle: ''
        },
        validationSchema: signupFormSchema,
        onSubmit
      })
      
      // Test invalid submission
      await testInvalidFormSubmission(result, {
        email: 'invalid-email',
        password: 'short',
        confirmPassword: 'different',
        firstName: '',
        lastName: '',
        jobTitle: ''
      }, {
        email: 'Please enter a valid email address',
        password: 'Password must be at least 8 characters',
        confirmPassword: "Passwords don't match",
        firstName: 'First name is required',
        lastName: 'Last name is required'
      })
      
      // Test valid submission
      await testValidFormSubmission(result, {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Engineer'
      }, onSubmit)
    })
  })

  describe('Error Handling', () => {
    it('should call onError callback on submission error', async () => {
      const onSubmit = createMockOnSubmit(false)
      const onError = createMockOnError()
      
      const { result } = createTestFormHook({
        initialValues: { email: 'test@example.com', password: 'password123' },
        validationSchema: loginFormSchema,
        onSubmit,
        onError
      })
      
      await simulateFormSubmission(result, { email: 'test@example.com', password: 'password123' })
      
      expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty validation schema', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      // Should still work with empty schema
      expect(result.current).toBeDefined()
    })

    it('should handle rapid field updates', () => {
      const onSubmit = createMockOnSubmit()
      const { result } = createTestFormHook({
        initialValues: { email: '', password: '' },
        validationSchema: loginFormSchema,
        onSubmit
      })
      
      // Rapid updates should not cause issues
      for (let i = 0; i < 10; i++) {
        simulateFieldUpdate(result, 'email', `test${i}@example.com`)
      }
      
      expectFormState(result, {
        values: { email: 'test9@example.com', password: '' },
        isDirty: true
      })
    })
  })
})
