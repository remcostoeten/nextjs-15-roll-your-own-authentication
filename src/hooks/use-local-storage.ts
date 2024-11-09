'use client'

import { useCallback, useEffect, useState } from 'react'

export function useDismissedState(key: string): [boolean, () => void] {
	const [isDismissed, setIsDismissed] = useState(() => {
		if (typeof window === 'undefined') return false
		return localStorage.getItem(key) === 'true'
	})

	const setDismissed = useCallback(() => {
		setIsDismissed(true)
		localStorage.setItem(key, 'true')
	}, [key])

	useEffect(() => {
		const stored = localStorage.getItem(key) === 'true'
		if (stored !== isDismissed) {
			setIsDismissed(stored)
		}
	}, [key])

	return [isDismissed, setDismissed]
}
