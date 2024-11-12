/**
 * @author Remco Stoeten
 * @description A React component for use-feature-config functionality.
 */

'use client'

import { useCallback } from 'react'

type FeatureFlag =
	| 'showSessionIndicator'
	| 'enableAnalytics'
	| 'debugMode'
	| 'showToasts'

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
						? true
						: false
			},
			enableAnalytics: {
				enabled: role === 'admin'
			},
			debugMode: {
				enabled: process.env.NODE_ENV === 'development'
			},
			showToasts: {
				enabled: false,
				value: ''
			}
		}),
		[role]
	)

	return getConfig()
}

/**
 * @example
 * import { useFeatureConfig } from './useFeatureConfig'
 * 
 * // Basic usage
 * 	const featureConfig = useFeatureConfig()
	if (!featureConfig.showSessionIndicator.enabled) {
		return null
	}
 * )
 */
