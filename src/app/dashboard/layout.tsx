import type React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { logout } from "@/modules/auth/api/actions/auth.actions";
import { getUserSession } from "@/modules/auth/lib/session";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/modules/dashboard/app-sidebar";
function LogoutButton() {
    return (
        <form  className='mt-20'action={logout}>
            <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Logout
            </button>
        </form>
    );
}


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    const session = await getUserSession();

    if (!session) {
      redirect('/login');
    }
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden bg-black">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
