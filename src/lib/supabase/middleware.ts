import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type UserRole = 'admin' | 'teacher' | null;

function getUserRole(appMetadata: Record<string, unknown> | undefined): UserRole {
  if (!appMetadata) return null;
  const role = appMetadata.role as string | undefined;
  if (role === 'admin') return 'admin';
  if (role === 'teacher') return 'teacher';
  return null;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Skip authentication if Supabase credentials are not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // No Supabase credentials - allow access to all pages for development
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const role = getUserRole(user?.app_metadata);

  // Route patterns
  const isLoginPage = pathname === '/login';
  const isRootPage = pathname === '/';
  const isTeacherRoute = pathname.startsWith('/teacher');
  const isDashboardRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/members') ||
    pathname.startsWith('/inactive-members') ||
    pathname.startsWith('/teachers') ||
    pathname.startsWith('/classes') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/lessons') ||
    pathname.startsWith('/payments') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/contabilitate') ||
    pathname.startsWith('/documente-asociatie') ||
    pathname.startsWith('/sponsorships') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/productivity') ||
    pathname.startsWith('/dragasani') ||
    pathname.startsWith('/research') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/admin');

  // Not authenticated - redirect to login for protected routes
  if (!user) {
    if (isDashboardRoute || isTeacherRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Authenticated user handling

  // Login page or root - redirect based on role
  if (isLoginPage || isRootPage) {
    const url = request.nextUrl.clone();
    url.pathname = role === 'teacher' ? '/teacher' : '/dashboard';
    return NextResponse.redirect(url);
  }

  // Teacher trying to access admin/dashboard routes
  if (role === 'teacher' && isDashboardRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/teacher';
    return NextResponse.redirect(url);
  }

  // Admin trying to access teacher routes (allow for testing, but redirect to dashboard)
  if (role === 'admin' && isTeacherRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
