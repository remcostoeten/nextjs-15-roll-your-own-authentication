import { z } from "zod"

export const createWorkspaceSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
})

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>