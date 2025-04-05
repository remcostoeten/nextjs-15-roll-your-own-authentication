import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/modules/authentication/utilities/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">JWT Authentication</h1>
        <p className="mb-8 text-muted-foreground">A secure authentication system using JWT tokens and PostgreSQL</p>

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

