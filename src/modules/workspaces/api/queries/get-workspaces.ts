'use server'

import { db } from 'db'
import { getCurrentUser } from 'current-user'
import { workspacePreferences, workspaces } from '@/api/schema'
import { eq } from 'drizzle-orm'

export async function getWorkspaces() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get workspaces through workspace preferences
    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        description: workspaces.description,
        emoji: workspaces.emoji,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(
        workspacePreferences,
        eq(workspaces.id, workspacePreferences.workspaceId)
      )
      .where(eq(workspacePreferences.userId, user.id))

    return userWorkspaces
  } catch (error) {
    console.error('Failed to fetch workspaces:', error)
    throw new Error('Failed to fetch workspaces')
  }
} 