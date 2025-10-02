'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { resetPasswordFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSuccess, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { ResetPasswordForm } from '@/lib/schemas/unified-form-schemas'

export function ResetPasswordForm() {
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [sessionError, setSessionError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useUnifiedForm({
    initialValues: {
      password: '',
      confirmPassword: ''
    } as ResetPasswordForm,
    validationSchema: resetPasswordFormSchema,
    onSubmit: async (values: ResetPasswordForm) => {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      })

      if (error) {
        throw new Error(error.message)
      }

      setSuccess(true)
      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push('/login?message=Password updated successfully')
      }, 2000)
    },
    onError: (error: Error) => {
      console.error('Password reset error:', error)
    }
  })

  useEffect(() => {
    // Check if we have the required URL parameters for password reset
    const checkSession = async () => {
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        if (!error) {
          setValidSession(true)
        } else {
          setSessionError('Invalid or expired reset link. Please request a new password reset.')
        }
      } else {
        setSessionError('Invalid reset link. Please request a new password reset.')
      }
    }

    checkSession()
  }, [searchParams])

  if (!validSession && !sessionError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validating reset link...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sessionError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-red-600">Invalid Link</CardTitle>
          <CardDescription className="text-center">
            This password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {sessionError}
          </p>
          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Request New Reset Link
            </Link>
            <Link
              href="/login"
              className="block w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-green-600">Password Updated!</CardTitle>
          <CardDescription className="text-center">
            Your password has been successfully updated
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
          <p className="text-sm text-gray-600 mb-4">
            Redirecting to login page...
          </p>
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Sign In with New Password
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormContainer onSubmit={(e) => { e.preventDefault(); form.submitForm(); }}>
          {form.errors.submit && (
            <FormError error={form.errors.submit} />
          )}
          
          <FormField
            name="password"
            label="New Password"
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
            label="Confirm New Password"
            type="password"
            value={form.values.confirmPassword}
            error={form.errors.confirmPassword}
            onChange={(value) => form.updateField('confirmPassword', value as string)}
            onBlur={() => form.validateField('confirmPassword')}
            placeholder="Confirm your new password"
            disabled={form.isSubmitting}
            required
          />
          
          <FormSubmitButton
            isSubmitting={form.isSubmitting}
            disabled={!form.isDirty}
            loadingText="Updating Password..."
          >
            Update Password
          </FormSubmitButton>
          
          <div className="text-center text-sm text-gray-600">
            <Link 
              href="/login" 
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </FormContainer>
      </CardContent>
    </Card>
  )
}