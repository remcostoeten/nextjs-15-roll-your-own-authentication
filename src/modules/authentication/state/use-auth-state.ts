'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCookie } from '@/shared/utils/cookies'
import { useAuthApi } from '../hooks/use-auth-api'

// Create API instance outside of the store to avoid
// recreating it on every state change
const api = typeof window !== 'undefined' ? useAuthApi() : null

type User = {
	id: string
	email: string
	firstName?: string
	lastName?: string
}

type AuthState = {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null

	login: (credentials: { email: string; password: string }) => Promise<void>
	register: (userData: {
		email: string
		password: string
		confirmPassword: string
		firstName?: string
		lastName?: string
	}) => Promise<void>
	logout: () => Promise<void>
	refreshAuth: () => Promise<void>
	fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			login: async (credentials) => {
				if (!api) return

				set({ isLoading: true, error: null })
				try {
					const { user } = await api.login(credentials)
					set({ user, isAuthenticated: true, isLoading: false })
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: 'Failed to login',
						isLoading: false,
					})
					throw error
				}
			},

			register: async (userData) => {
				if (!api) return

				set({ isLoading: true, error: null })
				try {
					// Register and automatically log in
					const { user } = await api.register(userData)
					set({ user, isAuthenticated: true, isLoading: false })
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: 'Failed to register',
						isLoading: false,
					})
					throw error
				}
			},

			logout: async () => {
				if (!api) return

				set({ isLoading: true, error: null })
				try {
					await api.logout()
					set({
						user: null,
						isAuthenticated: false,
						isLoading: false,
					})
				} catch (error) {
					set({
						error:
							error instanceof Error
								? error.message
								: 'Failed to logout',
						isLoading: false,
					})
					throw error
				}
			},

			refreshAuth: async () => {
				if (!api) return

				set({ isLoading: true, error: null })
				try {
					const { user } = await api.refreshAuth()
					set({ user, isAuthenticated: true, isLoading: false })
				} catch (error) {
					set({
						user: null,
						isAuthenticated: false,
						error:
							error instanceof Error
								? error.message
								: 'Failed to refresh authentication',
						isLoading: false,
					})
					throw error
				}
			},

			fetchUser: async () => {
				if (!api) return

				// Skip if already loading or if no access token is present
				if (get().isLoading || !getCookie('access_token')) {
					return
				}

				set({ isLoading: true, error: null })
				try {
					// First, verify the token
					const verifyResult = await api.verifyToken()

					if (!verifyResult.isValid) {
						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
						})
						return
					}

					// If token is valid, fetch additional user details
					const user = await api.getUser()
					set({
						user,
						isAuthenticated: !!user,
						isLoading: false,
					})
				} catch (error) {
					set({
						user: null,
						isAuthenticated: false,
						error:
							error instanceof Error
								? error.message
								: 'Failed to fetch user',
						isLoading: false,
					})
					throw error
				}
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
)
