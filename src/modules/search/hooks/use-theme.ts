"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "command-palette-theme"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null

      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setTheme(prefersDark ? "dark" : "light")
      }
    } catch (error) {
      console.error("Failed to load theme:", error)
    }
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return { theme, toggleTheme }
}
