'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'

type ErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
            <div className="text-center space-y-8 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-foreground">
                        Something went wrong!
                    </h2>
                    <div className="mt-2 text-muted-foreground">
                        {error.message || "An unexpected error occurred"}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Try again
                    </button>
                </motion.div>

                {error.digest && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-sm text-muted-foreground"
                    >
                        Error ID: {error.digest}
                    </motion.p>
                )}
            </div>
        </div>
    )
} 
