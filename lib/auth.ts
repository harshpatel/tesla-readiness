import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Profile } from '@/lib/types/database';

/**
 * Get the current user session from server components
 * Uses getUser() instead of getSession() to validate the session with Supabase server
 */
export async function getSession() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
  
  // Use getUser() to validate the session with Supabase Auth server
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  // Get the session after validating the user
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return session;
}

/**
 * Get the current user's profile
 * Uses getUser() to validate the session with Supabase Auth server
 * If impersonating, returns the impersonated user's profile
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  );
  
  // Use getUser() to validate the session with Supabase Auth server
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return null;
  }
  
  // Check if we're impersonating another user
  const impersonatingUserId = cookieStore.get('impersonating_user_id')?.value;
  const userId = impersonatingUserId || user.id;
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return profile as Profile;
}

/**
 * Check if the current user is an admin (regular admin or master admin)
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'admin' || user?.role === 'master_admin';
}

/**
 * Check if the current user is a master admin
 */
export async function isMasterAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'master_admin';
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

/**
 * Require admin role - throw error if not admin
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || (user.role !== 'admin' && user.role !== 'master_admin')) {
    throw new Error('Forbidden - Admin access required');
  }
  
  return user;
}

/**
 * Require master admin role - throw error if not master admin
 */
export async function requireMasterAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'master_admin') {
    throw new Error('Forbidden - Master Admin access required');
  }
  
  return user;
}

/**
 * Check if currently impersonating another user
 */
export async function getImpersonationState() {
  const cookieStore = await cookies();
  const impersonatingUserId = cookieStore.get('impersonating_user_id')?.value;
  const originalAdminId = cookieStore.get('original_admin_id')?.value;
  
  return {
    isImpersonating: !!impersonatingUserId,
    impersonatedUserId: impersonatingUserId || null,
    originalAdminId: originalAdminId || null,
  };
}

/**
 * Get the real admin user (even when impersonating)
 */
export async function getRealUser() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return null;
  }
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    return null;
  }
  
  return profile as Profile;
}

/**
 * Check if mutations should be blocked (when impersonating)
 * Returns an error response if mutations are blocked, null otherwise
 */
export async function checkMutationAllowed() {
  const { isImpersonating } = await getImpersonationState();
  
  if (isImpersonating) {
    return {
      blocked: true,
      error: 'Mutations are not allowed while impersonating a user. This is read-only mode.',
    };
  }
  
  return { blocked: false };
}

/**
 * Get impersonation data for Header component
 * Returns undefined if not impersonating
 */
export async function getImpersonationDataForHeader() {
  const impersonationState = await getImpersonationState();
  
  if (!impersonationState.isImpersonating) {
    return undefined;
  }
  
  const user = await getCurrentUser();
  
  if (!user) {
    return undefined;
  }
  
  return {
    isImpersonating: true,
    impersonatedUserName: user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user.full_name || user.email,
    impersonatedUserEmail: user.email,
  };
}



