import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Loader2, Smile } from "lucide-react"
import EmojiPicker from 'emoji-picker-react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createWorkspace } from "@/modules/workspaces/api/mutations/create-workspace"
import { createWorkspaceSchema, type CreateWorkspaceSchema, type Workspace } from "@/modules/workspaces/api/models/create-workspace-schema"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

type TCreateWorkspaceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkspaceCreated?: (workspace: Workspace) => void
}

export function CreateWorkspaceModal({ open, onOpenChange, onWorkspaceCreated }: TCreateWorkspaceModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const { toast } = useToast()
  
  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      emoji: "🏪",
    },
  })

  const onSubmit = async (data: CreateWorkspaceSchema) => {
    setIsSubmitting(true)

    try {
      const result = await createWorkspace({
        name: data.name,
        description: data.description || `${data.name}'s store`, 
        emoji: data.emoji,
      })

      if (result.success && result.workspace) {
        onWorkspaceCreated?.(result.workspace as Workspace)
        form.reset()
        onOpenChange(false)
        toast({
          title: "Success",
          description: "Store created successfully",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create store. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to create store:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset()
      setShowEmojiPicker(false)
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new store</DialogTitle>
          <DialogDescription>Create a new store for your products or services.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="emoji"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store icon</FormLabel>
                      <div className="flex items-center gap-2">
                        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-16 h-16 text-2xl"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowEmojiPicker(true);
                              }}
                            >
                              {field.value || <Smile className="h-6 w-6 text-muted-foreground" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 border-none" align="start">
                            <EmojiPicker
                              onEmojiClick={(emojiData) => {
                                field.onChange(emojiData.emoji)
                                setShowEmojiPicker(false)
                              }}
                              theme="dark"
                            />
                          </PopoverContent>
                        </Popover>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Store name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      id="name"
                                      placeholder="My Awesome Store"
                                      className="pl-9"
                                      {...field}
                                      autoComplete="off"
                                    />
                                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your store"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create store
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}