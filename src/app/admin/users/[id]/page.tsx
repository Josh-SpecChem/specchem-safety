import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const metadata: Metadata = {
  title: 'User Details | SpecChem Safety Training',
  description: 'View and manage individual user details',
}

// Mock user data - will be replaced with real API calls based on [id]
const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@specchem.com',
  jobTitle: 'Safety Coordinator',
  role: 'employee',
  plant: 'Columbus, OH - Corporate',
  status: 'active',
  lastLogin: '2024-09-30T10:30:00Z',
  createdAt: '2024-01-15T08:00:00Z',
  enrollments: [
    {
      courseId: '1',
      courseTitle: 'Function-Specific HazMat Training',
      status: 'in_progress',
      progress: 85,
      enrolledAt: '2024-09-01T09:00:00Z',
      lastActiveAt: '2024-09-30T10:30:00Z'
    },
    {
      courseId: '2',
      courseTitle: 'Capacitación Específica de HazMat por Función',
      status: 'completed',
      progress: 100,
      enrolledAt: '2024-08-15T09:00:00Z',
      completedAt: '2024-09-15T14:20:00Z'
    }
  ],
  recentActivity: [
    { action: 'Answered question in Section 4', time: '2024-09-30T10:30:00Z' },
    { action: 'Viewed Drum Closure Training', time: '2024-09-30T10:15:00Z' },
    { action: 'Started training session', time: '2024-09-30T10:00:00Z' },
    { action: 'Profile updated', time: '2024-09-28T14:30:00Z' }
  ]
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'suspended':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function UserDetails({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/admin/users"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {mockUser.firstName} {mockUser.lastName}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    User ID: {params.id} • {mockUser.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">Send Message</Button>
                <Button variant="outline">Reset Password</Button>
                <Button>Edit User</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-sm text-gray-900">
                      {mockUser.firstName} {mockUser.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{mockUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Job Title</label>
                    <p className="text-sm text-gray-900">{mockUser.jobTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <div className="mt-1">
                      <Badge className="bg-gray-100 text-gray-800">
                        {mockUser.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Plant Location</label>
                    <p className="text-sm text-gray-900">{mockUser.plant}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusBadgeColor(mockUser.status)}>
                        {mockUser.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Login</label>
                    <p className="text-sm text-gray-900">{formatDate(mockUser.lastLogin)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account Created</label>
                    <p className="text-sm text-gray-900">{formatDate(mockUser.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Enroll in Course
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Generate Certificate
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Notification
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    Suspend Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Enrollments */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Enrollments</CardTitle>
                  <CardDescription>
                    Current training progress and completed courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUser.enrollments.map((enrollment, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {enrollment.courseTitle}
                          </h4>
                          <Badge className={getStatusBadgeColor(enrollment.status)}>
                            {enrollment.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 min-w-[40px]">
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Enrolled: {formatDate(enrollment.enrolledAt)}</p>
                          {enrollment.status === 'completed' && enrollment.completedAt && (
                            <p>Completed: {formatDate(enrollment.completedAt)}</p>
                          )}
                          {enrollment.status === 'in_progress' && enrollment.lastActiveAt && (
                            <p>Last Active: {formatDate(enrollment.lastActiveAt)}</p>
                          )}
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <Button size="sm" variant="outline">View Progress</Button>
                          <Button size="sm" variant="outline">View Certificate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions and training activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUser.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500">{formatDate(activity.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}