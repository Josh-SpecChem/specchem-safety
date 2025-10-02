'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { signupFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSuccess, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { SignupForm } from '@/lib/schemas/unified-form-schemas'

export function SignupForm() {
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const form = useUnifiedForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      jobTitle: ''
    } as SignupForm,
    validationSchema: signupFormSchema,
    onSubmit: async (values: SignupForm) => {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            job_title: values.jobTitle || null
          }
        }
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      if (data.user) {
        setSuccess(true)
        // The user profile will be created automatically by our trigger
        // Redirect to a confirmation page or login
        setTimeout(() => {
          router.push('/login?message=Please check your email to confirm your account')
        }, 2000)
      }
    },
    onError: (error: Error) => {
      console.error('Signup error:', error)
    }
  })

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-green-600">Account Created!</CardTitle>
          <CardDescription className="text-center">
            Your account has been successfully created
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Please check your email to verify your account before signing in.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Go to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Sign up to access your training dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
          {form.errors.submit && (
            <FormError error={form.errors.submit} />
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="firstName"
              label="First Name"
              value={form.values.firstName}
              error={form.errors.firstName}
              onChange={(value) => form.updateField('firstName', value as string)}
              onBlur={() => form.validateField('firstName')}
              disabled={form.isSubmitting}
              required
            />
            
            <FormField
              name="lastName"
              label="Last Name"
              value={form.values.lastName}
              error={form.errors.lastName}
              onChange={(value) => form.updateField('lastName', value as string)}
              onBlur={() => form.validateField('lastName')}
              disabled={form.isSubmitting}
              required
            />
          </div>
          
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
            name="jobTitle"
            label="Job Title"
            value={form.values.jobTitle}
            error={form.errors.jobTitle}
            onChange={(value) => form.updateField('jobTitle', value as string)}
            onBlur={() => form.validateField('jobTitle')}
            placeholder="Enter your job title (optional)"
            disabled={form.isSubmitting}
          />
          
          <FormField
            name="password"
            label="Password"
            type="password"
            value={form.values.password}
            error={form.errors.password}
            onChange={(value) => form.updateField('password', value as string)}
            onBlur={() => form.validateField('password')}
            placeholder="At least 8 characters with uppercase, lowercase, and number"
            disabled={form.isSubmitting}
            required
          />
          
          <FormField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.values.confirmPassword}
            error={form.errors.confirmPassword}
            onChange={(value) => form.updateField('confirmPassword', value as string)}
            onBlur={() => form.validateField('confirmPassword')}
            placeholder="Confirm your password"
            disabled={form.isSubmitting}
            required
          />
          
          <FormSubmitButton
            isSubmitting={form.isSubmitting}
            disabled={!form.isDirty}
            loadingText="Creating Account..."
          >
            Create Account
          </FormSubmitButton>
          
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </FormContainer>
      </CardContent>
    </Card>
  )
}