"use client"

import { motion } from "framer-motion"
import { Zap, ZapOff } from "lucide-react"
import { useAnimations } from "../hooks/use-animations"
import { useTheme } from "../hooks/use-theme"

export function AnimationsToggle() {
  const { animationsEnabled, toggleAnimations } = useAnimations()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.button
      onClick={toggleAnimations}
      className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
        isDark ? "text-[#666] hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-black hover:bg-black/5"
      }`}
      whileHover={animationsEnabled ? { scale: 1.05 } : {}}
      whileTap={animationsEnabled ? { scale: 0.95 } : {}}
      initial={animationsEnabled ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
      title={animationsEnabled ? "Disable animations" : "Enable animations"}
    >
      {animationsEnabled ? (
        <>
          <Zap className="w-4 h-4" />
          <span className="text-xs">Animations</span>
        </>
      ) : (
        <>
          <ZapOff className="w-4 h-4" />
          <span className="text-xs">Animations</span>
        </>
      )}
    </motion.button>
  )
}
