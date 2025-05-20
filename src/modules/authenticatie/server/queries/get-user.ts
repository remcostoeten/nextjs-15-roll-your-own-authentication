import { db } from '@/api/db/connection';
import { users } from '@/api/db/schema';
import { type TUser } from '@/api/db/user-repository';
import { eq } from 'drizzle-orm';
import { type NextRequest } from 'next/server';
import { verifyJwt } from '../../helpers/jwt';

export async function getUserFromRequest(req: NextRequest): Promise<TUser | null> {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;

  const payload = await verifyJwt(token);
  if (!payload) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.id)
  });

  return user || null;
}
