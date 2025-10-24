import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware hit for:', req.nextUrl.pathname);
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => res.cookies.set(name, value));
        },
      },
    }
  );

  // Use getUser() instead of getSession() for security - validates with Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/phase1', '/phase2', '/onboarding', '/clinical', '/registry', '/results', '/admin', '/masteradmin'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing protected route without user, redirect to home page
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based access control for admin routes
  if (user && (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/masteradmin'))) {
    // Fetch user's role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role || 'student';

    // Check if trying to access /masteradmin
    if (req.nextUrl.pathname.startsWith('/masteradmin')) {
      if (userRole !== 'master_admin') {
        // Redirect to dashboard if not master_admin
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    // Check if trying to access /admin
    else if (req.nextUrl.pathname.startsWith('/admin')) {
      if (userRole !== 'admin' && userRole !== 'master_admin') {
        // Redirect to dashboard if not admin or master_admin
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/phase1/:path*', '/phase2/:path*', '/onboarding/:path*', '/clinical/:path*', '/registry/:path*', '/results/:path*', '/admin/:path*', '/masteradmin/:path*'],
};



