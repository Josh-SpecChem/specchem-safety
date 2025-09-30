import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Plant Management | SpecChem Safety Training',
  description: 'Manage plant locations and their training programs',
}

// Mock plant data - will be replaced with real API calls
const mockPlants = [
  {
    id: '1',
    name: 'Columbus Corporate',
    address: '1511 Baltimore Road, Columbus, OH 43223',
    status: 'active',
    employees: 124,
    completionRate: 87,
    activeEnrollments: 23,
    overdueTraining: 5,
    manager: 'Sarah Johnson',
    contact: '+1 (614) 294-3361',
    established: '2020-01-15T00:00:00Z',
    lastAudit: '2024-08-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Atlanta Production',
    address: '2845 Industrial Blvd, Atlanta, GA 30318',
    status: 'active',
    employees: 89,
    completionRate: 92,
    activeEnrollments: 12,
    overdueTraining: 2,
    manager: 'Mike Wilson',
    contact: '+1 (404) 555-0123',
    established: '2021-03-22T00:00:00Z',
    lastAudit: '2024-07-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'Denver Distribution',
    address: '5420 Commerce Street, Denver, CO 80022',
    status: 'active',
    employees: 67,
    completionRate: 78,
    activeEnrollments: 31,
    overdueTraining: 8,
    manager: 'Lisa Garcia',
    contact: '+1 (303) 555-0189',
    established: '2021-08-10T00:00:00Z',
    lastAudit: '2024-09-05T00:00:00Z'
  },
  {
    id: '4',
    name: 'Seattle Warehouse',
    address: '1847 Harbor Ave SW, Seattle, WA 98126',
    status: 'active',
    employees: 45,
    completionRate: 94,
    activeEnrollments: 8,
    overdueTraining: 1,
    manager: 'Tom Anderson',
    contact: '+1 (206) 555-0234',
    established: '2022-01-20T00:00:00Z',
    lastAudit: '2024-06-20T00:00:00Z'
  },
  {
    id: '5',
    name: 'Phoenix Facility',
    address: '3290 Desert Ridge Pkwy, Phoenix, AZ 85050',
    status: 'maintenance',
    employees: 32,
    completionRate: 65,
    activeEnrollments: 18,
    overdueTraining: 12,
    manager: 'John Martinez',
    contact: '+1 (602) 555-0167',
    established: '2022-11-05T00:00:00Z',
    lastAudit: '2024-05-15T00:00:00Z'
  }
]

const plantStats = {
  totalPlants: mockPlants.length,
  activePlants: mockPlants.filter(p => p.status === 'active').length,
  totalEmployees: mockPlants.reduce((sum, plant) => sum + plant.employees, 0),
  averageCompletion: Math.round(mockPlants.reduce((sum, plant) => sum + plant.completionRate, 0) / mockPlants.length)
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getCompletionRateColor(rate: number) {
  if (rate >= 90) return 'text-green-600'
  if (rate >= 80) return 'text-blue-600'
  if (rate >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function PlantManagement() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Plant Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage plant locations and training oversight
                </p>
              </div>
              <Button>
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Plant
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Plants</p>
                    <p className="text-2xl font-bold text-gray-900">{plantStats.totalPlants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Plants</p>
                    <p className="text-2xl font-bold text-gray-900">{plantStats.activePlants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{plantStats.totalEmployees}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Completion</p>
                    <p className="text-2xl font-bold text-gray-900">{plantStats.averageCompletion}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Plants
                  </label>
                  <Input
                    placeholder="Search by name or location..."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Rate
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Rates</option>
                    <option value="90-100">90-100%</option>
                    <option value="80-89">80-89%</option>
                    <option value="70-79">70-79%</option>
                    <option value="0-69">Below 70%</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPlants.map((plant) => (
              <Card key={plant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{plant.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {plant.address}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusBadgeColor(plant.status)}>
                      {plant.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">Employees</div>
                        <div className="text-xl font-bold text-gray-900">{plant.employees}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">Completion Rate</div>
                        <div className={`text-xl font-bold ${getCompletionRateColor(plant.completionRate)}`}>
                          {plant.completionRate}%
                        </div>
                      </div>
                    </div>

                    {/* Training Status */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active Enrollments</span>
                        <span className="font-medium text-blue-600">{plant.activeEnrollments}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Overdue Training</span>
                        <span className={`font-medium ${plant.overdueTraining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {plant.overdueTraining}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t pt-3 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Manager</span>
                        <span className="font-medium">{plant.manager}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Contact</span>
                        <span className="text-blue-600">{plant.contact}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Audit</span>
                        <span className="text-gray-900">{formatDate(plant.lastAudit)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Plant Performance Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Plant Performance Comparison</CardTitle>
              <CardDescription>
                Training completion rates across all plant locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockPlants.map((plant) => (
                  <div key={plant.id} className="flex items-center space-x-4">
                    <div className="w-40 text-sm font-medium text-gray-900 truncate">
                      {plant.name}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              plant.completionRate >= 90 
                                ? 'bg-green-500' 
                                : plant.completionRate >= 80 
                                  ? 'bg-blue-500'
                                  : plant.completionRate >= 70
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                            }`}
                            style={{ width: `${plant.completionRate}%` }}
                          ></div>
                        </div>
                        <div className={`text-sm font-medium w-12 ${getCompletionRateColor(plant.completionRate)}`}>
                          {plant.completionRate}%
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 w-24 text-right">
                      {plant.employees} employees
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}