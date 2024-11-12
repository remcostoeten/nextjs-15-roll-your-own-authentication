'use client'

import { GlowCard } from '@/components/glow-card'
import { useCursorGlow } from '@/hooks/use-cursor-glow'

type DashboardContentProps = {
	session: {
		email: string
		role: string
		userId: string
	}
	allCookies: any
}

export default function DashboardContent({
	session,
	allCookies
}: DashboardContentProps) {
	const { ref, glowStyles, containerStyles } = useCursorGlow({
		intensity: 0.03,
		delay: 2,
		randomness: 10,
		isDark: true
	})

	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-2xl font-bold mb-4 text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Dashboard
				</h1>
				<p className="text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Welcome, {session.email}
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold text-[#1a1a1a] hover:text-black dark:text-zinc-200 dark:hover:text-white">
					Debug Information
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<GlowCard
						glowConfig={{
							intensity: 0.15,
							delay: 0,
							randomness: 5,
							isDark: true
						}}
						className="p-6 bg-[#1a1a1a]/5 dark:bg-zinc-900/50"
					>
						<h3 className="font-medium mb-4 text-[#1a1a1a] dark:text-zinc-200">
							User Status
						</h3>
						<ul className="space-y-3 text-[#1a1a1a] dark:text-zinc-300">
							<li className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Role
								</span>
								<span className="text-sm">{session.role}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-sm font-medium">
									User ID
								</span>
								<span className="text-sm">
									{session.userId}
								</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Email
								</span>
								<span className="text-sm">{session.email}</span>
							</li>
						</ul>
					</GlowCard>

					<GlowCard
						glowConfig={{
							intensity: 0.15,
							delay: 0,
							randomness: 5,
							isDark: true
						}}
						className="p-6 bg-[#1a1a1a]/5 dark:bg-zinc-900/50"
					>
						<h3 className="font-medium mb-4 text-[#1a1a1a] dark:text-zinc-200">
							Session Info
						</h3>
						<ul className="space-y-3 text-[#1a1a1a] dark:text-zinc-300">
							<li className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Status
								</span>
								<span className="text-sm text-green-500">
									Active
								</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Cookies
								</span>
								<span className="text-sm">
									{allCookies.length} active
								</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Last Activity
								</span>
								<span className="text-sm">Just now</span>
							</li>
						</ul>
					</GlowCard>
				</div>
			</div>
		</div>
	)
}
