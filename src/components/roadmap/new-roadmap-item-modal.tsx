import { roadmapItemSchema } from '@/modules/roadmap/models/z.roadmap-item'
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button, Calendar, Dialog, DialogContent, DialogHeader, Popover, PopoverContent, PopoverTrigger, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "ui";
import type { z } from 'zod';

type RoadmapFormData = z.infer<typeof roadmapItemSchema>;

interface NewRoadmapItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoadmapFormData) => void;
}

export function NewRoadmapItemModal({ isOpen, onClose, onSubmit }: NewRoadmapItemModalProps) {
    const form = useForm<RoadmapFormData>({
        resolver: zodResolver(roadmapItemSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "planned" as const,
            priority: 0,
            startDate: null,
            endDate: null,
            quarter: "Q1 2024",
            assignee: null,
            tags: null,
            dependencies: null,
            progress: 0
        },
    });

    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
            if (e.ctrlKey && e.key === "Enter") {
                form.handleSubmit(onSubmit)();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, form, onSubmit]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isValid(date) ? format(date, "PPP") : null;
    };

    const getDateFromString = (dateStr: string | null | undefined) => {
        if (!dateStr) return undefined;
        const date = new Date(dateStr);
        return isValid(date) ? date : undefined;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">New Roadmap Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                {...form.register("title")}
                                id="title"
                                ref={(e) => {
                                    titleRef.current = e;
                                }}
                                className="mt-1"
                            />
                            {form.formState.errors.title && (
                                <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...form.register("description")}
                                className="mt-1 min-h-[100px]"
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {form.watch("startDate") ? (
                                                formatDate(form.watch("startDate")) || "Invalid date"
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={getDateFromString(form.watch("startDate"))}
                                            onSelect={(date) => form.setValue("startDate", date?.toISOString() ?? null)}
                                            initialFocus
                                            disabled={(date) => {
                                                const endDate = form.watch("endDate");
                                                return endDate ? date > new Date(endDate) : false;
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label>Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {form.watch("endDate") ? (
                                                formatDate(form.watch("endDate")) || "Invalid date"
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={getDateFromString(form.watch("endDate"))}
                                            onSelect={(date) => form.setValue("endDate", date?.toISOString() ?? null)}
                                            initialFocus
                                            disabled={(date) => {
                                                const startDate = form.watch("startDate");
                                                return startDate ? date < new Date(startDate) : false;
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={form.watch("status")}
                                    onValueChange={(value: "planned" | "in-progress" | "completed") => form.setValue("status", value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="planned">Planned</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.status && (
                                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.status.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>Priority</Label>
                                <Select
                                    value={form.watch("priority").toString()}
                                    onValueChange={(value) => form.setValue("priority", parseInt(value))}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Low</SelectItem>
                                        <SelectItem value="1">Medium</SelectItem>
                                        <SelectItem value="2">High</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.priority && (
                                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.priority.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Quarter</Label>
                            <Input
                                {...form.register("quarter")}
                                className="mt-1"
                                placeholder="e.g. Q1 2024"
                            />
                            {form.formState.errors.quarter && (
                                <p className="text-sm text-red-500 mt-1">{form.formState.errors.quarter.message}</p>
                            )}
                        </div>

                        <div>
                            <Label>Progress</Label>
                            <Input
                                type="number"
                                {...form.register("progress", { valueAsNumber: true })}
                                className="mt-1"
                                min="0"
                                max="100"
                                placeholder="0-100"
                            />
                            {form.formState.errors.progress && (
                                <p className="text-sm text-red-500 mt-1">{form.formState.errors.progress.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Creating..." : "Create Item"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 