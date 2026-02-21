// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Routes publiques (accessibles sans authentification)
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à login/register
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Spécifiez sur quelles routes le middleware s'applique
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};