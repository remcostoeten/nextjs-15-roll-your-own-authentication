'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type workspaces } from '@/server/db/schema'
import { usePathname, useRouter } from 'next/navigation'

interface WorkspaceTabsProps {
	workspace: typeof workspaces.$inferSelect
}

export function WorkspaceTabs({ workspace }: WorkspaceTabsProps) {
	const pathname = usePathname()
	const router = useRouter()

	const tabs = [
		{
			value: 'overview',
			label: 'Overview',
			href: `/dashboard/workspaces/${workspace.slug}`,
		},
		{
			value: 'snippets',
			label: 'Snippets',
			href: `/dashboard/workspaces/${workspace.slug}/snippets`,
		},
		{
			value: 'tasks',
			label: 'Tasks',
			href: `/dashboard/workspaces/${workspace.slug}/tasks`,
		},
	]

	const currentTab =
		tabs.find((tab) => pathname.startsWith(tab.href))?.value || 'overview'

	return (
		<Tabs
			value={currentTab}
			onValueChange={(value) => {
				const tab = tabs.find((t) => t.value === value)
				if (tab) {
					router.push(tab.href)
				}
			}}
		>
			<TabsList>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
					>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	)
}
