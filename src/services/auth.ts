import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/stores/auth-store';
import type { Teacher } from '@/types';

const supabase = createClient();

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  teacherId: string | null;
}

/**
 * Get the role from user's app_metadata
 */
export function getUserRole(appMetadata: Record<string, unknown> | undefined): UserRole {
  if (!appMetadata) return null;
  const role = appMetadata.role as string | undefined;
  if (role === 'admin') return 'admin';
  if (role === 'teacher') return 'teacher';
  return null;
}

/**
 * Get current authenticated user with role information
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  const role = getUserRole(user.app_metadata);
  let teacherId: string | null = null;

  // If user is a teacher, fetch their teacher record
  if (role === 'teacher') {
    const { data: teacher } = await supabase
      .from('teachers')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    teacherId = teacher?.id ?? null;
  }

  return {
    id: user.id,
    email: user.email ?? '',
    role,
    teacherId,
  };
}

/**
 * Get teacher profile by auth_id
 */
export async function getTeacherByAuthId(authId: string): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('auth_id', authId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Update teacher password
 */
export async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error: error ? new Error(error.message) : null };
}

/**
 * Check if email is available (not already registered)
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  // Check teachers table
  const { data: teacher } = await supabase
    .from('teachers')
    .select('id')
    .eq('email', email)
    .single();

  return !teacher;
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get the redirect path based on user role
 */
export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/dashboard';
    case 'teacher':
      return '/teacher';
    default:
      return '/login';
  }
}

/**
 * Check if user has access to a specific route
 */
export function hasRouteAccess(role: UserRole, pathname: string): boolean {
  // Admin can access everything except /teacher routes
  if (role === 'admin') {
    return !pathname.startsWith('/teacher');
  }

  // Teacher can only access /teacher routes and /login
  if (role === 'teacher') {
    return pathname.startsWith('/teacher') || pathname === '/login';
  }

  // No role - only public routes
  return pathname === '/login';
}
