'use client'

import { create } from 'zustand'

type User = {
	email: string
	role: string
	userId: string
}

type AuthStore = {
	user: User | null
	setUser: (user: User | null) => void
	logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	logout: () => set({ user: null })
}))