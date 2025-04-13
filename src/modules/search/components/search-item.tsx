"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { SearchItem as SearchItemType } from "../types"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"

interface SearchItemProps {
  item: SearchItemType
  onSelect: () => void
  index: number
  isFavorite?: boolean
  onToggleFavorite?: () => void
  isSelected?: boolean
}

export function SearchItemComponent({
  item,
  onSelect,
  index,
  isFavorite = false,
  onToggleFavorite,
  isSelected = false,
}: SearchItemProps) {
  const { theme } = useTheme()
  const { animationsEnabled } = useAnimations()
  const isDark = theme === "dark"

  return (
    <motion.div
      className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg cursor-pointer group ${
        isSelected
          ? isDark
            ? "bg-white/10 text-white"
            : "bg-black/10 text-black"
          : isDark
            ? "text-[#ccc] hover:bg-white/5"
            : "text-gray-700 hover:bg-black/5"
      }`}
      onClick={onSelect}
      initial={animationsEnabled ? { opacity: 0, y: 10 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      exit={animationsEnabled ? { opacity: 0, y: -10 } : { opacity: 0 }}
      transition={
        animationsEnabled
          ? {
              duration: 0.2,
              delay: index * 0.03, // Stagger effect
              ease: "easeOut",
            }
          : { duration: 0 }
      }
      whileHover={
        animationsEnabled
          ? {
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              scale: 1.01,
              transition: { duration: 0.1 },
            }
          : {}
      }
      whileTap={animationsEnabled ? { scale: 0.98 } : {}}
      layout={animationsEnabled}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDark ? "bg-[#ffffff08]" : "bg-[#00000008]"
          }`}
          whileHover={
            animationsEnabled
              ? {
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                }
              : {}
          }
        >
          <motion.div
            initial={animationsEnabled ? { scale: 0.8 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={animationsEnabled ? { duration: 0.2, delay: index * 0.03 + 0.1 } : { duration: 0 }}
          >
            {item.icon}
          </motion.div>
        </motion.div>
        <div>
          <div className={`font-medium flex items-center gap-2 ${isDark ? "text-white" : "text-black"}`}>
            {item.title}
            {item.badge && (
              <motion.span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isDark ? "bg-[#ffffff08] text-[#666]" : "bg-[#00000008] text-gray-500"
                }`}
                initial={animationsEnabled ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={animationsEnabled ? { duration: 0.2, delay: index * 0.03 + 0.15 } : { duration: 0 }}
              >
                {item.badge}
              </motion.span>
            )}
          </div>
          {item.description && (
            <motion.div
              className={isDark ? "text-[#666] text-xs mt-0.5" : "text-gray-500 text-xs mt-0.5"}
              initial={animationsEnabled ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={animationsEnabled ? { duration: 0.3, delay: index * 0.03 + 0.1 } : { duration: 0 }}
            >
              {item.description}
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onToggleFavorite && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            className={`opacity-0 group-hover:opacity-100 p-1 rounded-full transition-opacity ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/10"
            }`}
            whileHover={animationsEnabled ? { scale: 1.1 } : {}}
            whileTap={animationsEnabled ? { scale: 0.9 } : {}}
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? "fill-yellow-400 text-yellow-400" : isDark ? "text-[#666]" : "text-gray-400"
              }`}
            />
          </motion.button>
        )}

        {item.path && <span className={isDark ? "text-xs text-[#666]" : "text-xs text-gray-500"}>{item.path}</span>}

        <div className="flex gap-2">
          {item.altShortcut && (
            <motion.kbd
              className={`hidden sm:inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-mono ${
                isDark ? "text-[#666] bg-[#ffffff08]" : "text-gray-500 bg-[#00000008]"
              }`}
              initial={animationsEnabled ? { opacity: 0, x: 5 } : { opacity: 1 }}
              animate={{ opacity: 1, x: 0 }}
              transition={animationsEnabled ? { duration: 0.2, delay: index * 0.03 + 0.2 } : { duration: 0 }}
            >
              {item.altShortcut}
            </motion.kbd>
          )}
          {item.shortcut && (
            <motion.kbd
              className={`hidden sm:inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-mono ${
                isDark ? "text-[#666] bg-[#ffffff08]" : "text-gray-500 bg-[#00000008]"
              }`}
              initial={animationsEnabled ? { opacity: 0, x: 5 } : { opacity: 1 }}
              animate={{ opacity: 1, x: 0 }}
              transition={animationsEnabled ? { duration: 0.2, delay: index * 0.03 + 0.25 } : { duration: 0 }}
            >
              {item.shortcut}
            </motion.kbd>
          )}
        </div>
      </div>
    </motion.div>
  )
}
