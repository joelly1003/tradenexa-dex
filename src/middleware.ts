import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * TradeNexa Multi-Layer Edge Geofencing & Compliance Middleware
 *
 * Implements defense-in-depth:
 * 1. Preliminary edge-level geofencing against comprehensive OFAC/FATF sanctioned countries.
 * 2. Redirects restricted regions away from transaction execution routes (/trade) to a clean,
 *    branded /restricted-jurisdiction notice without raw 403 crashes.
 * 3. Keeps documentation, terms, privacy, and educational pages globally accessible for transparency.
 */

// OFAC / FATF High-Risk & Embargoed Country ISO Codes
const OFAC_RESTRICTED_COUNTRIES = new Set([
  'CU', // Cuba
  'IR', // Iran
  'KP', // North Korea
  'SY', // Syria
  'RU', // Russia
  'BY', // Belarus
  'MM', // Myanmar
]);

// Routes involving transaction execution or trading capabilities
const TRANSACTION_ROUTES = ['/trade'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static assets, images, and Next.js internals unconditionally
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Extract edge geolocation signal (Vercel, Cloudflare, or mock headers)
  const countryHeader = 
    request.headers.get('x-vercel-ip-country') || 
    request.headers.get('cf-ipcountry') || 
    '';
  const country = countryHeader.toUpperCase().trim();

  // Clone headers for downstream propagation
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tradenexa-country', country || 'UNKNOWN');
  requestHeaders.set('x-tradenexa-edge-verified', 'true');

  // 3. Edge-level geofencing check for restricted transaction execution
  const isRestrictedCountry = country && OFAC_RESTRICTED_COUNTRIES.has(country);
  const isAttemptingTrade = TRANSACTION_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isRestrictedCountry && isAttemptingTrade) {
    // Instead of throwing an uncaught 403 server error, rewrite/redirect to branded notice
    const restrictedUrl = new URL('/restricted-jurisdiction', request.url);
    return NextResponse.redirect(restrictedUrl);
  }

  // 4. Default: allow request through with security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and favicon:
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
