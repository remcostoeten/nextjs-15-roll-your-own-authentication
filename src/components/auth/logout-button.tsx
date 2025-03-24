'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui'
import { LogOut } from 'lucide-react'
import { useAuthApi } from '@/modules/authentication/hooks/use-auth-api'

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { logout } = useAuthApi()

    const handleLogout = async () => {
        console.log('Logout button clicked')
        try {
            setIsLoading(true)
            console.log('Calling logout function...')
            const result = await logout()
            console.log('Logout result:', result)
            // Manually redirect since the server redirect might not work in all cases
            router.push('/login')
        } catch (error) {
            console.error('Logout failed:', error)
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full justify-start"
        >
            <LogOut className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
    )
} 