'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../models/z.user'

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	setUser: (user: User | null) => void
	setIsAuthenticated: (isAuthenticated: boolean) => void
	setIsLoading: (isLoading: boolean) => void
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			isLoading: true,
			setUser: (user) => set({ user }),
			setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
			setIsLoading: (isLoading) => set({ isLoading }),
			logout: () => set({ user: null, isAuthenticated: false }),
		}),
		{
			name: 'auth-storage',
		}
	)
)
