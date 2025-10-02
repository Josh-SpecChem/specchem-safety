import type { AdminRole, SupabaseClient, SupabaseUser } from '@/types/api';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ConfigurationService } from '../configuration';

/**
 * Unified Middleware System
 * Handles authentication, authorization, and context injection in a single flow
 */

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/auth/callback',
  '/api/auth',
  '/api/health',        // Health check endpoint
  '/api/test',          // Test endpoints
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
  '/ebook',
  '/ebook-spanish',
  '/handbook',
  '/_next',
  '/favicon.ico'
];

// Static asset patterns
const STATIC_ASSET_PATTERNS = [
  '/_next/static',
  '/images',
  /\.(svg|png|jpg|jpeg|gif|webp)$/
];

/**
 * Main middleware function - unified authentication and authorization
 */
export async function middleware(request: NextRequest) {
  const { url, anonKey } = ConfigurationService.getSupabaseConfig();
  
  // Create Supabase client
  const supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Get user session
  const { data: { user } } = await supabase.auth.getUser();
  
  // Handle authentication and authorization
  const response = await handleAuthAndAuthz(request, user!, supabaseResponse, supabase);
  
  return response;
}

/**
 * Unified authentication and authorization handler
 */
async function handleAuthAndAuthz(
  request: NextRequest,
  user: SupabaseUser,
  supabaseResponse: NextResponse,
  supabase: SupabaseClient
): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  
  // Check if path is public or static asset
  if (isPublicPath(pathname) || isStaticAsset(pathname)) {
    return supabaseResponse;
  }
  
  // Redirect unauthenticated users to login
  if (!user) {
    return redirectToLogin(request, pathname);
  }
  
  // Inject user context for downstream use
  supabaseResponse.headers.set('x-user-id', user.id);
  supabaseResponse.headers.set('x-user-email', user.email || '');
  
  // Get user profile and roles
  try {
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select(`
        plant_id,
        admin_roles (
          role,
          plant_id
        )
      `)
      .eq('id', user.id)
      .single();
    
    if (profile) {
      supabaseResponse.headers.set('x-user-plant-id', profile.plant_id || '');
      
      // Determine user role
      const userRole = determineUserRole(profile.admin_roles || []);
      supabaseResponse.headers.set('x-user-role', userRole);
      
      // Set accessible plants
      const accessiblePlants = getAccessiblePlants(profile.admin_roles || [], profile.plant_id);
      supabaseResponse.headers.set('x-accessible-plants', JSON.stringify(accessiblePlants));
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
  
  // Add debug headers in development
  if (ConfigurationService.getNextJSConfig().isDevelopment) {
    addDebugHeaders(supabaseResponse);
  }
  
  return supabaseResponse;
}

/**
 * Check if path is public (doesn't require authentication)
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}

/**
 * Check if path is a static asset
 */
function isStaticAsset(pathname: string): boolean {
  return STATIC_ASSET_PATTERNS.some(pattern => {
    if (typeof pattern === 'string') {
      return pathname.startsWith(pattern);
    }
    return pattern.test(pathname);
  });
}

/**
 * Redirect to login page with redirect parameter
 */
function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('redirectTo', pathname);
  return NextResponse.redirect(url);
}

/**
 * Determine user role from admin roles
 */
function determineUserRole(adminRoles: AdminRole[]): string {
  if (adminRoles.some(role => role.role === 'hr_admin')) return 'hr_admin';
  if (adminRoles.some(role => role.role === 'dev_admin')) return 'dev_admin';
  if (adminRoles.some(role => role.role === 'plant_manager')) return 'plant_manager';
  return 'user';
}

/**
 * Get accessible plants for user
 */
function getAccessiblePlants(adminRoles: AdminRole[], userPlantId: string): string[] {
  // HR and Dev admins can access all plants
  if (adminRoles.some(role => role.role === 'hr_admin' || role.role === 'dev_admin')) {
    return ['*']; // Special marker for all plants
  }
  
  // Plant managers can access their assigned plants
  const plantManagerPlants = adminRoles
    .filter(role => role.role === 'plant_manager')
    .map(role => role.plantId)
    .filter(Boolean);
  
  // Regular users can access their own plant
  return [...new Set([userPlantId, ...plantManagerPlants])].filter(Boolean) as string[];
}

/**
 * Add debug headers in development
 */
function addDebugHeaders(response: NextResponse): void {
  response.headers.set('x-rls-enabled', 'true');
  response.headers.set('x-tenant-isolation', 'plant-based');
  response.headers.set('x-development-mode', 'true');
  response.headers.set('x-debug-timestamp', new Date().toISOString());
}

// Middleware configuration
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
