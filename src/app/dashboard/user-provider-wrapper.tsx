import { UserProvider } from "@/modules/authenticatie/context/user-context"
import { getSession } from "@/modules/authenticatie/helpers/session"
import { asUUID } from "@/shared/types/common"
import { ReactNode } from "react"

export async function UserProviderWrapper({ children }: { children: ReactNode }) {
  const session = await getSession()

  const user = session ? {
    id: asUUID(session.id),
    name: session.name || "",
    email: session.email,
    avatar: session.avatar || "",
    role: session.role || "user"
  } : null

  return (
    <UserProvider user={user}>
      {children}
    </UserProvider>
  )
}
