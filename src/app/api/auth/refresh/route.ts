import { NextRequest, NextResponse } from 'next/server';
import { refreshToken } from '@/modules/authentication/api/mutations/refresh-token';

export async function POST(request: NextRequest) {
  try {
    // Get the refresh token from cookies
    const token = request.cookies.get('refresh_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }
    
    // Get request info (optional)
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || undefined;
    
    // Call the refresh function
    const result = await refreshToken(token, { userAgent, ipAddress });
    
    // Create a response
    const response = NextResponse.json(result, { status: 200 });
    
    // Set new cookies
    response.cookies.set({
      name: 'access_token',
      value: result.tokens.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });
    
    response.cookies.set({
      name: 'refresh_token',
      value: result.tokens.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Clear the cookies if the refresh fails
    const response = NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred during token refresh' },
      { status: 401 }
    );
    
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    
    return response;
  }
} 