'use server';

import { db } from '@/server/db';
import { sessions } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function logout(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Clear the session from the database
    await db.delete(sessions).where(eq(sessions.userId, userId));

    // Clear the cookie
    (await
      // Clear the cookie
      cookies()).delete('token');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Logout failed. Please try again.' };
  }
} 
