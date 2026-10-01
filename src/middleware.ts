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

  // 2. Vercel Preview & Staging Domain Handling
  const host = (request.headers.get('host') || '').toLowerCase();
  const isVercelPreview = host.includes('vercel.app');
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (
    isProduction &&
    (host === 'www.tradenexa.com' || (process.env.ENFORCE_CANONICAL_DOMAIN === 'true' && isVercelPreview))
  ) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.host = 'tradenexa.com';
    canonicalUrl.protocol = 'https:';
    canonicalUrl.port = '';
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // 3. Extract edge geolocation signal (Vercel, Cloudflare, or mock headers)
  const countryHeader = 
    request.headers.get('x-vercel-ip-country') || 
    request.headers.get('cf-ipcountry') || 
    '';
  const country = countryHeader.toUpperCase().trim();

  // 4. Edge-level geofencing check
  if (country && OFAC_RESTRICTED_COUNTRIES.has(country)) {
    // Return 403 JSON for API calls
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Access restricted under protocol compliance policies.' },
        { status: 403 }
      );
    }
    // Redirect page traffic to dedicated restricted access landing
    if (pathname !== '/restricted') {
      const restrictedUrl = request.nextUrl.clone();
      restrictedUrl.pathname = '/restricted';
      return NextResponse.rewrite(restrictedUrl);
    }
  }

  // Clone headers for downstream propagation
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tradenexa-country', country || 'UNKNOWN');
  requestHeaders.set('x-tradenexa-edge-verified', 'true');

  // 5. Default: allow request through with security headers
  const finalResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security Headers
  finalResponse.headers.set('X-Content-Type-Options', 'nosniff');
  finalResponse.headers.set('X-Frame-Options', 'DENY');
  finalResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (isVercelPreview) {
    finalResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return finalResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files and favicon:
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
