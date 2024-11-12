"use client"

import type { User } from "@/features/auth/types"
import { create } from "zustand"

type AuthStore = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated })
}))

export function useAuth() {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useAuthStore()
  
  return {
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated
  }
} 
