import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Building2, Loader2 } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { createWorkspace } from "@/modules/workspaces/api/mutations/create-workspace"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
})

type FormData = z.infer<typeof formSchema>

interface CreateWorkspaceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkspaceCreated?: (workspace: any) => void
}

export function CreateWorkspaceModal({ open, onOpenChange, onWorkspaceCreated }: CreateWorkspaceModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Call the server action to create a workspace
      const result = await createWorkspace(data.name)

      if (result.success) {
        // Pass the created workspace back to the parent component
        onWorkspaceCreated?.(result.workspace)
        reset()
        onOpenChange(false)
      } else {
        setError(result.error || "Failed to create store. Please try again.")
      }
    } catch (error) {
      console.error("Failed to create store:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      reset()
      setError(null)
    }
  }, [open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new store</DialogTitle>
          <DialogDescription>Create a new store for your products or services.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Store name</Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="My Awesome Store"
                  className="pl-9"
                  {...register("name")}
                  autoComplete="off"
                />
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-3 rounded-md text-sm">{error}</div>}
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
      </DialogContent>
    </Dialog>
  )
}
