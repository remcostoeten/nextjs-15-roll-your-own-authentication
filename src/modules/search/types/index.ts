import type { LucideIcon } from "lucide-react"

export interface SearchItem {
  id: string
  title: string
  description?: string
  icon: LucideIcon
  shortcut?: string
  type: "route" | "action"
  category: "page" | "feature" | "system" | "recent"
  badge?: string
  path?: string
  altShortcut?: string
}

export interface ActionHandler {
  id: string
  handler: () => void
}
