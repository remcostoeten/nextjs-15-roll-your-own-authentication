'use server'

import { db } from 'db'
import { getCurrentUser } from 'current-user'
import { workspacePreferences, workspaces } from '@/api/schema'
import { and, eq } from 'drizzle-orm'

export async function getWorkspaceById(workspaceId: number) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get workspace with permission check
    const [workspace] = await db
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
      .where(
        and(
          eq(workspaces.id, workspaceId),
          eq(workspacePreferences.userId, user.id)
        )
      )

    if (!workspace) {
      throw new Error('Workspace not found')
    }

    return workspace
  } catch (error) {
    console.error('Failed to fetch workspace:', error)
    throw new Error('Failed to fetch workspace')
  }
} 