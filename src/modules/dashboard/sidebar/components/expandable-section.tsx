"use client"

import React from "react"
import { motion } from "framer-motion"
import { Plus, LucideIcon } from "lucide-react"

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ANIMATION_PROPS = {
  initial: { height: 0, opacity: 0, overflow: "hidden" },
  animate: { height: "auto", opacity: 1, overflow: "visible" },
  exit: { height: 0, opacity: 0, overflow: "hidden" },
  transition: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
}

interface ActionItem {
  label: string
  icon: LucideIcon
  danger?: boolean
  onClick?: () => void
}

interface SubItem {
  label: string
  href?: string
  count?: number
  onClick?: () => void
}

interface ExpandableSectionProps {
  id: string
  label: string
  icon: LucideIcon
  items: SubItem[]
  actions: ActionItem[]
  isExpanded: boolean
  isCollapsed: boolean
  onToggle: (id: string) => void
}

export function ExpandableSection({
  id,
  label,
  icon: Icon,
  items,
  actions,
  isExpanded,
  isCollapsed,
  onToggle,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <React.Fragment>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => onToggle(id)} className="relative">
          <Icon className="h-4 w-4 text-sidebar-accent-foreground" />
          <span>{label}</span>
        </SidebarMenuButton>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-3 top-1.5 h-6 w-6 opacity-60 hover:opacity-100 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">{label} actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {actions.map((action) => (
              <DropdownMenuItem 
                key={action.label} 
                className={cn(
                  "flex items-center gap-2",
                  action.danger && "text-red-500 focus:text-red-500"
                )}
                onClick={() => {
                  action.onClick?.()
                  setIsOpen(false)
                }}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {isExpanded && !isCollapsed && (
        <motion.div {...ANIMATION_PROPS} key={`${id}-submenu`}>
          <div className="ml-8 space-y-0.5 py-1">
            {items.map((item) => (
              <div 
                key={item.label} 
                className="flex items-center justify-between py-1.5 px-3 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                onClick={item.onClick}
              >
                <a href={item.href || "#"} className="grow">
                  {item.label}
                </a>
                {item.count !== undefined && (
                  <span className="text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </React.Fragment>
  )
}
