// src/api/queries/user.queries.ts
import { db } from '@/api/db';
import { users } from '@/api/schema';
import { eq, or } from 'drizzle-orm';

export async function findUserById(id: number, includeProfile: boolean = false) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        profile: includeProfile ? true : undefined,
      },
      columns: {
        passwordHash: false,
      },
    });
    return user || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

export async function findUserByEmailWithPassword(email: string) {
  if (!email) return null;
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
    return user || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

export async function findUserByUsernameWithPassword(username: string) {
    if (!username) return null;
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
        });
        return user || null;
    } catch (error) {
        console.error('Error finding user by username:', error);
        return null;
    }
}

export async function findUserByIdentifierWithPassword(identifier: string) {
    if (!identifier) return null;
    try {
        const user = await db.query.users.findFirst({
            where: or(
                eq(users.email, identifier.toLowerCase()),
                eq(users.username, identifier)
            ),
        });
        return user || null;
    } catch (error) {
        console.error('Error finding user by identifier:', error);
        return null;
    }
}

export async function checkUserExists(email: string, username: string): Promise<boolean> {
  try {
    const existingUser = await db.query.users.findFirst({
      where: or(
        eq(users.email, email.toLowerCase()),
        eq(users.username, username)
      ),
      columns: {
        id: true,
      },
    });
    return !!existingUser;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return true; // Or throw error
  }
}

