export type ToastPosition =
    | "top-right" | "top-left" | "bottom-right"
    | "bottom-left" | "top-center" | "bottom-center"

export type ToastVariant = "success" | "error" | "warning" | "info" | "pending"
export type ToastAnimation = "slide" | "fade" | "zoom" | "bounce"

export type ToastProps = {
    id: string
    message: string
    description?: string
    variant?: ToastVariant
    position?: ToastPosition
    duration?: number
    animation?: ToastAnimation
    showProgress?: boolean
    showSpinner?: boolean
    isPending?: boolean
}

export type ToastStore = {
    toasts: ToastProps[]
    add: (toast: Omit<ToastProps, "id">) => string
    remove: (id: string) => void
    update: (id: string, toast: Partial<ToastProps>) => void
    clear: () => void
}

export type ToastAPI = {
    toast: (message: string | Partial<ToastProps>) => string
    success: (message: string, options?: Partial<ToastProps>) => string
    error: (message: string, options?: Partial<ToastProps>) => string
    promise: <T>(
        promise: Promise<T>,
        options: {
            loading: string
            success: string | ((data: T) => string)
            error: string | ((error: unknown) => string)
        },
        toastOptions?: Partial<ToastProps>
    ) => Promise<T>
}
