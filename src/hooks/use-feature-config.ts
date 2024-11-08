'use client'

import { useCallback } from 'react'

type FeatureFlag = 'showSessionIndicator' | 'enableAnalytics' | 'debugMode'

type FeatureConfig = Record<
	FeatureFlag,
	{
		enabled: boolean
		value?: string | number | boolean
	}
>

export function useFeatureConfig(role?: string) {
	const getConfig = useCallback(
		(): FeatureConfig => ({
			showSessionIndicator: {
				enabled:
					process.env.NEXT_PUBLIC_SHOW_SESSION_INDICATOR === 'true'
			},
			enableAnalytics: {
				enabled: role === 'admin'
			},
			debugMode: {
				enabled: process.env.NODE_ENV === 'development'
			}
		}),
		[role]
	)

	return getConfig()
}
