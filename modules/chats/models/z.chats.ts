import { z } from 'zod'

// Chat creation schema
export const createChatSchema = z.object({
	name: z.string().min(1, 'Chat name is required'),
	workspaceId: z.string().min(1, 'Workspace ID is required'),
	memberIds: z.array(z.string()).optional(),
})

// Chat update schema
export const updateChatSchema = z.object({
	name: z.string().min(1, 'Chat name is required'),
})

// Message creation schema
export const createMessageSchema = z.object({
	chatId: z.string().min(1, 'Chat ID is required'),
	message: z.string().min(1, 'Message is required'),
	attachment: z.string().optional(),
})

// Message update schema
export const updateMessageSchema = z.object({
	message: z.string().min(1, 'Message is required'),
	is_favorite: z.boolean().optional(),
})

// Add member schema
export const addMemberSchema = z.object({
	userId: z.string().min(1, 'User ID is required'),
	role: z.enum(['member', 'admin']).default('member'),
})

// Update member role schema
export const updateMemberRoleSchema = z.object({
	role: z.enum(['member', 'admin']),
})

// Toggle favorite schema
export const toggleFavoriteSchema = z.object({
	messageId: z.string().min(1, 'Message ID is required'),
})

// Filter validation schema
export const chatFilterSchema = z.object({
	workspaceId: z.string(),
	searchQuery: z.string().optional(),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().default(10),
	sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('updatedAt'),
	sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
