import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, verifyRefreshToken } from '@/shared/utils/jwt'
import { db } from '@/server/db'
import { sessions, users } from '@/server/db/schemas'
import { eq } from 'drizzle-orm'

/**
 * This middleware prevents authenticated users from accessing login/register pages
 */
export async function preventAuthenticatedAccess(
  request: NextRequest
): Promise<NextResponse | undefined> {
  // Check if the route is login or register
  const url = request.nextUrl.pathname
  if (
    !['/login', '/register', '/auth/login', '/auth/register'].includes(url)
  ) {
    return undefined // Not a protected route, continue
  }

  try {
    // Check for access token
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
      return undefined // No token, allow access to login/register
    }

    try {
      // Verify access token
      const payload = await verifyAccessToken(accessToken)

      // User is authenticated, redirect to dashboard or home
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      // Access token is invalid or expired, try to refresh
      const refreshToken = request.cookies.get('refresh_token')?.value

      if (!refreshToken) {
        return undefined // No valid refresh token, allow access to login/register
      }

      try {
        // Verify refresh token
        const payload = await verifyRefreshToken(refreshToken)

        // Check if token exists in database
        const session = await db.query.sessions.findFirst({
          where: eq(sessions.refreshToken, refreshToken),
        })

        if (!session) {
          return undefined // Invalid session, allow access to login/register
        }

        // User has valid session, redirect to dashboard or home
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch (error) {
        return undefined // Invalid refresh token, allow access to login/register
      }
    }
  } catch (error) {
    return undefined // Error occurred, allow access to login/register
  }
}

/**
 * Higher-order function to protect API routes with authentication
 * @param request The Next.js request object
 * @param handler The handler function to execute if authentication is successful
 * @returns The response from the handler or an unauthorized response
 */
export async function withAuth(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Check for access token
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      )
    }

    try {
      // Verify access token
      const payload = await verifyAccessToken(accessToken)

      // Token is valid, proceed with the handler
      return await handler()
    } catch (error) {
      // Access token is invalid or expired
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Authentication middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    )
  }
}

/**
 * Middleware to protect admin routes
 */
export async function requireAdminRole(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Check for access token
    const accessToken = request.cookies.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      )
    }

    // Verify access token
    const payload = await verifyAccessToken(accessToken)

    // Check if user has admin role
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
    })

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admins only' },
        { status: 403 }
      )
    }

    // User is admin, proceed with the handler
    return await handler()
  } catch (error) {
    console.error('Admin role middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error during admin check' },
      { status: 500 }
    )
  }
}
