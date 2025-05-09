import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/modules/auth/lib/security';
import { LogActionInput, logUserAction } from './modules/metrics/api/mutations/log-actions.mutation';

const AUTH_COOKIE_NAME = 'auth_token';
const PUBLIC_PATHS = ['/login', '/register', '/', '/api/auth/login', '/api/auth/register'];
const AUTH_ONLY_PATHS = ['/dashboard'];

// Helper to get request context in middleware
async function getMiddlewareRequestContext(request: NextRequest): Promise<Omit<LogActionInput, 'userId' | 'actionType' | 'details'>> {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || null;
    const userAgent = request.headers.get('user-agent');
    const path = request.nextUrl.pathname;

    // GeoIP lookup could be done here too if needed/performant enough
    // let geo = request.geo; // Next.js geo object (if configured)

    
    return {
        ipAddress: ip,
        userAgent: userAgent,
        path: path,
        // country: geo?.country,
        // region: geo?.region,
        // city: geo?.city,
    };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    // Redirect to login if no token found
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.includes('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Verify the token
    const payload = await verifyJwt(token);
    
      if (!payload) {
      throw new Error('Invalid token');
    }

    // Token is valid, continue
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
