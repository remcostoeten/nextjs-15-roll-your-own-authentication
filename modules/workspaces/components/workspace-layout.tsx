import type { ReactNode } from "react"
import Link from "next/link"
import { getWorkspaceBySlug } from "../api/queries"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { NotificationBell } from "@/modules/notifications/components/notification-bell"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Users, CheckSquare, Settings, LogOut } from "lucide-react"
import { logout } from "@/modules/authentication/api/mutations"
import { redirect } from "next/navigation"

interface WorkspaceLayoutProps {
  children: ReactNode
  params: {
    slug: string
  }
}

export async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const workspace = await getWorkspaceBySlug(params.slug)

  if (!workspace) {
    redirect("/workspaces")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <WorkspaceSwitcher currentWorkspace={workspace} />
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <form
              action={async () => {
                "use server"
                await logout()
                redirect("/login")
              }}
            >
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </form>
          </div>
        </div>
        <div className="container border-t">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
                asChild
              >
                <Link href={`/workspaces/${workspace.slug}`}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Overview
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
                asChild
              >
                <Link href={`/workspaces/${workspace.slug}/tasks`}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Tasks
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
                asChild
              >
                <Link href={`/workspaces/${workspace.slug}/members`}>
                  <Users className="mr-2 h-4 w-4" />
                  Members
                </Link>
              </TabsTrigger>
              {workspace.role === "owner" || workspace.role === "admin" ? (
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
                  asChild
                >
                  <Link href={`/workspaces/${workspace.slug}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </TabsTrigger>
              ) : null}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}

