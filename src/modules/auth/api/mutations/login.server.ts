'use server'

import { z } from "zod";
import { db } from "@/api/db";
import { loginSchema, type TLoginData, type TAuthResponse } from "../models/auth.schema";
import { logUserAction } from "@/modules/metrics/api/mutations/log-actions.mutation";
import { ActionType } from "@/modules/metrics/api/schemas/action-log-schema";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "../services/cookie.service";

const AUTH_COOKIE_NAME = 'auth_token';

export async function login(data: TLoginData): Promise<TAuthResponse<{ id: number; email: string; username: string }>> {
  try {
    const { email, password } = loginSchema.parse(data)

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (!user?.passwordHash || !user.email || !user.username || !user.role) {
      await logUserAction({ userId: user?.id, actionType: 'LOGIN_FAIL' as ActionType })
      return { success: false, error: 'Invalid email or password' }
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      await logUserAction({ userId: user.id, actionType: 'LOGIN_FAIL' as ActionType })
      return { success: false, error: 'Invalid email or password' }
    }

    await setAuthCookie({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    })
    await logUserAction({ userId: user.id, actionType: 'LOGIN_SUCCESS' as ActionType })

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input format',
        issues: error.issues,
      }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Authentication failed' }
  }
}

// import { z } from "zod"
// import bcrypt from "bcryptjs"
// import { cookies } from "next/headers"
// import { db } from "@/api/db"
// import { users } from "@/api/schema"
// import { createJwt } from "@/modules/auth/lib/security"

// const AUTH_COOKIE_NAME = 'auth_token'

// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string(),
// })


// export async function login(data: LoginData) {
//   try {
//     const { email, password } = loginSchema.parse(data)

//     // Find user
//     const user = await db.query.users.findFirst({
//       where: (users, { eq }) => eq(users.email, email),
//     })

//     if (!user || !user.passwordHash || !user.email || !user.username || !user.role) {
//       console.error('Login failed: User not found or invalid data', { email })
//       return {
//         success: false,
//         error: "Invalid email or password",
//       }
//     }

//     // Verify password
//     const isValidPassword = await bcrypt.compare(password, user.passwordHash)

//     if (!isValidPassword) {
//       console.error('Login failed: Invalid password', { email })
//       return {
//         success: false,
//         error: "Invalid email or password",
//       }
//     }

//     // Create JWT token
//     const token = await createJwt({
//       sub: user.id.toString(),
//       email: user.email,
//       username: user.username,
//       role: user.role,
//     })
    
//     // Set auth cookie
//     cookies().set(AUTH_COOKIE_NAME, token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//     })

//     console.log('Login successful', { email, userId: user.id })
//     return {
//       success: true,
//       data: {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//       },
//     }
//   } catch (error) {
//     console.error('Login error:', error)
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         error: "Invalid input format",
//         issues: error.issues,
//       }
//     }

//     if (error instanceof Error) {
//       return {
//         success: false,
//         error: "Authentication failed",
//       }
//     }

//     return {
//       success: false,
//       error: "An unexpected error occurred",
//     }
//   }
// } 