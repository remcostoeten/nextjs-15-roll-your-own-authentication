import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge class names with Tailwind CSS
 * Uses clsx for conditional class names and tailwind-merge to handle conflicting classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
} 