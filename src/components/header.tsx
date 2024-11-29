'use client'

import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()
    const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname)

    if (isAuthPage) {
        return null
    }

    return (
        <header>
            {/* Your header content */}
        </header>
    )
} 
