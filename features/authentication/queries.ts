'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const token = cookies().get('token');
  
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token.value);
  
  if (!payload?.userId) {
    return null;
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, payload.userId as string));

  return user || null;
} 
