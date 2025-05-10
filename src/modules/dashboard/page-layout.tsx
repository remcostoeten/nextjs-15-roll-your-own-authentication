import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { Providers } from "@/components/providers/providers"

type TProps =  {
  children: ReactNode
  heading?: string
  description?: string
  actions?: ReactNode
}

export function PageLayout({ children, heading, description, actions }: TProps) {
  return (
    <Providers>
      <main className="flex-1 overflow-auto p-6">
        {(heading || description || actions) && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                {heading && <h1 className="text-2xl font-semibold">{heading}</h1>}
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            <Separator className="mt-4" />
          </div>
        )}
        {children}
      </main>
    </Providers>
  )
}
