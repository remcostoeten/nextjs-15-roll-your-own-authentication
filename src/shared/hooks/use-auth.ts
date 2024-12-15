'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthResponse } from '@/server/mutations/auth/user/types'

export type { User, AuthResponse }

export type LoginCredentials = {
	email: string
	password: string
	remember?: boolean
}

export type RegisterData = {
	email: string
	password: string
	firstName: string
	lastName: string
}

export type AuthError = {
	message: string
	code?: string
	status?: number
}

interface AuthState {
	user: User | null
	isLoading: boolean
	error: AuthError | null
	setUser: (user: User | null) => void
	clearError: () => void
}

export const useAuth = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isLoading: false,
			error: null,
			setUser: (user) => set({ user, error: null }),
			clearError: () => set({ error: null })
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				isLoading: state.isLoading,
				error: state.error
			})
		}
	)
)
