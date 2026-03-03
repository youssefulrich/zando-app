import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Si pas connecté → rediriger seulement les routes privées
  if (!token) {
    if (
      pathname.startsWith("/profile") ||
      pathname.startsWith("/bookings") ||
      pathname.startsWith("/owner")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Si connecté → empêcher accès login/register
  if (
    token &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 🔥 IMPORTANT : middleware appliqué UNIQUEMENT aux routes privées
export const config = {
  matcher: ["/profile/:path*", "/bookings/:path*", "/owner/:path*"],
};