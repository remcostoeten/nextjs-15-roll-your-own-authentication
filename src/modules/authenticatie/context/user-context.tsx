"use client"

import { TAuthUser } from "@/modules/authenticatie/types"
import { noop } from "@/shared/utilities/noop"
import { ReactNode, createContext, experimental_taintUniqueValue, useContext, useMemo } from "react"

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
  // Protect sensitive user data from being passed to client components
  if (user?.id) {
    try {
      // Only in server components where this API is available
      experimental_taintUniqueValue(
        'User session data should not be directly passed to client components',
        user,
        user.id
      )
    } catch (e) {
      // Silently fail if not in server component
      noop()
    }
  }

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
