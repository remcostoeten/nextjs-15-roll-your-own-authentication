import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { getSnippetById } from '@/modules/snippets/api/queries'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import { Badge } from '@/components/ui/badge'
import { SnippetActions } from '@/modules/snippets/components/snippet-actions'
import { SnippetSyntaxHighlighter } from '@/modules/snippets/components/snippet-syntax-highlighter'
import { SnippetVersionHistory } from '@/modules/snippets/components/snippet-version-history'
import { db } from '@/server/db'
import { workspaces } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { ArrowLeft, Pin, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SnippetPageProps {
	params: {
		slug: string
		id: string
	}
	searchParams: {
		tab?: string
	}
}

export async function generateMetadata({
	params,
}: SnippetPageProps): Promise<Metadata> {
	const snippet = await getSnippetById(params.id)

	if (!snippet) {
		return {
			title: 'Snippet Not Found',
		}
	}

	return {
		title: `${snippet.title} | Snippets`,
		description: `Code snippet: ${snippet.title}`,
	}
}

export default async function SnippetPage({
	params,
	searchParams,
}: SnippetPageProps) {
	// Require authentication
	await requireAuth()

	const snippet = await getSnippetById(params.id)

	if (!snippet) {
		notFound()
	}

	// Get workspace
	const workspace = await db.query.workspaces.findFirst({
		where: eq(workspaces.id, snippet.workspaceId),
	})

	if (!workspace) {
		notFound()
	}

	// Format the date
	const formattedDate = formatDistanceToNow(new Date(snippet.updatedAt), {
		addSuffix: true,
	})
	const activeTab = searchParams.tab || 'code'

	return (
		<div className="container max-w-4xl py-6">
			<div className="space-y-6">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						asChild
					>
						<Link
							href={`/dashboard/workspaces/${params.slug}/snippets`}
						>
							<ArrowLeft className="h-4 w-4 mr-1" />
							Back to snippets
						</Link>
					</Button>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold tracking-tight">
							{snippet.title}
						</h1>
						{snippet.isPinned && (
							<Pin className="h-4 w-4 text-primary" />
						)}
						{snippet.isFavorite && (
							<Star className="h-4 w-4 text-yellow-500" />
						)}
					</div>

					<SnippetActions
						snippet={snippet}
						workspaceSlug={params.slug}
					/>
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between text-muted-foreground">
					<p>Last updated {formattedDate}</p>
					{snippet.creator && (
						<p>
							Created by {snippet.creator.firstName}{' '}
							{snippet.creator.lastName}
						</p>
					)}
				</div>

				<Tabs
					defaultValue={activeTab}
					className="w-full"
				>
					<TabsList>
						<TabsTrigger
							value="code"
							asChild
						>
							<Link href={`?tab=code`}>Code</Link>
						</TabsTrigger>
						<TabsTrigger
							value="history"
							asChild
						>
							<Link href={`?tab=history`}>History</Link>
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="code"
						className="mt-6"
					>
						<div className="rounded-lg border overflow-hidden">
							<div className="bg-muted px-4 py-2 flex items-center justify-between">
								<div className="text-sm font-medium">
									{snippet.language}
								</div>
							</div>
							<SnippetSyntaxHighlighter
								code={snippet.content}
								language={snippet.language}
							/>
						</div>
					</TabsContent>

					<TabsContent
						value="history"
						className="mt-6"
					>
						<SnippetVersionHistory
							snippetId={snippet.id}
							language={snippet.language}
						/>
					</TabsContent>
				</Tabs>

				<div className="flex flex-wrap gap-2">
					{snippet.category && (
						<Badge variant="secondary">
							{snippet.category.name}
						</Badge>
					)}

					{snippet.labels.map((label) => (
						<Badge
							key={label.id}
							style={{
								backgroundColor: `${label.color}20`,
								color: label.color,
								borderColor: `${label.color}40`,
							}}
							variant="outline"
						>
							{label.name}
						</Badge>
					))}
				</div>
			</div>
		</div>
	)
}
