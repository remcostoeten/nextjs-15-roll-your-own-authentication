import { Suspense } from "react";
import { DashboardStats } from "@/modules/admin/components/dashboard-stats";
import { RecentActivities } from "@/modules/admin/components/recent-activities";
import { requireAdmin } from "@/modules/authentication/utilities/auth";
import { getUserStatistics } from "@/modules/admin/api/queries";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  // Ensure user is an admin
  await requireAdmin();

  // Get user statistics
  const stats = await getUserStatistics();

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 gap-8">
        <Suspense fallback={<div>Loading recent activities...</div>}>
          <RecentActivities />
        </Suspense>
      </div>
    </div>
  );
}
