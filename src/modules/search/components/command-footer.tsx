"use client"

import { motion } from "framer-motion"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"

export function CommandFooter() {
  const { theme } = useTheme()
  const { animationsEnabled } = useAnimations()
  const isDark = theme === "dark"

  return (
    <motion.div
      className={`border-t px-4 py-2 text-xs flex items-center gap-2 flex-wrap ${
        isDark ? "border-[#ffffff08] text-[#666]" : "border-[#0000000f] text-gray-500"
      }`}
      initial={animationsEnabled ? { opacity: 0, y: 10 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={animationsEnabled ? { duration: 0.2, delay: 0.3 } : { duration: 0 }}
    >
      <span>Use</span>
      <motion.kbd
        className={`rounded border px-1.5 ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
        whileHover={
          animationsEnabled
            ? {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              }
            : {}
        }
      >
        ↑
      </motion.kbd>
      <motion.kbd
        className={`rounded border px-1.5 ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
        whileHover={
          animationsEnabled
            ? {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              }
            : {}
        }
      >
        ↓
      </motion.kbd>
      <span>to navigate</span>
      <span className="mx-2">•</span>
      <motion.kbd
        className={`rounded border px-1.5 ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
        whileHover={
          animationsEnabled
            ? {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              }
            : {}
        }
      >
        enter
      </motion.kbd>
      <span>to select</span>
      <span className="mx-2">•</span>
      <motion.kbd
        className={`rounded border px-1.5 ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
        whileHover={
          animationsEnabled
            ? {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              }
            : {}
        }
      >
        esc
      </motion.kbd>
      <span>to close</span>
      <span className="mx-2">•</span>
      <motion.kbd
        className={`rounded border px-1.5 ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
        whileHover={
          animationsEnabled
            ? {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              }
            : {}
        }
      >
        tab
      </motion.kbd>
      <span>to switch sections</span>
    </motion.div>
  )
}
