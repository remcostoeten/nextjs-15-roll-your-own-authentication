import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { db } from "@/server/db"
import { redirect } from "next/navigation"

// Define the token payload type
export type TokenPayload = {
  id: string
  email: string
  isAdmin: boolean
  sessionId: string
}

// Generate a JWT token
export async function generateToken(payload: TokenPayload): Promise<string> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    if (!secret || secret.length === 0) {
      console.error("JWT_SECRET is not defined or empty")
      throw new Error("JWT_SECRET is not defined")
    }

    const token = await new SignJWT(payload as any)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token expires in 7 days
      .sign(secret)

    console.log(`Generated token for user ${payload.id}`)
    return token
  } catch (error) {
    console.error("Error generating token:", error)
    throw new Error("Failed to generate token")
  }
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    if (!secret || secret.length === 0) {
      console.error("JWT_SECRET is not defined or empty")
      return null
    }

    const { payload } = await jwtVerify(token, secret)
    return payload as TokenPayload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Get the current user from the token in cookies
export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  return payload
}

// Require authentication
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

// Require admin role
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!user.isAdmin) {
    redirect("/dashboard")
  }

  return user
}

// Log user activity (console only since we removed the userActivities table)
export async function logUserActivity(userId: string, action: string) {
  try {
    // We've removed the userActivities table, so we'll just log to console
    console.log(`User activity: ${userId} - ${action} at ${new Date().toISOString()}`)
    return true
  } catch (error) {
    console.error("Error logging user activity:", error)
    return false
  }
}

// Check if this is the first user (for admin assignment)
export async function isFirstUser() {
  try {
    const users = await db.query.users.findMany({
      limit: 1,
    })
    return users.length === 0
  } catch (error) {
    console.error("Error checking if first user:", error)
    return false
  }
}

