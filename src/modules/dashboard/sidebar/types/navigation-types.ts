import { LucideIcon } from "lucide-react"

// Basic navigation item interface
export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  isExternal?: boolean
}

// Action item interface for dropdown menus
export interface ActionItem {
  label: string
  icon: LucideIcon
  onClick?: () => void
  danger?: boolean
}

// Sub-items for expandable sections
export interface SubNavItem {
  label: string
  href?: string
  count?: number
  onClick?: () => void
}

// Expandable section interface
export interface ExpandableNavSection {
  id: string
  label: string
  icon: LucideIcon
  defaultExpanded?: boolean
  items: SubNavItem[]
  actions: ActionItem[]
}

// Navigation group interface
export interface NavGroup {
  title?: string
  items: (NavItem | ExpandableNavSection)[]
}

// Complete sidebar navigation configuration
export interface SidebarNavConfig {
  mainNavigation: NavItem[]
  contentNavigation: (NavItem | ExpandableNavSection)[]
  settingsNavigation: NavItem[]
}
