import { z } from 'zod';

/**
 * Unified Form Validation Schemas
 * 
 * Centralized validation schemas for all forms in the application.
 * These schemas work with the unified form system to provide consistent validation.
 */

// ========================================
// AUTHENTICATION FORM SCHEMAS
// ========================================

export const loginFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
});

export const signupFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  jobTitle: z.string()
    .max(100, 'Job title is too long')
    .optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
});

export const resetPasswordFormSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ========================================
// PROFILE FORM SCHEMAS
// ========================================

export const profileUpdateFormSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  jobTitle: z.string()
    .max(100, 'Job title is too long')
    .optional(),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
});

// ========================================
// ADMIN FORM SCHEMAS
// ========================================

export const adminCreateUserFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  jobTitle: z.string()
    .max(100, 'Job title is too long')
    .optional(),
  role: z.enum(['employee', 'plant_manager', 'hr_admin'], {
    message: 'Please select a valid role'
  }),
  plantId: z.string()
    .min(1, 'Please select a plant')
    .uuid('Please select a valid plant')
});

export const adminUpdateUserFormSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  jobTitle: z.string()
    .max(100, 'Job title is too long')
    .optional(),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  status: z.enum(['active', 'suspended'], {
    message: 'Please select a valid status'
  }),
  plantId: z.string()
    .min(1, 'Please select a plant')
    .uuid('Please select a valid plant')
});

export const adminCreatePlantFormSchema = z.object({
  name: z.string()
    .min(1, 'Plant name is required')
    .max(100, 'Plant name is too long'),
  isActive: z.boolean().default(true)
});

export const adminUpdatePlantFormSchema = z.object({
  name: z.string()
    .min(1, 'Plant name is required')
    .max(100, 'Plant name is too long'),
  isActive: z.boolean()
});

export const adminCreateCourseFormSchema = z.object({
  slug: z.string()
    .min(1, 'Course slug is required')
    .max(100, 'Course slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Course slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string()
    .min(1, 'Course title is required')
    .max(200, 'Course title is too long'),
  version: z.string()
    .min(1, 'Version is required')
    .max(20, 'Version is too long'),
  isPublished: z.boolean().default(false)
});

export const adminUpdateCourseFormSchema = z.object({
  slug: z.string()
    .min(1, 'Course slug is required')
    .max(100, 'Course slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Course slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string()
    .min(1, 'Course title is required')
    .max(200, 'Course title is too long'),
  version: z.string()
    .min(1, 'Version is required')
    .max(20, 'Version is too long'),
  isPublished: z.boolean()
});

export const adminCreateEnrollmentFormSchema = z.object({
  userId: z.string()
    .min(1, 'Please select a user')
    .uuid('Please select a valid user'),
  courseId: z.string()
    .min(1, 'Please select a course')
    .uuid('Please select a valid course'),
  plantId: z.string()
    .min(1, 'Please select a plant')
    .uuid('Please select a valid plant'),
  status: z.enum(['enrolled', 'in_progress', 'completed'], {
    message: 'Please select a valid status'
  }).default('enrolled')
});

export const adminUpdateEnrollmentFormSchema = z.object({
  status: z.enum(['enrolled', 'in_progress', 'completed'], {
    message: 'Please select a valid status'
  }),
  completedAt: z.string().datetime().nullable().optional()
});

// ========================================
// SEARCH AND FILTER SCHEMAS
// ========================================

export const searchFormSchema = z.object({
  query: z.string()
    .max(100, 'Search query is too long')
    .optional(),
  category: z.string()
    .max(50, 'Category is too long')
    .optional(),
  status: z.string()
    .max(50, 'Status is too long')
    .optional()
});

export const filterFormSchema = z.object({
  plantId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: z.string().max(50).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50)
});

// ========================================
// CONTACT AND FEEDBACK SCHEMAS
// ========================================

export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject is too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long')
});

export const feedbackFormSchema = z.object({
  rating: z.number()
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be between 1 and 5'),
  comment: z.string()
    .max(500, 'Comment is too long')
    .optional(),
  category: z.enum(['bug', 'feature', 'improvement', 'other'], {
    message: 'Please select a valid category'
  })
});

// ========================================
// TYPE EXPORTS
// ========================================

export type LoginForm = z.infer<typeof loginFormSchema>;
export type SignupForm = z.infer<typeof signupFormSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
export type ProfileUpdateForm = z.infer<typeof profileUpdateFormSchema>;
export type AdminCreateUserForm = z.infer<typeof adminCreateUserFormSchema>;
export type AdminUpdateUserForm = z.infer<typeof adminUpdateUserFormSchema>;
export type AdminCreatePlantForm = z.infer<typeof adminCreatePlantFormSchema>;
export type AdminUpdatePlantForm = z.infer<typeof adminUpdatePlantFormSchema>;
export type AdminCreateCourseForm = z.infer<typeof adminCreateCourseFormSchema>;
export type AdminUpdateCourseForm = z.infer<typeof adminUpdateCourseFormSchema>;
export type AdminCreateEnrollmentForm = z.infer<typeof adminCreateEnrollmentFormSchema>;
export type AdminUpdateEnrollmentForm = z.infer<typeof adminUpdateEnrollmentFormSchema>;
export type SearchForm = z.infer<typeof searchFormSchema>;
export type FilterForm = z.infer<typeof filterFormSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type FeedbackForm = z.infer<typeof feedbackFormSchema>;

// ========================================
// VALIDATION HELPERS
// ========================================

export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .safeParse(password).success;
};

export const validateUUID = (uuid: string): boolean => {
  return z.string().uuid().safeParse(uuid).success;
};

export const validateRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// ========================================
// SCHEMA VALIDATION UTILITIES
// ========================================

export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

export const getFieldError = (errors: Record<string, string>, fieldName: string): string | undefined => {
  return errors[fieldName];
};

export const hasFormErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};
