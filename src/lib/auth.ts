/**
 * Legacy Authentication Functions - DEPRECATED
 * @deprecated This file is deprecated and will be removed in the next major version.
 * Use the unified authentication system from '@/lib/auth' instead.
 * 
 * This file is maintained for backward compatibility during migration.
 * All functions in this file are deprecated and should not be used in new code.
 */

import { createClient } from './supabase/server';
import { getProfile } from './db/operations';
import { redirect } from 'next/navigation';

/**
 * @deprecated Use AuthService.getCurrentUser() instead
 */
export async function getCurrentUser() {
  console.warn('getCurrentUser is deprecated. Use AuthService.getCurrentUser() instead.');
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

/**
 * @deprecated Use AuthService.getCurrentProfile() instead
 */
export async function getCurrentProfile() {
  console.warn('getCurrentProfile is deprecated. Use AuthService.getCurrentProfile() instead.');
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  const profile = await getProfile(user.id);
  return profile;
}

/**
 * @deprecated Use AuthService.requireAuth() instead
 */
export async function requireAuth() {
  console.warn('requireAuth is deprecated. Use AuthService.requireAuth() instead.');
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * @deprecated Use AuthService.requireProfile() instead
 */
export async function requireProfile() {
  console.warn('requireProfile is deprecated. Use AuthService.requireProfile() instead.');
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect('/login');
  }
  
  return profile;
}

/**
 * @deprecated Use AuthService.hasAdminRole() instead
 */
export async function checkAdminRole(userId: string, requiredRole?: 'hr_admin' | 'dev_admin' | 'plant_manager', plantId?: string) {
  console.warn('checkAdminRole is deprecated. Use AuthService.hasAdminRole() instead.');
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use AuthService.requireAdminRole() instead
 */
export async function requireAdminRole(requiredRole?: 'hr_admin' | 'dev_admin' | 'plant_manager', plantId?: string) {
  console.warn('requireAdminRole is deprecated. Use AuthService.requireAdminRole() instead.');
  const user = await requireAuth();
  throw new Error('This function is deprecated. Use the unified authentication system.');
}

/**
 * @deprecated Use AuthService.getUserPlantId() instead
 */
export async function getUserPlantId(userId: string) {
  console.warn('getUserPlantId is deprecated. Use AuthService.getUserPlantId() instead.');
  const profileResponse = await getProfile(userId);
  return profileResponse.success ? profileResponse.data?.plantId || null : null;
}

/**
 * @deprecated Use AuthService.requireUserInPlant() instead
 */
export async function requireUserInPlant(userId: string, plantId: string) {
  console.warn('requireUserInPlant is deprecated. Use AuthService.requireUserInPlant() instead.');
  const userPlantId = await getUserPlantId(userId);
  
  if (userPlantId !== plantId) {
    redirect('/unauthorized');
  }
  
  return true;
}