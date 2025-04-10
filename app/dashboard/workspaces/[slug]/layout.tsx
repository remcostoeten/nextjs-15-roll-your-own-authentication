import type { ReactNode } from 'react'
import Link from 'next/link'
import { getWorkspaceBySlug } from '@/modules/workspaces/api/queries'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, Users, CheckSquare, Settings } from 'lucide-react'
import { redirect } from 'next/navigation'

interface WorkspaceLayoutProps {
	children: ReactNode
	params: {
		slug: string
	}
}

export default async function WorkspaceLayout({
	children,
	params,
}: WorkspaceLayoutProps) {
	const workspace = await getWorkspaceBySlug(params.slug)

	if (!workspace) {
		redirect('/dashboard/workspaces')
	}

	return (
		<div className="flex-1 flex flex-col">
			<div className="container border-t">
				<Tabs
					defaultValue="overview"
					className="w-full"
				>
					<TabsList className="w-full justify-start h-12 bg-transparent p-0">
						<TabsTrigger
							value="overview"
							className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
							asChild
						>
							<Link
								href={`/dashboard/workspaces/${workspace.slug}`}
							>
								<Briefcase className="mr-2 h-4 w-4" />
								Overview
							</Link>
						</TabsTrigger>
						<TabsTrigger
							value="tasks"
							className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
							asChild
						>
							<Link
								href={`/dashboard/workspaces/${workspace.slug}/tasks`}
							>
								<CheckSquare className="mr-2 h-4 w-4" />
								Tasks
							</Link>
						</TabsTrigger>
						<TabsTrigger
							value="members"
							className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
							asChild
						>
							<Link
								href={`/dashboard/workspaces/${workspace.slug}/members`}
							>
								<Users className="mr-2 h-4 w-4" />
								Members
							</Link>
						</TabsTrigger>
						{workspace.role === 'owner' ||
						workspace.role === 'admin' ? (
							<TabsTrigger
								value="settings"
								className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-4"
								asChild
							>
								<Link
									href={`/dashboard/workspaces/${workspace.slug}/settings`}
								>
									<Settings className="mr-2 h-4 w-4" />
									Settings
								</Link>
							</TabsTrigger>
						) : null}
					</TabsList>
				</Tabs>
			</div>

			<main className="flex-1">{children}</main>
		</div>
	)
}
