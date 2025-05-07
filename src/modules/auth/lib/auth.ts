import { SignJWT } from "jose"
import { compare, hash } from "bcryptjs"

import { db } from "@/api/db"
import { users } from "@/api/schema"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
)

export async function hashPassword(password: string) {
  return hash(password, 10)
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
) {
  return compare(plainTextPassword, hashedPassword)
}

export async function createSession(user: typeof users.$inferSelect) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET)

  return token
} 