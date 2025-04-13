"use client"

import { motion } from "framer-motion"
import { Command } from "cmdk"
import { Search, Clock, X } from "lucide-react"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"

interface CommandHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  onClose: () => void
}

export function CommandHeader({ search, onSearchChange, onClose }: CommandHeaderProps) {
  const { theme } = useTheme()
  const { animationsEnabled } = useAnimations()
  const isDark = theme === "dark"

  return (
    <motion.div
      className={`flex items-center border-b px-4 relative ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
      initial={animationsEnabled ? { opacity: 0, y: -10 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={animationsEnabled ? { duration: 0.2, delay: 0.1 } : { duration: 0 }}
    >
      <motion.div
        initial={animationsEnabled ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={animationsEnabled ? { duration: 0.2, delay: 0.2 } : { duration: 0 }}
      >
        <Search className={isDark ? "w-5 h-5 text-[#666]" : "w-5 h-5 text-gray-400"} />
      </motion.div>
      <Command.Input
        value={search}
        onValueChange={onSearchChange}
        placeholder="Search commands..."
        className={`flex-1 h-14 px-4 border-0 outline-none placeholder:text-[#666] ${
          isDark ? "bg-transparent text-white" : "bg-transparent text-black placeholder:text-gray-400"
        }`}
      />
      <div className="flex items-center gap-4">
        <motion.div
          initial={animationsEnabled ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={animationsEnabled ? { duration: 0.2, delay: 0.2 } : { duration: 0 }}
        >
          <Clock className={isDark ? "w-4 h-4 text-[#666]" : "w-4 h-4 text-gray-400"} />
        </motion.div>
        {search && (
          <motion.button
            onClick={() => onSearchChange("")}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/5 text-[#666]" : "hover:bg-black/5 text-gray-400"
            }`}
            whileHover={animationsEnabled ? { scale: 1.1 } : {}}
            whileTap={animationsEnabled ? { scale: 0.95 } : {}}
            initial={animationsEnabled ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
        <motion.button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${
            isDark ? "hover:bg-white/5 text-[#666]" : "hover:bg-black/5 text-gray-400"
          }`}
          whileHover={animationsEnabled ? { scale: 1.1 } : {}}
          whileTap={animationsEnabled ? { scale: 0.95 } : {}}
          initial={animationsEnabled ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={animationsEnabled ? { duration: 0.2, delay: 0.2 } : { duration: 0 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
