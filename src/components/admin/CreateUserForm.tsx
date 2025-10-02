'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUnifiedForm } from '@/hooks/useUnifiedForm'
import { adminCreateUserFormSchema } from '@/lib/schemas/unified-form-schemas'
import { FormField, FormError, FormSuccess, FormSubmitButton, FormContainer } from '@/components/ui/unified-form'
import type { AdminCreateUserForm } from '@/lib/schemas/unified-form-schemas'

interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [success, setSuccess] = useState(false)

  const form = useUnifiedForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      role: 'employee' as const,
      plantId: ''
    } as AdminCreateUserForm,
    validationSchema: adminCreateUserFormSchema,
    onSubmit: async (values: AdminCreateUserForm) => {
      // TODO: Implement actual user creation API call
      console.log('Creating user:', values)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      onSuccess?.()
    },
    onError: (error: Error) => {
      console.error('User creation error:', error)
    }
  })

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'plant_manager', label: 'Plant Manager' },
    { value: 'hr_admin', label: 'HR Admin' }
  ]

  const plantOptions = [
    { value: 'plant-1', label: 'Seattle Plant' },
    { value: 'plant-2', label: 'Portland Plant' },
    { value: 'plant-3', label: 'Spokane Plant' }
  ]

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-green-600">User Created!</CardTitle>
          <CardDescription className="text-center">
            The user has been successfully created
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
            The user will receive an email invitation to set up their account.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setSuccess(false)
                form.resetForm()
              }}
              className="w-full"
            >
              Create Another User
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create New User</CardTitle>
        <CardDescription className="text-center">
          Add a new user to the system
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
            placeholder="Enter user's email"
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
            placeholder="Enter job title (optional)"
            disabled={form.isSubmitting}
          />
          
          <FormField
            name="role"
            label="Role"
            type="select"
            options={roleOptions}
            value={form.values.role}
            error={form.errors.role}
            onChange={(value) => form.updateField('role', value as string)}
            onBlur={() => form.validateField('role')}
            disabled={form.isSubmitting}
            required
          />
          
          <FormField
            name="plantId"
            label="Plant"
            type="select"
            options={plantOptions}
            value={form.values.plantId}
            error={form.errors.plantId}
            onChange={(value) => form.updateField('plantId', value as string)}
            onBlur={() => form.validateField('plantId')}
            disabled={form.isSubmitting}
            required
          />
          
          <div className="flex gap-3">
            <FormSubmitButton
              isSubmitting={form.isSubmitting}
              disabled={!form.isDirty}
              loadingText="Creating User..."
              className="flex-1"
            >
              Create User
            </FormSubmitButton>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={form.isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </FormContainer>
      </CardContent>
    </Card>
  )
}
