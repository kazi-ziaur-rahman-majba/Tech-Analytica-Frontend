import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Public routes - allow access
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Check if token exists
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based redirects
  if (role === 'ADMIN') {
    if (pathname.startsWith('/my-tasks')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (role === 'USER') {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/my-tasks', request.url));
    }
    if (pathname.startsWith('/tasks') || pathname.startsWith('/audit-log')) {
      return NextResponse.redirect(new URL('/my-tasks', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/tasks/:path*',
    '/audit-log/:path*',
    '/audit-logs/:path*',
    '/my-tasks/:path*',
  ],
};