import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminDashboardContent } from '@/components/admin/AdminDashboardContent'

export const metadata: Metadata = {
  title: 'Admin Dashboard | SpecChem Safety Training',
  description: 'Administrative overview and management dashboard',
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Overview of training progress and system status
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <AdminDashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}