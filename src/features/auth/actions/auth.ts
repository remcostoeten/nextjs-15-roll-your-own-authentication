'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { AuthState } from '../types'

const signUpSchema = z
  .object({
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[0-9]/, 'Must contain number')
      .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Required')
})

async function setSession(userId: string, email: string) {
  const token = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  )

  const cookieStore = cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400
  })
}

export async function signUp(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const validatedFields = signUpSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    })

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors
      }
    }

    const { email, password } = validatedFields.data

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get()

    if (existingUser) {
      return {
        error: {
          email: ['Email already exists']
        }
      }
    }

    const hashedPassword = await hash(password, 10)

    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword
      })
      .returning()

    if (!user?.id) {
      return {
        error: {
          _form: ['Failed to create account']
        }
      }
    }

    await setSession(user.id, user.email)
    redirect('/dashboard')
  } catch (error) {
    console.error('SignUp error:', error)
    return {
      error: {
        _form: ['Failed to create account']
      }
    }
  }
}

export async function signIn(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const validatedFields = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    })

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors
      }
    }

    const { email, password } = validatedFields.data

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get()

    if (!user) {
      return {
        error: {
          email: ['Email not found']
        }
      }
    }

    const passwordMatch = await compare(password, user.password)
    
    if (!passwordMatch) {
      return {
        error: {
          _form: ['Invalid credentials']
        }
      }
    }

    await setSession(user.id, user.email)
    redirect('/dashboard')

  } catch (error) {
    console.error('SignIn error:', error)
    return {
      error: {
        _form: ['Failed to sign in']
      }
    }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  ;(await cookieStore).delete('session')
  redirect('/login')
}
