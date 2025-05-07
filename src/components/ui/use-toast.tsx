import { toast as sonnerToast, ToastT } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  function toast({ title, description, variant = "default" }: ToastProps) {
    sonnerToast(title, {
      description,
      style: {
        background: variant === "destructive" ? "rgb(239 68 68)" : "white",
        color: variant === "destructive" ? "white" : "black",
      },
    })
  }

  return {
    toast,
  }
} 