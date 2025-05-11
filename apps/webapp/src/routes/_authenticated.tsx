import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { authClient } from "@acme/auth/client";
import { DashboardHeader } from "./_authenticated/dashboard/-components/dashboard-header";
import { SidebarNav } from "./_authenticated/dashboard/-components/sidebar-nav";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { error } = await authClient.getSession();
    if (error) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: "/login",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <div className="hidden border-r bg-muted/40 md:block md:w-64">
          <div className="flex h-full flex-col gap-2 p-4">
            <SidebarNav />
          </div>
        </div>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
