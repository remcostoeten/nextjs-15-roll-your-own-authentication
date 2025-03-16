'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCookie } from '@/shared/utils/cookies'
import { useAuthApi } from '../hooks/use-auth-api'
import { toast } from 'sonner'

// Create API instance outside of the store to avoid
// recreating it on every state change
const api = typeof window !== 'undefined' ? useAuthApi() : null

type User = {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: 'admin' | 'user'
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

const createAuthStore = (set: any, get: any): AuthState => ({
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
            toast.success('Welcome back!', {
                description: `Logged in as ${user.email}`,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to login'
            set({
                error: message,
                isLoading: false,
            })
            toast.error('Login failed', {
                description: message,
            })
            throw error
        }
    },

    register: async (userData) => {
        if (!api) return

        set({ isLoading: true, error: null })
        try {
            const result = await api.register(userData)
            if (!result.success) {
                throw new Error(result.message || 'Registration failed')
            }
            if (result.user) {
                set({ user: result.user, isAuthenticated: true, isLoading: false })
                toast.success('Welcome!', {
                    description: 'Your account has been created successfully.',
                })
            } else {
                throw new Error('Registration successful but no user data returned')
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to register'
            set({
                error: message,
                isLoading: false,
            })
            toast.error('Registration failed', {
                description: message,
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
                error: null
            })
            toast.success('Goodbye!', {
                description: 'You have been logged out successfully.',
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to logout'
            set({
                error: message,
                isLoading: false,
            })
            toast.error('Logout failed', {
                description: message,
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
                error: error instanceof Error ? error.message : 'Failed to refresh authentication',
                isLoading: false,
            })
            throw error
        }
    },

    fetchUser: async () => {
        if (!api) return

        if (get().isLoading || !getCookie('access_token')) {
            return
        }

        set({ isLoading: true, error: null })
        try {
            const verifyResult = await api.verifyToken()
            console.log('Token verification result:', verifyResult) // Debug log

            if (!verifyResult.isValid) {
                console.log('Token invalid, clearing user state') // Debug log
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
                return
            }

            const user = await api.getUser()
            console.log('Fetched user data:', user) // Debug log

            if (!user) {
                console.log('No user data returned') // Debug log
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
                return
            }

            // Ensure role is properly set
            const userData = {
                ...user,
                role: user.role as 'admin' | 'user'
            }

            console.log('Setting user state:', userData) // Debug log
            set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
            })
        } catch (error) {
            console.error('Error fetching user:', error) // Debug log
            set({
                user: null,
                isAuthenticated: false,
                error: error instanceof Error ? error.message : 'Failed to fetch user',
                isLoading: false,
            })
            throw error
        }
    },
})

export const useAuthStore = create<AuthState>()(
    persist(
        createAuthStore,
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
