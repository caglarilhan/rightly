import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/launch-dashboard',
    '/basic-test',
    '/simple-test',
    '/test',
    '/robots.txt',
    '/sitemap.xml',
    '/',
    '/features',
    '/pricing',
    '/docs',
    '/privacy',
    '/security',
    '/support',
    '/terms'
  ]
  
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Diğer sayfalar için normal authentication
  const isAuthenticated = request.cookies.has('auth-token') // veya başka bir auth check
  
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login?redirectTo=' + request.nextUrl.pathname, request.url))
  }

  return NextResponse.next()
}

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
}
