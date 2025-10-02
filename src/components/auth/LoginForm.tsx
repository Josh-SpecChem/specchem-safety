'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { loginFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { LoginForm } from '@/lib/schemas/unified-form-schemas'

export function LoginForm() {
  const { signIn } = useAuth()

  const form = useUnifiedForm({
    initialValues: {
      email: '',
      password: ''
    } as LoginForm,
    validationSchema: loginFormSchema,
    onSubmit: async (values: LoginForm) => {
      const result = await signIn(values.email, values.password)
      
      if (result.error) {
        throw new Error(result.error)
      }
      // Success will be handled by auth context and middleware redirect
    },
    onError: (error: Error) => {
      console.error('Login error:', error)
    }
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
          {form.errors.submit && (
            <FormError error={form.errors.submit} />
          )}
          
          <FormField
            name="email"
            label="Email"
            type="email"
            value={form.values.email}
            error={form.errors.email}
            onChange={(value) => form.updateField('email', value as string)}
            onBlur={() => form.validateField('email')}
            placeholder="Enter your email"
            disabled={form.isSubmitting}
            required
          />
          
          <FormField
            name="password"
            label="Password"
            type="password"
            value={form.values.password}
            error={form.errors.password}
            onChange={(value) => form.updateField('password', value as string)}
            onBlur={() => form.validateField('password')}
            placeholder="Enter your password"
            disabled={form.isSubmitting}
            required
          />
          
          <FormSubmitButton
            isSubmitting={form.isSubmitting}
            disabled={!form.isDirty}
            loadingText="Signing In..."
          >
            Sign In
          </FormSubmitButton>
          
          <div className="text-center text-sm text-gray-600">
            <Link 
              href="/forgot-password" 
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </FormContainer>
      </CardContent>
    </Card>
  )
}