import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken } from '@/shared/utils/jwt';
import { db } from '@/server/db';
import { sessions } from '@/server/db/schemas';
import { eq } from 'drizzle-orm';

/**
 * This middleware handles authentication for API routes
 * It verifies the access token and adds the user to the request
 * If the access token is expired, it tries to refresh it using the refresh token
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Check for access token
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    try {
      // Verify access token
      const payload = await verifyAccessToken(accessToken);
      
      // Token is valid, continue to handler
      return handler(request);
    } catch (error) {
      // Access token is invalid or expired, try to refresh
      const refreshToken = request.cookies.get('refresh_token')?.value;
      
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token and no refresh token' },
          { status: 401 }
        );
      }
      
      try {
        // Verify refresh token
        const payload = await verifyRefreshToken(refreshToken);
        
        // Check if token exists in database
        const session = await db.query.sessions.findFirst({
          where: eq(sessions.refreshToken, refreshToken),
        });
        
        if (!session) {
          return NextResponse.json(
            { error: 'Unauthorized - Invalid refresh token' },
            { status: 401 }
          );
        }
        
        // Token is valid, continue to handler
        // The client will need to handle refresh separately
        return handler(request);
      } catch (error) {
        return NextResponse.json(
          { error: 'Unauthorized - Token refresh failed' },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 