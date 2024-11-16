import { verifyToken } from '@/features/authentication/queries/verify-token';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// Add paths that should be public
const publicPaths = ['/login', '/register', '/'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    const payload = await verifyToken(token.value);
    if (!payload?.userId) {
      throw new Error('Invalid token');
    }
    return NextResponse.next();
  } catch (error) {
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
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
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
