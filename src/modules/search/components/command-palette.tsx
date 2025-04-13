"use client"

import { useState, lazy, Suspense, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command } from "cmdk"
import { searchItems, getItemById } from "../data/search-items"
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts"
import { useRecentSearches } from "../hooks/use-recent-searches"
import { useToast, ToastManager } from "./toast"
import type { SearchItem } from "../types"
import { CommandOverlay } from "./command-overlay"
import { CommandHeader } from "./command-header"
import { ViewToggle } from "./view-toggle"
import { CommandFooter } from "./command-footer"
import { useTheme } from "../hooks/use-theme"
import { FavoritesSection } from "./favorites-section"
import { useFavorites } from "../hooks/use-favorites"
import { useAnimations } from "../hooks/use-animations"
import { useCommandHistory } from "../hooks/use-command-history"
import { CommandHistorySection } from "./command-history-section"
import { useSettings } from "../hooks/use-settings"
import { SettingsPanel } from "./settings-panel"

// Lazy loaded components
const RecentSearches = lazy(() => import("./recent-searches").then((mod) => ({ default: mod.RecentSearches })))
const SearchResults = lazy(() => import("./search-results").then((mod) => ({ default: mod.SearchResults })))

interface CommandPaletteProps {
  open?: boolean
  setOpen?: (open: boolean) => void
}

export function CommandPalette({ open: externalOpen, setOpen: externalSetOpen }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"routes" | "actions">("routes")
  const [showSettings, setShowSettings] = useState(false)
  const { recentSearches, addToRecent } = useRecentSearches()
  const { toasts, addToast, removeToast } = useToast()
  const { theme } = useTheme()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { animationsEnabled } = useAnimations()
  const { commandHistory, addToHistory } = useCommandHistory()
  const { settings } = useSettings()
  const commandListRef = useRef<HTMLDivElement>(null)

  // Use external state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setIsOpen = externalSetOpen || setInternalOpen

  // Reset selected index when search changes
  useEffect(() => {
    if (isOpen) {
      // Focus the command input when opened
      const input = document.querySelector("[cmdk-input]") as HTMLInputElement
      if (input) {
        input.focus()
      }
    }
  }, [isOpen])

  // Close settings panel when command palette is closed
  useEffect(() => {
    if (!isOpen) {
      setShowSettings(false)
    }
  }, [isOpen])

  const getFilteredItems = () => {
    // First filter by view type
    const typeFiltered = searchItems.filter((item) =>
      view === "routes" ? item.type === "route" : item.type === "action",
    )

    // If no search, return all items of the current type
    if (search.trim() === "") {
      return typeFiltered
    }

    // Implement fuzzy search
    const searchLower = search.toLowerCase()
    return typeFiltered
      .map((item) => {
        // Calculate a relevance score
        const titleMatch = item.title.toLowerCase().includes(searchLower) ? 2 : 0
        const descMatch = item.description?.toLowerCase().includes(searchLower) ? 1 : 0
        const score = titleMatch + descMatch

        return { ...item, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
  }

  // Function to execute actions when an item is selected
  const executeAction = (itemId: string) => {
    const item = getItemById(itemId)
    if (!item) return

    // Show a toast notification
    addToast(`Executed: ${item.title}`)

    // Add to command history
    addToHistory(item)

    // Here you would implement the actual action logic
    // For example, navigation for routes:
    if (item.type === "route" && item.path) {
      console.log(`Navigating to: ${item.path}`)
      // window.location.href = item.path
    }

    // Or execute a function for actions
    if (item.type === "action") {
      console.log(`Executing action: ${item.id}`)
      // Execute specific action based on ID
      switch (item.id) {
        case "editor":
          console.log("Opening script editor...")
          break
        case "terminal":
          console.log("Opening terminal...")
          break
        case "git":
          console.log("Opening git control...")
          break
        case "activity":
          console.log("Opening activity monitor...")
          break
        case "settings":
          setShowSettings(true)
          return // Don't close the palette
        default:
          console.log(`No handler for action: ${item.id}`)
      }
    }

    // Close the palette after executing the action
    setIsOpen(false)
  }

  const handleItemSelect = (item: SearchItem) => {
    addToRecent(item.title)
    executeAction(item.id)
  }

  useKeyboardShortcuts({
    open: isOpen,
    setOpen: setIsOpen,
    getFilteredItems,
    addToRecent,
    executeAction,
  })

  const filteredItems = getFilteredItems()
  const favoriteItems = searchItems.filter((item) => isFavorite(item.id))

  // All visible items in the correct order
  const allVisibleItems: SearchItem[] = []
  if (search.length === 0) {
    allVisibleItems.push(...favoriteItems)
  }
  allVisibleItems.push(...filteredItems)

  // Animation settings based on the global flag
  const animationProps = animationsEnabled
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }

  const contentAnimationProps = animationsEnabled
    ? {
        initial: { opacity: 0, scale: 0.96, y: -8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 1,
        },
      }
    : {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }

  return (
    <>
      <CommandOverlay open={isOpen} onClose={() => setIsOpen(false)} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-start justify-center pt-[20vh]"
            {...animationProps}
          >
            <Command
              className={`w-[640px] max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl border overflow-hidden backdrop-blur-xl ${
                theme === "dark" ? "bg-[#111] border-[#ffffff0f] text-white" : "bg-white border-[#0000000f] text-black"
              }`}
              filter={(value, search) => {
                if (value.toLowerCase().includes(search.toLowerCase())) return 1
                return 0
              }}
              loop
            >
              <motion.div {...contentAnimationProps}>
                {showSettings ? (
                  <SettingsPanel onClose={() => setShowSettings(false)} />
                ) : (
                  <>
                    <CommandHeader search={search} onSearchChange={setSearch} onClose={() => setIsOpen(false)} />

                    <ViewToggle view={view} setView={setView} showAnimationsToggle />

                    <Command.List
                      ref={commandListRef}
                      className="max-h-[min(400px,calc(100vh-16rem))] overflow-y-auto overscroll-contain p-2"
                    >
                      <Command.Empty>
                        <motion.div
                          className={`py-6 text-center text-sm ${theme === "dark" ? "text-[#666]" : "text-gray-500"}`}
                          initial={animationsEnabled ? { opacity: 0, y: 10 } : { opacity: 1 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                        >
                          No results found. Try a different search term.
                        </motion.div>
                      </Command.Empty>

                      <Suspense
                        fallback={
                          <motion.div
                            className={`py-4 text-center text-sm ${theme === "dark" ? "text-[#666]" : "text-gray-500"}`}
                            initial={animationsEnabled ? { opacity: 0 } : { opacity: 1 }}
                            animate={{ opacity: 1 }}
                            transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                          >
                            <motion.div
                              animate={
                                animationsEnabled
                                  ? {
                                      scale: [1, 1.1, 1],
                                      opacity: [0.5, 1, 0.5],
                                    }
                                  : {}
                              }
                              transition={
                                animationsEnabled
                                  ? {
                                      repeat: Number.POSITIVE_INFINITY,
                                      duration: 1.5,
                                      ease: "easeInOut",
                                    }
                                  : {}
                              }
                            >
                              Loading...
                            </motion.div>
                          </motion.div>
                        }
                      >
                        {search.length === 0 && (
                          <>
                            {favoriteItems.length > 0 && (
                              <FavoritesSection
                                items={favoriteItems}
                                onSelect={handleItemSelect}
                                onToggleFavorite={toggleFavorite}
                              />
                            )}

                            {settings.showCommandHistory && commandHistory.length > 0 && (
                              <CommandHistorySection items={commandHistory.slice(0, 3)} onSelect={handleItemSelect} />
                            )}

                            <RecentSearches
                              recentSearches={recentSearches}
                              onSelect={(item) => {
                                setSearch(item)
                                addToRecent(item)
                              }}
                            />
                          </>
                        )}

                        <SearchResults
                          items={filteredItems}
                          view={view}
                          onSelect={handleItemSelect}
                          onToggleFavorite={toggleFavorite}
                          isFavorite={isFavorite}
                        />
                      </Suspense>
                    </Command.List>

                    <CommandFooter />
                  </>
                )}
              </motion.div>
            </Command>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <ToastManager toasts={toasts} removeToast={removeToast} />
    </>
  )
}
