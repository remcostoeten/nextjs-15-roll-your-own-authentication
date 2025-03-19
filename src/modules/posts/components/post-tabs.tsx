'use client'

import { Heart, Zap, Award } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

type Tab = 'following' | 'featured' | 'rising'

interface PostTabsProps {
	activeTab: Tab
	onChange: (tab: Tab) => void
}

export function PostTabs({ activeTab, onChange }: PostTabsProps) {
	const tabs = [
		{
			id: 'following' as const,
			label: 'Following',
			icon: <Heart className="h-4 w-4" />,
		},
		{
			id: 'featured' as const,
			label: 'Featured',
			icon: <Award className="h-4 w-4" />,
		},
		{
			id: 'rising' as const,
			label: 'Rising',
			icon: <Zap className="h-4 w-4" />,
		},
	]

	return (
		<div className="inline-flex border border-button-border rounded-md overflow-hidden">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => onChange(tab.id)}
					className={cn(
						'flex items-center gap-2 px-4 py-2 transition-colors',
						activeTab === tab.id
							? 'bg-background-lighter text-title-light'
							: 'bg-background text-button hover:text-title-light hover:bg-background-lighter/50'
					)}
				>
					{tab.icon}
					<span>{tab.label}</span>
				</button>
			))}
		</div>
	)
}
