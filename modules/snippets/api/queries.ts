'use server'

import { db } from '@/server/db'
import {
	snippets,
	categories,
	labels,
	snippetLabels,
	snippetVersions,
	users,
	workspaceMembers,
	workspaces,
} from '@/server/db/schema'
import {
	eq,
	and,
	like,
	or,
	inArray,
	desc,
	asc,
	sql,
	count,
	isNull,
	not,
} from 'drizzle-orm'
import { getCurrentUser } from '@/modules/authentication/utilities/auth'
import type { SnippetFilterInput } from './models/snippet-models'

// Get snippets for a workspace with filtering and pagination
export async function getWorkspaceSnippets({
	workspaceId,
	categoryId = null,
	labelIds = [],
	searchQuery = '',
	isPublicOnly = false,
	isPinned = false,
	isFavorite = false,
	isArchived = false,
	page = 1,
	limit = 10,
	sortBy = 'position',
	sortOrder = 'desc',
}: SnippetFilterInput) {
	const user = await getCurrentUser()

	if (!user) {
		return { snippets: [], total: 0 }
	}

	// Check if user is a member of the workspace
	const isMember = await db.query.workspaceMembers.findFirst({
		where: and(
			eq(workspaceMembers.workspaceId, workspaceId),
			eq(workspaceMembers.userId, user.id)
		),
	})

	if (!isMember && !isPublicOnly) {
		return { snippets: [], total: 0 }
	}

	// Build the query conditions
	const conditions = [eq(snippets.workspaceId, workspaceId)]

	// If not a workspace member, only show public snippets
	if (!isMember) {
		conditions.push(eq(snippets.isPublic, true))
	} else if (isPublicOnly) {
		conditions.push(eq(snippets.isPublic, true))
	}

	// Filter by category if provided
	if (categoryId) {
		conditions.push(eq(snippets.categoryId, categoryId))
	}

	// Filter by pinned status
	if (isPinned) {
		conditions.push(eq(snippets.isPinned, true))
	}

	// Filter by favorite status
	if (isFavorite) {
		conditions.push(eq(snippets.isFavorite, true))
	}

	// Filter by archive status
	if (isArchived) {
		conditions.push(eq(snippets.isArchived, true))
	} else {
		// By default, exclude archived snippets
		conditions.push(eq(snippets.isArchived, false))
	}

	// Filter by search query if provided
	if (searchQuery) {
		conditions.push(
			or(
				like(snippets.title, `%${searchQuery}%`),
				like(snippets.content, `%${searchQuery}%`)
			)
		)
	}

	// Calculate offset
	const offset = (page - 1) * limit

	// Create a subquery for label filtering if needed
	let query = db
		.select({
			id: snippets.id,
			title: snippets.title,
			content: snippets.content,
			language: snippets.language,
			categoryId: snippets.categoryId,
			isPublic: snippets.isPublic,
			isPinned: snippets.isPinned,
			isFavorite: snippets.isFavorite,
			isArchived: snippets.isArchived,
			shareId: snippets.shareId,
			position: snippets.position,
			createdAt: snippets.createdAt,
			updatedAt: snippets.updatedAt,
			createdById: snippets.createdById,
		})
		.from(snippets)

	// Apply all conditions
	query = query.where(and(...conditions))

	// Apply label filtering if needed
	if (labelIds.length > 0) {
		query = query.where(
			sql`EXISTS (
        SELECT 1 FROM ${snippetLabels}
        WHERE ${snippetLabels.snippetId} = ${snippets.id}
        AND ${snippetLabels.labelId} IN (${labelIds.join(',')})
      )`
		)
	}

	// Apply sorting
	if (sortBy === 'position') {
		// For position sorting, always put pinned items first if sorting by position
		if (sortOrder === 'desc') {
			query = query.orderBy(
				desc(snippets.isPinned),
				desc(snippets.position)
			)
		} else {
			query = query.orderBy(
				desc(snippets.isPinned),
				asc(snippets.position)
			)
		}
	} else if (sortOrder === 'desc') {
		query = query.orderBy(desc(snippets.isPinned), desc(snippets[sortBy]))
	} else {
		query = query.orderBy(desc(snippets.isPinned), asc(snippets[sortBy]))
	}

	// Apply pagination
	query = query.limit(limit).offset(offset)

	// Execute the query
	const snippetsResult = await query

	// Get total count for pagination
	const [totalCount] = await db
		.select({ count: count() })
		.from(snippets)
		.where(and(...conditions))

	// Get categories for the snippets
	const categoryIds = snippetsResult
		.map((snippet) => snippet.categoryId)
		.filter(Boolean) as string[]

	const categoriesResult =
		categoryIds.length > 0
			? await db
					.select()
					.from(categories)
					.where(inArray(categories.id, categoryIds))
			: []

	// Get labels for the snippets
	const snippetIds = snippetsResult.map((snippet) => snippet.id)

	const snippetLabelsResult =
		snippetIds.length > 0
			? await db
					.select({
						snippetId: snippetLabels.snippetId,
						labelId: snippetLabels.labelId,
						labelName: labels.name,
						labelColor: labels.color,
					})
					.from(snippetLabels)
					.innerJoin(labels, eq(snippetLabels.labelId, labels.id))
					.where(inArray(snippetLabels.snippetId, snippetIds))
			: []

	// Get creators for the snippets
	const creatorIds = snippetsResult
		.map((snippet) => snippet.createdById)
		.filter((value, index, self) => self.indexOf(value) === index) // Get unique IDs

	const creatorsResult =
		creatorIds.length > 0
			? await db
					.select({
						id: users.id,
						firstName: users.firstName,
						lastName: users.lastName,
					})
					.from(users)
					.where(inArray(users.id, creatorIds))
			: []

	// Organize labels by snippet
	const snippetLabelsMap = snippetLabelsResult.reduce(
		(acc, { snippetId, labelId, labelName, labelColor }) => {
			if (!acc[snippetId]) {
				acc[snippetId] = []
			}
			acc[snippetId].push({
				id: labelId,
				name: labelName,
				color: labelColor,
			})
			return acc
		},
		{} as Record<string, { id: string; name: string; color: string }[]>
	)

	// Create a map of categories by ID
	const categoriesMap = categoriesResult.reduce(
		(acc, category) => {
			acc[category.id] = category
			return acc
		},
		{} as Record<string, (typeof categoriesResult)[0]>
	)

	// Create a map of creators by ID
	const creatorsMap = creatorsResult.reduce(
		(acc, creator) => {
			acc[creator.id] = creator
			return acc
		},
		{} as Record<string, (typeof creatorsResult)[0]>
	)

	// Combine the data
	const enrichedSnippets = snippetsResult.map((snippet) => ({
		...snippet,
		category: snippet.categoryId ? categoriesMap[snippet.categoryId] : null,
		labels: snippetLabelsMap[snippet.id] || [],
		creator: creatorsMap[snippet.createdById] || null,
	}))

	return {
		snippets: enrichedSnippets,
		total: totalCount?.count || 0,
	}
}

// Get a single snippet by ID
export async function getSnippetById(snippetId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

	const [snippet] = await db
		.select()
		.from(snippets)
		.where(eq(snippets.id, snippetId))

	if (!snippet) {
		return null
	}

	// Check if user is a member of the workspace
	const isMember = await db.query.workspaceMembers.findFirst({
		where: and(
			eq(workspaceMembers.workspaceId, snippet.workspaceId),
			eq(workspaceMembers.userId, user.id)
		),
	})

	// If not a member and snippet is not public, return null
	if (!isMember && !snippet.isPublic) {
		return null
	}

	// Get category if exists
	const category = snippet.categoryId
		? await db
				.select()
				.from(categories)
				.where(eq(categories.id, snippet.categoryId))
				.then((res) => res[0] || null)
		: null

	// Get labels
	const snippetLabelsResult = await db
		.select({
			labelId: snippetLabels.labelId,
			labelName: labels.name,
			labelColor: labels.color,
		})
		.from(snippetLabels)
		.innerJoin(labels, eq(snippetLabels.labelId, labels.id))
		.where(eq(snippetLabels.snippetId, snippetId))

	const snippetLabelsData = snippetLabelsResult.map(
		({ labelId, labelName, labelColor }) => ({
			id: labelId,
			name: labelName,
			color: labelColor,
		})
	)

	// Get creator
	const creator = await db
		.select({
			id: users.id,
			firstName: users.firstName,
			lastName: users.lastName,
		})
		.from(users)
		.where(eq(users.id, snippet.createdById))
		.then((res) => res[0] || null)

	return {
		...snippet,
		category,
		labels: snippetLabelsData,
		creator,
	}
}

// Get snippet versions
export async function getSnippetVersions(snippetId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	const snippet = await db.query.snippets.findFirst({
		where: eq(snippets.id, snippetId),
	})

	if (!snippet) {
		return []
	}

	// Check if user is a member of the workspace
	const isMember = await db.query.workspaceMembers.findFirst({
		where: and(
			eq(workspaceMembers.workspaceId, snippet.workspaceId),
			eq(workspaceMembers.userId, user.id)
		),
	})

	if (!isMember) {
		return []
	}

	// Get versions with creator info
	const versions = await db
		.select({
			id: snippetVersions.id,
			content: snippetVersions.content,
			createdAt: snippetVersions.createdAt,
			creatorId: snippetVersions.createdById,
			creatorFirstName: users.firstName,
			creatorLastName: users.lastName,
		})
		.from(snippetVersions)
		.innerJoin(users, eq(snippetVersions.createdById, users.id))
		.where(eq(snippetVersions.snippetId, snippetId))
		.orderBy(desc(snippetVersions.createdAt))

	return versions
}

// Get a snippet by share ID (for public sharing)
export async function getSnippetByShareId(shareId: string) {
	const [snippet] = await db
		.select()
		.from(snippets)
		.where(and(eq(snippets.shareId, shareId), eq(snippets.isPublic, true)))

	if (!snippet) {
		return null
	}

	// Get category if exists
	const category = snippet.categoryId
		? await db
				.select()
				.from(categories)
				.where(eq(categories.id, snippet.categoryId))
				.then((res) => res[0] || null)
		: null

	// Get labels
	const snippetLabelsResult = await db
		.select({
			labelId: snippetLabels.labelId,
			labelName: labels.name,
			labelColor: labels.color,
		})
		.from(snippetLabels)
		.innerJoin(labels, eq(snippetLabels.labelId, labels.id))
		.where(eq(snippetLabels.snippetId, snippet.id))

	const snippetLabelsData = snippetLabelsResult.map(
		({ labelId, labelName, labelColor }) => ({
			id: labelId,
			name: labelName,
			color: labelColor,
		})
	)

	// Get creator
	const creator = await db
		.select({
			id: users.id,
			firstName: users.firstName,
			lastName: users.lastName,
		})
		.from(users)
		.where(eq(users.id, snippet.createdById))
		.then((res) => res[0] || null)

	return {
		...snippet,
		category,
		labels: snippetLabelsData,
		creator,
	}
}

// Get categories for a workspace
export async function getWorkspaceCategories(workspaceId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	// Check if user is a member of the workspace
	const isMember = await db.query.workspaceMembers.findFirst({
		where: and(
			eq(workspaceMembers.workspaceId, workspaceId),
			eq(workspaceMembers.userId, user.id)
		),
	})

	if (!isMember) {
		return []
	}

	const categoriesResult = await db
		.select({
			id: categories.id,
			name: categories.name,
			workspaceId: categories.workspaceId,
			createdById: categories.createdById,
			createdAt: categories.createdAt,
			snippetCount: sql<number>`(
        SELECT COUNT(*) FROM ${snippets}
        WHERE ${snippets.categoryId} = ${categories.id}
        AND ${snippets.isArchived} = false
      )`,
		})
		.from(categories)
		.where(eq(categories.workspaceId, workspaceId))
		.orderBy(asc(categories.name))

	return categoriesResult
}

// Get labels for a workspace
export async function getWorkspaceLabels(workspaceId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	// Check if user is a member of the workspace
	const isMember = await db.query.workspaceMembers.findFirst({
		where: and(
			eq(workspaceMembers.workspaceId, workspaceId),
			eq(workspaceMembers.userId, user.id)
		),
	})

	if (!isMember) {
		return []
	}

	const labelsResult = await db
		.select({
			id: labels.id,
			name: labels.name,
			color: labels.color,
			workspaceId: labels.workspaceId,
			createdById: labels.createdById,
			createdAt: labels.createdAt,
			snippetCount: sql<number>`(
        SELECT COUNT(*) FROM ${snippetLabels}
        JOIN ${snippets} ON ${snippetLabels.snippetId} = ${snippets.id}
        WHERE ${snippetLabels.labelId} = ${labels.id}
        AND ${snippets.isArchived} = false
      )`,
		})
		.from(labels)
		.where(eq(labels.workspaceId, workspaceId))
		.orderBy(asc(labels.name))

	return labelsResult
}

// Get workspace stats
export async function getWorkspaceSnippetStats(workspaceId: string) {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

	// Check if user is a member of the workspace
	const isMember = await db.query.workspaceMembers.findFirst({
		where: and(
			eq(workspaceMembers.workspaceId, workspaceId),
			eq(workspaceMembers.userId, user.id)
		),
	})

	if (!isMember) {
		return null
	}

	// Get total counts
	const [totalSnippets] = await db
		.select({ count: count() })
		.from(snippets)
		.where(
			and(
				eq(snippets.workspaceId, workspaceId),
				eq(snippets.isArchived, false)
			)
		)

	const [totalCategories] = await db
		.select({ count: count() })
		.from(categories)
		.where(eq(categories.workspaceId, workspaceId))

	const [totalLabels] = await db
		.select({ count: count() })
		.from(labels)
		.where(eq(labels.workspaceId, workspaceId))

	const [totalPublic] = await db
		.select({ count: count() })
		.from(snippets)
		.where(
			and(
				eq(snippets.workspaceId, workspaceId),
				eq(snippets.isPublic, true),
				eq(snippets.isArchived, false)
			)
		)

	const [totalArchived] = await db
		.select({ count: count() })
		.from(snippets)
		.where(
			and(
				eq(snippets.workspaceId, workspaceId),
				eq(snippets.isArchived, true)
			)
		)

	// Get language distribution
	const languageDistribution = await db
		.select({
			language: snippets.language,
			count: count(),
		})
		.from(snippets)
		.where(
			and(
				eq(snippets.workspaceId, workspaceId),
				eq(snippets.isArchived, false),
				not(isNull(snippets.language))
			)
		)
		.groupBy(snippets.language)
		.orderBy(desc(count()))
		.limit(10)

	return {
		totalSnippets: totalSnippets?.count || 0,
		totalCategories: totalCategories?.count || 0,
		totalLabels: totalLabels?.count || 0,
		totalPublic: totalPublic?.count || 0,
		totalArchived: totalArchived?.count || 0,
		languageDistribution,
	}
}

// Search snippets across workspaces
export async function searchSnippetsAcrossWorkspaces(
	searchQuery: string,
	limit = 5
) {
	const user = await getCurrentUser()

	if (!user) {
		return []
	}

	// Get workspaces the user is a member of
	const userWorkspaces = await db
		.select({ workspaceId: workspaceMembers.workspaceId })
		.from(workspaceMembers)
		.where(eq(workspaceMembers.userId, user.id))

	if (userWorkspaces.length === 0) {
		return []
	}

	const workspaceIds = userWorkspaces.map((w) => w.workspaceId)

	// Search snippets in those workspaces
	const searchResults = await db
		.select({
			id: snippets.id,
			title: snippets.title,
			content: snippets.content,
			language: snippets.language,
			workspaceId: snippets.workspaceId,
			workspaceName: workspaces.name,
			updatedAt: snippets.updatedAt,
		})
		.from(snippets)
		.innerJoin(workspaces, eq(snippets.workspaceId, workspaces.id))
		.where(
			and(
				inArray(snippets.workspaceId, workspaceIds),
				eq(snippets.isArchived, false),
				or(
					like(snippets.title, `%${searchQuery}%`),
					like(snippets.content, `%${searchQuery}%`)
				)
			)
		)
		.orderBy(desc(snippets.updatedAt))
		.limit(limit)

	return searchResults
}
