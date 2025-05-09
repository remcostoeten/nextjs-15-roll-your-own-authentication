import { UserProfileDropdownWrapper } from './UserProfileDropdownWrapper'
import { DashboardNav } from '@/modules/dashboard/components/DashboardNav'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/modules/dashboard/app-sidebar'
import { UserProfileDropdown } from '@/modules/dashboard/user-profile-dropdown'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProfileDropdownWrapper>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 flex">
                  <a className="mr-6 flex items-center space-x-2" href="/">
                    <span className="font-bold">Dashboard</span>
                  </a>
                  <DashboardNav />
                </div>
                <div className="flex items-center gap-4">
                  <UserProfileDropdown />
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="container py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </UserProfileDropdownWrapper>
  )
} 