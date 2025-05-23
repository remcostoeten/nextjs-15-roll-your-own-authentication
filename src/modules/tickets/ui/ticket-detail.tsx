'use client';

import {
	type TTicketPriority,
	type TTicketStatus,
	TicketPriority,
	TicketStatus,
} from '@/api/schemas/ticket-scheme';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
	toast,
} from '@/shared/components/ui';

import { formatDistanceToNow } from 'date-fns';
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	CircleDashed,
	CircleEllipsis,
	Clock,
	Edit2,
	MessageSquare,
	Trash2,
	User,
	XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { addComment } from '../server/mutations/add-comments';
import { deleteTicket } from '../server/mutations/delete-ticket';
import { updateTicket } from '../server/mutations/update-tickets';
import type { TicketDetail as TicketDetailType } from '../types';

interface TicketDetailProps {
	ticketData: TicketDetailType;
	workspaceId: string;
}

export function TicketDetail({ ticketData, workspaceId }: TicketDetailProps) {
	const router = useRouter();

	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isAddingComment, setIsAddingComment] = useState(false);
	const [comment, setComment] = useState('');

	const [formData, setFormData] = useState({
		title: ticketData.ticket.title,
		description: ticketData.ticket.description || '',
		status: ticketData.ticket.status as TTicketStatus,
		priority: ticketData.ticket.priority as TTicketPriority,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleUpdate = async () => {
		setIsSubmitting(true);

		try {
			const result = await updateTicket({
				ticketId: ticketData.ticket.id,
				...formData,
			});

			if (result.success) {
				toast.success('Ticket updated', 'Your ticket has been updated successfully.');
				setIsEditing(false);
				router.refresh();
			} else {
				toast.error('Error', result.error || 'Failed to update ticket');
			}
		} catch (error) {
			toast.error('Error', 'An unexpected error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);

		try {
			const result = await deleteTicket({
				ticketId: ticketData.ticket.id,
				workspaceId,
			});

			if (result.success) {
				toast.success('Ticket deleted', 'Your ticket has been deleted successfully.');
				router.push(`/workspace/${workspaceId}/tickets`);
			} else {
				toast.error('Error', result.error || 'Failed to delete ticket');
			}
		} catch (error) {
			toast.error('Error', 'An unexpected error occurred');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleAddComment = async () => {
		if (!comment.trim()) return;

		setIsAddingComment(true);

		try {
			const result = await addComment({
				ticketId: ticketData.ticket.id,
				content: comment,
			});

			if (result.success) {
				toast.success('Comment added', 'Your comment has been added successfully.');
				setComment('');
				router.refresh();
			} else {
				toast.error('Error', result.error || 'Failed to add comment');
			}
		} catch (error) {
			toast.error('Error', 'An unexpected error occurred');
		} finally {
			setIsAddingComment(false);
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'backlog':
				return <CircleDashed className="h-4 w-4" />;
			case 'todo':
				return <CircleEllipsis className="h-4 w-4" />;
			case 'in_progress':
				return <Clock className="h-4 w-4" />;
			case 'in_review':
				return <AlertCircle className="h-4 w-4" />;
			case 'done':
				return <CheckCircle2 className="h-4 w-4" />;
			case 'canceled':
				return <XCircle className="h-4 w-4" />;
			default:
				return <CircleDashed className="h-4 w-4" />;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'low':
				return 'bg-blue-500 text-white';
			case 'medium':
				return 'bg-yellow-500 text-white';
			case 'high':
				return 'bg-orange-500 text-white';
			case 'urgent':
				return 'bg-red-500 text-white';
			default:
				return 'bg-gray-500 text-white';
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-start justify-between space-y-0">
					{isEditing ? (
						<div className="space-y-2 w-full">
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								className="w-full text-2xl font-bold bg-transparent border-b border-input px-2 py-1 focus:outline-none focus:border-primary"
							/>
						</div>
					) : (
						<div>
							<CardTitle className="text-2xl">{ticketData.ticket.title}</CardTitle>
							<div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
								<span>#{ticketData.ticket.id.substring(0, 8)}</span>
								<span>•</span>
								<span>
									Created{' '}
									{formatDistanceToNow(new Date(ticketData.ticket.createdAt), {
										addSuffix: true,
									})}
								</span>
								<span>•</span>
								<span>Reported by {ticketData.reporter.name || 'Unknown'}</span>
							</div>
						</div>
					)}

					{!isEditing && (
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
								<Edit2 className="h-4 w-4 mr-1" />
								Edit
							</Button>

							<Dialog>
								<DialogTrigger asChild>
									<Button variant="destructive" size="sm">
										<Trash2 className="h-4 w-4 mr-1" />
										Delete
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											Are you sure you want to delete this ticket?
										</DialogTitle>
									</DialogHeader>
									<p className="py-4">
										This action cannot be undone. This will permanently delete
										the ticket and all associated data.
									</p>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline">Cancel</Button>
										</DialogClose>
										<Button
											variant="destructive"
											onClick={handleDelete}
											disabled={isDeleting}
										>
											{isDeleting ? 'Deleting...' : 'Delete Ticket'}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</CardHeader>

				<CardContent className="space-y-6">
					{isEditing ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Status</label>
								<Select
									value={formData.status}
									onValueChange={(value: string) =>
										handleSelectChange('status', value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={TicketStatus.BACKLOG}>
											Backlog
										</SelectItem>
										<SelectItem value={TicketStatus.TODO}>To Do</SelectItem>
										<SelectItem value={TicketStatus.IN_PROGRESS}>
											In Progress
										</SelectItem>
										<SelectItem value={TicketStatus.IN_REVIEW}>
											In Review
										</SelectItem>
										<SelectItem value={TicketStatus.DONE}>Done</SelectItem>
										<SelectItem value={TicketStatus.CANCELED}>
											Canceled
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Priority</label>
								<Select
									value={formData.priority}
									onValueChange={(value: string) =>
										handleSelectChange('priority', value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select priority" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={TicketPriority.LOW}>Low</SelectItem>
										<SelectItem value={TicketPriority.MEDIUM}>
											Medium
										</SelectItem>
										<SelectItem value={TicketPriority.HIGH}>High</SelectItem>
										<SelectItem value={TicketPriority.URGENT}>
											Urgent
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card>
								<CardContent className="p-4 flex items-center gap-3">
									{getStatusIcon(ticketData.ticket.status)}
									<div>
										<p className="text-sm font-medium">Status</p>
										<p className="capitalize">
											{ticketData.ticket.status.replace('_', ' ')}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4 flex items-center gap-3">
									<AlertTriangle className="h-4 w-4" />
									<div>
										<p className="text-sm font-medium">Priority</p>
										<Badge
											className={`capitalize ${getPriorityColor(ticketData.ticket.priority)}`}
										>
											{ticketData.ticket.priority}
										</Badge>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4 flex items-center gap-3">
									<User className="h-4 w-4" />
									<div>
										<p className="text-sm font-medium">Assignee</p>
										{ticketData.assignee ? (
											<div className="flex items-center gap-2">
												<Avatar className="h-6 w-6">
													<AvatarImage
														src={ticketData.assignee.avatar || ''}
														alt={ticketData.assignee.name || ''}
													/>
													<AvatarFallback>
														{ticketData.assignee.name?.charAt(0) || 'U'}
													</AvatarFallback>
												</Avatar>
												<span>{ticketData.assignee.name}</span>
											</div>
										) : (
											<span className="text-muted-foreground">
												Unassigned
											</span>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					<div>
						<h3 className="text-lg font-medium mb-2">Description</h3>
						{isEditing ? (
							<Textarea
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Enter ticket description"
								className="min-h-[150px]"
							/>
						) : (
							<div className="prose prose-sm max-w-none">
								{ticketData.ticket.description ? (
									<p className="whitespace-pre-line">
										{ticketData.ticket.description}
									</p>
								) : (
									<p className="text-muted-foreground italic">
										No description provided
									</p>
								)}
							</div>
						)}
					</div>

					{isEditing && (
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsEditing(false)}>
								Cancel
							</Button>
							<Button onClick={handleUpdate} disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>
					)}

					<div>
						<h3 className="text-lg font-medium mb-4 flex items-center gap-2">
							<MessageSquare className="h-5 w-5" />
							Comments
						</h3>

						<div className="space-y-4 mb-6">
							{ticketData.comments && ticketData.comments.length > 0 ? (
								ticketData.comments.map(({ comment, user }) => (
									<div key={comment.id} className="flex gap-3">
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={user.avatar || ''}
												alt={user.name || ''}
											/>
											<AvatarFallback>
												{user.name?.charAt(0) || 'U'}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<span className="font-medium">{user.name}</span>
												<span className="text-xs text-muted-foreground">
													{formatDistanceToNow(
														new Date(comment.createdAt),
														{ addSuffix: true }
													)}
												</span>
											</div>
											<p className="mt-1 whitespace-pre-line">
												{comment.content}
											</p>
										</div>
									</div>
								))
							) : (
								<p className="text-muted-foreground italic">No comments yet</p>
							)}
						</div>

						<div className="space-y-2">
							<Textarea
								placeholder="Add a comment..."
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="min-h-[100px]"
							/>
							<div className="flex justify-end">
								<Button
									onClick={handleAddComment}
									disabled={isAddingComment || !comment.trim()}
								>
									{isAddingComment ? 'Adding...' : 'Add Comment'}
								</Button>
							</div>
						</div>
					</div>

					{ticketData.history && ticketData.history.length > 0 && (
						<div>
							<h3 className="text-lg font-medium mb-4 flex items-center gap-2">
								<Clock className="h-5 w-5" />
								Activity History
							</h3>

							<div className="space-y-3">
								{ticketData.history.map(({ history, user }) => (
									<div key={history.id} className="flex gap-3 text-sm">
										<Avatar className="h-6 w-6">
											<AvatarImage
												src={user.avatar || ''}
												alt={user.name || ''}
											/>
											<AvatarFallback>
												{user.name?.charAt(0) || 'U'}
											</AvatarFallback>
										</Avatar>
										<div>
											<span className="font-medium">{user.name}</span>{' '}
											{history.field === 'status' && (
												<span>
													changed status from{' '}
													<Badge variant="outline" className="capitalize">
														{history.oldValue?.replace('_', ' ') ||
															'none'}
													</Badge>{' '}
													to{' '}
													<Badge variant="outline" className="capitalize">
														{history.newValue?.replace('_', ' ') ||
															'none'}
													</Badge>
												</span>
											)}
											{history.field === 'priority' && (
												<span>
													changed priority from{' '}
													<Badge variant="outline" className="capitalize">
														{history.oldValue || 'none'}
													</Badge>{' '}
													to{' '}
													<Badge variant="outline" className="capitalize">
														{history.newValue || 'none'}
													</Badge>
												</span>
											)}
											{history.field === 'assignee' && (
												<span>
													{history.newValue === 'unassigned'
														? 'unassigned the ticket'
														: `assigned the ticket to ${history.newValue}`}
												</span>
											)}
											{history.field === 'title' && (
												<span>updated the title</span>
											)}
											<span className="text-xs text-muted-foreground ml-2">
												{formatDistanceToNow(new Date(history.createdAt), {
													addSuffix: true,
												})}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
