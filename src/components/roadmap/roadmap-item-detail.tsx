import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Check, Clock, MessageSquare, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Progress } from "@/shared/components/ui/progress";

interface RoadmapItemDetailProps {
    item: any;
    onClose: () => void;
}

export function RoadmapItemDetail({ item, onClose }: RoadmapItemDetailProps) {
    const [activeTab, setActiveTab] = useState("details");

    return (
        <Card className="w-full max-w-2xl p-6 space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Created {format(new Date(item.createdAt), "PPP")}
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    ×
                </Button>
            </div>

            <Progress value={item.progress} className="h-2" />

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {format(new Date(item.startDate), "MMM d")} -{" "}
                            {format(new Date(item.endDate), "MMM d, yyyy")}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={item.assigneeAvatar} />
                            <AvatarFallback>RS</AvatarFallback>
                        </Avatar>
                        <span>{item.assigneeName}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">
                        {item.estimatedHours} hours estimated
                    </span>
                </div>
            </div>

            <Separator />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                    </div>
                </TabsContent>

                <TabsContent value="subtasks" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Subtasks</h3>
                        <Button variant="outline" size="sm" disabled>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Subtask
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {/* Example subtasks - would be populated from item.subtasks */}
                        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                            <Button variant="outline" size="icon" className="h-6 w-6" disabled>
                                <Check className="h-4 w-4" />
                            </Button>
                            <span className="flex-1">Design wireframes</span>
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={item.assigneeAvatar} />
                                <AvatarFallback>RS</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Comments</h3>
                        <Button variant="outline" size="sm" disabled>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Comment
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {/* Example comments - would be populated from item.comments */}
                        <div className="flex space-x-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={item.assigneeAvatar} />
                                <AvatarFallback>RS</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">{item.assigneeName}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {format(new Date(), "PPP")}
                                    </span>
                                </div>
                                <p className="text-sm mt-1">
                                    Example comment content...
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                <Button disabled>Save Changes</Button>
            </div>
        </Card>
    );
} 