import { userRepository } from '@/api/db/user-repository';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the current session
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user data from the repository
    const user = await userRepository.findById(session.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data without sensitive information
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
