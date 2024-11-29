/**
 * Toast store for managing toast state
 * @author Remco Stoeten
 */

import { create } from 'zustand'
import type { ToastProps } from './types'

type ToastStore = {
	toasts: ToastProps[]
	add: (
		message: string,
		options?: Partial<Omit<ToastProps, 'id' | 'message'>>
	) => string
	remove: (id: string) => void
	update: (id: string, toast: Partial<ToastProps>) => void
}

export const useToastStore = create<ToastStore>((set) => ({
	toasts: [],
	add: (message, options = {}) => {
		const id = Math.random().toString(36).substr(2, 9)
		set((state) => ({
			toasts: [
				...state.toasts,
				{
					...options,
					id,
					message
				}
			]
		}))
		return id
	},
	remove: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id)
		})),
	update: (id, toast) =>
		set((state) => ({
			toasts: state.toasts.map((t) =>
				t.id === id ? { ...t, ...toast } : t
			)
		}))
}))
