import type { Metadata } from "next"
import ApiAuthenticationClientPage from "./api-authentication-client-page"

export const metadata: Metadata = {
  title: "API Authentication | Documentation",
  description: "Learn how to authenticate API requests using JWT tokens",
}

export default function ApiAuthenticationPage() {
  return <ApiAuthenticationClientPage />
}

