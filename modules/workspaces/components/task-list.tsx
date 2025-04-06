"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Clock, Plus, Calendar } from "lucide-react"
import { createTask, updateTask, deleteTask } from "../api/mutations"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

type Task = {
  id: number
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  assignee: {
    id: number
    firstName: string
    lastName: string
  } | null
}

type Member = {
  id: number
  role: string
  joinedAt: string
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    username: string
  }
}

interface TaskListProps {
  workspaceId: number
  tasks: Task[]
  members: Member[]
}

export function TaskList({ workspaceId, tasks, members }: TaskListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    // Add due date to form data
    if (dueDate) {
      formData.set("dueDate", dueDate.toISOString())
    }

    try {
      const result = await createTask(workspaceId, formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Failed to create task",
          description: result.error,
        })
      } else {
        toast({
          title: "Task created",
          description: "Your task has been created successfully.",
        })
        setShowNewTaskDialog(false)
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

  // Handle update task
  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedTask) return

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    // Add due date to form data
    if (dueDate) {
      formData.set("dueDate", dueDate.toISOString())
    }

    try {
      const result = await updateTask(selectedTask.id, formData)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Failed to update task",
          description: result.error,
        })
      } else {
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully.",
        })
        setShowEditTaskDialog(false)
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

  // Handle delete task
  const handleDeleteTask = async (taskId: number) => {
    setIsLoading(true)

    try {
      const result = await deleteTask(taskId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Failed to delete task",
          description: result.error,
        })
      } else {
        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully.",
        })
        setShowEditTaskDialog(false)
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

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "todo":
        return <Badge variant="outline">To Do</Badge>
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>
      case "done":
        return <Badge variant="success">Done</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const doneTasks = tasks.filter((task) => task.status === "done")

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle>Create new task</DialogTitle>
                <DialogDescription>Add a new task to your workspace.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="Task title" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" name="description" placeholder="Task description" disabled={isLoading} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="todo" disabled={isLoading}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium" disabled={isLoading}>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          disabled={isLoading}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedToId">Assign To (Optional)</Label>
                    <Select name="assignedToId" disabled={isLoading}>
                      <SelectTrigger id="assignedToId">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.user.id.toString()}>
                            {member.user.firstName} {member.user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewTaskDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todo" className="flex gap-2">
            <CheckSquare className="h-4 w-4" />
            To Do
            <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs">{todoTasks.length}</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex gap-2">
            <Clock className="h-4 w-4" />
            In Progress
            <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs">{inProgressTasks.length}</span>
          </TabsTrigger>
          <TabsTrigger value="done" className="flex gap-2">
            <CheckSquare className="h-4 w-4" />
            Done
            <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs">{doneTasks.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todo" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todoTasks.length > 0 ? (
              todoTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedTask(task)
                    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
                    setShowEditTaskDialog(true)
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <CardDescription className="line-clamp-2">{task.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {task.dueDate && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Due {format(new Date(task.dueDate), "PPP")}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    {task.assignee ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {getInitials(task.assignee.firstName, task.assignee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {task.assignee.firstName} {task.assignee.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                    {getStatusBadge(task.status)}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="text-center">
                  <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No tasks</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new task.</p>
                  <Button onClick={() => setShowNewTaskDialog(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedTask(task)
                    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
                    setShowEditTaskDialog(true)
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <CardDescription className="line-clamp-2">{task.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {task.dueDate && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Due {format(new Date(task.dueDate), "PPP")}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    {task.assignee ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {getInitials(task.assignee.firstName, task.assignee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {task.assignee.firstName} {task.assignee.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                    {getStatusBadge(task.status)}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No in-progress tasks</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Move tasks to in-progress when you start working on them.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="done" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doneTasks.length > 0 ? (
              doneTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedTask(task)
                    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
                    setShowEditTaskDialog(true)
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <CardDescription className="line-clamp-2">{task.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {task.dueDate && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Due {format(new Date(task.dueDate), "PPP")}</span>
                      </div>
                    )}
                    {task.completedAt && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        <span>Completed {format(new Date(task.completedAt), "PPP")}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    {task.assignee ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-xs">
                            {getInitials(task.assignee.firstName, task.assignee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {task.assignee.firstName} {task.assignee.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                    {getStatusBadge(task.status)}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="text-center">
                  <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No completed tasks</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tasks will appear here when they are marked as done.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={showEditTaskDialog} onOpenChange={setShowEditTaskDialog}>
        <DialogContent>
          {selectedTask && (
            <form onSubmit={handleUpdateTask}>
              <DialogHeader>
                <DialogTitle>Edit task</DialogTitle>
                <DialogDescription>Update task details or change its status.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input id="edit-title" name="title" defaultValue={selectedTask.title} required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={selectedTask.description || ""}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select name="status" defaultValue={selectedTask.status} disabled={isLoading}>
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select name="priority" defaultValue={selectedTask.priority} disabled={isLoading}>
                      <SelectTrigger id="edit-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-dueDate">Due Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          disabled={isLoading}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-assignedToId">Assign To (Optional)</Label>
                    <Select
                      name="assignedToId"
                      defaultValue={selectedTask.assignee?.id.toString()}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="edit-assignedToId">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.user.id.toString()}>
                            {member.user.firstName} {member.user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditTaskDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

