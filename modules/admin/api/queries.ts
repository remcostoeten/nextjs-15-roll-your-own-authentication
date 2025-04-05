"use server"

import { db } from "@/server/db"
import { users, sessions } from "@/server/db/schema"
import { count, eq, sql } from "drizzle-orm"
import { getCurrentUser } from "@/modules/authentication/utilities/auth"

// Get all users with session counts
export async function getAllUsers() {
  const currentUser = await getCurrentUser()

  if (!currentUser?.isAdmin) {
    throw new Error("Unauthorized access")
  }

  const result = await db.query.users.findMany({
    orderBy: [users.createdAt],
  })

  // Get session counts for each user
  const userIds = result.map((user) => user.id)

  const sessionCounts = await db
    .select({
      userId: sessions.userId,
      count: count(),
    })
    .from(sessions)
    .where(sql`${sessions.userId} IN (${userIds.join(",")})`)
    .groupBy(sessions.userId)

  // Create a map of userId to session count
  const sessionCountMap = new Map(sessionCounts.map((item) => [item.userId, item.count]))

  // Add session count to each user
  const usersWithSessionCount = result.map((user) => ({
    ...user,
    sessionCount: sessionCountMap.get(user.id) || 0,
  }))

  return usersWithSessionCount
}

// Get user statistics
export async function getUserStatistics() {
  const currentUser = await getCurrentUser()

  if (!currentUser?.isAdmin) {
    throw new Error("Unauthorized access")
  }

  const [totalUsers] = await db.select({ count: count() }).from(users)

  // Since isActive doesn't exist anymore, we'll count all users as active
  const activeUsers = { count: totalUsers.count }

  // Since role doesn't exist anymore, we'll count admin users based on isAdmin field
  const [adminUsers] = await db.select({ count: count() }).from(users).where(sql`${users.isAdmin} = true`)

  const [totalSessions] = await db.select({ count: count() }).from(sessions)

  return {
    totalUsers: totalUsers.count,
    activeUsers: activeUsers.count,
    adminUsers: adminUsers.count,
    totalSessions: totalSessions.count,
    totalActivities: 0, // No more activities
    recentActivities: [], // No more activities
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (user.length === 0) {
      return null
    }

    // Transform to handle both role and isAdmin
    return {
      ...user[0],
      isAdmin: user[0].isAdmin || user[0].role === "admin",
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw new Error("Failed to get user by ID")
  }
}

