'use server';

import { db } from '@/api/db';
import { users } from '@/api/schema';
import { eq, or } from 'drizzle-orm';
import { getUserSession } from '@/modules/auth/lib/session';
import type { UserSession } from '@/modules/auth/lib/session';

export async function findUserById(id: number, includeProfile: boolean = false) {
  console.log(`🔍 Finding user by ID: ${id}`);
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
    
    if (!user) {
      console.log(`❌ No user found with ID: ${id}`);
      return null;
    }
    
    console.log(`✅ Found user:`, { id: user.id, email: user.email });
    return user;
  } catch (error) {
    console.error('❌ Error finding user by ID:', error);
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

export async function getCurrentUser(): Promise<UserSession | null> {
  console.log('🔍 Getting current user...');
  try {
    const session = await getUserSession();
    if (!session) {
      console.log('❌ No active session found');
      return null;
    }
    console.log('✅ Session found:', { id: session.id });

    const user = await findUserById(session.id);
    if (!user || !user.email || !user.username || !user.role) {
      console.warn('❌ Invalid user data');
      return null;
    }

    const userSession = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    console.log('✅ Current user loaded successfully:', { id: user.id, email: user.email });
    return userSession;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
}
