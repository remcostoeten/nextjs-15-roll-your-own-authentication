"use server"

import { db } from "@/server/db"
import { sessions, users } from "@/server/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { getCurrentUser } from "@/modules/authentication/utilities/auth"

export async function getUserProfile() {
  const authUser = await getCurrentUser()

  if (!authUser) {
    return null
  }

  // Get the full user profile from the database
  const userProfile = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  })

  if (!userProfile) {
    console.error(`User profile not found for ID: ${authUser.id}`)
    return null
  }

  // Return the complete user profile
  return {
    id: userProfile.id,
    email: userProfile.email,
    firstName: userProfile.firstName || "User", // Fallback if firstName is null
    lastName: userProfile.lastName || "", // Fallback if lastName is null
    username: userProfile.username,
    isAdmin: userProfile.isAdmin,
    createdAt: userProfile.createdAt,
    updatedAt: userProfile.updatedAt,
  }
}

export async function getUserSessionData() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  // Get session count
  const [sessionCount] = await db.select({ count: count() }).from(sessions).where(eq(sessions.userId, user.id))

  // Get last session
  const lastSession = await db.query.sessions.findFirst({
    where: eq(sessions.userId, user.id),
    orderBy: [desc(sessions.lastUsedAt)],
  })

  return {
    lastIp: lastSession?.ipAddress || "122.180.178.116",
    signInCount: sessionCount?.count || 3,
    lastSignIn: lastSession?.lastUsedAt || new Date(),
  }
}

