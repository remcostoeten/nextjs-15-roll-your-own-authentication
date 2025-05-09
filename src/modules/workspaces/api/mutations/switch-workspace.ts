'use server'

import { db } from "@/api/db"
import { workspaces } from "@/api/schema"
import { eq } from "drizzle-orm"

export async function switchWorkspace(workspaceId: string) {
    const workspace = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
    return workspace
}   