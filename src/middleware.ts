import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/modules/auth/lib/security';
import { LogActionInput, logUserAction } from './modules/metrics/api/mutations/log-actions.mutation';

const AUTH_COOKIE_NAME = 'auth_token';
const PUBLIC_PATHS = ['/login', '/register'];
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
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const requestContext = getMiddlewareRequestContext(request);

  let userId: number | null = null;
  let tokenIsValid = false;
  let response = NextResponse.next(); // Start with default response

  if (token) {
    const verifiedPayload = await verifyJwt(token);
    if (verifiedPayload) {
      tokenIsValid = true;
      userId = Number(verifiedPayload.sub);
    } else {
      // Token exists but is invalid/expired, clear it
      response.cookies.delete(AUTH_COOKIE_NAME);
    }
  }

  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  const isAuthOnlyPath = AUTH_ONLY_PATHS.some(path => pathname.startsWith(path));

  // 1. Logged in user on public path -> Redirect to dashboard
  if (tokenIsValid && isPublicPath) {
    const redirectUrl = new URL('/dashboard', request.url);
    response = NextResponse.redirect(redirectUrl);
    await logUserAction({ ...requestContext, userId, actionType: 'MIDDLEWARE_REDIRECT_AUTH', details: { from: pathname, to: '/dashboard' } });
    return response;
  }

  // 2. Logged out user on protected path -> Redirect to login
  if (!tokenIsValid && isAuthOnlyPath) {
    const loginUrl = new URL('/login', request.url);
    response = NextResponse.redirect(loginUrl);
    // Log the redirect action (userId is null here)
    await logUserAction({ ...requestContext, userId: null, actionType: 'MIDDLEWARE_REDIRECT_UNAUTH', details: { from: pathname, to: '/login' } });
    // Ensure cookie is cleared if it was invalid
    if (token) response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  // 3. Log general page view for authenticated users (optional)
  // if (tokenIsValid && !isPublicPath && !isAuthOnlyPath) { // Avoid logging redirects again
  //     await logUserAction({ ...requestContext, userId, actionType: 'VIEW_PAGE' });
  // }

  // Return the calculated response (either redirect or next())
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
