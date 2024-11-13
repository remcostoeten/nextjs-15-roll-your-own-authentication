'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DismissState = {
	dismissedItems: Record<string, boolean>
	dismiss: (key: string) => void
	isDismissed: (key: string) => boolean
}

export const useDismissStore = create<DismissState>()(
	persist(
		(set, get) => ({
			dismissedItems: {},
			dismiss: (key: string) =>
				set((state) => ({
					dismissedItems: { ...state.dismissedItems, [key]: true }
				})),
			isDismissed: (key: string) => get().dismissedItems[key] || false
		}),
		{
			name: 'dismissal-storage',
			skipHydration: true // Important for Next.js
		}
	)
)

export function useDismissedState(key: string): [boolean, () => void] {
	const [mounted, setMounted] = useState(false)
	const dismiss = useDismissStore((state) => state.dismiss)
	const isDismissed = useDismissStore((state) => state.isDismissed(key))

	useEffect(() => {
		setMounted(true)
	}, [])

	const setDismissed = () => {
		dismiss(key)
	}

	// Return false during SSR to prevent hydration mismatch
	if (!mounted) {
		return [false, setDismissed]
	}

	return [isDismissed, setDismissed]
}
