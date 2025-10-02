# Unified Form System Documentation

## Overview

The Unified Form System provides a consistent, type-safe approach to form handling across the SpecChem Safety Training application. It replaces the previous inconsistent form patterns with a standardized solution that improves developer experience, user experience, and maintainability.

## Key Features

- **Type Safety**: Full TypeScript support with Zod validation schemas
- **Consistent API**: Unified interface across all forms
- **Accessibility**: Built-in accessibility features and ARIA support
- **Error Handling**: Standardized error display and management
- **Validation**: Real-time and submission-time validation
- **Performance**: Optimized re-renders and state management
- **Testing**: Comprehensive testing utilities and patterns

## Architecture

### Core Components

1. **useUnifiedForm Hook** - Main form state management
2. **FormField Component** - Standardized form field rendering
3. **Form Validation Schemas** - Centralized Zod schemas
4. **Form Components** - Error, success, loading, and submit components
5. **Migration Utilities** - Tools for migrating existing forms
6. **Testing Utilities** - Comprehensive testing helpers

### File Structure

```
src/
├── hooks/
│   └── useUnifiedForm.ts          # Main form hook
├── components/ui/
│   └── unified-form.tsx           # Form components
├── lib/schemas/
│   └── unified-form-schemas.ts    # Validation schemas
├── lib/utils/
│   ├── form-migration-utils.ts    # Migration tools
│   └── form-testing-utils.ts      # Testing utilities
└── __tests__/
    └── unified-form.test.ts       # Test suite
```

## Usage Guide

### Basic Form Setup

```typescript
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { loginFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'

export function LoginForm() {
  const form = useUnifiedForm({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginFormSchema,
    onSubmit: async (values) => {
      // Handle form submission
      await signIn(values.email, values.password)
    },
    onError: (error) => {
      console.error('Login error:', error)
    }
  })

  return (
    <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
      <FormField
        name="email"
        label="Email"
        type="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(value) => form.updateField('email', value)}
        onBlur={() => form.validateField('email')}
        required
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        value={form.values.password}
        error={form.errors.password}
        onChange={(value) => form.updateField('password', value)}
        onBlur={() => form.validateField('password')}
        required
      />

      {form.errors.submit && (
        <FormError error={form.errors.submit} />
      )}

      <FormSubmitButton
        isSubmitting={form.isSubmitting}
        disabled={!form.isDirty}
      >
        Sign In
      </FormSubmitButton>
    </FormContainer>
  )
}
```

### Form Field Types

The `FormField` component supports multiple input types:

```typescript
// Text input
<FormField
  name="firstName"
  label="First Name"
  type="text"
  value={form.values.firstName}
  error={form.errors.firstName}
  onChange={(value) => form.updateField('firstName', value)}
  required
/>

// Email input
<FormField
  name="email"
  label="Email"
  type="email"
  value={form.values.email}
  error={form.errors.email}
  onChange={(value) => form.updateField('email', value)}
  required
/>

// Password input
<FormField
  name="password"
  label="Password"
  type="password"
  value={form.values.password}
  error={form.errors.password}
  onChange={(value) => form.updateField('password', value)}
  required
/>

// Select dropdown
<FormField
  name="role"
  label="Role"
  type="select"
  options={[
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' }
  ]}
  value={form.values.role}
  error={form.errors.role}
  onChange={(value) => form.updateField('role', value)}
  required
/>

// Textarea
<FormField
  name="description"
  label="Description"
  type="textarea"
  value={form.values.description}
  error={form.errors.description}
  onChange={(value) => form.updateField('description', value)}
  rows={4}
/>
```

### Validation Schemas

Create validation schemas using Zod:

```typescript
import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  age: z
    .number()
    .min(18, "Must be at least 18 years old")
    .max(100, "Age must be less than 100"),
  agree: z.boolean().refine((val) => val === true, "Must agree to terms"),
});

export type UserForm = z.infer<typeof userFormSchema>;
```

### Form State Management

The `useUnifiedForm` hook provides comprehensive form state:

```typescript
const form = useUnifiedForm({
  initialValues: {
    /* ... */
  },
  validationSchema: schema,
  onSubmit: async (values) => {
    /* ... */
  },
  onError: (error) => {
    /* ... */
  },
});

// Available properties:
form.values; // Current form values
form.errors; // Current validation errors
form.isSubmitting; // Whether form is being submitted
form.isDirty; // Whether form has been modified
form.isValid; // Whether form is valid

// Available methods:
form.updateField(field, value); // Update a field value
form.validateField(field); // Validate a specific field
form.validateForm(); // Validate entire form
form.submitForm(); // Submit the form
form.resetForm(); // Reset to initial values
form.clearErrors(); // Clear all errors
form.setFieldError(field, error); // Set a field error manually
```

## Migration Guide

### From Manual State Management

**Before:**

```typescript
export function OldForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Manual validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      await signIn(email, password)
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}
```

**After:**

```typescript
export function NewForm() {
  const form = useUnifiedForm({
    initialValues: { email: '', password: '' },
    validationSchema: loginFormSchema,
    onSubmit: async (values) => {
      await signIn(values.email, values.password)
    }
  })

  return (
    <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
      <FormField
        name="email"
        label="Email"
        type="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(value) => form.updateField('email', value)}
        onBlur={() => form.validateField('email')}
        required
      />
      <FormField
        name="password"
        label="Password"
        type="password"
        value={form.values.password}
        error={form.errors.password}
        onChange={(value) => form.updateField('password', value)}
        onBlur={() => form.validateField('password')}
        required
      />
      {form.errors.submit && <FormError error={form.errors.submit} />}
      <FormSubmitButton
        isSubmitting={form.isSubmitting}
        disabled={!form.isDirty}
      >
        Sign In
      </FormSubmitButton>
    </FormContainer>
  )
}
```

### From useAdminForm

**Before:**

```typescript
export function OldAdminForm() {
  const form = useAdminForm({
    initialData: { name: '', email: '' },
    validationSchema: schema,
    onSubmit: async (data) => {
      await createUser(data)
    }
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
      <input
        value={form.formState.data.name}
        onChange={(e) => form.updateField('name', e.target.value)}
      />
      <input
        value={form.formState.data.email}
        onChange={(e) => form.updateField('email', e.target.value)}
      />
      <button disabled={form.formState.isSubmitting}>
        Submit
      </button>
    </form>
  )
}
```

**After:**

```typescript
export function NewAdminForm() {
  const form = useUnifiedForm({
    initialValues: { name: '', email: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      await createUser(values)
    }
  })

  return (
    <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
      <FormField
        name="name"
        label="Name"
        value={form.values.name}
        error={form.errors.name}
        onChange={(value) => form.updateField('name', value)}
        onBlur={() => form.validateField('name')}
        required
      />
      <FormField
        name="email"
        label="Email"
        type="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(value) => form.updateField('email', value)}
        onBlur={() => form.validateField('email')}
        required
      />
      <FormSubmitButton
        isSubmitting={form.isSubmitting}
        disabled={!form.isDirty}
      >
        Submit
      </FormSubmitButton>
    </FormContainer>
  )
}
```

## Testing

### Unit Testing Forms

```typescript
import { renderHook, act } from "@testing-library/react";
import { useUnifiedForm } from "@/hooks/useUnifiedForm";
import { loginFormSchema } from "@/lib/schemas/unified-form-schemas";
import {
  createTestFormHook,
  simulateFormSubmission,
  expectFormState,
  testValidFormSubmission,
} from "@/lib/utils/form-testing-utils";

describe("LoginForm", () => {
  it("should submit valid form", async () => {
    const onSubmit = jest.fn();
    const { result } = createTestFormHook({
      initialValues: { email: "", password: "" },
      validationSchema: loginFormSchema,
      onSubmit,
    });

    await testValidFormSubmission(
      result,
      { email: "test@example.com", password: "password123" },
      onSubmit,
    );
  });
});
```

### Integration Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/LoginForm'

describe('LoginForm Integration', () => {
  it('should handle successful login', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    })
  })
})
```

## Best Practices

### 1. Schema Design

- Use descriptive error messages
- Validate on both client and server
- Keep schemas focused and reusable

```typescript
// Good
export const userFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    ),
});

// Avoid
export const userFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### 2. Error Handling

- Provide clear, actionable error messages
- Handle both validation and submission errors
- Use consistent error display patterns

```typescript
const form = useUnifiedForm({
  initialValues: { email: "", password: "" },
  validationSchema: loginFormSchema,
  onSubmit: async (values) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      // Let the hook handle the error display
      throw error;
    }
  },
  onError: (error) => {
    // Log error for debugging
    console.error("Login error:", error);
  },
});
```

### 3. Accessibility

- Always provide labels for form fields
- Use proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers

```typescript
<FormField
  name="email"
  label="Email Address"  // Clear, descriptive label
  type="email"
  value={form.values.email}
  error={form.errors.email}
  onChange={(value) => form.updateField('email', value)}
  onBlur={() => form.validateField('email')}
  required  // Indicates required field
  disabled={form.isSubmitting}  // Prevents interaction during submission
/>
```

### 4. Performance

- Use `useCallback` for event handlers
- Minimize re-renders with proper dependency arrays
- Consider form splitting for large forms

```typescript
// Good - stable references
const handleEmailChange = useCallback(
  (value: string) => {
    form.updateField("email", value);
  },
  [form.updateField],
);

// Avoid - recreates on every render
const handleEmailChange = (value: string) => {
  form.updateField("email", value);
};
```

## Troubleshooting

### Common Issues

1. **Form not submitting**
   - Check if `onSubmit` is properly defined
   - Ensure form validation passes
   - Verify `submitForm()` is called

2. **Validation not working**
   - Verify schema is properly imported
   - Check field names match schema keys
   - Ensure validation is triggered

3. **Errors not displaying**
   - Check if error state is properly set
   - Verify `FormError` component is used
   - Ensure error messages are defined in schema

4. **Type errors**
   - Verify TypeScript types are properly exported
   - Check schema and form values match
   - Ensure proper type annotations

### Debug Tools

```typescript
// Add debugging to form hook
const form = useUnifiedForm({
  initialValues: { email: "", password: "" },
  validationSchema: loginFormSchema,
  onSubmit: async (values) => {
    console.log("Submitting:", values);
    await signIn(values.email, values.password);
  },
  onError: (error) => {
    console.error("Form error:", error);
  },
});

// Debug form state
console.log("Form state:", {
  values: form.values,
  errors: form.errors,
  isSubmitting: form.isSubmitting,
  isDirty: form.isDirty,
  isValid: form.isValid,
});
```

## Migration Checklist

- [ ] Identify all existing forms
- [ ] Create validation schemas for each form
- [ ] Replace manual state management with `useUnifiedForm`
- [ ] Update form components to use `FormField`
- [ ] Replace custom error handling with `FormError`
- [ ] Update submit buttons to use `FormSubmitButton`
- [ ] Add proper accessibility attributes
- [ ] Write tests for migrated forms
- [ ] Remove old form utilities and hooks
- [ ] Update documentation

## Future Enhancements

- **Form Persistence**: Auto-save form data
- **Multi-step Forms**: Support for wizard-style forms
- **File Upload**: Built-in file upload handling
- **Form Analytics**: Track form interaction metrics
- **Advanced Validation**: Conditional validation rules
- **Form Templates**: Pre-built form templates for common use cases

This unified form system provides a solid foundation for consistent, maintainable form handling across the application while improving both developer and user experience.
