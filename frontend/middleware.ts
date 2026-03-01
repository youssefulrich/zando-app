import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Routes publiques
  const publicPaths = [
    '/',
    '/residences',
    '/vehicles',
    '/login',
    '/register',
  ];

  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  );

  // Routes protégées
  const protectedPaths = [
    '/profile',
    '/bookings',
    '/owner',
  ];

  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};