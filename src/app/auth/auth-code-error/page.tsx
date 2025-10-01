import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Error | SpecChem Safety Training',
  description: 'There was an issue with your authentication link',
}

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            There was an issue with your authentication link. This could be because:
          </p>
          <ul className="mt-4 text-sm text-gray-600 list-disc list-inside space-y-1 text-left">
            <li>The link has expired</li>
            <li>The link has already been used</li>
            <li>The link is invalid</li>
          </ul>
        </div>
        <div className="text-center space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Return to Login
          </Link>
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-500"
            >
              Request a new password reset link
            </Link>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-900">Need Help?</h3>
          <p className="mt-1 text-xs text-blue-700">
            If you continue to experience issues, please contact your system administrator 
            or try requesting a new authentication link.
          </p>
        </div>
      </div>
    </div>
  )
}