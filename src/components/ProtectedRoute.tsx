'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(fallbackPath)
        return
      }

      if (requireAdmin && profile && !['hr_admin', 'dev_admin'].includes(profile.role)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [user, profile, loading, requireAdmin, router, fallbackPath])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || (requireAdmin && profile && !['hr_admin', 'dev_admin'].includes(profile.role))) {
    return null
  }

  return <>{children}</>
}