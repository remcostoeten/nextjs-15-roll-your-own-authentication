'use server';

import { createToken } from '@/lib/auth';
import { db } from '@/server/db';
import { sessions, users } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { ActionResponse, AuthCredentials } from '../types';

export async function login(credentials: AuthCredentials): Promise<ActionResponse> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email))

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }

    const passwordMatch = await bcrypt.compare(credentials.password, user.password)
    
    if (!passwordMatch) {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }

    const token = await createToken({ userId: user.id, role: user.role })

    // Create a new session
    await db.insert(sessions).values({
      userId: user.id,
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 hours
    })

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Login failed. Please try again.'
    }
  }
} 
