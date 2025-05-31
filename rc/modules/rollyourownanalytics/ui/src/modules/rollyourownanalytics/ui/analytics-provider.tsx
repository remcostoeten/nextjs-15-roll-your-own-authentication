'use client'

import { TTrackingContext, TAnalyticsConfig } from '@/modules/rollyourownanalytics/types'
import { getSessionId, getVisitorId } from '@/modules/rollyourownanalytics/utilities'
import { createContext, useContext, useCallback } from 'react'


const AnalyticsContext = createContext<TTrackingContext | null>(null)

type TProps = {
  children: React.ReactNode
  config: TAnalyticsConfig
}

export function AnalyticsProvider({ children, config }: TProps) {
  const trackingContext: TTrackingContext = {
    projectId: config.projectId,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    config,
  }

  return (
    <AnalyticsContext.Provider value={trackingContext}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }

  const trackEvent = useCallback(
    (type: string, data?: Record<string, any>) => {
      trackEventAction({
        projectId: context.projectId,
        sessionId: context.sessionId,
        type: type as any,
        name: data?.name || type,
        url: window.location.href,
        pathname: window.location.pathname,
        title: document.title,
        metadata: data,
      }).catch(error => {
        if (context.config.debug) {
          console.error('Failed to track custom event:', error)
        }
      })
    },
    [context]
  )

  const trackCustomEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      trackEvent('custom', { name: eventName, ...properties })
    },
    [trackEvent]
  )

  const trackConversion = useCallback(
    (goalName: string, value?: number) => {
      trackEvent('conversion', { name: goalName, value })
    },
    [trackEvent]
  )

  return {
    trackEvent,
    trackCustomEvent,
    trackConversion,
    projectId: context.projectId,
    sessionId: context.sessionId,
    visitorId: context.visitorId,
  }
}