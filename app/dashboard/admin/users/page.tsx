import { getAllUsers } from "@/modules/admin/api/queries"
import { requireAdmin } from "@/modules/authentication/lib/auth"
import { UserTable } from "@/modules/admin/components/user-table"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the JWT Authentication system",
}

export default async function AdminUsersPage() {
  const admin = await requireAdmin()
  const users = await getAllUsers()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>

      <div className="rounded-md border">
        <UserTable users={users} currentUserId={admin.id} />
      </div>
    </div>
  )
}

