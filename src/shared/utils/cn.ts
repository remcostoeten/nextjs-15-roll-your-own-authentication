import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names using clsx and ensures Tailwind classes work correctly using twMerge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
} 