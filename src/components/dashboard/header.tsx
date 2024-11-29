'use client'

import { useToastStore } from '@/shared/primitives/toast'
import { Button } from '@/shared/ui'
import { motion } from 'framer-motion'
import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * Dashboard header component with navigation and user actions
 * @author Remco Stoeten
 */
export function DashboardHeader() {
	const router = useRouter()
	const { add: addToast } = useToastStore()

	const handleLogout = async () => {
		try {
			// Add your logout logic here
			addToast('Logged out successfully', {
				variant: 'success',
				duration: 3000
			})
			router.push('/login')
		} catch (error) {
			console.error('Logout error:', error)
			addToast('Failed to logout', {
				variant: 'error',
				duration: 5000
			})
		}
	}

	return (
		<motion.header
			className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="container flex h-16 items-center px-4">
				<Link
					href="/dashboard"
					className="mr-8 flex items-center space-x-2"
				>
					<span className="text-xl font-bold">Dashboard</span>
				</Link>

				<div className="ml-auto flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						className="relative h-8 w-8"
						asChild
					>
						<Link href="/profile">
							<User className="h-4 w-4" />
							<span className="sr-only">Profile</span>
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="relative h-8 w-8"
						asChild
					>
						<Link href="/settings">
							<Settings className="h-4 w-4" />
							<span className="sr-only">Settings</span>
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="relative h-8 w-8"
						onClick={handleLogout}
					>
						<LogOut className="h-4 w-4" />
						<span className="sr-only">Logout</span>
					</Button>
				</div>
			</div>
		</motion.header>
	)
}
