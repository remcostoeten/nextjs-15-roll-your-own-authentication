'use server'

import { db } from 'db'
import { getCurrentUser } from 'current-user'
import { workspacePreferences } from '@/api/schema/workspace-preferences'

export async function updateWorkspacePreference(workspaceId: number) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const defaultPreferences = {
    theme: 'system',
    notifications: true,
    language: 'en'
  }

  await db
    .insert(workspacePreferences)
    .values({
      userId: user.id,
      workspaceId,
      preferences: defaultPreferences,
    })
    .onConflictDoUpdate({
      target: [workspacePreferences.userId, workspacePreferences.workspaceId],
      set: {
        preferences: defaultPreferences,
        updatedAt: new Date(),
      },
    })

  return { success: true }
} 