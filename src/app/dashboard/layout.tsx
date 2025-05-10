import { UserProfileDropdownWrapper } from './UserProfileDropdownWrapper'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Aside } from '@/modules/dashboard/sidebar/app-sidebar'
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProfileDropdownWrapper>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Aside />
          <div className="flex-1 flex flex-col">
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