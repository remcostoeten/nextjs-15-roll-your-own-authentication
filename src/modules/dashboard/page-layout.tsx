import type { ReactNode } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumbs } from "./breadcrumbs"
import { Providers } from "@/components/providers/providers"

interface PageLayoutProps {
  children: ReactNode
  heading?: string
  description?: string
  actions?: ReactNode
}

export function PageLayout({ children, heading, description, actions }: PageLayoutProps) {
  return (
    <Providers>
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6 z-10">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <Breadcrumbs />
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        {(heading || description) && (
          <div className="mb-6">
            {heading && <h1 className="text-2xl font-semibold">{heading}</h1>}
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
            <Separator className="mt-4" />
          </div>
        )}
        {children}
      </main>
    </Providers>
  )
}
