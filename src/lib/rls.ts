import { createClient } from './supabase/server';

/**
 * RLS (Row Level Security) utilities for SpecChem Safety Training
 * These functions help enforce tenant isolation and role-based access control
 */

export interface UserContext {
  userId: string;
  plantId: string;
  roles: Array<{
    role: 'hr_admin' | 'dev_admin' | 'plant_manager';
    plantId?: string;
  }>;
}

/**
 * Get the current user's context including plant and roles
 */
export async function getCurrentUserContext(): Promise<UserContext | null> {
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
    roles: profile.admin_roles || [],
  };
}

/**
 * Check if the current user has a specific admin role
 */
export async function hasAdminRole(
  role?: 'hr_admin' | 'dev_admin' | 'plant_manager',
  plantId?: string
): Promise<boolean> {
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
 * Ensure the current user has access to a specific plant
 */
export async function requirePlantAccess(plantId: string): Promise<boolean> {
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
 * Get the list of plants the current user can access
 */
export async function getAccessiblePlants(): Promise<string[]> {
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
 * Apply tenant filtering to a Supabase query
 */
export async function applyTenantFilter(
  query: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  plantIdColumn: string = 'plant_id'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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
 * Validate that a record belongs to an accessible plant
 */
export async function validateTenantAccess(
  tableName: string,
  recordId: string,
  plantIdColumn: string = 'plant_id'
): Promise<boolean> {
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
 * Get RLS context for debugging
 */
export async function getRLSDebugInfo() {
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