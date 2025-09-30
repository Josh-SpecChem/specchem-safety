import { useState, useEffect, useCallback } from 'react'

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: string
  enrolledAt: string
  completedAt: string | null
  user: {
    firstName: string
    lastName: string
    email: string
    plantId: string
    plant: {
      name: string
    }
  }
  course: {
    name: string
    isActive: boolean
  }
}

export interface EnrollmentFilters {
  plantId?: string
  courseId?: string
  status?: string
  limit?: number
  offset?: number
}

export interface EnrollmentResponse {
  success: boolean
  data: Enrollment[]
  error?: string
}

export function useEnrollments(filters: EnrollmentFilters = {}) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.plantId) params.append('plantId', filters.plantId)
      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.status) params.append('status', filters.status)
      if (filters.limit) params.append('limit', String(filters.limit))
      if (filters.offset) params.append('offset', String(filters.offset))

      const response = await fetch(`/api/admin/enrollments?${params}`)
      const result: EnrollmentResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch enrollments')
      }

      if (result.success) {
        setEnrollments(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch enrollments')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }, [
    filters.plantId,
    filters.courseId,
    filters.status,
    filters.limit,
    filters.offset
  ])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  return {
    enrollments,
    loading,
    error,
    refetch: fetchEnrollments,
  }
}

// Hook for enrollment statistics
export function useEnrollmentStats() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/enrollments')
      const result: EnrollmentResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch enrollment stats')
      }

      if (result.success) {
        const enrollments = result.data
        const total = enrollments.length
        const completed = enrollments.filter(e => e.status === 'completed').length
        const inProgress = enrollments.filter(e => e.status === 'in_progress').length
        const overdue = enrollments.filter(e => {
          // This is a simplified overdue calculation
          // In real implementation, you'd check against due dates
          return e.status === 'enrolled' && !e.completedAt
        }).length

        setStats({ total, completed, inProgress, overdue })
      } else {
        throw new Error(result.error || 'Failed to fetch enrollment stats')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}