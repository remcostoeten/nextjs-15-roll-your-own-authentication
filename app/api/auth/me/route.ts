import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('token=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, payload.userId));

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 
