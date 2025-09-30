import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserManagementContent } from '@/components/admin/UserManagementContent'

export const metadata: Metadata = {
  title: 'User Management | SpecChem Safety Training',
  description: 'Manage user accounts and permissions',
}

export default function UserManagement() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <UserManagementContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}