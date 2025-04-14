'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { Sidebar } from './dashboard-sidebar'
import { MobileNavigationBar } from './mobile-navigation'
import { LogoLoader } from './logo-loader'
import { LayoutHeader } from './layout-header'

type TProps = {
	children: React.ReactNode
}

export function DashboardLayout({ children }: TProps) {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 1000)

		return () => clearTimeout(timer)
	}, [])

	return (
		<div className="flex min-h-svh w-full bg-[#1E1E1E]">
			<div className="flex flex-col h-screen w-screen bg-[#1E1E1E] text-white">
				<div className="flex-shrink-0">
					<MobileNavigationBar />
					<LayoutHeader />
				</div>
				<div className="flex flex-1 w-full overflow-y-hidden">
					<Sidebar />
					<div className="flex-grow h-full overflow-y-auto bg-[#1E1E1E]">
						<div className="flex flex-row h-full w-full">
							<div className="flex h-full w-full">
								<div className="w-full h-full">
									<main className="h-full flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden">
										{isLoading ? <LogoLoader /> : children}
									</main>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
