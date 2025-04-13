"use client"

import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "command-palette-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load favorites:", error)
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error("Failed to save favorites:", error)
    }
  }, [favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }, [])

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.includes(id)
    },
    [favorites],
  )

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
