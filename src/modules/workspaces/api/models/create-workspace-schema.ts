import { z } from "zod"

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().min(1, "Description is required"),
  emoji: z.string().min(1, "Store emoji is required"),
})

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>

export type Workspace = {
  id: number
  name: string
  description: string
  emoji: string
  url?: string
  logo?: string
  createdAt?: Date | null
  updatedAt?: Date | null
}