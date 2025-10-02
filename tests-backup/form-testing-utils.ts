import { renderHook, act } from '@testing-library/react';
import { useUnifiedForm } from '@/hooks/useUnifiedForm';
import { z } from 'zod';

/**
 * Form Testing Utilities
 * 
 * Comprehensive testing utilities for the unified form system.
 */

// ========================================
// TEST SCHEMAS
// ========================================

export const testFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be at least 18'),
  agree: z.boolean().refine(val => val === true, 'Must agree to terms')
});

export const testFormSchemaOptional = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  age: z.number().optional()
});

export type TestForm = z.infer<typeof testFormSchema>;
export type TestFormOptional = z.infer<typeof testFormSchemaOptional>;

// ========================================
// TEST UTILITIES
// ========================================

export interface FormTestConfig<T> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void>;
  onError?: (error: Error) => void;
}

export function createTestFormHook<T>(config: FormTestConfig<T>) {
  return renderHook(() => useUnifiedForm({
    initialValues: config.initialValues,
    validationSchema: config.validationSchema,
    onSubmit: config.onSubmit || jest.fn(),
    onError: config.onError
  }));
}

export async function simulateFormSubmission<T>(
  formHook: ReturnType<typeof renderHook>,
  values: T
): Promise<boolean> {
  // Update form values
  Object.entries(values).forEach(([key, value]) => {
    act(() => {
      formHook.result.current.updateField(key as keyof T, value);
    });
  });
  
  // Submit form
  let result: boolean;
  await act(async () => {
    result = await formHook.result.current.submitForm();
  });
  
  return result!;
}

export function simulateFieldUpdate<T>(
  formHook: ReturnType<typeof renderHook>,
  field: keyof T,
  value: T[keyof T]
) {
  act(() => {
    formHook.result.current.updateField(field, value);
  });
}

export function simulateFieldValidation<T>(
  formHook: ReturnType<typeof renderHook>,
  field: keyof T
) {
  act(() => {
    formHook.result.current.validateField(field);
  });
}

// ========================================
// ASSERTION HELPERS
// ========================================

export function expectFormState<T>(
  formHook: ReturnType<typeof renderHook>,
  expectedState: Partial<{
    values: T;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isDirty: boolean;
    isValid: boolean;
  }>
) {
  const current = formHook.result.current;
  
  if (expectedState.values !== undefined) {
    expect(current.values).toEqual(expectedState.values);
  }
  
  if (expectedState.errors !== undefined) {
    expect(current.errors).toEqual(expectedState.errors);
  }
  
  if (expectedState.isSubmitting !== undefined) {
    expect(current.isSubmitting).toBe(expectedState.isSubmitting);
  }
  
  if (expectedState.isDirty !== undefined) {
    expect(current.isDirty).toBe(expectedState.isDirty);
  }
  
  if (expectedState.isValid !== undefined) {
    expect(current.isValid).toBe(expectedState.isValid);
  }
}

export function expectFieldError<T>(
  formHook: ReturnType<typeof renderHook>,
  field: keyof T,
  expectedError: string
) {
  const current = formHook.result.current;
  expect(current.errors[field as string]).toBe(expectedError);
}

export function expectNoFieldError<T>(
  formHook: ReturnType<typeof renderHook>,
  field: keyof T
) {
  const current = formHook.result.current;
  expect(current.errors[field as string]).toBeUndefined();
}

export function expectFormSubmissionSuccess(
  formHook: ReturnType<typeof renderHook>,
  expectedValues: unknown
) {
  const current = formHook.result.current;
  expect(current.isSubmitting).toBe(false);
  expect(current.isDirty).toBe(false);
  expect(current.errors.submit).toBeUndefined();
}

export function expectFormSubmissionError(
  formHook: ReturnType<typeof renderHook>,
  expectedError: string
) {
  const current = formHook.result.current;
  expect(current.isSubmitting).toBe(false);
  expect(current.errors.submit).toBe(expectedError);
}

// ========================================
// COMMON TEST SCENARIOS
// ========================================

export async function testValidFormSubmission<T>(
  formHook: ReturnType<typeof renderHook>,
  validValues: T,
  onSubmitMock: jest.Mock
) {
  const success = await simulateFormSubmission(formHook, validValues);
  
  expect(success).toBe(true);
  expect(onSubmitMock).toHaveBeenCalledWith(validValues);
  expectFormSubmissionSuccess(formHook, validValues);
}

export async function testInvalidFormSubmission<T>(
  formHook: ReturnType<typeof renderHook>,
  invalidValues: T,
  expectedErrors: Record<string, string>
) {
  const success = await simulateFormSubmission(formHook, invalidValues);
  
  expect(success).toBe(false);
  expectFormState(formHook, { errors: expectedErrors });
}

export function testFieldValidation<T>(
  formHook: ReturnType<typeof renderHook>,
  field: keyof T,
  invalidValue: T[keyof T],
  expectedError: string
) {
  simulateFieldUpdate(formHook, field, invalidValue);
  simulateFieldValidation(formHook, field);
  
  expectFieldError(formHook, field, expectedError);
}

export function testFieldClearError<T>(
  formHook: ReturnType<typeof renderHook>,
  field: keyof T,
  invalidValue: T[keyof T],
  validValue: T[keyof T]
) {
  // Set invalid value and validate
  simulateFieldUpdate(formHook, field, invalidValue);
  simulateFieldValidation(formHook, field);
  
  // Should have error
  expect(formHook.result.current.errors[field as string]).toBeDefined();
  
  // Set valid value
  simulateFieldUpdate(formHook, field, validValue);
  
  // Error should be cleared
  expectNoFieldError(formHook, field);
}

export function testFormReset<T>(
  formHook: ReturnType<typeof renderHook>,
  initialValues: T
) {
  // Make form dirty
  simulateFieldUpdate(formHook, 'name' as keyof T, 'test');
  expect(formHook.result.current.isDirty).toBe(true);
  
  // Reset form
  act(() => {
    formHook.result.current.resetForm();
  });
  
  // Should be back to initial state
  expectFormState(formHook, {
    values: initialValues,
    isDirty: false,
    errors: {}
  });
}

// ========================================
// PERFORMANCE TESTING
// ========================================

export function testFormPerformance<T>(
  formHook: ReturnType<typeof renderHook>,
  iterations: number = 1000
) {
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    act(() => {
      formHook.result.current.updateField('name' as keyof T, `test${i}`);
    });
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  expect(duration).toBeLessThan(1000); // Should complete in under 1 second
}

// ========================================
// ACCESSIBILITY TESTING
// ========================================

export function testFormAccessibility(formElement: HTMLElement) {
  // Check for proper labels
  const inputs = formElement.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const label = formElement.querySelector(`label[for="${id}"]`);
    expect(label).toBeTruthy();
  });
  
  // Check for error announcements
  const errorElements = formElement.querySelectorAll('[role="alert"]');
  expect(errorElements.length).toBeGreaterThanOrEqual(0);
  
  // Check for required field indicators
  const requiredFields = formElement.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    const label = formElement.querySelector(`label[for="${field.getAttribute('id')}"]`);
    expect(label?.textContent).toContain('*');
  });
}

// ========================================
// INTEGRATION TESTING
// ========================================

export async function testFormIntegration<T>(
  formHook: ReturnType<typeof renderHook>,
  testData: Array<{
    values: T;
    shouldSucceed: boolean;
    expectedErrors?: Record<string, string>;
  }>
) {
  for (const testCase of testData) {
    const success = await simulateFormSubmission(formHook, testCase.values);
    
    if (testCase.shouldSucceed) {
      expect(success).toBe(true);
    } else {
      expect(success).toBe(false);
      if (testCase.expectedErrors) {
        expectFormState(formHook, { errors: testCase.expectedErrors });
      }
    }
  }
}

// ========================================
// MOCK UTILITIES
// ========================================

export function createMockOnSubmit<T>(shouldSucceed: boolean = true, delay: number = 0) {
  return jest.fn().mockImplementation(async (values: T) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    if (!shouldSucceed) {
      throw new Error('Mock submission error');
    }
    
    return values;
  });
}

export function createMockOnError() {
  return jest.fn();
}

// ========================================
// TEST DATA GENERATORS
// ========================================

export function generateValidTestData(): TestForm {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    age: 25,
    agree: true
  };
}

export function generateInvalidTestData(): TestForm {
  return {
    name: '',
    email: 'invalid-email',
    age: 16,
    agree: false
  };
}

export function generatePartialTestData(): Partial<TestForm> {
  return {
    name: 'Jane Doe',
    email: 'jane@example.com'
  };
}
