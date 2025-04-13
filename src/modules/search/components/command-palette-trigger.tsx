"use client"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useAnimations } from "../hooks/use-animations"

interface CommandPaletteTriggerProps {
  setOpen: (open: boolean) => void
}

export function CommandPaletteTrigger({ setOpen }: CommandPaletteTriggerProps) {
  const { animationsEnabled } = useAnimations()

  return (
    <motion.button
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111] text-white border border-[#ffffff1a] hover:bg-[#222] transition-colors"
      whileHover={animationsEnabled ? { scale: 1.03, backgroundColor: "#222" } : {}}
      whileTap={animationsEnabled ? { scale: 0.97 } : {}}
      initial={animationsEnabled ? { opacity: 0, y: 10 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={animationsEnabled ? { duration: 0.3 } : { duration: 0 }}
    >
      <Search className="w-4 h-4" />
      <span>Search...</span>
      <motion.kbd
        className="ml-2 px-1.5 py-0.5 text-xs bg-[#ffffff08] rounded"
        initial={animationsEnabled ? { opacity: 0, x: -5 } : { opacity: 1 }}
        animate={{ opacity: 1, x: 0 }}
        transition={animationsEnabled ? { duration: 0.3, delay: 0.1 } : { duration: 0 }}
      >
        ⌘K
      </motion.kbd>
    </motion.button>
  )
}
