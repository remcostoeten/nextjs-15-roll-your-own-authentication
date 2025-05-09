import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import { z } from "zod"

import { db } from "@/api/db"
import { users } from "@/api/schema"
import { comparePasswords, createSession } from "@/modules/auth/lib/auth"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isValidPassword = await comparePasswords(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const session = await createSession(user)
    
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    )

    response.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
} 