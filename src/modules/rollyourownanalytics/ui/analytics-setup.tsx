'use client'

import { AnalyticsProvider } from './analytics-provider'
import { AnalyticsTracker } from './analytics-tracker'
import { TAnalyticsConfig } from '@/modules/rollyourownanalytics/types'

type TProps = {
  children: React.ReactNode
  config: TAnalyticsConfig
}

export function AnalyticsSetup({ children, config }: TProps) {
  return (
    <AnalyticsProvider config={config}>
      <AnalyticsTracker config={config} />
      {children}
    </AnalyticsProvider>
  )
}
