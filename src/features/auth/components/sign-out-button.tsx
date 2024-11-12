'use client'

import { useAuth } from '@/hooks'
import { Button } from '@/shared/components/ui/button'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
    const { signOut, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-10 w-24 bg-muted rounded-md flex items-center justify-center">
                    <div className="h-4 w-16 bg-muted-foreground/20 rounded" />
                </div>
            </div>
        )
    }

    return (
        <Button
            variant="outline"
            onClick={signOut}
            disabled={isLoading}
            className="w-24"
        >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
        </Button>
    )
} 
