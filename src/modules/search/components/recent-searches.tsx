"use client"

import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command } from "cmdk"
import { History, Clock, X } from "lucide-react"
import { useTheme } from "../hooks/use-theme"

interface RecentSearchesProps {
  recentSearches: string[]
  onSelect: (item: string) => void
  onClear?: () => void
}

function RecentSearchesComponent({ recentSearches, onSelect, onClear }: RecentSearchesProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  if (recentSearches.length === 0) return null

  return (
    <Command.Group
      heading={
        <motion.div
          className={`flex items-center justify-between gap-2 text-xs font-medium px-2 pb-1.5 ${
            isDark ? "text-[#666]" : "text-gray-500"
          }`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            RECENT
          </div>
          {onClear && (
            <motion.button
              onClick={onClear}
              className={`text-xs flex items-center gap-1 px-1.5 py-0.5 rounded ${
                isDark
                  ? "hover:bg-white/5 text-[#666] hover:text-white"
                  : "hover:bg-black/5 text-gray-500 hover:text-black"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-3 h-3" />
              Clear
            </motion.button>
          )}
        </motion.div>
      }
    >
      <AnimatePresence>
        {recentSearches.map((item, index) => (
          <Command.Item key={item} onSelect={() => onSelect(item)} value={item}>
            <motion.div
              className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg cursor-pointer ${
                isDark ? "text-[#ccc] hover:bg-white/5" : "text-gray-700 hover:bg-black/5"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                scale: 1.01,
                transition: { duration: 0.1 },
              }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 + 0.1 }}
              >
                <Clock className={isDark ? "w-4 h-4 text-[#666]" : "w-4 h-4 text-gray-500"} />
              </motion.div>
              <span>{item}</span>
            </motion.div>
          </Command.Item>
        ))}
      </AnimatePresence>
    </Command.Group>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const RecentSearches = memo(RecentSearchesComponent)
