import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | SpecChem Safety Training',
  description: 'Manage your profile and account settings',
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            User Profile
          </h1>
          
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Profile Management
            </h2>
            <p className="text-gray-600">
              Profile management features will be available in the next update.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}