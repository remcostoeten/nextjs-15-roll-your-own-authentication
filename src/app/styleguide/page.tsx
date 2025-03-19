"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StyleguideRedirect() {
    const router = useRouter()

    useEffect(() => {
        router.replace("/demos/styleguide")
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Redirecting...</h1>
                <p className="text-muted-foreground">Please wait while we redirect you to the styleguide.</p>
            </div>
        </div>
    )
} 