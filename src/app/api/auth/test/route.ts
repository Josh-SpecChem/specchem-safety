import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
      success: true,
      message: 'Auth API routes are working correctly',
      user: user ? {
        id: user.id,
        email: user.email,
        authenticated: true
      } : null,
      timestamp: new Date().toISOString(),
      routes: {
        callback: '/api/auth/callback',
        confirm: '/api/auth/confirm',
        error: '/auth/auth-code-error'
      }
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error testing auth setup',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}