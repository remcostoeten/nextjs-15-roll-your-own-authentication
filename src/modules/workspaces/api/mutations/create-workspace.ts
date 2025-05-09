'use server'

import { db } from "@/api/db"
import { createWorkspaceSchema, CreateWorkspaceSchema } from "../models"
import { workspaces } from "@/api/schema"

export async function createWorkspace(data: CreateWorkspaceSchema) {
    const { name, description } = createWorkspaceSchema.parse(data)

    const workspace = await db.insert(workspaces).values({ name, description }).returning()

    return workspace
}
