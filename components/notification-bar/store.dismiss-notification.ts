/**
 * @fileoverview Zustand store for managing notification dismissal state with local storage persistence.
 * @author Remco Stoeten
 */

'use client'

import { create } from 'zustand'
import { useDismissedState } from '../../hooks/use-local-storage'

/** Key used for storing notification dismissal state in local storage */
export const NOTIFICATION_STORAGE_KEY = 'notification_dismissed'

/**
 * State interface for notification dismissal
 * @interface DismissState
 */
type DismissState = {
	/** Whether the notification has been dismissed */
	isDismissed: boolean
	/** Sets the notification as dismissed */
	setIsDismissed: () => void
}

/**
 * Creates a Zustand store that manages notification dismissal state
 * with persistence to local storage
 *
 * @returns Zustand store with dismissal state and setter
 */
export const useDismissStore = create<DismissState>(() => {
	const [isDismissed, setDismissed] = useDismissedState(
		NOTIFICATION_STORAGE_KEY
	)

	return {
		isDismissed,
		setIsDismissed: setDismissed
	}
})
