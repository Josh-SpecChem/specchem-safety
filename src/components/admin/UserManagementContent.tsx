'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useUsers } from '@/hooks/useUsers'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'hr_admin':
      return 'bg-purple-100 text-purple-800'
    case 'plant_manager':
      return 'bg-blue-100 text-blue-800' 
    case 'dev_admin':
      return 'bg-red-100 text-red-800'
    case 'employee':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function UserManagementContent() {
  const [filters, setFilters] = useState({
    search: '',
    plantId: '',
    role: '',
    isActive: undefined as boolean | undefined,
    limit: 50,
    offset: 0
  })

  const { users, loading, error, refetch } = useUsers(filters)

  const handleFilterChange = (key: string, value: string | boolean | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0 // Reset pagination when filters change
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      plantId: '',
      role: '',
      isActive: undefined,
      limit: 50,
      offset: 0
    })
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading users: {error}</p>
              <Button onClick={refetch} className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="employee">Employee</option>
                <option value="plant_manager">Plant Manager</option>
                <option value="hr_admin">HR Admin</option>
                <option value="dev_admin">Dev Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.isActive === undefined ? '' : String(filters.isActive)}
                onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plant
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.plantId}
                onChange={(e) => handleFilterChange('plantId', e.target.value)}
              >
                <option value="">All Plants</option>
                {/* You can populate this from a plants API call */}
                <option value="columbus">Columbus, OH</option>
                <option value="atlanta">Atlanta, GA</option>
                <option value="denver">Denver, CO</option>
                <option value="seattle">Seattle, WA</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {loading ? 'Loading users...' : `${users.length} users found`}
              </CardDescription>
            </div>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Plant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Enrollments</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.jobTitle && (
                            <div className="text-sm text-gray-500">{user.jobTitle}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {user.plant.name}
                        {user.plant.location && (
                          <div className="text-xs text-gray-500">{user.plant.location}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.isActive ? 'ACTIVE' : 'SUSPENDED'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {user.enrollments.length} courses
                        {user.enrollments.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {user.enrollments.filter(e => e.status === 'completed').length} completed
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {user.isActive ? 'Suspend' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {Math.min(filters.offset + 1, users.length)} to {Math.min(filters.offset + filters.limit, users.length)} of {users.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.offset === 0}
            onClick={() => handleFilterChange('offset', Math.max(0, filters.offset - filters.limit))}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-600 text-white">
            {Math.floor(filters.offset / filters.limit) + 1}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={users.length < filters.limit}
            onClick={() => handleFilterChange('offset', filters.offset + filters.limit)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}