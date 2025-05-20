"use server"

import { ticketRepository } from "@/api/repositories/ticket-repository"
import { getCurrentUser } from "@/modules/authenticatie/server/queries/auth"

export async function addComment(data: {
  ticketId: string
  content: string
}) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    const comment = await ticketRepository.addComment({
      ticketId: data.ticketId,
      userId: user.id,
      content: data.content
    })

    return {
      success: true,
      data: comment
    }
  } catch (error) {
    console.error("Error adding comment:", error)
    return {
      success: false,
      error: "Failed to add comment"
    }
  }
}
