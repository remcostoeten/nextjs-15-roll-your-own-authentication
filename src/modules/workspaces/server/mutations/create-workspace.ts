"use server"

import { workspaceRepository } from "@/api/repositories/workspace-repository"
import { getCurrentUser } from "@/modules/authenticatie/server/queries/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  description: z.string().optional(),
})

export async function createWorkspace(formData: FormData | Record<string, any>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        error: "You must be logged in to create a workspace",
      }
    }

    const data = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
    const validatedData = createWorkspaceSchema.parse(data)

    // Create the workspace with title instead of name
    const workspace = await workspaceRepository.createWorkspace({
      title: validatedData.name, // Map name to title
      description: validatedData.description,
      createdBy: user.id,
    })

    // Revalidate the workspaces page
    revalidatePath("/workspaces")

    return { success: true, workspace }
  } catch (error) {
    console.error("Error creating workspace:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create workspace",
    }
  }
}
