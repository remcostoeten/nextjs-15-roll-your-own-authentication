/**
 * Toast hook for managing toast notifications
 * @author Remco Stoeten
 */

import { useCallback } from 'react'
import { useToastStore } from './toast-store'
import type { ToastProps } from './types'

type ToastOptions = Partial<Omit<ToastProps, 'id' | 'message'>>

export function useToast() {
	const { add: addToast, remove: removeToast } = useToastStore()

	const toast = useCallback(
		(message: string, options?: ToastOptions) => {
			return addToast(message, options)
		},
		[addToast]
	)

	return { toast, remove: removeToast }
}
