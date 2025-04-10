import { z } from 'zod'

const createWorkspaceSchema = z.object({
	name: z.string().min(1, 'Workspace name is required'),
	description: z.string().optional(),
})

const updateWorkspaceSchema = z.object({
	name: z.string().min(1, 'Workspace name is required'),
	description: z.string().optional(),
})

const inviteMemberSchema = z.object({
	email: z.string().email('Invalid email address'),
	role: z.enum(['member', 'admin']),
})

const updateMemberRoleSchema = z.object({
	role: z.enum(['member', 'admin', 'owner']),
})

const createActivitySchema = z.object({
	type: z.enum(['message', 'system']),
	content: z.string().min(1, 'Content is required'),
	metadata: z.record(z.string(), z.any()).optional(),
})

export {
	createWorkspaceSchema,
	updateWorkspaceSchema,
	inviteMemberSchema,
	updateMemberRoleSchema,
	createActivitySchema,
}
