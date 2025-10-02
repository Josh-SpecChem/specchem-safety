import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Unified Form Field Component - Standardized form field across the application
 * 
 * Provides consistent styling, validation, and accessibility for all form fields.
 */

export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  value: unknown;
  error?: string | undefined;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  options,
  value,
  error,
  onChange,
  onBlur,
  disabled,
  className,
  description,
  min,
  max,
  step,
  rows = 3
}: FormFieldProps) {
  const fieldId = `field-${name}`;
  
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {type === 'select' ? (
        <Select
          value={typeof value === 'string' ? value : ''}
          onValueChange={onChange}
          disabled={disabled || false}
        >
          <SelectTrigger 
            id={fieldId}
            className={cn(
              'w-full',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          >
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === 'textarea' ? (
        <Textarea
          id={fieldId}
          name={name}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
        />
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={type}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-full',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
        />
      )}
      
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Form Error Display Component
 */
export interface FormErrorProps {
  error: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <div className={cn(
      'p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md',
      className
    )}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    </div>
  );
}

/**
 * Form Success Display Component
 */
export interface FormSuccessProps {
  message: string;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null;
  
  return (
    <div className={cn(
      'p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md',
      className
    )}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {message}
      </div>
    </div>
  );
}

/**
 * Form Loading State Component
 */
export interface FormLoadingProps {
  message?: string;
  className?: string;
}

export function FormLoading({ message = 'Processing...', className }: FormLoadingProps) {
  return (
    <div className={cn(
      'p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md',
      className
    )}>
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        {message}
      </div>
    </div>
  );
}

/**
 * Form Submit Button Component
 */
export interface FormSubmitButtonProps {
  children: React.ReactNode;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export function FormSubmitButton({
  children,
  isSubmitting = false,
  disabled = false,
  className,
  loadingText = 'Submitting...'
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      className={cn(
        'w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Form Container Component
 */
export interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function FormContainer({ children, onSubmit, className }: FormContainerProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      {children}
    </form>
  );
}
