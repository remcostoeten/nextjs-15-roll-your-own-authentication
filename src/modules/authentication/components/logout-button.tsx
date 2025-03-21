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
			className="relative inline-flex items-center justify-center px-4 py-2 bg-transparent text-[#4e9815] border border-[#4e9815] rounded-lg font-medium
                     transition-all duration-300 ease-in-out
                     hover:bg-[#4e9815] hover:text-black hover:scale-105
                     hover:shadow-[0_0_20px_rgba(78,152,21,0.3)]
                     disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:text-[#4e9815] disabled:hover:shadow-none"
		>
			{isLoading ? (
				<>
					<svg
						className="animate-spin -ml-1 mr-2 h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Logging out...
				</>
			) : (
				'Logout'
			)}
		</button>
	)
}
