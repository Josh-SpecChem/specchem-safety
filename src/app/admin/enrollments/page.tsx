import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { EnrollmentManagementContent } from '@/components/admin/EnrollmentManagementContent'

export const metadata: Metadata = {
  title: 'Enrollment Management | SpecChem Safety Training',
  description: 'Manage course enrollments and assignments',
}

export default function EnrollmentManagement() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage course assignments and track training progress
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <EnrollmentManagementContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}