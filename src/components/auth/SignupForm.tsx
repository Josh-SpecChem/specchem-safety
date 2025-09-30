'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateUserProfileSchema } from '@/lib/validations'

interface RegistrationData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  jobTitle?: string
}

export function SignupForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    jobTitle: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()

  const handleChange = (field: keyof RegistrationData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setError('') // Clear error when user starts typing
  }

  const validateForm = (): string | null => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      return 'Please fill in all required fields'
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address'
    }

    // Validate profile data with Zod
    try {
      updateUserProfileSchema.parse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle || undefined
      })
    } catch (err) {
      console.error('Validation error:', err)
      return 'Please check your profile information'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            job_title: formData.jobTitle || null
          }
        }
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        setSuccess(true)
        // The user profile will be created automatically by our trigger
        // Redirect to a confirmation page or login
        setTimeout(() => {
          router.push('/login?message=Please check your email to confirm your account')
        }, 2000)
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-green-600">Account Created!</CardTitle>
          <CardDescription className="text-center">
            Please check your email to confirm your account before signing in.
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
          <Button asChild variant="outline">
            <Link href="/login">
              Go to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join the SpecChem Safety Training platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name *
              </label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
                disabled={loading}
                placeholder="John"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
                disabled={loading}
                placeholder="Doe"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              disabled={loading}
              placeholder="john.doe@company.com"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
              Job Title
            </label>
            <Input
              id="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange('jobTitle')}
              disabled={loading}
              placeholder="Safety Manager"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password *
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required
              disabled={loading}
              placeholder="At least 8 characters"
              className="w-full"
              minLength={8}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password *
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              disabled={loading}
              placeholder="Confirm your password"
              className="w-full"
              minLength={8}
            />
          </div>
          
          <div className="space-y-4">
            <div className="text-xs text-gray-600">
              <p>By creating an account, you agree to our:</p>
              <div className="mt-1 space-x-4">
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}