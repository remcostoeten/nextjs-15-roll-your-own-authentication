'use client';

import { db } from '@/server/db';
import { profiles, sessions, users } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { createToken } from './queries/create-token';

export type AuthCredentials = {
  email: string;
  password: string;
};

export async function loginUser(credentials: AuthCredentials) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email));

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    const token = await createToken({ userId: user.id, role: user.role });

    // Create a new session
    await db.insert(sessions).values({
      userId: user.id,
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 hours
    });

    // Return the user data instead of redirecting
    return { user };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed. Please try again.');
  }
}

export async function registerUser(credentials: AuthCredentials) {
  try {
    // Validate email format
    if (!credentials.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    // Validate password length
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email));

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    // Start a transaction to ensure both user and profile are created
    const [user] = await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          email: credentials.email,
          password: hashedPassword,
          role: credentials.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
        })
        .returning();

      await tx.insert(profiles).values({
        userId: newUser.id,
        isAdmin: credentials.email === process.env.ADMIN_EMAIL,
        socials: {},
      });

      return [newUser];
    });

    return { user }; // Return the user object instead of redirecting
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Registration failed. Please try again.');
  }
}

export async function logoutUser() {
  const token = cookies().get('token');
  
  if (token) {
    // Delete the session from the database
    await db
      .delete(sessions)
      .where(eq(sessions.token, token.value));
  }
  
  cookies().delete('token');
  return { success: true };
} 
