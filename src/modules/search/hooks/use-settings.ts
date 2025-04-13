"use client"

import { useState, useEffect } from "react"

interface Settings {
  showCommandHistory: boolean
  compactMode: boolean
  searchDelay: number
  maxRecentSearches: number
  maxFavorites: number
  maxCommandHistory: number
  animationSpeed: "slow" | "normal" | "fast"
  position: "top" | "center" | "bottom"
  width: "narrow" | "normal" | "wide"
  showShortcuts: boolean
  showDescriptions: boolean
  showIcons: boolean
  showBadges: boolean
}

const DEFAULT_SETTINGS: Settings = {
  showCommandHistory: true,
  compactMode: false,
  searchDelay: 0,
  maxRecentSearches: 5,
  maxFavorites: 10,
  maxCommandHistory: 10,
  animationSpeed: "normal",
  position: "center",
  width: "normal",
  showShortcuts: true,
  showDescriptions: true,
  showIcons: true,
  showBadges: true,
}

const STORAGE_KEY = "command-palette-settings"

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }))
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }, [settings])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return {
    settings,
    updateSettings,
    resetSettings,
  }
}
