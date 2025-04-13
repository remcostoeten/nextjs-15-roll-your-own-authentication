"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useAnimations } from "../hooks/use-animations"

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-[#111] px-4 py-3 text-white shadow-lg border border-[#ffffff1a]"
      initial={animationsEnabled ? { opacity: 0, y: 50, x: 20 } : { opacity: 1 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={animationsEnabled ? { opacity: 0, y: 20, x: 20 } : { opacity: 0 }}
      transition={animationsEnabled ? { type: "spring", stiffness: 500, damping: 30 } : { duration: 0 }}
    >
      <span>{message}</span>
      <motion.button
        onClick={onClose}
        className="ml-2 rounded-full p-1 hover:bg-white/10"
        whileHover={animationsEnabled ? { backgroundColor: "rgba(255, 255, 255, 0.15)", scale: 1.1 } : {}}
        whileTap={animationsEnabled ? { scale: 0.9 } : {}}
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  )
}

interface ToastManagerProps {
  toasts: Array<{ id: string; message: string }>
  removeToast: (id: string) => void
}

export function ToastManager({ toasts, removeToast }: ToastManagerProps) {
  const { animationsEnabled } = useAnimations()

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}
    </AnimatePresence>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string }>>([])

  const addToast = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message }])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}
