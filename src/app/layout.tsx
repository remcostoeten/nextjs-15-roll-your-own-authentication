import '@/styles/globals.css'
import { fontVariables, siteMetadata } from '@/core/config'

export const metadata = siteMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        {children}
      </body>
    </html>
  )
}
