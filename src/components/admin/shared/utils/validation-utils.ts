import { z } from 'zod';

export class ValidationUtils {
  static emailSchema = z.string().email('Invalid email address');
  
  static passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');
  
  static phoneSchema = z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in format (XXX) XXX-XXXX');
  
  static nameSchema = z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters');
  
  static requiredStringSchema = z.string().min(1, 'This field is required');
  
  static optionalStringSchema = z.string().optional();
  
  static booleanSchema = z.boolean();
  
  static numberSchema = z.number().min(0, 'Number must be positive');
  
  static dateSchema = z.date();
  
  static urlSchema = z.string().url('Invalid URL');
  
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    try {
      this.emailSchema.parse(email);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.issues[0]?.message || 'Invalid email' };
      }
      return { isValid: false, error: 'Invalid email' };
    }
  }
  
  static validatePassword(password: string): { isValid: boolean; error?: string } {
    try {
      this.passwordSchema.parse(password);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.issues[0]?.message || 'Invalid password' };
      }
      return { isValid: false, error: 'Invalid password' };
    }
  }
  
  static validatePhone(phone: string): { isValid: boolean; error?: string } {
    try {
      this.phoneSchema.parse(phone);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.issues[0]?.message || 'Invalid phone number' };
      }
      return { isValid: false, error: 'Invalid phone number' };
    }
  }
  
  static validateRequired(value: unknown): { isValid: boolean; error?: string } {
    try {
      this.requiredStringSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.issues[0]?.message || 'This field is required' };
      }
      return { isValid: false, error: 'This field is required' };
    }
  }
  
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
  
  static sanitizeHtml(input: string): string {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
}
