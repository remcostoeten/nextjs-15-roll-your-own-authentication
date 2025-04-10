import { z } from 'zod'

// Snippet validation schemas
export const createSnippetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	language: z.string().default('plain'),
	categoryId: z.string().optional().nullable(),
	isPublic: z.boolean().default(false),
	isPinned: z.boolean().default(false),
	isFavorite: z.boolean().default(false),
	labelIds: z.array(z.string()).default([]),
})

export const updateSnippetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	language: z.string(),
	categoryId: z.string().optional().nullable(),
	isPublic: z.boolean(),
	isPinned: z.boolean().optional(),
	isFavorite: z.boolean().optional(),
	isArchived: z.boolean().optional(),
	labelIds: z.array(z.string()).default([]),
})

export type CreateSnippetInput = z.infer<typeof createSnippetSchema>
export type UpdateSnippetInput = z.infer<typeof updateSnippetSchema>

// Category validation schemas
export const createCategorySchema = z.object({
	name: z.string().min(1, 'Category name is required'),
})

export const updateCategorySchema = z.object({
	name: z.string().min(1, 'Category name is required'),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

// Label validation schemas
export const createLabelSchema = z.object({
	name: z.string().min(1, 'Label name is required'),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
		.default('#6366F1'),
})

export const updateLabelSchema = z.object({
	name: z.string().min(1, 'Label name is required'),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
})

export type CreateLabelInput = z.infer<typeof createLabelSchema>
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>

// Filter validation schema
export const snippetFilterSchema = z.object({
	workspaceId: z.string(),
	categoryId: z.string().optional().nullable(),
	labelIds: z.array(z.string()).default([]),
	searchQuery: z.string().optional(),
	isPublicOnly: z.boolean().optional(),
	isPinned: z.boolean().optional(),
	isFavorite: z.boolean().optional(),
	isArchived: z.boolean().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().default(10),
	sortBy: z
		.enum(['title', 'createdAt', 'updatedAt', 'position'])
		.default('position'),
	sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type SnippetFilterInput = z.infer<typeof snippetFilterSchema>

// Bulk operations schema
export const bulkOperationSchema = z.object({
	snippetIds: z.array(z.string()),
	operation: z.enum([
		'archive',
		'unarchive',
		'delete',
		'favorite',
		'unfavorite',
		'pin',
		'unpin',
		'addLabel',
		'removeLabel',
	]),
	labelId: z.string().optional(),
})

export type BulkOperationInput = z.infer<typeof bulkOperationSchema>
