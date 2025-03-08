import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user';
import { withAuth } from '@/modules/authentication/api/middleware';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      // Get the access token from cookies
      const accessToken = request.cookies.get('access_token')?.value;
      
      if (!accessToken) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      // Get the current user
      const user = await getCurrentUser(accessToken);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error('Get user error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'An error occurred while getting user' },
        { status: 500 }
      );
    }
  });
} 