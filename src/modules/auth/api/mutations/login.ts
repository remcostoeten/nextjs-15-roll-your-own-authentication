import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { z } from "zod"

import { db } from "@/api/db"
import { users } from "@/api/schema"
import { comparePasswords, createSession } from "@/modules/auth/lib/auth"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function login(data: z.infer<typeof loginSchema>) {
  const { email, password } = loginSchema.parse(data)

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password")
  }

  const isValidPassword = await comparePasswords(password, user.passwordHash)

  if (!isValidPassword) {
    throw new Error("Invalid email or password")
  }

  const session = await createSession(user)
  
  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  })

  return { success: true }
} 