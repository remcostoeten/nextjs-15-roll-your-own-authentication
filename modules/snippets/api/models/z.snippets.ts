import { z } from 'zod'

export const createSnippetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	language: z.string().default('plain'),
	categoryId: z.string().optional().nullable(),
	isPublic: z.boolean().default(false),
	labelIds: z.array(z.string()).default([]),
})

export const updateSnippetSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	content: z.string().min(1, 'Content is required'),
	language: z.string(),
	categoryId: z.string().optional().nullable(),
	isPublic: z.boolean(),
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
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().default(10),
	sortBy: z.enum(['title', 'createdAt', 'updatedAt']).default('createdAt'),
	sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type SnippetFilterInput = z.infer<typeof snippetFilterSchema>
