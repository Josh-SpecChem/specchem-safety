import { useState, useEffect, useCallback } from 'react'

export interface PlantStats {
  plantId: string
  plantName: string
  totalUsers: number
  activeEnrollments: number
  completionRate: number
  averageProgress: number
  overdueCount: number
}

export interface CourseStats {
  courseId: string
  courseName: string
  totalEnrollments: number
  completions: number
  averageScore: number
  averageTimeSpent: number
}

export interface AnalyticsData {
  plantStats?: PlantStats
  courseStats?: CourseStats
}

export interface AnalyticsResponse {
  success: boolean
  data: AnalyticsData
  error?: string
}

export function useAnalytics(plantId?: string, courseId?: string) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (plantId) params.append('plantId', plantId)
      if (courseId) params.append('courseId', courseId)

      const response = await fetch(`/api/admin/analytics?${params}`)
      const result: AnalyticsResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch analytics')
      }

      if (result.success) {
        setAnalytics(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAnalytics({})
    } finally {
      setLoading(false)
    }
  }, [plantId, courseId])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}

// Hook for dashboard overview stats
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEnrollments: 0,
    completionRate: 0,
    overdueTraining: 0,
    totalPlants: 0,
    activePlants: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch users and enrollments data to calculate stats
      const [usersResponse, enrollmentsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/enrollments')
      ])

      const usersResult = await usersResponse.json()
      const enrollmentsResult = await enrollmentsResponse.json()

      if (!usersResponse.ok || !enrollmentsResponse.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      if (usersResult.success && enrollmentsResult.success) {
        const users = usersResult.data
        const enrollments = enrollmentsResult.data

        const totalUsers = users.length
        const activeEnrollments = enrollments.filter((e: { status: string }) => 
          e.status === 'enrolled' || e.status === 'in_progress'
        ).length
        
        const completedEnrollments = enrollments.filter((e: { status: string }) => 
          e.status === 'completed'
        ).length
        const completionRate = enrollments.length > 0 
          ? Math.round((completedEnrollments / enrollments.length) * 100) 
          : 0
        
        const overdueTraining = enrollments.filter((e: { status: string; completedAt: string | null }) => {
          // Simplified overdue calculation
          return e.status === 'enrolled' && !e.completedAt
        }).length

        // Get unique plants from users
        const uniquePlants = new Set(users.map((u: { plantId: string }) => u.plantId))
        const totalPlants = uniquePlants.size
        const activePlants = totalPlants // Assuming all plants with users are active

        setStats({
          totalUsers,
          activeEnrollments,
          completionRate,
          overdueTraining,
          totalPlants,
          activePlants
        })
      } else {
        throw new Error('Failed to process dashboard data')
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