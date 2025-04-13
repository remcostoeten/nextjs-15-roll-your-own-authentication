"use client"

import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command } from "cmdk"
import { History } from "lucide-react"
import type { SearchItem } from "../types"
import { SearchItemComponent } from "./search-item"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"

interface CommandHistorySectionProps {
  items: SearchItem[]
  onSelect: (item: SearchItem) => void
}

function CommandHistorySectionComponent({ items, onSelect }: CommandHistorySectionProps) {
  const { theme } = useTheme()
  const { animationsEnabled } = useAnimations()
  const isDark = theme === "dark"

  if (items.length === 0) return null

  return (
    <Command.Group
      heading={
        <motion.div
          className={`flex items-center gap-2 text-xs font-medium px-2 pb-1.5 ${
            isDark ? "text-[#666]" : "text-gray-500"
          }`}
          initial={animationsEnabled ? { opacity: 0, y: -5 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
        >
          <History className="w-4 h-4" />
          RECENT COMMANDS
        </motion.div>
      }
    >
      <AnimatePresence>
        {items.map((item, index) => (
          <Command.Item
            key={`history-${item.id}`}
            onSelect={() => onSelect(item)}
            value={item.title}
            data-index={`history-${index}`}
          >
            <SearchItemComponent
              item={item}
              onSelect={() => onSelect(item)}
              index={index}
              isFavorite={false}
              isSelected={false}
            />
          </Command.Item>
        ))}
      </AnimatePresence>
    </Command.Group>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const CommandHistorySection = memo(CommandHistorySectionComponent)
