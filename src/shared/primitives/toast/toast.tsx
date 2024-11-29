"use client"

import { motion } from "framer-motion"
import { cn } from 'helpers'
import { AlertCircle, CheckCircle, Info, Loader2, X, XCircle } from "lucide-react"
import React, { useEffect, useMemo, useState } from "react"
import { ANIMATIONS, DEFAULT_DURATION, POSITION_STYLES } from "./constants"
import { useToastStore } from "./toast"
import type { ToastProps } from "./toast.d"

export default function Toast({
  id,
  message,
  description,
  variant = "info",
  position = "bottom-right",
  duration = DEFAULT_DURATION,
  animation = "slide",
  showProgress = true,
  showSpinner = false,
  isPending = false,
}: ToastProps) {
  const { remove } = useToastStore()
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isPending && duration) {
      const timer = setTimeout(() => remove(id), duration)

      if (showProgress) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            const next = prev - (100 / (duration / 100))
            return next < 0 ? 0 : next
          })
        }, 100)

        return () => {
          clearTimeout(timer)
          clearInterval(interval)
        }
      }

      return () => clearTimeout(timer)
    }
  }, [duration, id, isPending, remove, showProgress])

  const Icon = useMemo(() => {
    switch (variant) {
      case "success":
        return CheckCircle
      case "error":
        return XCircle
      case "warning":
        return AlertCircle
      case "info":
        return Info
      default:
        return null
    }
  }, [variant])

  return (
    <motion.div
      layout
      initial={ANIMATIONS.initial}
      animate={ANIMATIONS.animate}
      exit={ANIMATIONS.exit}
      className={cn(
        "fixed pointer-events-auto select-none",
        POSITION_STYLES[position]
      )}
    >
      <div className={cn(
        "flex w-full items-center gap-3 rounded-lg bg-zinc-900 p-4 text-white shadow-lg",
        "border border-zinc-800 min-w-[320px] max-w-[520px]"
      )}>
        {showSpinner && isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : Icon && (
          <Icon className="h-5 w-5" />
        )}

        <div className="flex-1">
          <p className="font-medium leading-none tracking-tight">
            {message}
          </p>
          {description && (
            <p className="mt-1 text-sm text-zinc-400">
              {description}
            </p>
          )}
        </div>

        {!isPending && (
          <button
            onClick={() => remove(id)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {showProgress && !isPending && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-white/20 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
