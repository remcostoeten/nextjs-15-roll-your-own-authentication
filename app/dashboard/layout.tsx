import type { ReactNode } from "react";
import { requireAuth } from "@/modules/authentication/utilities/auth";
import { Sidebar } from "@/components/ui/sidebar";
import { NotificationBell } from "@/modules/notifications/components/notification-bell";
import { WorkspaceSwitcher } from "@/modules/workspaces/components/workspace-switcher";
import { logout } from "@/modules/authentication/api/mutations";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b border-border bg-card">
          <div className="container flex h-16 items-center px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <WorkspaceSwitcher />
              <span className="font-medium ml-4">Dashboard</span>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <NotificationBell />
              <form
                action={async () => {
                  "use server";
                  await logout();
                  redirect("/login");
                }}
              >
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </form>
            </div>
          </div>
        </header>

        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/user/profile"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Profile
          </Link>
          {/* Storage link removed */}
          {/* Add other navigation links as needed */}
        </nav>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
