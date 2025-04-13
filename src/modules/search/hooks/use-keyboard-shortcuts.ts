"use client"

import { useEffect } from "react"
import { keyboardShortcutsMap } from "../config/shortcuts"
import { getItemById } from "../data/search-items"
import type { SearchItem } from "../types"

interface UseKeyboardShortcutsProps {
  open: boolean
  setOpen: (open: boolean) => void
  getFilteredItems: () => SearchItem[]
  addToRecent: (query: string) => void
  executeAction: (itemId: string) => void
}

export function useKeyboardShortcuts({
  open,
  setOpen,
  getFilteredItems,
  addToRecent,
  executeAction,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts if we're in an input field (except for Escape)
      if (
        (e.key !== "Escape" && document.activeElement instanceof HTMLInputElement) ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Toggle command palette with Cmd/Ctrl + K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
        return
      }

      // Close with Escape
      if (e.key === "Escape" && open) {
        e.preventDefault()
        setOpen(false)
        return
      }

      // Don't handle other shortcuts if the palette is open
      if (open) {
        return
      }

      // Handle Alt + number shortcuts
      if (e.altKey && !isNaN(Number.parseInt(e.key))) {
        const shortcutKey = `alt+${e.key}`
        const itemId = keyboardShortcutsMap[shortcutKey]

        if (itemId) {
          e.preventDefault()
          const item = getItemById(itemId)
          if (item) {
            addToRecent(item.title)
            executeAction(itemId)
          }
        }
        return
      }

      // Handle Cmd/Ctrl + letter shortcuts
      if ((e.metaKey || e.ctrlKey) && !e.altKey) {
        const shortcutKey = e.key.toLowerCase()
        const itemId = keyboardShortcutsMap[shortcutKey]

        if (itemId) {
          e.preventDefault()
          const item = getItemById(itemId)
          if (item) {
            addToRecent(item.title)
            executeAction(itemId)
          }
        }
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen, getFilteredItems, addToRecent, executeAction])
}
