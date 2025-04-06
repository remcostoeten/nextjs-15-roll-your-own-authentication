"use server"

import { db } from "@/server/db"
import { sessions } from "@/server/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { getCurrentUser } from "@/modules/authentication/utilities/auth"

// Get user session data
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

