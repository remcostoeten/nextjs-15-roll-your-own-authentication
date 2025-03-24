'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../state/use-auth-state'
import type { LoginCredentials, CreateUser, User } from '../models/z.user'
import { loginMutation } from '../api/mutations/login'
import { registerMutation } from '../api/mutations/register'
import { getUserQuery } from '../api/queries/get-user'

export const useAuth = () => {
	const {
		user,
		isAuthenticated,
		isLoading,
		setUser,
		setIsAuthenticated,
		setIsLoading,
		logout: storeLogout,
	} = useAuthStore()

	useEffect(() => {
		const initAuth = async () => {
			try {
				setIsLoading(true)
				const user = await getUserQuery()
				if (user) {
					setUser(user)
					setIsAuthenticated(true)
				}
			} catch (error) {
				console.error('Failed to initialize auth:', error)
			} finally {
				setIsLoading(false)
			}
		}

		if (!isAuthenticated && !isLoading) {
			initAuth()
		}
	}, [isAuthenticated, isLoading, setIsAuthenticated, setIsLoading, setUser])

	const login = async (credentials: LoginCredentials): Promise<User> => {
		try {
			setIsLoading(true)
			const user = await loginMutation(credentials)
			setUser(user)
			setIsAuthenticated(true)
			return user
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	const register = async (userData: CreateUser): Promise<User> => {
		try {
			setIsLoading(true)
			const user = await registerMutation(userData)
			setUser(user)
			setIsAuthenticated(true)
			return user
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	const logout = async () => {
		try {
			setIsLoading(true)
			// Call logout API endpoint here if needed
			storeLogout()
		} catch (error) {
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		logout,
	}
}
