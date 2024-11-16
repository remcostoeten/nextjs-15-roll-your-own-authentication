"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion"
import { AlertCircle, CheckCircle, Info, Loader2, X, XCircle } from 'lucide-react'
import React from "react"
import { create } from "zustand"

/**
 * Defines the possible positions for toast notifications
 */
export type ToastPosition = 
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center"

/**
 * Defines the possible visual variants for toast notifications
 */
export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading"

/**
 * Defines the possible animation types for toast notifications
 */
export type ToastAnimation = "slide" | "fade" | "zoom" | "bounce"

/**
 * Action configuration for interactive toast notifications
 */
type ToastAction = {
  label: string;
  onClick: () => void;
}

/**
 * Props for individual toast notifications
 * @extends HTMLAttributes<HTMLDivElement>
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique identifier for the toast */
  id: string;
  /** Optional title text */
  title?: string;
  /** Main message content */
  message: string;
  /** Visual style variant */
  variant?: ToastVariant;
  /** Position on screen */
  position?: ToastPosition;
  /** Duration in milliseconds before auto-dismiss */
  duration?: number;
  /** Animation style */
  animation?: ToastAnimation;
  /** Whether to show progress bar */
  showProgress?: boolean;
  /** Whether to show variant icon */
  showIcon?: boolean;
  /** Optional interactive action */
  action?: ToastAction;
  /** Callback fired when toast is dismissed */
  onDismiss?: () => void;
}

/**
 * Store interface for managing toast state
 */
interface ToastStore {
  /** Array of active toasts */
  toasts: ToastProps[];
  /** Adds a new toast and returns its ID */
  add: (toast: Omit<ToastProps, "id">) => string;
  /** Removes a toast by ID */
  remove: (id: string) => void;
  /** Updates an existing toast */
  update: (id: string, toast: Partial<ToastProps>) => void;
  /** Removes all toasts */
  clear: () => void;
}

// Constants
const TOAST_LIMIT = 5
const DEFAULT_DURATION = 5000

type AnimationConfig = {
  initial: object;
  animate: object;
  exit: object;
  transition?: object;
}

/**
 * Animation configurations for different animation types
 */
const animationVariants: Record<ToastAnimation, AnimationConfig> = {
  slide: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  bounce: {
    initial: { opacity: 0, y: 50, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { opacity: 0, y: 50, scale: 0.8 },
  },
}

/**
 * CSS classes for different toast positions
 */
const positionStyles: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
}

/**
 * Zustand store for managing toast state
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({
      toasts: [{ id, ...toast }, ...state.toasts].slice(0, TOAST_LIMIT),
    }))
    return id
  },
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  update: (id, toast) =>
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...toast } : t)),
    })),
  clear: () => set({ toasts: [] }),
}))

/**
 * Individual toast notification component
 * @param props - Toast properties
 */
export function Toast({
  id,
  title,
  message,
  variant = "default",
  position = "bottom-right",
  duration = DEFAULT_DURATION,
  animation = "slide",
  showProgress = true,
  showIcon = true,
  action,
  onDismiss,
  ...props
}: ToastProps): JSX.Element {
  const { remove } = useToastStore()
  const [progress, setProgress] = React.useState<number>(100)

  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => remove(id), duration)
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev - 100 / (duration / 100)
          return next < 0 ? 0 : next
        })
      }, 100)

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [duration, id, remove])

  const handleDismiss = () => {
    remove(id)
    onDismiss?.()
  }

  const Icon = React.useMemo(() => {
    switch (variant) {
      case "success":
        return CheckCircle
      case "error":
        return XCircle
      case "warning":
        return AlertCircle
      case "info":
        return Info
      case "loading":
        return Loader2
      default:
        return null
    }
  }, [variant])

  const motionProps: HTMLMotionProps<"div"> = {
    layout: true,
    initial: animationVariants[animation].initial,
    animate: animationVariants[animation].animate,
    exit: animationVariants[animation].exit,
    className: cn(
      "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-zinc-900",
      positionStyles[position]
    ),
    ...props
  }

  return (
    <motion.div {...motionProps}>
      <div className="p-4">
        <div className="flex items-start">
          {showIcon && Icon && (
            <div className="flex-shrink-0">
              <Icon
                className={cn("h-6 w-6", {
                  "text-green-400": variant === "success",
                  "text-red-400": variant === "error",
                  "text-yellow-400": variant === "warning",
                  "text-blue-400": variant === "info",
                  "text-zinc-400 animate-spin": variant === "loading",
                  "text-zinc-400": variant === "default",
                })}
              />
            </div>
          )}
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>}
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
            {action && (
              <div className="mt-3 flex space-x-7">
                <button
                  onClick={action.onClick}
                  className="rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-zinc-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md bg-white text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-400"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {showProgress && (
        <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={cn("h-full transition-all duration-300 ease-in-out", {
              "bg-green-500": variant === "success",
              "bg-red-500": variant === "error",
              "bg-yellow-500": variant === "warning",
              "bg-blue-500": variant === "info",
              "bg-zinc-500": variant === "default" || variant === "loading",
            })}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}

/**
 * Container component for rendering all active toasts
 */
export function Toaster(): JSX.Element {
  const { toasts } = useToastStore()

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-end justify-start gap-2 px-4 py-6 pointer-events-none sm:p-6">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Type for the promise-based toast options
 */
type ToastPromiseOptions<T> = {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
}

/**
 * Hook for managing toast notifications
 * @returns Toast API methods
 */
export const useToast = () => {
  const { add, remove, update } = useToastStore()

  const toast = React.useMemo(
    () => ({
      /** Show a default toast */
      default: (message: string, options?: Partial<Omit<ToastProps, "id" | "message">>) =>
        add({ message, ...options }),
      /** Show a success toast */
      success: (message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) =>
        add({ message, variant: "success", ...options }),
      /** Show an error toast */
      error: (message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) =>
        add({ message, variant: "error", ...options }),
      /** Show a warning toast */
      warning: (message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) =>
        add({ message, variant: "warning", ...options }),
      /** Show an info toast */
      info: (message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) =>
        add({ message, variant: "info", ...options }),
      /** Show a loading toast */
      loading: (message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) =>
        add({ message, variant: "loading", duration: Infinity, ...options }),
      /** Show a promise-based toast */
      promise: async <T,>(
        promise: Promise<T>,
        options: ToastPromiseOptions<T>,
        toastOptions: Partial<Omit<ToastProps, "id" | "message" | "variant">> = {}
      ): Promise<T> => {
        const id = add({
          message: options.loading,
          variant: "loading",
          duration: Infinity,
          ...toastOptions,
        })

        try {
          const data = await promise
          const message = typeof options.success === "function" ? options.success(data) : options.success
          update(id, { message, variant: "success", duration: DEFAULT_DURATION })
          return data
        } catch (err) {
          const message = typeof options.error === "function" ? options.error(err) : options.error
          update(id, { message, variant: "error", duration: DEFAULT_DURATION })
          throw err
        }
      },
      /** Dismiss a specific toast */
      dismiss: (id: string) => remove(id),
      /** Update an existing toast */
      update: (id: string, options: Partial<Omit<ToastProps, "id">>) => update(id, options),
    }),
    [add, remove, update]
  )

  return toast
}

/** Type definition for the toast API */
export type ToastAPI = ReturnType<typeof useToast>

