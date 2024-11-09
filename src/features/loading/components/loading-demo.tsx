'use client'

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import {
	Button,
	Progress,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from 'ui'

type DummyUser = {
	id: string
	name: string
	email: string
	role: string
}

const DUMMY_USER: DummyUser = {
	id: '12345',
	name: 'John Doe',
	email: 'john@example.com',
	role: 'user'
}

const DURATION_OPTIONS = [
	{ value: '1000', label: '1 second' },
	{ value: '2000', label: '2 seconds' },
	{ value: '3000', label: '3 seconds' },
	{ value: '5000', label: '5 seconds' }
]

type LoadingDemoProps = {
	initialLoadingTime?: number
}

export default function LoadingDemo({
	initialLoadingTime = 3000
}: LoadingDemoProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [progress, setProgress] = useState(0)
	const [loadingTime, setLoadingTime] = useState(initialLoadingTime)
	const [userData, setUserData] = useState<DummyUser | null>(null)

	async function handleLoadingDemo() {
		setIsLoading(true)
		setProgress(0)
		setUserData(null)

		const startTime = Date.now()
		const intervalTime = 50

		const progressInterval = setInterval(() => {
			const elapsed = Date.now() - startTime
			const newProgress = Math.min((elapsed / loadingTime) * 100, 100)
			setProgress(newProgress)
		}, intervalTime)

		await new Promise((resolve) => setTimeout(resolve, loadingTime))

		clearInterval(progressInterval)
		setProgress(100)
		setUserData(DUMMY_USER)

		// Don't reset immediately to show the loaded data
		setTimeout(() => {
			setIsLoading(false)
		}, 500)
	}

	return (
		<div className="border border-neutral-800 rounded-lg p-6 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">
					Live Demo: Loading States
				</h3>
				<div className="flex items-center gap-3">
					<Select
						value={loadingTime.toString()}
						onValueChange={(value) => setLoadingTime(Number(value))}
						disabled={isLoading}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Select duration" />
						</SelectTrigger>
						<SelectContent>
							{DURATION_OPTIONS.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={handleLoadingDemo}
						disabled={isLoading}
					>
						<RefreshCw
							className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
						/>
						{isLoading ? 'Loading...' : 'Start Loading'}
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<div className="flex justify-between text-sm text-neutral-400">
						<span>Progress</span>
						<span>{Math.round(progress)}%</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				<div className="space-y-3 min-h-[100px]">
					{isLoading ? (
						<>
							<div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4" />
							<div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2" />
							<div className="h-4 bg-neutral-800 rounded animate-pulse w-2/3" />
						</>
					) : userData ? (
						<div className="space-y-2 text-sm">
							<p>
								<span className="font-medium text-neutral-200">
									ID:
								</span>{' '}
								<span className="text-neutral-400">
									{userData.id}
								</span>
							</p>
							<p>
								<span className="font-medium text-neutral-200">
									Name:
								</span>{' '}
								<span className="text-neutral-400">
									{userData.name}
								</span>
							</p>
							<p>
								<span className="font-medium text-neutral-200">
									Email:
								</span>{' '}
								<span className="text-neutral-400">
									{userData.email}
								</span>
							</p>
							<p>
								<span className="font-medium text-neutral-200">
									Role:
								</span>{' '}
								<span className="text-neutral-400">
									{userData.role}
								</span>
							</p>
						</div>
					) : (
						<div className="text-neutral-400">
							Click &quot;Start Loading&quot; to simulate a
							loading state
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
