import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return "morning"
  } else if (hour >= 12 && hour < 17) {
    return "afternoon"
  } else if (hour >= 17 && hour < 22) {
    return "evening"
  } else {
    return "night"
  }
}

export function getGreeting(firstName: string): string {
  const timeOfDay = getTimeOfDay()
  return `Good ${timeOfDay}, ${firstName}`
}

