'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { forgotPasswordFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSuccess, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { ForgotPasswordForm } from '@/lib/schemas/unified-form-schemas'

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false)

  const form = useUnifiedForm({
    initialValues: {
      email: ''
    } as ForgotPasswordForm,
    validationSchema: forgotPasswordFormSchema,
    onSubmit: async (values: ForgotPasswordForm) => {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw new Error(error.message)
      }

      setSuccess(true)
    },
    onError: (error: Error) => {
      console.error('Password reset error:', error)
    }
  })

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-green-600">Email Sent!</CardTitle>
          <CardDescription className="text-center">
            Check your email for password reset instructions
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            We&apos;ve sent password reset instructions to <strong>{form.values.email}</strong>. 
            Please check your inbox and follow the link to reset your password.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Back to Login
            </Link>
            <button
              onClick={() => {
                setSuccess(false)
                form.resetForm()
              }}
              className="block w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Send Another Email
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
          {form.errors.submit && (
            <FormError error={form.errors.submit} />
          )}
          
          <FormField
            name="email"
            label="Email Address"
            type="email"
            value={form.values.email}
            error={form.errors.email}
            onChange={(value) => form.updateField('email', value as string)}
            onBlur={() => form.validateField('email')}
            placeholder="Enter your email address"
            disabled={form.isSubmitting}
            required
          />
          
          <FormSubmitButton
            isSubmitting={form.isSubmitting}
            disabled={!form.isDirty}
            loadingText="Sending Email..."
          >
            Send Reset Email
          </FormSubmitButton>
          
          <div className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link 
              href="/login" 
              className="text-blue-600 hover:underline"
            >
              Back to Login
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