import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * TradeNexa Public Access & Compliance Routing Middleware
 *
 * Ensures all public trading, market, documentation, and compliance routes
 * bypass restrictive authentication gates and never return raw 403 Forbidden 
 * errors that crash client navigation.
 */

// Explicitly defined public routes that must always be openly accessible
const PUBLIC_PATHS = [
  '/',
  '/trade',
  '/market',
  '/earn',
  '/leaderboard',
  '/docs',
  '/terms',
  '/privacy',
  '/fees',
  '/assets',
  '/bounty',
  '/contact',
  '/cookies',
  '/guides',
  '/profile',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static assets and Next.js internals unconditionally
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // static files like favicon.ico, images, svgs
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Check if requested path is a known public page or subpath
  const isPublicRoute = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Clone headers to pass geolocation or downstream access flags
  const requestHeaders = new Headers(request.headers);
  const country = request.headers.get('x-vercel-ip-country') || 
                  request.headers.get('cf-ipcountry') || 
                  'UNKNOWN';
  
  requestHeaders.set('x-tradenexa-country', country);
  requestHeaders.set('x-tradenexa-route-access', 'public');

  // Even if a compliance or geofence condition is evaluated at edge,
  // we do NOT return a raw 403/PERMISSION_DENIED response that breaks SPA hydration.
  // Instead, pass the country header downstream for graceful in-app handling.
  if (isPublicRoute) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Add security headers that ensure no cross-origin or client script blocking
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }

  // Fallback for any unknown route: pass through so Next.js not-found.tsx can handle it
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
