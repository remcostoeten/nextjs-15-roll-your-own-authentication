import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { db } from '@/server/db'
import { workspaces } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/modules/authentication/utilities/auth'
import { SnippetsHeader } from '@/modules/snippets/components/snippets-header'
import { SnippetsList } from '@/modules/snippets/components/snippets-list'
import { SnippetsFilters } from '@/modules/snippets/components/snippets-filters'
import { SnippetsLoading } from '@/modules/snippets/components/snippets-loading'
import { SnippetsStats } from '@/modules/snippets/components/snippets-stats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	FolderArchiveIcon as ArchiveBox,
	BookmarkIcon,
	Pin,
	Star,
} from 'lucide-react'

interface SnippetsPageProps {
	params: {
		slug: string
	}
	searchParams: {
		q?: string
		category?: string
		labels?: string
		public?: string
		pinned?: string
		favorite?: string
		archived?: string
		view?: string
		page?: string
		sort?: string
		order?: string
	}
}

export default async function SnippetsPage({
	params,
	searchParams,
}: SnippetsPageProps) {
	// Require authentication
	const user = await requireAuth()

	// Get workspace by slug
	const workspace = await db.query.workspaces.findFirst({
		where: eq(workspaces.slug, params.slug),
	})

	if (!workspace) {
		notFound()
	}

	// Parse search params
	const searchQuery = searchParams.q || ''
	const categoryId = searchParams.category || null
	const labelIds = searchParams.labels ? searchParams.labels.split(',') : []
	const isPublicOnly = searchParams.public === 'true'
	const isPinned = searchParams.pinned === 'true'
	const isFavorite = searchParams.favorite === 'true'
	const isArchived = searchParams.archived === 'true'
	const view = searchParams.view || 'all'
	const page = Number.parseInt(searchParams.page || '1', 10)
	const sortBy = (searchParams.sort || 'position') as
		| 'title'
		| 'createdAt'
		| 'updatedAt'
		| 'position'
	const sortOrder = (searchParams.order || 'desc') as 'asc' | 'desc'

	return (
		<div className="flex flex-col space-y-6">
			<SnippetsHeader workspace={workspace} />

			<Tabs
				defaultValue={view}
				className="w-full"
			>
				<TabsList className="mb-4">
					<TabsTrigger
						value="all"
						asChild
					>
						<a href={`?view=all`}>All Snippets</a>
					</TabsTrigger>
					<TabsTrigger
						value="pinned"
						asChild
					>
						<a
							href={`?view=pinned&pinned=true`}
							className="flex items-center gap-1"
						>
							<Pin className="h-3.5 w-3.5" />
							<span>Pinned</span>
						</a>
					</TabsTrigger>
					<TabsTrigger
						value="favorites"
						asChild
					>
						<a
							href={`?view=favorites&favorite=true`}
							className="flex items-center gap-1"
						>
							<Star className="h-3.5 w-3.5" />
							<span>Favorites</span>
						</a>
					</TabsTrigger>
					<TabsTrigger
						value="public"
						asChild
					>
						<a
							href={`?view=public&public=true`}
							className="flex items-center gap-1"
						>
							<BookmarkIcon className="h-3.5 w-3.5" />
							<span>Public</span>
						</a>
					</TabsTrigger>
					<TabsTrigger
						value="archived"
						asChild
					>
						<a
							href={`?view=archived&archived=true`}
							className="flex items-center gap-1"
						>
							<ArchiveBox className="h-3.5 w-3.5" />
							<span>Archive</span>
						</a>
					</TabsTrigger>
				</TabsList>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<aside className="md:col-span-1">
						<Suspense
							fallback={
								<div className="h-[400px] w-full animate-pulse bg-muted rounded-md"></div>
							}
						>
							<SnippetsFilters
								workspaceId={workspace.id}
								currentCategoryId={categoryId}
								currentLabelIds={labelIds}
								isPublicOnly={isPublicOnly}
								isPinned={isPinned}
								isFavorite={isFavorite}
								isArchived={isArchived}
							/>
						</Suspense>

						<div className="mt-6">
							<Suspense
								fallback={
									<div className="h-[200px] w-full animate-pulse bg-muted rounded-md"></div>
								}
							>
								<SnippetsStats workspaceId={workspace.id} />
							</Suspense>
						</div>
					</aside>

					<main className="md:col-span-3">
						<TabsContent
							value="all"
							className="mt-0"
						>
							<Suspense fallback={<SnippetsLoading />}>
								<SnippetsList
									workspaceId={workspace.id}
									searchQuery={searchQuery}
									categoryId={categoryId}
									labelIds={labelIds}
									isPublicOnly={isPublicOnly}
									isPinned={isPinned}
									isFavorite={isFavorite}
									isArchived={false}
									page={page}
									sortBy={sortBy}
									sortOrder={sortOrder}
								/>
							</Suspense>
						</TabsContent>

						<TabsContent
							value="pinned"
							className="mt-0"
						>
							<Suspense fallback={<SnippetsLoading />}>
								<SnippetsList
									workspaceId={workspace.id}
									searchQuery={searchQuery}
									categoryId={categoryId}
									labelIds={labelIds}
									isPublicOnly={isPublicOnly}
									isPinned={true}
									isFavorite={isFavorite}
									isArchived={false}
									page={page}
									sortBy={sortBy}
									sortOrder={sortOrder}
								/>
							</Suspense>
						</TabsContent>

						<TabsContent
							value="favorites"
							className="mt-0"
						>
							<Suspense fallback={<SnippetsLoading />}>
								<SnippetsList
									workspaceId={workspace.id}
									searchQuery={searchQuery}
									categoryId={categoryId}
									labelIds={labelIds}
									isPublicOnly={isPublicOnly}
									isPinned={isPinned}
									isFavorite={true}
									isArchived={false}
									page={page}
									sortBy={sortBy}
									sortOrder={sortOrder}
								/>
							</Suspense>
						</TabsContent>

						<TabsContent
							value="public"
							className="mt-0"
						>
							<Suspense fallback={<SnippetsLoading />}>
								<SnippetsList
									workspaceId={workspace.id}
									searchQuery={searchQuery}
									categoryId={categoryId}
									labelIds={labelIds}
									isPublicOnly={true}
									isPinned={isPinned}
									isFavorite={isFavorite}
									isArchived={false}
									page={page}
									sortBy={sortBy}
									sortOrder={sortOrder}
								/>
							</Suspense>
						</TabsContent>

						<TabsContent
							value="archived"
							className="mt-0"
						>
							<Suspense fallback={<SnippetsLoading />}>
								<SnippetsList
									workspaceId={workspace.id}
									searchQuery={searchQuery}
									categoryId={categoryId}
									labelIds={labelIds}
									isPublicOnly={isPublicOnly}
									isPinned={isPinned}
									isFavorite={isFavorite}
									isArchived={true}
									page={page}
									sortBy={sortBy}
									sortOrder={sortOrder}
								/>
							</Suspense>
						</TabsContent>
					</main>
				</div>
			</Tabs>
		</div>
	)
}
