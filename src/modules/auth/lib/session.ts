'use server';

import { cookies } from 'next/headers';
import { verifyJwt } from '@/modules/auth/lib/security';
import { Role } from '@/api/schema';
import { findUserById } from '../api/queries/user.queries';

const AUTH_COOKIE_NAME = 'auth_token';

export type UserSession = {
  id: number;
  email: string;
  username: string;
  role: Role;
} | null;

export async function getUserSession(): Promise<UserSession> {
  console.log('🔍 Getting user session...');
  
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    console.log('❌ No auth token found in cookies');
    return null;
  }
  console.log('✅ Found auth token');

  const verifiedPayload = await verifyJwt(token);

  if (!verifiedPayload) {
    console.log('❌ JWT verification failed');
    return null;
  }
  console.log('✅ JWT verified successfully');

  try {
    console.log(`🔍 Looking up user with ID ${verifiedPayload.sub}`);
    const user = await findUserById(Number(verifiedPayload.sub));

    if (!user) {
      console.warn(`❌ User with ID ${verifiedPayload.sub} not found in DB, but valid JWT exists.`);
      return null;
    }

    if (!user.email || !user.username || !user.role) {
      console.warn(`❌ Invalid user data for ID ${verifiedPayload.sub}`);
      return null;
    }

    const session: UserSession = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    console.log('✅ User session created successfully:', { id: user.id, email: user.email });
    return session;

  } catch (error) {
    console.error('❌ Error fetching user data during session retrieval:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
    const session = await getUserSession();
    return !!session;
}

export async function getUserId(): Promise<number | null> {
    const session = await getUserSession();
    return session?.id ?? null;
}
