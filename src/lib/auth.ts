import { createClient } from './supabase/server';
import { getProfile } from './db/operations';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const profile = await getProfile(user.id);
  return profile;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect('/login');
  }
  
  return profile;
}

export async function checkAdminRole(userId: string, requiredRole?: 'hr_admin' | 'dev_admin' | 'plant_manager', plantId?: string) {
  const profile = await getProfile(userId);
  
  if (!profile || !profile.adminRoles || profile.adminRoles.length === 0) {
    return false;
  }

  // If no specific role required, any admin role is sufficient
  if (!requiredRole) {
    return true;
  }

  // Check for the specific role
  const hasRole = profile.adminRoles.some(role => {
    if (role.role !== requiredRole) {
      return false;
    }
    
    // For plant-specific roles, check plant match
    if (plantId && role.plantId && role.plantId !== plantId) {
      return false;
    }
    
    return true;
  });

  return hasRole;
}

export async function requireAdminRole(requiredRole?: 'hr_admin' | 'dev_admin' | 'plant_manager', plantId?: string) {
  const user = await requireAuth();
  const hasRole = await checkAdminRole(user.id, requiredRole, plantId);
  
  if (!hasRole) {
    redirect('/unauthorized');
  }
  
  return user;
}

export async function getUserPlantId(userId: string) {
  const profile = await getProfile(userId);
  return profile?.plantId || null;
}

export async function requireUserInPlant(userId: string, plantId: string) {
  const userPlantId = await getUserPlantId(userId);
  
  if (userPlantId !== plantId) {
    redirect('/unauthorized');
  }
  
  return true;
}