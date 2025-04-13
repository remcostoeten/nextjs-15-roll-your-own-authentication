"use client"

import { useState, useEffect, createContext, useContext } from "react"

type AnimationsContextType = {
  animationsEnabled: boolean
  toggleAnimations: () => void
}

const STORAGE_KEY = "command-palette-animations"

// Default context value
const defaultContextValue: AnimationsContextType = {
  animationsEnabled: true,
  toggleAnimations: () => {},
}

// Create context
export const AnimationsContext = createContext<AnimationsContextType>(defaultContextValue)

// Hook to use animations context
export function useAnimations() {
  return useContext(AnimationsContext)
}

// Provider hook that creates animations object and handles state
export function useAnimationsProvider() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Load animation preference from localStorage on mount
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem(STORAGE_KEY)
      if (savedPreference !== null) {
        setAnimationsEnabled(savedPreference === "true")
      }
    } catch (error) {
      console.error("Failed to load animation preference:", error)
    }
  }, [])

  // Save animation preference to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(animationsEnabled))
    } catch (error) {
      console.error("Failed to save animation preference:", error)
    }
  }, [animationsEnabled])

  const toggleAnimations = () => {
    setAnimationsEnabled((prev) => !prev)
  }

  return {
    animationsEnabled,
    toggleAnimations,
  }
}
