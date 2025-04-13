"use client"

import { motion } from "framer-motion"
import { Layout, Settings } from "lucide-react"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"
import { AnimationsToggle } from "./animations-toggle"

interface ViewToggleProps {
  view: "routes" | "actions"
  setView: (view: "routes" | "actions") => void
  showAnimationsToggle?: boolean
}

export function ViewToggle({ view, setView, showAnimationsToggle }: ViewToggleProps) {
  const { theme } = useTheme()
  const { animationsEnabled } = useAnimations()
  const isDark = theme === "dark"

  return (
    <motion.div
      className={`border-b px-2 py-2 flex items-center justify-between ${isDark ? "border-[#ffffff08]" : "border-[#0000000f]"}`}
      initial={animationsEnabled ? { opacity: 0, y: -10 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={animationsEnabled ? { duration: 0.2, delay: 0.15 } : { duration: 0 }}
    >
      <div className="flex gap-2">
        <motion.button
          onClick={() => setView("routes")}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 ${
            view === "routes"
              ? isDark
                ? "bg-white/10 text-white"
                : "bg-black/10 text-black"
              : isDark
                ? "text-[#666] hover:bg-white/5"
                : "text-gray-500 hover:bg-black/5"
          }`}
          whileHover={animationsEnabled ? { scale: view === "routes" ? 1.05 : 1.02 } : {}}
          whileTap={animationsEnabled ? { scale: 0.98 } : {}}
          layout={animationsEnabled}
        >
          <Layout className="w-4 h-4" />
          Routes
        </motion.button>
        <motion.button
          onClick={() => setView("actions")}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all duration-200 ${
            view === "actions"
              ? isDark
                ? "bg-white/10 text-white"
                : "bg-black/10 text-black"
              : isDark
                ? "text-[#666] hover:bg-white/5"
                : "text-gray-500 hover:bg-black/5"
          }`}
          whileHover={animationsEnabled ? { scale: view === "actions" ? 1.05 : 1.02 } : {}}
          whileTap={animationsEnabled ? { scale: 0.98 } : {}}
          layout={animationsEnabled}
        >
          <Settings className="w-4 h-4" />
          Actions
        </motion.button>
      </div>
      {showAnimationsToggle && <AnimationsToggle />}
    </motion.div>
  )
}
