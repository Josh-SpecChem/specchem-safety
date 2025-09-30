import { useState, useEffect, useCallback } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  jobTitle: string
  role: string
  isActive: boolean
  plantId: string
  plant: {
    name: string
    location: string
  }
  enrollments: Array<{
    courseId: string
    courseName: string
    status: string
    enrolledAt: string
    completedAt: string | null
  }>
  lastLoginAt: string | null
  createdAt: string
}

export interface UserFilters {
  search?: string
  plantId?: string
  role?: string
  isActive?: boolean
  limit?: number
  offset?: number
}

export interface UserResponse {
  success: boolean
  data: User[]
  error?: string
}

export function useUsers(filters: UserFilters = {}) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.plantId) params.append('plantId', filters.plantId)
      if (filters.role) params.append('role', filters.role)
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive))
      if (filters.limit) params.append('limit', String(filters.limit))
      if (filters.offset) params.append('offset', String(filters.offset))

      const response = await fetch(`/api/admin/users?${params}`)
      const result: UserResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users')
      }

      if (result.success) {
        setUsers(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [
    filters.search,
    filters.plantId,
    filters.role,
    filters.isActive,
    filters.limit,
    filters.offset
  ])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  }
}

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/users?search=${userId}&limit=1`)
      const result: UserResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch user')
      }

      if (result.success && result.data.length > 0) {
        setUser(result.data[0])
      } else {
        setUser(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  }
}