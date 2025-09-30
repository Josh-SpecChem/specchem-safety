import { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | SpecChem Safety Training',
  description: 'Set your new SpecChem Safety Training account password',
}

function ResetPasswordContent() {
  return <ResetPasswordForm />
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo-primary.webp"
            alt="SpecChem Logo"
            width={200}
            height={80}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Choose a new secure password for your account
          </p>
        </div>

        {/* Reset Password Form */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 SpecChem. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a 
              href="/privacy" 
              className="hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}