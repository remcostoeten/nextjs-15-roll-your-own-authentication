import type React from "react"
import { requireAdmin } from "@/modules/authentication/lib/auth"
import Link from "next/link"
import { LayoutDashboard, Users, Activity, Settings, Bell } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for JWT Authentication system",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-8">
          <nav className="grid items-start gap-2">
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </Link>
            <Link
              href="/dashboard/admin/notifications"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Link>
            <Link
              href="/dashboard/workspaces"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Activity className="h-4 w-4" />
              <span>Workspaces</span>
            </Link>
            <Link
              href="/dashboard/user/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </nav>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </>
  )
}

