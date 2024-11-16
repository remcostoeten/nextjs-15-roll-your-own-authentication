import Header from '@/components/layout/header'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from './theme-providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: PageProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 antialiased', inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header/>
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}
