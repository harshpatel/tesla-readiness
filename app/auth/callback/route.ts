import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('========== AUTH CALLBACK HIT ==========');
  
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard';

  // Use public site URL for redirects (Render uses localhost:10000 internally)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  // Debug logging
  console.log('Callback URL:', requestUrl.href);
  console.log('Request origin:', requestUrl.origin);
  console.log('Site URL for redirects:', siteUrl);
  console.log('Parameters:', {
    token_hash,
    type,
    code,
    redirectTo,
    allParams: Object.fromEntries(requestUrl.searchParams.entries()),
  });
  console.log('==========================================');

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

  // Handle magic link verification
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', siteUrl));
    }
  }
  
  // Handle PKCE code exchange
  if (code) {
    console.log('Attempting to exchange code for session...');
    console.log('Available cookies:', cookieStore.getAll().map(c => c.name));
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      console.error('This likely means the code_verifier is missing from cookies');
      return NextResponse.redirect(new URL('/?error=auth_failed', siteUrl));
    }

    if (data.session) {
      // Check if profile exists, if not create one
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (!profile && !profileError) {
        // Determine role based on email
        const email = data.session.user.email!;
        let role: 'student' | 'admin' | 'master_admin' = 'student';
        
        // Master admins
        if (email === 'harsh@teslamr.com' || email === 'ricky@teslamr.com') {
          role = 'master_admin';
        }
        // @teslamr.com emails are admins
        else if (email.endsWith('@teslamr.com')) {
          role = 'admin';
        }
        
        // Create profile for new user
        await supabase.from('profiles').insert({
          id: data.session.user.id,
          email: email,
          full_name: data.session.user.user_metadata?.full_name || null,
          role: role,
        });
      }

      // Redirect to the intended destination
      return NextResponse.redirect(new URL(redirectTo, siteUrl));
    }
  }

  // After OTP verification or code exchange, check for session
  // Using getSession() here is safe because we just verified/exchanged above
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Check if profile exists, if not create one
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile && !profileError) {
      // Determine role based on email
      const email = session.user.email!;
      let role: 'student' | 'admin' | 'master_admin' = 'student';
      
      // Master admins
      if (email === 'harsh@teslamr.com' || email === 'ricky@teslamr.com') {
        role = 'master_admin';
      }
      // @teslamr.com emails are admins
      else if (email.endsWith('@teslamr.com')) {
        role = 'admin';
      }
      
      // Create profile for new user
      await supabase.from('profiles').insert({
        id: session.user.id,
        email: email,
        full_name: session.user.user_metadata?.full_name || null,
        role: role,
      });
    }

    // Redirect to the intended destination
    return NextResponse.redirect(new URL(redirectTo, siteUrl));
  }

  // If no valid auth, redirect to login
  return NextResponse.redirect(new URL('/?error=no_auth', siteUrl));
}



