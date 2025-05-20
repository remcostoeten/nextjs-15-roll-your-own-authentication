"use client"

import type React from "react"

import { TicketPriority, TicketStatus } from "@/api/schemas/ticket-scheme"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { useToast } from "@/shared/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createTicket } from "../server/mutations/create-ticket"

interface CreateTicketFormProps {
  workspaceId: string
}

export function CreateTicketForm({ workspaceId }: CreateTicketFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TicketStatus.BACKLOG,
    priority: TicketPriority.MEDIUM,
    dueDate: "",
    estimatedHours: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createTicket({
        workspaceId,
        ...formData,
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
      })

      if (result.success) {
        toast({
          title: "Ticket created",
          description: "Your ticket has been created successfully.",
        })
        router.push(`/workspace/${workspaceId}/tickets/${result.ticket.id}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create ticket",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter ticket title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter ticket description"
          className="min-h-[150px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TicketStatus.BACKLOG}>Backlog</SelectItem>
              <SelectItem value={TicketStatus.TODO}>To Do</SelectItem>
              <SelectItem value={TicketStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={TicketStatus.IN_REVIEW}>In Review</SelectItem>
              <SelectItem value={TicketStatus.DONE}>Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TicketPriority.LOW}>Low</SelectItem>
              <SelectItem value={TicketPriority.MEDIUM}>Medium</SelectItem>
              <SelectItem value={TicketPriority.HIGH}>High</SelectItem>
              <SelectItem value={TicketPriority.URGENT}>Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedHours">Estimated Hours</Label>
          <Input
            id="estimatedHours"
            name="estimatedHours"
            type="number"
            min="0"
            step="0.5"
            value={formData.estimatedHours}
            onChange={handleChange}
            placeholder="e.g. 4.5"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push(`/workspace/${workspaceId}/tickets`)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </form>
  )
}
