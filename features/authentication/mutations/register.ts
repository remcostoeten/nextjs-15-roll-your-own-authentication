'use server';

import { db } from '@/server/db';
import { profiles, users } from '@/server/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { ActionResponse, AuthCredentials } from '../types';
import { login } from './login';

export async function register(credentials: AuthCredentials): Promise<ActionResponse> {
  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email))

    if (existingUser) {
      return {
        success: false,
        error: 'User already exists'
      }
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10)

    // Start a transaction to ensure both user and profile are created
    const result = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: credentials.email,
          password: hashedPassword,
          role: credentials.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
        })
        .returning()

      await tx.insert(profiles).values({
        userId: user.id,
        isAdmin: credentials.email === process.env.ADMIN_EMAIL,
        socials: {},
      })

      return user
    })

    // Auto login after registration
    const loginResponse = await login(credentials)
    return loginResponse

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return {
        success: false,
        error: 'Email already in use'
      }
    }

    return {
      success: false,
      error: 'Error creating user'
    }
  }
} 
