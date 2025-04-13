"use client"

import type { ReactNode } from "react"
import { AnimationsContext, useAnimationsProvider } from "../hooks/use-animations"

interface AnimationsProviderProps {
  children: ReactNode
}

export function AnimationsProvider({ children }: AnimationsProviderProps) {
  const animations = useAnimationsProvider()

  return <AnimationsContext.Provider value={animations}>{children}</AnimationsContext.Provider>
}
