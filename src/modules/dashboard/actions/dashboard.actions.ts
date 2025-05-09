'use server'

import { db } from '@/api/db'
import { users } from '@/api/schema'
import { gt } from 'drizzle-orm'

export async function getDashboardData() {
  try {
    // Get total users
    const totalUsers = await db.select({ count: users.id }).from(users)
    
    // Get active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activeUsers = await db.select({ count: users.id })
      .from(users)
      .where(gt(users.updatedAt, thirtyDaysAgo))

    // Get team members
    const members = await db.select({
      id: users.id,
      name: users.username,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .limit(5)

    return {
      metrics: {
        totalUsers: totalUsers[0]?.count || 0,
        activeUsers: activeUsers[0]?.count || 0,
        totalPosts: 0, // TODO: Implement when posts table is ready
        engagement: 0, // TODO: Calculate based on user activity
      },
      members: members.map(member => ({
        id: member.id.toString(),
        name: member.name || 'Unknown',
        email: member.email || '',
        role: member.role || 'user',
      })),
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw new Error('Failed to fetch dashboard data')
  }
} 