"use client"

import React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { ExpandableSection } from "../components/expandable-section"
import { EXPANDABLE_SECTIONS, CONTENT_NAV_ITEMS } from "../config/navigation-config"

interface ContentNavigationProps {
  pathname: string | null
  isCollapsed: boolean
}

export function ContentNavigation({ pathname, isCollapsed }: ContentNavigationProps) {
  const [expandedSections, setExpandedSections] = React.useState({
    posts: true,
    pages: false,
  })

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(path)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId as keyof typeof prev],
    }))
  }

  return (
    <SidebarMenu>
      <AnimatePresence initial={false}>
        {Object.values(EXPANDABLE_SECTIONS).map((section) => (
          <ExpandableSection
            key={section.id}
            id={section.id}
            label={section.label}
            icon={section.icon}
            items={section.items}
            actions={section.actions}
            isExpanded={!!expandedSections[section.id as keyof typeof expandedSections]}
            isCollapsed={isCollapsed}
            onToggle={toggleSection}
          />
        ))}
      </AnimatePresence>

      {CONTENT_NAV_ITEMS.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={isActive(item.href)}>
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
