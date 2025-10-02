import { useState, useCallback } from 'react';
import { z } from 'zod';
import type { FormConfig, FormState, FormActions } from '@/types/hooks';

/**
 * Unified Form Hook - Standardized form state management across the application
 * 
 * This hook provides a consistent interface for form handling, validation,
 * and error management across all components.
 */

export function useUnifiedForm<T>(config: FormConfig<T>) {
  const [values, setValues] = useState<T>(config.initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear field error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);
  
  const validateField = useCallback((field: keyof T) => {
    try {
      const fieldValue = values[field];
      const fieldSchema = (config.validationSchema as any).shape?.[field as string];
      
      if (fieldSchema) {
        fieldSchema.parse(fieldValue);
        setErrors(prev => ({ ...prev, [field as string]: '' }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ 
          ...prev, 
          [field as string]: error.issues[0]?.message || 'Invalid value' 
        }));
      }
    }
  }, [values, config.validationSchema]);
  
  const validateForm = useCallback(() => {
    try {
      config.validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, config.validationSchema]);
  
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }
    
    setIsSubmitting(true);
    try {
      await config.onSubmit(values);
      setIsDirty(false);
      return true;
    } catch (error) {
      if (config.onError) {
        config.onError(error as Error);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, config]);
  
  const resetForm = useCallback(() => {
    setValues(config.initialValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [config.initialValues]);
  
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);
  
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);
  
  const formState: FormState<T> = {
    values,
    errors,
    isSubmitting,
    isDirty,
    isValid: Object.keys(errors).length === 0,
  };
  
  const formActions: FormActions<T> = {
    updateField,
    validateField,
    validateForm,
    submitForm,
    resetForm,
    clearErrors,
    setFieldError,
  };
  
  return {
    ...formState,
    ...formActions,
  };
}