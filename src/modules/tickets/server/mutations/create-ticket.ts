"use server"

import { ticketRepository } from "@/api/repositories/ticket-repository"
import { getCurrentUser } from "@/modules/authenticatie/server/queries/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createTicketSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assigneeId: z.string().uuid().optional(),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  estimatedHours: z.number().optional(),
  labels: z.array(z.string()).optional(),
})

export async function createTicket(formData: FormData | Record<string, any>) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Parse and validate the input
    const data = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData

    // Handle labels if they come as a string
    if (typeof data.labels === "string") {
      try {
        data.labels = JSON.parse(data.labels)
      } catch {
        data.labels = data.labels.split(",").map((label: string) => label.trim())
      }
    }

    const validatedData = createTicketSchema.parse({
      ...data,
      estimatedHours: data.estimatedHours ? Number(data.estimatedHours) : undefined,
    })

    // Create the ticket
    const ticket = await ticketRepository.createTicket({
      ...validatedData,
      reporterId: user.id,
    })

    // Revalidate the workspace tickets page
    revalidatePath(`/workspace/${validatedData.workspaceId}/tickets`)

    return { success: true, ticket }
  } catch (error) {
    console.error("Error creating ticket:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create ticket",
    }
  }
}
