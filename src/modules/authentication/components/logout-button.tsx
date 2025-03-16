'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await fetch('/api/auth/logout')
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    )
} 