"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react"
import { createNotification } from "../api/mutations"
import { useToast } from "@/components/ui/use-toast"
import { MultiSelect } from "./multi-select"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

interface CreateNotificationFormProps {
  users: User[]
}

export function CreateNotificationForm({ users }: CreateNotificationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGlobal, setIsGlobal] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [notificationType, setNotificationType] = useState("info")

  // Handle form submission
  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    // Add selected users to form data
    if (!isGlobal && selectedUsers.length > 0) {
      selectedUsers.forEach((userId) => {
        formData.append("targetUserIds", userId.toString())
      })
    }

    // Add expiry date to form data
    if (expiryDate) {
      formData.append("expiresAt", expiryDate.toISOString())
    }

    // Add notification type
    formData.set("type", notificationType)

    // Add isGlobal flag
    formData.set("isGlobal", isGlobal.toString())

    try {
      const result = await createNotification(formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Failed to create notification",
          description: result.error,
        })
      } else {
        toast({
          title: "Notification created",
          description: "Your notification has been created successfully.",
        })
        router.push("/admin/notifications")
        router.refresh()
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

  // Get notification type icon
  const getNotificationTypeIcon = () => {
    switch (notificationType) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Notification title" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Notification content"
            rows={4}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Notification Type</Label>
          <Select defaultValue="info" onValueChange={setNotificationType} disabled={isLoading}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">
                <div className="flex items-center">
                  <Info className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Information</span>
                </div>
              </SelectItem>
              <SelectItem value="success">
                <div className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>Success</span>
                </div>
              </SelectItem>
              <SelectItem value="warning">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Warning</span>
                </div>
              </SelectItem>
              <SelectItem value="error">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  <span>Error</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link (Optional)</Label>
          <Input id="link" name="link" placeholder="https://example.com or /profile" disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isLoading}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={setExpiryDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="isGlobal" checked={isGlobal} onCheckedChange={setIsGlobal} disabled={isLoading} />
          <Label htmlFor="isGlobal">Send to all users</Label>
        </div>

        {!isGlobal && (
          <div className="space-y-2">
            <Label htmlFor="targetUsers">Target Users</Label>
            <MultiSelect
              options={users.map((user) => ({
                value: user.id.toString(),
                label: `${user.firstName} ${user.lastName} (${user.email})`,
              }))}
              selected={selectedUsers.map((id) => id.toString())}
              onChange={(values) => setSelectedUsers(values.map((v) => Number.parseInt(v)))}
              placeholder="Select users"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">{selectedUsers.length} user(s) selected</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || (!isGlobal && selectedUsers.length === 0)}>
          {isLoading ? "Creating..." : "Create Notification"}
        </Button>
      </div>
    </form>
  )
}

