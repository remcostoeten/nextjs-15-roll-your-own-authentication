import React, { ReactNode } from "react"
import {
  BookOpen,
  Code,
  FileCode,
  Icon,
  Layers,
  Settings,
  Shield,
  Terminal,
  Zap,
} from "lucide-react"
import { NavIcon } from "../components/nav-icon"

export type NavItem = {
  name: string
  href: string
  icon: ReactNode
  description?: string
  isDropdown?: boolean
  items?: NavItem[]
}

export const navItems: NavItem[] = [
  {
    name: "_docs",
    href: "/docs",
    icon: <NavIcon Icon={BookOpen} />,
    description: "Documentation and guides",
  },
  {
    name: "_changelog",
    href: "/changelog",
    icon: <NavIcon Icon={FileCode} />,
    description: "Latest updates and changes",
  },
  {
    name: "_roadmap",
    href: "/roadmap",
    icon: <NavIcon Icon={Layers} />,
    description: "Upcoming features and plans",
  },
  {
    name: "_demos",
    href: "#",
    icon: <NavIcon Icon={Code} />,
    description: "Interactive examples and demos",
    isDropdown: true,
    items: [
      {
        name: "dev-tool",
        href: "/demos/dev-tool",
        icon: <NavIcon Icon={Terminal} />,
        description: "Developer tools and utilities",
      },
      {
        name: "styleguide",
        href: "/demos/styleguide",
        icon: <NavIcon Icon={Layers} />,
        description: "Design system and components",
      },
      {
        name: "security",
        href: "/demos/security",
        icon: <NavIcon Icon={Shield} />,
        description: "Security features and best practices",
      },
      {
        name: "test",
        href: "/dev/test",
        icon: <NavIcon Icon={Zap} />,
        description: "Testing environment",
      },
    ],
  },
  {
    name: "_settings",
    href: "/settings",
    icon: <NavIcon Icon={Settings} />,
    description: "Configuration options",
  },
]; 