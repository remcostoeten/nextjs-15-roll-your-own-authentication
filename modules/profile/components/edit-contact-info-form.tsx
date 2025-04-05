"use client"

import { useState } from "react"
import type { User } from "@/server/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateContactInfo } from "@/modules/profile/api/mutations"
import { Pencil, Check, X } from "lucide-react"

interface EditContactInfoFormProps {
  user: User
}

export function EditContactInfoForm({ user }: EditContactInfoFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await updateContactInfo(formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error,
        })
      } else {
        toast({
          title: "Contact information updated",
          description: "Your contact information has been updated successfully.",
        })
        setIsEditing(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <div className="flex items-center gap-2">
            <p>{user.email}</p>
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-500">Primary</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p>{user.phone || "+919871388333"}</p>
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-500">Primary</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email} required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="phone">Phone</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
            <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isLoading}>
              <Check className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
          </div>
        </div>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone || ""}
          placeholder="+1234567890"
          disabled={isLoading}
        />
      </div>
    </form>
  )
}

