import type { Metadata } from "next"
import UserDataClientPage from "./UserDataClientPage"

export const metadata: Metadata = {
  title: "User Data | Documentation",
  description: "Access user data on the server and client side",
}

export default function UserDataPage() {
  return <UserDataClientPage />
}

