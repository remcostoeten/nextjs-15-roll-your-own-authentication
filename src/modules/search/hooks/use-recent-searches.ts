"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "recent-searches"

export function useRecentSearches(maxItems = 5) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error)
    }
  }, [])

  // Save recent searches to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches))
    } catch (error) {
      console.error("Failed to save recent searches:", error)
    }
  }, [recentSearches])

  const addToRecent = (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev].slice(0, maxItems))
    }
  }

  const clearRecent = () => {
    setRecentSearches([])
  }

  return {
    recentSearches,
    addToRecent,
    clearRecent,
  }
}
