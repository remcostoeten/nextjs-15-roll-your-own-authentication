"use client"

import { create } from "zustand"
import { DEFAULT_DURATION, TOAST_LIMIT } from "./constants"
import type { ToastProps, ToastStore } from "./types"

const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    add: (toast) => {
        const id = Math.random().toString(36).slice(2)
        set((state) => ({
            toasts: [{ id, ...toast }, ...state.toasts].slice(0, TOAST_LIMIT),
        }))
        return id
    },
    remove: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
    })),
    update: (id, toast) => set((state) => ({
        toasts: state.toasts.map((t) => t.id === id ? { ...t, ...toast } : t)
    })),
    clear: () => set({ toasts: [] })
}))

/**
 * Toast notification utility
 * @author Your Name
 */
export const toast = {
    show(message: string, options?: Partial<Omit<ToastProps, "id" | "message">>) {
        return useToastStore.getState().add({ message, ...options })
    },

    success(message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) {
        return this.show(message, { variant: "success", ...options })
    },

    error(message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) {
        return this.show(message, { variant: "error", ...options })
    },

    warning(message: string, options?: Partial<Omit<ToastProps, "id" | "message" | "variant">>) {
        return this.show(message, { variant: "warning", ...options })
    },

    async promise<T>(
        promise: Promise<T>,
        {
            loading,
            success,
            error
        }: {
            loading: string
            success: string | ((data: T) => string)
            error: string | ((error: unknown) => string)
        }
    ): Promise<T> {
        const id = this.show(loading, {
            isPending: true,
            showSpinner: true,
            duration: undefined
        })

        try {
            const data = await promise
            const message = typeof success === "function" ? success(data) : success
            useToastStore.getState().update(id, {
                message,
                isPending: false,
                variant: "success",
                duration: DEFAULT_DURATION
            })
            return data
        } catch (err) {
            const message = typeof error === "function" ? error(err) : error
            useToastStore.getState().update(id, {
                message,
                isPending: false,
                variant: "error",
                duration: DEFAULT_DURATION
            })
            throw err
        }
    }
}

export { useToastStore }
