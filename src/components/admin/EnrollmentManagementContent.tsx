'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEnrollments, useEnrollmentStats } from '@/hooks/useEnrollments'
import { 
  useAdminFilters, 
  useAdminPagination, 
  AdminTable, 
  AdminFilters, 
  AdminPagination,
  BadgeUtils,
  FormatUtils
} from './shared'
import type { AdminEnrollment, EnrollmentStats } from '@/types/database'
import type { AdminTableColumn } from '@/types/ui'

export function EnrollmentManagementContent() {
  const { filters, updateFilter, clearFilters, hasActiveFilters, filterCount } = useAdminFilters({
    plantId: '',
    courseId: '',
    status: '',
    limit: 50,
    offset: 0
  });

  const { pagination, setPage, setLimit, updateTotal } = useAdminPagination({
    initialPage: 1,
    initialLimit: 50
  });

  const { data: enrollments, loading, error, refetch } = useEnrollments({ 
    ...filters, 
    page: pagination.page, 
    limit: pagination.limit,
    status: filters.status as "enrolled" | "in_progress" | "completed" | undefined,
    dateRange: filters.dateRange ? {
      startDate: filters.dateRange.start?.toISOString(),
      endDate: filters.dateRange.end?.toISOString()
    } : undefined
  });
  const { data: stats, loading: statsLoading } = useEnrollmentStats();

  // Update pagination total when enrollments data changes
  React.useEffect(() => {
    if (enrollments && Array.isArray(enrollments) && enrollments.length > 0) {
      updateTotal(enrollments.length);
    }
  }, [enrollments, updateTotal]);

  const columns: AdminTableColumn<AdminEnrollment>[] = [
    {
      key: 'userId',
      title: 'User',
      render: (value: any, enrollment: AdminEnrollment) => (
        <div>
          <div className="font-medium text-gray-900">
            {enrollment.user ? FormatUtils.formatName(enrollment.user.firstName, enrollment.user.lastName) : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">{enrollment.user?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'courseId',
      title: 'Course',
      render: (value: any, enrollment: AdminEnrollment) => (
        <div>
          <div className="font-medium text-gray-900">
            {enrollment.course?.title || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {enrollment.course?.difficulty || 'N/A'} • {FormatUtils.formatDuration(enrollment.course?.duration || 0)}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, row: AdminEnrollment) => {
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
      key: 'progress',
      title: 'Progress',
      render: (value: any, row: AdminEnrollment) => {
        const progress = value as number;
        return (
          <div className="text-sm text-gray-700">
            {FormatUtils.formatProgress(progress)}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'enrolledAt',
      title: 'Enrolled',
      render: (value: any, row: AdminEnrollment) => {
        const enrolledAt = value as string;
        return (
          <div className="text-sm text-gray-500">
            {FormatUtils.formatDate(enrolledAt)}
          </div>
        );
      }
    },
    {
      key: 'completedAt',
      title: 'Completed',
      render: (value: any, row: AdminEnrollment) => {
        const completedAt = value as string;
        return (
          <div className="text-sm text-gray-500">
            {completedAt ? FormatUtils.formatDate(completedAt) : 'Not completed'}
          </div>
        );
      }
    },
    {
      key: 'id',
      title: 'Actions',
      render: (value: any, enrollment: AdminEnrollment) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            Cancel
          </Button>
        </div>
      )
    }
  ];

  const filterFields = [
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
    },
    {
      key: 'courseId',
      label: 'Course',
      type: 'select' as const,
      options: [
        // These would typically come from an API call
        { value: 'course1', label: 'Safety Training' },
        { value: 'course2', label: 'Equipment Operation' },
        { value: 'course3', label: 'Emergency Procedures' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'enrolled', label: 'Enrolled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  ];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading enrollments: {error}</p>
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : (stats as EnrollmentStats)?.total || 0}
                </p>
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
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : (stats as EnrollmentStats)?.completed || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : (stats as EnrollmentStats)?.inProgress || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '...' : (stats as EnrollmentStats)?.overdue || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <AdminFilters
        fields={filterFields}
        filters={filters as unknown as Record<string, unknown>}
        onFilterChange={updateFilter as (key: string, value: unknown) => void}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        filterCount={filterCount}
      />

      {/* Enrollments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enrollments</CardTitle>
              <CardDescription>
                {loading ? 'Loading enrollments...' : `${Array.isArray(enrollments) ? enrollments.length : 0} enrollments found`}
              </CardDescription>
            </div>
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Bulk Enroll
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AdminTable
            data={enrollments as AdminEnrollment[] || []}
            columns={columns}
            isLoading={loading}
            error={error}
            emptyMessage="No enrollments found matching your criteria."
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