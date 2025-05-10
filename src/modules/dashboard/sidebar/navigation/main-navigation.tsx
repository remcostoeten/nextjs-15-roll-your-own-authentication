"use client"

import React from "react"
import Link from "next/link"
import { BarChart, Briefcase, ShoppingCart, Users, CircleDollarSign } from "lucide-react"

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { MAIN_NAV_ITEMS } from "../config/navigation-config"

interface MainNavigationProps {
  pathname: string | null
}

export function MainNavigation({ pathname }: MainNavigationProps) {
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(path)
  }

  return (
    <SidebarMenu>
      {MAIN_NAV_ITEMS.map((item) => (
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
