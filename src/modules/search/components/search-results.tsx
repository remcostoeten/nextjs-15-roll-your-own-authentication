"use client"

import { memo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command } from "cmdk"
import { Layout, Bell } from "lucide-react"
import type { SearchItem } from "../types"
import { SearchItemComponent } from "./search-item"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"

interface SearchResultsProps {
  items: SearchItem[]
  view: "routes" | "actions"
  onSelect: (item: SearchItem) => void
  onToggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

function SearchResultsComponent({ items, view, onSelect, onToggleFavorite, isFavorite }: SearchResultsProps) {
  const { theme } = useTheme()
  const { animationsEnabled } = useAnimations()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (items.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => {
          if (prev === null) return 0
          return (prev + 1) % items.length
        })
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => {
          if (prev === null) return items.length - 1
          return (prev - 1 + items.length) % items.length
        })
      } else if (e.key === "Enter" && selectedIndex !== null) {
        e.preventDefault()
        onSelect(items[selectedIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [items, onSelect, selectedIndex])

  // Reset selected index when items change
  useEffect(() => {
    setSelectedIndex(items.length > 0 ? 0 : null)
  }, [items])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex !== null) {
      const selectedElement = document.querySelector(`[data-index="${selectedIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: animationsEnabled ? "smooth" : "auto", block: "nearest" })
      }
    }
  }, [selectedIndex, animationsEnabled])

  if (items.length === 0) return null

  return (
    <Command.Group
      heading={
        <motion.div
          className={`flex items-center gap-2 text-xs font-medium px-2 pb-1.5 pt-2 ${
            theme === "dark" ? "text-[#666]" : "text-gray-500"
          }`}
          initial={animationsEnabled ? { opacity: 0, y: -5 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
          layout={animationsEnabled}
        >
          {view === "routes" ? (
            <>
              <Layout className="w-4 h-4" />
              AVAILABLE ROUTES
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              AVAILABLE ACTIONS
            </>
          )}
        </motion.div>
      }
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <Command.Item key={item.id} onSelect={() => onSelect(item)} value={item.title} data-index={index}>
            <SearchItemComponent
              item={item}
              onSelect={() => onSelect(item)}
              index={index}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
              isSelected={index === selectedIndex}
            />
          </Command.Item>
        ))}
      </AnimatePresence>
    </Command.Group>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const SearchResults = memo(SearchResultsComponent)
