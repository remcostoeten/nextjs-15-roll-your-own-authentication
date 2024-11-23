import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { extractRouterConfig } from 'uploadthing/server'
import SessionStatus from '../components/_dev-tools/session-status'
import { featureFlags } from '../config/features'
import { uploadRouter } from '../server/uploadthing'
import { getUser } from '../services/auth/get-user'
import './globals.css'

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <NextSSRPlugin
          routerConfig={extractRouterConfig(uploadRouter)}
        />
        <nav className="border-b border-border">
          <div className="container mx-auto flex justify-between items-center h-14">
            <Link href="/" className="text-xl font-bold">
              Auth Dashboard
            </Link>
            <div>
              {user ? (
                <>
                  <Link href="/dashboard" className="mr-4">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="mr-4">
                    Profile
                  </Link>
                  <Link href="/logout">Logout</Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="mr-4">
                    Login
                  </Link>
                  <Link href="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto mt-8">{children}</main>
        {featureFlags.sessionStatus && <SessionStatus user={user} />}
        <ToastContainer />
      </body>
    </html>
  )
}
