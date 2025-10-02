/**
 * Legacy RLS (Row Level Security) utilities
 * @deprecated Use the new unified auth system from '@/lib/auth' instead
 * This file is maintained for backward compatibility during migration
 */

import type { UserContext } from '@/types';
import { AuthService } from './auth/index';
import { createClient } from './supabase/server';

// Create auth service instance
const authService = new AuthService();

/**
 * @deprecated Use authService.getUserContext() instead
 */
export async function getCurrentUserContext(): Promise<UserContext | null> {
  console.warn('getCurrentUserContext is deprecated. Use authService.getUserContext() instead.');
  
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get user profile with plant and admin roles
  const { data: profile } = await supabase
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

  if (!profile) {
    return null;
  }

  return {
    userId: user.id,
    plantId: profile.plant_id,
    accessiblePlants: [profile.plant_id],
    roles: profile.admin_roles || [],
  };
}

/**
 * @deprecated Use authService.hasAdminRole() instead
 */
export async function hasAdminRole(
  role?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
): Promise<boolean> {
  console.warn('hasAdminRole is deprecated. Use authService.hasAdminRole() instead.');
  
  const context = await getCurrentUserContext();
  
  if (!context) {
    return false;
  }

  // If no specific role required, any admin role is sufficient
  if (!role) {
    return context.roles.length > 0;
  }

  // Check for the specific role
  return context.roles.some(userRole => {
    if (userRole.role !== role) {
      return false;
    }
    
    // For plant-specific roles, check plant match or org-wide admin
    if (plantId && userRole.plantId && userRole.plantId !== plantId) {
      return false;
    }
    
    return true;
  });
}

/**
 * @deprecated Use authService.getAccessiblePlants() instead
 */
export async function requirePlantAccess(plantId: string): Promise<boolean> {
  console.warn('requirePlantAccess is deprecated. Use authService.getAccessiblePlants() instead.');
  
  const context = await getCurrentUserContext();
  
  if (!context) {
    throw new Error('User not authenticated');
  }

  // User's own plant
  if (context.plantId === plantId) {
    return true;
  }

  // HR admins and dev admins have access to all plants
  if (await hasAdminRole('hr_admin') || await hasAdminRole('dev_admin')) {
    return true;
  }

  // Plant managers have access to their managed plants
  if (await hasAdminRole('plant_manager', plantId)) {
    return true;
  }

  throw new Error('Access denied: insufficient permissions for this plant');
}

/**
 * @deprecated Use authService.getAccessiblePlants() instead
 */
export async function getAccessiblePlants(): Promise<string[]> {
  console.warn('getAccessiblePlants is deprecated. Use authService.getAccessiblePlants() instead.');
  
  const context = await getCurrentUserContext();
  
  if (!context) {
    return [];
  }

  const supabase = await createClient();

  // HR and dev admins can access all plants
  if (await hasAdminRole('hr_admin') || await hasAdminRole('dev_admin')) {
    const { data: plants } = await supabase
      .from('plants')
      .select('id')
      .eq('is_active', true);
    
    return plants?.map(p => p.id) || [];
  }

  // Regular users and plant managers
  const accessiblePlantIds = new Set<string>();
  
  // Always include user's own plant
  accessiblePlantIds.add(context.plantId);
  
  // Add plants where user is a plant manager
  context.roles.forEach(role => {
    if (role.role === 'plant_manager' && role.plantId) {
      accessiblePlantIds.add(role.plantId);
    }
  });

  return Array.from(accessiblePlantIds);
}

/**
 * @deprecated Use authService.applyTenantFilter() instead
 */
export async function applyTenantFilter(
  query: any,
  plantIdColumn: string = 'plant_id'
): Promise<any> {
  console.warn('applyTenantFilter is deprecated. Use authService.applyTenantFilter() instead.');
  
  const accessiblePlants = await getAccessiblePlants();
  
  if (accessiblePlants.length === 0) {
    // No accessible plants - return query that returns no results
    return query.eq(plantIdColumn, '00000000-0000-0000-0000-000000000000');
  }

  if (accessiblePlants.length === 1) {
    // Single plant access
    return query.eq(plantIdColumn, accessiblePlants[0]);
  }

  // Multiple plants access
  return query.in(plantIdColumn, accessiblePlants);
}

/**
 * @deprecated Use authService.validateTenantAccess() instead
 */
export async function validateTenantAccess(
  tableName: string,
  recordId: string,
  plantIdColumn: string = 'plant_id'
): Promise<boolean> {
  console.warn('validateTenantAccess is deprecated. Use authService.validateTenantAccess() instead.');
  
  const supabase = await createClient();
  const accessiblePlants = await getAccessiblePlants();

  if (accessiblePlants.length === 0) {
    return false;
  }

  const { data } = await supabase
    .from(tableName)
    .select(plantIdColumn)
    .eq('id', recordId)
    .single();

  if (!data) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plantId = (data as any)[plantIdColumn] as string;
  return accessiblePlants.includes(plantId);
}

/**
 * @deprecated Use authService.getRLSDebugInfo() instead
 */
export async function getRLSDebugInfo() {
  console.warn('getRLSDebugInfo is deprecated. Use authService.getRLSDebugInfo() instead.');
  
  const context = await getCurrentUserContext();
  const accessiblePlants = await getAccessiblePlants();
  
  return {
    userContext: context,
    accessiblePlants,
    permissions: {
      isHRAdmin: await hasAdminRole('hr_admin'),
      isDevAdmin: await hasAdminRole('dev_admin'),
      isPlantManager: await hasAdminRole('plant_manager'),
      isAnyAdmin: await hasAdminRole(),
    },
  };
}