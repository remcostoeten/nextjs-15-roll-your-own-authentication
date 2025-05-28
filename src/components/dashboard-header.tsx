"use client"

import { NotificationsDropdown } from '@/modules/notifications/components/notifications-dropdown';
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { ChevronRight, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button, Separator } from "ui";

export function DashboardHeader() {
  const pathname = usePathname()

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: `/${pathSegments.slice(0, index + 1).join('/')}`,
    isLast: index === pathSegments.length - 1
  }))

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
              <span className={crumb.isLast ? "text-foreground font-medium" : "hover:text-foreground transition-colors"}>
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="relative h-8 w-8 p-0 xl:h-8 xl:w-40 xl:justify-start xl:px-3 xl:py-2">
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <NotificationsDropdown />

        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
