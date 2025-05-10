'use server'

import { db } from 'db'
import { getSession } from 'session'
import { workspacePreferences } from '@/api/schema/workspace-preferences'
import { eq } from 'drizzle-orm'

export async function getWorkspacePreference() {
  try {
    const session = await getSession()
    if (!session?.userId) return null

    const [preference] = await db
      .select()
      .from(workspacePreferences)
      .where(eq(workspacePreferences.userId, Number(session.userId)))
      .limit(1)

    return preference
  } catch (error) {
    console.error('Failed to fetch workspace preference:', error)
    return null
  }
} 