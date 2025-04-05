"use server"

import { db } from "@/server/db"
import { users, sessions, userNotifications } from "@/server/db/schema"
import { eq, count, and } from "drizzle-orm"

export async function getUserStats(userId: string) {
  try {
    // Get session count
    const [sessionCount] = await db.select({ count: count() }).from(sessions).where(eq(sessions.userId, userId))

    // Get user creation date
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    // Get unread notifications count
    const [unreadNotificationsResult] = await db
      .select({ count: count() })
      .from(userNotifications)
      .where(and(eq(userNotifications.userId, userId), eq(userNotifications.isRead, false)))

    const memberSince = user?.createdAt || new Date()
    const daysSinceJoined = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24))

    return {
      sessionCount: sessionCount?.count || 0,
      memberSince,
      daysSinceJoined,
      // Add the properties expected by WelcomeBanner
      unreadNotifications: unreadNotificationsResult?.count || 0,
      totalUsers: 0, // This would need admin access to count all users
      totalActivities: 0, // We removed activities, so set to 0
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    return {
      sessionCount: 0,
      memberSince: new Date(),
      daysSinceJoined: 0,
      unreadNotifications: 0,
      totalUsers: 0,
      totalActivities: 0,
    }
  }
}

