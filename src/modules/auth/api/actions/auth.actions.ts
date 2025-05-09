'use server'

import { z } from "zod"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

import { db } from "@/api/db"
import { users } from "@/api/schema"
import { createJwt } from "@/modules/auth/lib/security"
import { cookies } from "next/headers"

const AUTH_COOKIE_NAME = 'auth_token'

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
})

export type RegisterData = z.infer<typeof registerSchema>

export async function register(data: RegisterData) {
  try {
    const { email, password, username } = registerSchema.parse(data)

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, or }) => 
        or(eq(users.email, email), eq(users.username, username)),
    })

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("Email already exists")
      }
      if (existingUser.username === username) {
        throw new Error("Username already exists")
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash,
        role: 'user' as const, // Set default role
      })
      .returning()

    if (!user || !user.email || !user.username || !user.role) {
      throw new Error("Failed to create user")
    }

    // Create JWT token
    const token = await createJwt({
      sub: user.id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    })
    
    // Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        issues: error.issues,
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: "Something went wrong",
    }
  }
} 