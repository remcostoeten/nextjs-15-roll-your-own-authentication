import '@/styles/styles.css'
import { ThemeProvider } from '@/components/theme/providers'
import { Toaster } from 'sonner'
import FloatingTodo from '@/components/theme/floating-notes'
import { Inter } from 'next/font/google'
import { cn } from '@/shared/utils'
import { WidgetProvider } from '@/shared/providers/widget-provider'
import { siteMetadata } from '@/core/config/metadata'

const inter = Inter({ subsets: ['latin'] })
export const metadata = siteMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const showFloatingTodo = process.env.NEXT_PUBLIC_ENABLE_FLOATING_TODO === 'true'

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={cn('min-h-screen bg-background antialiased', inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WidgetProvider>
            {children}
          </WidgetProvider>
          {showFloatingTodo && <FloatingTodo />}
          <Toaster
            richColors
            position="top-right"
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
