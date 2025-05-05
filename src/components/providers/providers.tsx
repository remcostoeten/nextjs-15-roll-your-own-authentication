import { ThemeProvider } from "../theme-provider"
import { TooltipProvider } from "../ui/tooltip"
import { SidebarProvider } from "../ui/sidebar"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={50}>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}