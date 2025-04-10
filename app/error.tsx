'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Center } from '@/shared/components/center'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error('Application error:', error)
	}, [error])

	return (
		<Center className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<AlertCircle className="h-16 w-16 text-destructive" />
				<h1 className="text-4xl font-bold tracking-tight">
					Something went wrong
				</h1>
				<p className="text-lg text-muted-foreground">
					We apologize for the inconvenience. Please try again.
				</p>
			</div>
			<div className="flex gap-4">
				<Button
					onClick={reset}
					variant="default"
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					Try again
				</Button>
				<Button
					asChild
					variant="outline"
				>
					<a href="/">Return home</a>
				</Button>
			</div>
		</Center>
	)
}
