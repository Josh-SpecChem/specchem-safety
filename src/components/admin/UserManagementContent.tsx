'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUsers } from '@/hooks/useUsers'
import { 
  useAdminFilters, 
  useAdminPagination, 
  AdminTable, 
  AdminFilters, 
  AdminPagination,
  BadgeUtils,
  FormatUtils
} from './shared'
import type { AdminUser } from '@/types/database'
import type { AdminTableColumn } from '@/types/ui'

export function UserManagementContent() {
  const { filters, updateFilter, clearFilters, hasActiveFilters, filterCount } = useAdminFilters({
    search: '',
    plantId: '',
    role: '',
    limit: 50,
    offset: 0
  });

  const { pagination, setPage, setLimit, updateTotal } = useAdminPagination({
    initialPage: 1,
    initialLimit: 50
  });

  const { data: users, loading, error, refetch } = useUsers({ 
    ...filters, 
    page: pagination.page, 
    limit: pagination.limit,
    status: filters.status as "active" | "suspended" | undefined,
    role: filters.role as "hr_admin" | "dev_admin" | "plant_manager" | undefined,
    dateRange: filters.dateRange ? {
      startDate: filters.dateRange.start?.toISOString(),
      endDate: filters.dateRange.end?.toISOString()
    } : undefined
  });

  // Update pagination total when users data changes
  React.useEffect(() => {
    if (users && users.length > 0) {
      updateTotal(users.length);
    }
  }, [users, updateTotal]);

  const columns: AdminTableColumn<AdminUser>[] = [
    {
      key: 'firstName',
      title: 'User',
      render: (_, user) => (
        <div>
          <div className="font-medium text-gray-900">
            {FormatUtils.formatName(user.firstName, user.lastName)}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
          {user.jobTitle && (
            <div className="text-sm text-gray-500">{user.jobTitle}</div>
          )}
        </div>
      )
    },
    {
      key: 'id',
      title: 'Role',
      render: (value: any, user: AdminUser) => {
        // Get the primary role from adminRoles or default to 'Employee'
        const role = (user as any)?.adminRoles?.[0]?.role || 'employee';
        const config = BadgeUtils.getRoleBadgeConfig(role);
        return (
          <Badge className={config.className}>
            {config.text}
          </Badge>
        );
      }
    },
    {
      key: 'plantId',
      title: 'Plant',
      render: (_, user) => (
        <div className="text-sm text-gray-700">
          {user.plant?.name || 'N/A'}
          {user.plant?.location && (
            <div className="text-xs text-gray-500">{user.plant.location}</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, user: AdminUser) => {
        const status = value as string;
        const config = BadgeUtils.getStatusBadgeConfig(status);
        return (
          <Badge className={config.className}>
            {config.text}
          </Badge>
        );
      }
    },
    {
      key: 'enrollments',
      title: 'Enrollments',
      render: (value: any, user: AdminUser) => {
        const enrollments = value as unknown[];
        return (
          <div className="text-sm text-gray-700">
            {enrollments?.length || 0} courses
            {enrollments && enrollments.length > 0 && (
              <div className="text-xs text-gray-500">
                {enrollments.filter((e: any) => e.status === 'completed').length} completed
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'updatedAt',
      title: 'Last Updated',
      render: (value: any, user: AdminUser) => {
        const updatedAt = value as string;
        return (
          <div className="text-sm text-gray-500">
            {updatedAt ? FormatUtils.formatDate(updatedAt) : 'Never'}
          </div>
        );
      }
    },
    {
      key: 'id',
      title: 'Actions',
      render: (_, user) => (
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
            className={user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
          >
            {user.status === 'active' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      )
    }
  ];

  const filterFields = [
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
      placeholder: 'Search by name or email...'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { value: 'employee', label: 'Employee' },
        { value: 'plant_manager', label: 'Plant Manager' },
        { value: 'hr_admin', label: 'HR Admin' },
        { value: 'dev_admin', label: 'Dev Admin' }
      ]
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'boolean' as const
    },
    {
      key: 'plantId',
      label: 'Plant',
      type: 'select' as const,
      options: [
        { value: 'columbus', label: 'Columbus, OH' },
        { value: 'atlanta', label: 'Atlanta, GA' },
        { value: 'denver', label: 'Denver, CO' },
        { value: 'seattle', label: 'Seattle, WA' }
      ]
    }
  ];

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
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <AdminFilters
        fields={filterFields}
        filters={filters as unknown as Record<string, unknown>}
        onFilterChange={updateFilter as (key: string, value: unknown) => void}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        filterCount={filterCount}
      />

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {loading ? 'Loading users...' : `${users?.length || 0} users found`}
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
          <AdminTable
            data={users as unknown as AdminUser[] || []}
            columns={columns}
            isLoading={loading}
            error={error}
            emptyMessage="No users found matching your criteria."
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      <AdminPagination
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}