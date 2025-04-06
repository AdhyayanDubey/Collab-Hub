import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For now, this is a placeholder middleware
  // In a real app, you would check authentication status here

  // Example: Redirect /api/* requests to your backend API if needed
  // if (request.nextUrl.pathname.startsWith('/api/')) {
  //   return NextResponse.rewrite(new URL('/api', request.url))
  // }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

