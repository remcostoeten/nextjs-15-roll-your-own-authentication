"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "helpers";
import { AlertCircle, CheckCircle, Info, Loader2, X, XCircle } from "lucide-react";
import * as React from "react";
import { create } from "zustand";

// Types and Interfaces
export type ToastPosition =
  | "top-right" | "top-left" | "bottom-right"
  | "bottom-left" | "top-center" | "bottom-center";

export type ToastVariant = "success" | "error" | "warning" | "info" | "pending";
export type ToastAnimation = "slide" | "fade" | "zoom" | "bounce";

export interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Main message to display */
  message: string;
  /** Additional descriptive text */
  description?: string;
  /** Visual style variant */
  variant?: ToastVariant;
  /** Screen position */
  position?: ToastPosition;
  /** Duration in milliseconds */
  duration?: number;
  /** Animation style */
  animation?: ToastAnimation;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Display loading spinner */
  showSpinner?: boolean;
  /** Toast is in loading state */
  isPending?: boolean;
}

interface ToastStore {
  toasts: ToastProps[];
  add: (toast: Omit<ToastProps, "id">) => string;
  remove: (id: string) => void;
  update: (id: string, toast: Partial<ToastProps>) => void;
  clear: () => void;
}

// Constants
const TOAST_LIMIT = 5;
const DEFAULT_DURATION = 5000;

// Animation Variants
const animations = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

const positionStyles: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

// Store
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [
        { id, ...toast },
        ...state.toasts,
      ].slice(0, TOAST_LIMIT),
    }));
    return id;
  },
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  update: (id, toast) =>
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...toast } : t
      ),
    })),
  clear: () => set({ toasts: [] }),
}));

// Toast Component
export function Toast({
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
  const { remove } = useToastStore();
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (!isPending && duration) {
      const timer = setTimeout(() => remove(id), duration);

      if (showProgress) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            const next = prev - (100 / (duration / 100));
            return next < 0 ? 0 : next;
          });
        }, 100);

        return () => {
          clearTimeout(timer);
          clearInterval(interval);
        };
      }

      return () => clearTimeout(timer);
    }
  }, [duration, id, isPending, remove, showProgress]);

  const Icon = React.useMemo(() => {
    switch (variant) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "warning":
        return AlertCircle;
      case "info":
        return Info;
      default:
        return null;
    }
  }, [variant]);

  return (
    <motion.div
      layout
      initial={animations.initial}
      animate={animations.animate}
      exit={animations.exit}
      className={cn(
        "fixed pointer-events-auto select-none",
        positionStyles[position]
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
  );
}

// Toast Container
export function Toaster() {
  const { toasts } = useToastStore();

  return (
    <AnimatePresence mode="sync">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </AnimatePresence>
  );
}

// Toast Hook
interface ToastAPI {
  /** Show a toast notification */
  toast: (message: string | Partial<ToastProps>) => string;
  /** Show a success toast */
  success: (message: string, options?: Partial<ToastProps>) => string;
  /** Show an error toast */
  error: (message: string, options?: Partial<ToastProps>) => string;
  /** Show a loading toast that updates on promise resolution */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    toastOptions?: Partial<ToastProps>
  ) => Promise<T>;
}

/**
 * Custom hook for managing toast notifications
 * @example
 * const { toast, success, error, promise } = useToast()
 * 
 * // Basic usage
 * toast("Hello!")
 * 
 * // With options
 * toast({ message: "Hello!", duration: 5000 })
 * 
 * // Variants
 * success("Task completed")
 * error("Something went wrong")
 * 
 * // Async operations
 * await promise(
 *   fetchData(),
 *   {
 *     loading: "Fetching...",
 *     success: "Data loaded",
 *     error: "Failed to load"
 *   }
 * )
 */

export const useToast = (): ToastAPI => {
  const { add, remove, update } = useToastStore();

  return {
    toast: (message) => {
      if (typeof message === "string") {
        return add({ message });
      }
      return add(message);
    },

    success: (message, options = {}) =>
      add({ message, variant: "success", ...options }),

    error: (message, options = {}) =>
      add({ message, variant: "error", ...options }),

    promise: async (promise, options, toastOptions = {}) => {
      const id = add({
        message: options.loading,
        isPending: true,
        showSpinner: true,
        ...toastOptions,
      });

      try {
        const data = await promise;
        const message = typeof options.success === "function"
          ? options.success(data)
          : options.success;

        update(id, {
          message,
          isPending: false,
          variant: "success",
          duration: DEFAULT_DURATION,
        });

        return data;
      } catch (err) {
        const message = typeof options.error === "function"
          ? options.error(err)
          : options.error;

        update(id, {
          message,
          isPending: false,
          variant: "error",
          duration: DEFAULT_DURATION,
        });

        throw err;
      }
    },
  };
};
