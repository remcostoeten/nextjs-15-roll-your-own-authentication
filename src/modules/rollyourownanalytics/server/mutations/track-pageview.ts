'use server'

import type { TAnalyticsEvent } from '../../types'
import { trackEvent } from './track-event'

export async function trackPageview(data: {
  projectId: string
  sessionId: string
  visitorId: string
  url: string
  title?: string
  referrer?: string
  device?: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  os?: string
  screenWidth?: number
  screenHeight?: number
  viewportWidth?: number
  viewportHeight?: number
  language?: string
}) {
  const eventData: Partial<TAnalyticsEvent> = {
    ...data,
    type: 'pageview',
    metadata: { visitorId: data.visitorId },
  }

  return await trackEvent(eventData)
}
