import NNavigationMenu from '@/components/layout/navigation/Header'
import { UserProfile } from '@/components/layout/navigation/navigation'
import { getUser } from '@/features/authentication/queries/get-user'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from './theme-providers'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: PageProps) {
	const user = await getUser()

	const userProfile: UserProfile | null = user ? { 
		email: user.email,
		role: user.role as 'user' | 'admin',
		avatarUrl: user.avatarUrl,
	} : null;

	return (
		<html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen  antialiased', inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
            <NNavigationMenu user={userProfile} />
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}
