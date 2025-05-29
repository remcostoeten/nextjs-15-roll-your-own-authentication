"use client"

import { TAuthUser } from "@/modules/authenticatie/types"
import { noop } from "@/shared/utilities/noop"
import { ReactNode, createContext, useContext, useMemo } from "react"

type UserContextType = {
  user: TAuthUser | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  user,
  isLoading = false
}: {
  children: ReactNode
  user: TAuthUser | null
  isLoading?: boolean
}) {
  // Note: experimental_taintUniqueValue is not available in this React version
  // This would be used to protect sensitive user data in server components

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isLoading
  }), [user, isLoading])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
