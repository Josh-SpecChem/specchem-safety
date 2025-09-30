import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Settings | SpecChem Safety Training',
  description: 'System settings and configuration',
}

// Mock settings data - will be replaced with real API calls
const systemSettings = {
  general: {
    siteName: 'SpecChem Safety Training',
    supportEmail: 'support@specchem.com',
    defaultLanguage: 'en',
    timezone: 'America/New_York',
    maintenanceMode: false
  },
  authentication: {
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableMFA: false
  },
  training: {
    defaultCourseLanguage: 'en',
    allowSelfEnrollment: true,
    certificateExpiry: 365,
    reminderDaysBefore: 30,
    maxQuizAttempts: 3
  },
  notifications: {
    emailNotifications: true,
    overdueReminders: true,
    completionNotifications: true,
    weeklyReports: true,
    systemAlerts: true
  }
}

const auditLogs = [
  {
    id: '1',
    action: 'User Role Updated',
    user: 'Sarah Johnson',
    target: 'Mike Wilson',
    details: 'Changed role from User to Manager',
    timestamp: '2024-09-30T14:30:00Z',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    action: 'Course Settings Modified',
    user: 'System Admin',
    target: 'Function-Specific HazMat Training',
    details: 'Updated quiz passing score to 80%',
    timestamp: '2024-09-30T11:15:00Z',
    ip: '192.168.1.50'
  },
  {
    id: '3',
    action: 'Plant Added',
    user: 'Lisa Garcia',
    target: 'Phoenix Facility',
    details: 'Added new plant location',
    timestamp: '2024-09-29T16:45:00Z',
    ip: '192.168.1.75'
  },
  {
    id: '4',
    action: 'Bulk User Import',
    user: 'Sarah Johnson',
    target: 'Atlanta Plant Users',
    details: 'Imported 25 new user accounts',
    timestamp: '2024-09-29T09:30:00Z',
    ip: '192.168.1.100'
  },
  {
    id: '5',
    action: 'System Backup',
    user: 'System Automated',
    target: 'Database',
    details: 'Automated daily backup completed',
    timestamp: '2024-09-29T02:00:00Z',
    ip: 'localhost'
  }
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AdminSettings() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Configure system settings and manage administrative options
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export Settings
                </Button>
                <Button>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panels */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic system configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name
                      </label>
                      <Input defaultValue={systemSettings.general.siteName} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Support Email
                      </label>
                      <Input defaultValue={systemSettings.general.supportEmail} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Language
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={systemSettings.general.defaultLanguage}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={systemSettings.general.timezone}
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={systemSettings.general.maintenanceMode}
                    />
                    <label htmlFor="maintenanceMode" className="text-sm text-gray-700">
                      Enable maintenance mode
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Authentication Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                  <CardDescription>Security and login configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Min Length
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={systemSettings.authentication.passwordMinLength}
                        min="6"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session Timeout (minutes)
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={systemSettings.authentication.sessionTimeout}
                        min="15"
                        max="480"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Login Attempts
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={systemSettings.authentication.maxLoginAttempts}
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireEmailVerification"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked={systemSettings.authentication.requireEmailVerification}
                      />
                      <label htmlFor="requireEmailVerification" className="text-sm text-gray-700">
                        Require email verification for new accounts
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="enableMFA"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked={systemSettings.authentication.enableMFA}
                      />
                      <label htmlFor="enableMFA" className="text-sm text-gray-700">
                        Enable multi-factor authentication (Coming Soon)
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Training Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Training Settings</CardTitle>
                  <CardDescription>Course and certification configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Course Language
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={systemSettings.training.defaultCourseLanguage}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Expiry (days)
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={systemSettings.training.certificateExpiry}
                        min="30"
                        max="1095"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reminder Days Before Expiry
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={systemSettings.training.reminderDaysBefore}
                        min="1"
                        max="90"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Quiz Attempts
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={systemSettings.training.maxQuizAttempts}
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowSelfEnrollment"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={systemSettings.training.allowSelfEnrollment}
                    />
                    <label htmlFor="allowSelfEnrollment" className="text-sm text-gray-700">
                      Allow users to self-enroll in courses
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Email and alert preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={systemSettings.notifications.emailNotifications}
                    />
                    <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                      Enable email notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="overdueReminders"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={systemSettings.notifications.overdueReminders}
                    />
                    <label htmlFor="overdueReminders" className="text-sm text-gray-700">
                      Send overdue training reminders
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="completionNotifications"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={systemSettings.notifications.completionNotifications}
                    />
                    <label htmlFor="completionNotifications" className="text-sm text-gray-700">
                      Send course completion notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="weeklyReports"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={systemSettings.notifications.weeklyReports}
                    />
                    <label htmlFor="weeklyReports" className="text-sm text-gray-700">
                      Send weekly progress reports to managers
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="systemAlerts"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked={systemSettings.notifications.systemAlerts}
                    />
                    <label htmlFor="systemAlerts" className="text-sm text-gray-700">
                      Send system alerts to administrators
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Email Service</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">File Storage</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Background Jobs</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Backup Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      System Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Storage Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Storage Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Database</span>
                        <span className="font-medium">2.4 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Media Files</span>
                        <span className="font-medium">1.8 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Backups</span>
                        <span className="font-medium">5.2 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Total used: 9.4 GB of 50 GB
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Admin Activity</CardTitle>
              <CardDescription>
                Recent administrative actions and system changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Target</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{log.action}</td>
                        <td className="py-3 px-4 text-gray-700">{log.user}</td>
                        <td className="py-3 px-4 text-gray-700">{log.target}</td>
                        <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{log.details}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{formatDate(log.timestamp)}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm font-mono">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}