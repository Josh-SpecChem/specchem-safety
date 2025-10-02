import { NextRequest } from 'next/server';

export interface UserContext {
  id: string;
  email: string;
  role: string;
  plantId: string;
  accessiblePlants: string[];
}

/**
 * Extract user context from middleware-injected headers
 */
export function extractUserContext(request: NextRequest): UserContext | null {
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  const userRole = request.headers.get('x-user-role');
  const userPlantId = request.headers.get('x-user-plant-id');
  const accessiblePlantsHeader = request.headers.get('x-accessible-plants');
  
  if (!userId || !userEmail) {
    return null;
  }
  
  const accessiblePlants = accessiblePlantsHeader === '["*"]' 
    ? ['*'] 
    : JSON.parse(accessiblePlantsHeader || '[]');
  
  return {
    id: userId,
    email: userEmail,
    role: userRole || 'user',
    plantId: userPlantId || '',
    accessiblePlants
  };
}

/**
 * Require authentication - throws if no user context
 */
export function requireAuth(request: NextRequest): UserContext {
  const context = extractUserContext(request);
  if (!context) {
    throw new Error('Authentication required');
  }
  return context;
}

/**
 * Require specific role or higher - throws if insufficient permissions
 */
export function requireRole(request: NextRequest, requiredRole: string): UserContext {
  const context = requireAuth(request);
  
  const roleHierarchy = ['hr_admin', 'dev_admin', 'plant_manager', 'user'];
  const userRoleIndex = roleHierarchy.indexOf(context.role);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  if (userRoleIndex > requiredRoleIndex) {
    throw new Error('Insufficient permissions');
  }
  
  return context;
}

/**
 * Check if user has access to specific plant
 */
export function hasPlantAccess(request: NextRequest, plantId: string): boolean {
  const context = extractUserContext(request);
  if (!context) return false;
  
  // Admin users can access all plants
  if (context.accessiblePlants.includes('*')) return true;
  
  // Check if user has access to specific plant
  return context.accessiblePlants.includes(plantId);
}

/**
 * Require plant access - throws if no access
 */
export function requirePlantAccess(request: NextRequest, plantId: string): UserContext {
  const context = requireAuth(request);
  
  if (!hasPlantAccess(request, plantId)) {
    throw new Error('Access denied to plant');
  }
  
  return context;
}
