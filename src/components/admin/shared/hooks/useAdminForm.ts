import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface FormOptions<T> {
  initialData: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
}

export function useAdminForm<T>(
  options: FormOptions<T>
) {
  const [formState, setFormState] = useState<FormState<T>>({
    data: options.initialData,
    errors: {},
    isDirty: false,
    isValid: false,
    isSubmitting: false
  });

  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value
      },
      isDirty: true
    }));
  }, []);

  const validateField = useCallback((field: keyof T) => {
    try {
      // Validate the entire form and extract field-specific errors
      options.validationSchema.parse(formState.data);
      
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: ''
        }
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(err => err.path.includes(field as string));
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: fieldError?.message || 'Invalid value'
          }
        }));
      }
    }
  }, [formState.data, options.validationSchema]);

  const validateForm = useCallback(() => {
    try {
      options.validationSchema.parse(formState.data);
      
      setFormState(prev => ({
        ...prev,
        errors: {},
        isValid: true
      }));
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        
        setFormState(prev => ({
          ...prev,
          errors,
          isValid: false
        }));
      }
      
      return false;
    }
  }, [formState.data, options.validationSchema]);

  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }
    
    setFormState(prev => ({
      ...prev,
      isSubmitting: true
    }));
    
    try {
      await options.onSubmit(formState.data);
      
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        isDirty: false
      }));
      
      return true;
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        errors: {
          ...prev.errors,
          submit: error instanceof Error ? error.message : 'Submission failed'
        }
      }));
      
      return false;
    }
  }, [formState.data, validateForm, options.onSubmit]);

  const resetForm = useCallback(() => {
    setFormState({
      data: options.initialData,
      errors: {},
      isDirty: false,
      isValid: false,
      isSubmitting: false
    });
  }, [options.initialData]);

  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      errors: {}
    }));
  }, []);

  return {
    formState,
    updateField,
    validateField,
    validateForm,
    submitForm,
    resetForm,
    clearErrors
  };
}
