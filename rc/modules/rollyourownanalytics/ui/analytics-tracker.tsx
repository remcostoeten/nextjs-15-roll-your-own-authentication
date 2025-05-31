'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageLeave } from '@/modules/rollyourownanalytics/server/mutations/track-page-leave'
import { trackPageview } from '@/modules/rollyourownanalytics/server/mutations/track-pageview'
import { TAnalyticsConfig } from '@/modules/rollyourownanalytics/types'
import { getVisitorId, getSessionId, getDeviceInfo, getPageMetrics, startPageTracking, updateSessionTimestamp, setupEventListeners } from '@/modules/rollyourownanalytics/utilities'

type TProps = {
  config: TAnalyticsConfig
}

export function AnalyticsTracker({ config }: TProps) {
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)
  const visitorIdRef = useRef<string>('')
  const sessionIdRef = useRef<string>('')
  const cleanupRef = useRef<(() => void) | null>(null)
  const lastPathnameRef = useRef<string>('')

  useEffect(() => {
    if (!config.projectId || isInitialized) return

    // Check if Do Not Track is enabled and we should respect it
    if (config.respectDnt && navigator.doNotTrack === '1') {
      return
    }

    visitorIdRef.current = getVisitorId()
    sessionIdRef.current = getSessionId()
    setIsInitialized(true)

    if (config.debug) {
      console.log('Analytics initialized:', {
        projectId: config.projectId,
        visitorId: visitorIdRef.current,
        sessionId: sessionIdRef.current,
      })
    }
  }, [config, isInitialized])

  useEffect(() => {
    if (!isInitialized || !config.trackPageviews) return

    const currentUrl = window.location.href
    const deviceInfo = getDeviceInfo()

    // Track page leave for previous page
    if (lastPathnameRef.current && lastPathnameRef.current !== pathname) {
      const metrics = getPageMetrics()
      trackPageLeave({
        projectId: config.projectId,
        sessionId: sessionIdRef.current,
        url: window.location.origin + lastPathnameRef.current,
        duration: metrics.duration,
        scrollDepth: metrics.scrollDepth,
      }).catch(error => {
        if (config.debug) {
          console.error('Failed to track page leave:', error)
        }
      })
    }

    // Track new pageview
    trackPageview({
      projectId: config.projectId,
      sessionId: sessionIdRef.current,
      visitorId: visitorIdRef.current,
      url: currentUrl,
      title: document.title,
      referrer: document.referrer || undefined,
      device: deviceInfo.device,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      screenWidth: deviceInfo.screenWidth,
      screenHeight: deviceInfo.screenHeight,
      viewportWidth: deviceInfo.viewportWidth,
      viewportHeight: deviceInfo.viewportHeight,
      language: navigator.language,
    }).catch(error => {
      if (config.debug) {
        console.error('Failed to track pageview:', error)
      }
    })

    // Start page tracking for duration and scroll depth
    startPageTracking()
    
    // Update session timestamp
    updateSessionTimestamp()

    lastPathnameRef.current = pathname

    if (config.debug) {
      console.log('Pageview tracked:', { pathname, url: currentUrl })
    }
  }, [pathname, isInitialized, config])

  useEffect(() => {
    if (!isInitialized) return

    const trackEvent = (type: string, data?: Record<string, any>) => {
      trackEventAction({
        projectId: config.projectId,
        sessionId: sessionIdRef.current,
        type: type as any,
        name: data?.tagName || type,
        url: window.location.href,
        pathname: window.location.pathname,
        title: document.title,
        metadata: data,
      }).catch(error => {
        if (config.debug) {
          console.error('Failed to track event:', error)
        }
      })

      if (config.debug) {
        console.log('Event tracked:', { type, data })
      }
    }

    // Set up automatic event listeners
    const cleanupFunctions: (() => void)[] = []

    if (config.trackClicks || config.trackForms || config.trackErrors) {
      const cleanup = setupEventListeners(trackEvent)
      cleanupFunctions.push(cleanup)
    }

    // Track page visibility changes
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        const metrics = getPageMetrics()
        trackPageLeave({
          projectId: config.projectId,
          sessionId: sessionIdRef.current,
          url: window.location.href,
          duration: metrics.duration,
          scrollDepth: metrics.scrollDepth,
        }).catch(error => {
          if (config.debug) {
            console.error('Failed to track page leave on visibility change:', error)
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    cleanupFunctions.push(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    })

    // Track page unload
    function handleBeforeUnload() {
      const metrics = getPageMetrics()
      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          projectId: config.projectId,
          sessionId: sessionIdRef.current,
          url: window.location.href,
          duration: metrics.duration,
          scrollDepth: metrics.scrollDepth,
        })
        navigator.sendBeacon('/api/analytics/page-leave', data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    cleanupFunctions.push(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })

    // Periodic session update (every 30 seconds)
    const sessionUpdateInterval = setInterval(() => {
      updateSessionTimestamp()
    }, 30000)

    cleanupFunctions.push(() => {
      clearInterval(sessionUpdateInterval)
    })

    cleanupRef.current = () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }

    return cleanupRef.current
  }, [isInitialized, config])

  // This component doesn't render anything
  return null
}
