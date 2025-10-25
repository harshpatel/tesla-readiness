import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Check if current user is admin or master_admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'master_admin')) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get the user ID to impersonate from request body
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify the target user exists and is a student
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('id, role, email, first_name, last_name, full_name')
      .eq('id', userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role !== 'student') {
      return NextResponse.json({ error: 'Can only impersonate students' }, { status: 400 });
    }

    // Set impersonation cookie (httpOnly for security)
    cookieStore.set('impersonating_user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours max (safety limit)
    });

    // Also set the admin's original ID to remember who's impersonating
    cookieStore.set('original_admin_id', currentUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Impersonation started',
      impersonatedUser: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.first_name && targetUser.last_name 
          ? `${targetUser.first_name} ${targetUser.last_name}`
          : targetUser.full_name || targetUser.email
      }
    });
  } catch (error) {
    console.error('Impersonation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

