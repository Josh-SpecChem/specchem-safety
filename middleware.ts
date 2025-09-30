import { type NextRequest } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update the user's session
  const supabaseResponse = await updateSession(request);
  
  // Add RLS context headers for debugging in development
  if (process.env.NODE_ENV === 'development') {
    supabaseResponse.headers.set('x-rls-enabled', 'true');
    supabaseResponse.headers.set('x-tenant-isolation', 'plant-based');
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images in the public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};