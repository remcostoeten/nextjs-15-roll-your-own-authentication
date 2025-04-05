"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DocsSidebar({ className, ...props }: DocsSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Architecture",
          href: "/docs/architecture",
          items: [],
        },
      ],
    },
    {
      title: "Authentication",
      items: [
        {
          title: "API Authentication",
          href: "/docs/api-authentication",
          items: [],
        },
        {
          title: "JWT Tokens",
          href: "/docs/jwt-tokens",
          items: [],
        },
        {
          title: "OAuth Integration",
          href: "/docs/oauth-integration",
          items: [],
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          title: "User Data",
          href: "/docs/user-data",
          items: [],
        },
        {
          title: "Roles & Permissions",
          href: "/docs/roles-permissions",
          items: [],
        },
        {
          title: "Sessions",
          href: "/docs/sessions",
          items: [],
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          title: "Database Relations",
          href: "/docs/database-relations",
          items: [],
        },
        {
          title: "Data Protection",
          href: "/docs/data-protection",
          items: [],
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          title: "Route Protection",
          href: "/docs/route-protection",
          items: [],
        },
        {
          title: "API Security",
          href: "/docs/api-security",
          items: [],
        },
        {
          title: "Best Practices",
          href: "/docs/security-best-practices",
          items: [],
        },
      ],
    },
  ]

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        {routes.map((route) => (
          <div key={route.title} className="px-3 py-2">
            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">{route.title}</h4>
            {route.items?.length > 0 && (
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {route.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline",
                      pathname === item.href ? "font-medium text-foreground bg-accent" : "text-muted-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

