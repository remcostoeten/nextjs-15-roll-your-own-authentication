'use client'

import { Toaster } from '@/shared/primitives/toast'
import { usePathname } from 'next/navigation'

/**
 * Auth layout wrapper for login/register pages
 * Conditionally renders based on pathname
 * @author Your Name
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname)

    if (!isAuthPage) {
        return null
    }

    return (
        <main className="min-h-screen -mt-8">
            {children}
            <Toaster />
        </main>
    )
} 
