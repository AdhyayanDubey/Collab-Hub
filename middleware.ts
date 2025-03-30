import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_token")
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/api/seed"]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

  // API routes (except auth-related ones) should be protected
  const isApiRoute = pathname.startsWith("/api") && !pathname.startsWith("/api/auth")

  // If not authenticated and trying to access a protected route, redirect to login
  if (!authCookie && !isPublicRoute && (isApiRoute || !pathname.startsWith("/api"))) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If authenticated and trying to access login, redirect to workspaces
  if (authCookie && pathname === "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/workspaces"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

