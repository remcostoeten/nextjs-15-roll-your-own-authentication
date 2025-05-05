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
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const verifiedPayload = await verifyJwt(token);

  if (!verifiedPayload) {
    return null;
  }

  try {
    const user = await findUserById(Number(verifiedPayload.sub));

    if (!user) {
      console.warn(`User with ID ${verifiedPayload.sub} not found in DB, but valid JWT exists.`);
      return null;
    }

    const session: UserSession = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return session;

  } catch (error) {
    console.error('Error fetching user data during session retrieval:', error);
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
