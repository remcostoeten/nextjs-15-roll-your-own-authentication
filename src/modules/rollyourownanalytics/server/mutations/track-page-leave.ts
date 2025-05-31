'use server'

import { analyticsDb } from '../db/connection'
import { analyticsEvents } from '../schemas/schema-analytics'
import { eq, and, desc } from 'drizzle-orm'

export async function trackPageLeave(data: {
  projectId: string
  sessionId: string
  url: string
  duration: number
  scrollDepth: number
}) {
  try {
    const pageviewEvent = await analyticsDb
      .select()
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, data.projectId),
          eq(analyticsEvents.sessionId, data.sessionId),
          eq(analyticsEvents.url, data.url),
          eq(analyticsEvents.type, 'pageview')
        )
      )
      .orderBy(desc(analyticsEvents.timestamp))
      .get()

    if (pageviewEvent) {
      await analyticsDb
        .update(analyticsEvents)
        .set({
          duration: data.duration,
          scrollDepth: data.scrollDepth,
          exitPage: true,
        })
        .where(eq(analyticsEvents.id, pageviewEvent.id))
    }

    return { success: true }
  } catch (error) {
    console.error('Error tracking page leave:', error)
    return { success: false, error: 'Failed to track page leave' }
  }
}
