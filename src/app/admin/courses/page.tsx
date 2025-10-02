'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useCourses } from '@/hooks/useCourses'
import { useState } from 'react'

function CourseAdministrationPage() {
  const { data: courses, loading, error } = useCourses()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="container mx-auto p-6">
          <div className="text-center text-red-600 p-8">
            <p>Error loading courses: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // Filter courses based on search and status
  const coursesArray = Array.isArray(courses) ? courses : courses ? [courses] : []
  const filteredCourses = coursesArray.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && course.isPublished) ||
                         (statusFilter === 'inactive' && !course.isPublished)
    return matchesSearch && matchesStatus
  })
  
  // Calculate statistics
  const statistics = {
    totalCourses: coursesArray.length,
    activeCourses: coursesArray.filter(course => course.isPublished).length,
    totalEnrollments: coursesArray.reduce((sum, course) => sum + (course.totalEnrollments || 0), 0),
    completedEnrollments: coursesArray.reduce((sum, course) => sum + (course.completedEnrollments || 0), 0),
    avgCompletionRate: coursesArray.length > 0 
      ? Math.round(coursesArray.reduce((sum, course) => sum + (course.completionRate || 0), 0) / coursesArray.length)
      : 0,
  }
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Administration</h1>
            <p className="text-gray-600 mt-1">Manage training courses, content, and settings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Courses
            </Button>
            <Button className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Course
            </Button>
          </div>
        </div>

        {/* Course Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statistics.totalCourses}</div>
              <p className="text-xs text-gray-500 mt-1">{statistics.activeCourses} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.totalEnrollments}</div>
              <p className="text-xs text-gray-500 mt-1">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{statistics.avgCompletionRate}%</div>
              <p className="text-xs text-gray-500 mt-1">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Published Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{statistics.activeCourses}</div>
              <p className="text-xs text-gray-500 mt-1">Ready for enrollment</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Search, filter, and manage your training courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Search courses by title or slug..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Published</option>
                  <option value="inactive">Unpublished</option>
                </select>
              </div>
            </div>

            {/* Course List */}
            <div className="space-y-4">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No courses found.</p>
                </div>
              ) : (
                filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Course Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                              <Badge variant={course.isPublished ? "default" : "secondary"}>
                                {course.isPublished ? 'Published' : 'Draft'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                v{course.version}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">Course slug: {course.slug}</p>
                            
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                ID: {course.id.slice(0, 8)}...
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Avg: {course.avgProgress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Course Statistics */}
                      <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-blue-600">{course.totalEnrollments}</div>
                            <div className="text-xs text-gray-500">Enrollments</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-green-600">{course.completionRate}%</div>
                            <div className="text-xs text-gray-500">Completion</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-purple-600">{course.avgProgress}%</div>
                            <div className="text-xs text-gray-500">Avg Progress</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            Edit Course
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Content
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            Enrollments
                          </Button>
                          <Button 
                            variant={course.isPublished ? "destructive" : "default"} 
                            size="sm" 
                            className="text-xs"
                          >
                            {course.isPublished ? 'Unpublish' : 'Publish'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Completion Rate</span>
                        <span>{course.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                      <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                      <span>Last Updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {filteredCourses.length} of {coursesArray.length} courses
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common course management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">Create New Course</span>
                <span className="text-xs text-gray-500">Start from scratch</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Duplicate Course</span>
                <span className="text-xs text-gray-500">Copy existing</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span className="text-sm font-medium">Import Course</span>
                <span className="text-xs text-gray-500">Upload content</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium">Course Analytics</span>
                <span className="text-xs text-gray-500">View detailed stats</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

export default CourseAdministrationPage