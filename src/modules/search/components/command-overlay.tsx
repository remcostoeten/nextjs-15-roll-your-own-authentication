"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "../hooks/use-theme"
import { useAnimations } from "../hooks/use-animations"

interface CommandOverlayProps {
  open: boolean
  onClose: () => void
}

export function CommandOverlay({ open, onClose }: CommandOverlayProps) {
  const { theme } = useTheme()
  const { animationsEnabled } = useAnimations()

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...animationProps}
          className={
            theme === "dark"
              ? "fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              : "fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          }
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  )
}
