import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard';

  if (code) {
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
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
    }

    if (data.session) {
      // Check if profile exists, if not create one
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (!profile && !profileError) {
        // Create profile for new user
        await supabase.from('profiles').insert({
          id: data.session.user.id,
          email: data.session.user.email!,
          full_name: data.session.user.user_metadata?.full_name || null,
          role: 'student', // Default role
        });
      }

      // Redirect to the intended destination
      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    }
  }

  // If no code or error, redirect to login
  return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin));
}



