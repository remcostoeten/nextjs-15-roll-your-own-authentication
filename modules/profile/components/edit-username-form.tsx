"use client"

import { useState } from "react"
import type { User } from "@/server/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateUsername } from "@/modules/profile/api/mutations"
import { Pencil, Check, X } from "lucide-react"

interface EditUsernameFormProps {
  user: User
}

export function EditUsernameForm({ user }: EditUsernameFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await updateUsername(formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error,
        })
      } else {
        toast({
          title: "Username updated",
          description: "Your username has been updated successfully.",
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
          <p className="text-sm text-muted-foreground">Username</p>
          <div className="flex items-center justify-between">
            <p>{user.username}</p>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Local Authenticators</p>
          <p>Password</p>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="username">Username</Label>
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
        <Input id="username" name="username" defaultValue={user.username} required disabled={isLoading} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Local Authenticators</p>
        <p>Password</p>
      </div>
    </form>
  )
}

