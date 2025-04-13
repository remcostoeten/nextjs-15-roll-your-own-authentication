"use client"

import { useState, useEffect, useCallback } from "react"
import type { SearchItem } from "../types"

const STORAGE_KEY = "command-palette-history"

export function useCommandHistory(maxItems = 10) {
  const [commandHistory, setCommandHistory] = useState<SearchItem[]>([])

  // Load command history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setCommandHistory(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load command history:", error)
    }
  }, [])

  // Save command history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(commandHistory))
    } catch (error) {
      console.error("Failed to save command history:", error)
    }
  }, [commandHistory])

  const addToHistory = useCallback(
    (item: SearchItem) => {
      setCommandHistory((prev) => {
        // Remove the item if it already exists
        const filtered = prev.filter((i) => i.id !== item.id)
        // Add the item to the beginning of the array
        return [item, ...filtered].slice(0, maxItems)
      })
    },
    [maxItems],
  )

  const clearHistory = useCallback(() => {
    setCommandHistory([])
  }, [])

  return {
    commandHistory,
    addToHistory,
    clearHistory,
  }
}
