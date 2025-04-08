'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { MoreHorizontal, UserMinus, UserCog, Loader2 } from 'lucide-react'
import {
	removeWorkspaceMember,
	updateMemberRole,
} from '@/modules/workspaces/api/mutations'
import { useToast } from '@/hooks/use-toast'

type Member = {
	id: string
	role: string
	joinedAt: Date
	user: {
		id: string
		firstName: string
		lastName: string
		email: string
		username: string
		avatar: string | null
	}
}

interface WorkspaceMembersListProps {
	members: Member[]
	workspaceId: string
	currentUserRole: string
}

export function WorkspaceMembersList({
	members,
	workspaceId,
	currentUserRole,
}: WorkspaceMembersListProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [showRoleDialog, setShowRoleDialog] = useState(false)
	const [showRemoveDialog, setShowRemoveDialog] = useState(false)
	const [selectedMember, setSelectedMember] = useState<Member | null>(null)
	const [newRole, setNewRole] = useState<string>('')
	const [isLoading, setIsLoading] = useState(false)

	const canManageMembers =
		currentUserRole === 'owner' || currentUserRole === 'admin'
	const isOwner = currentUserRole === 'owner'

	// Get user initials for avatar
	const getUserInitials = (firstName: string, lastName: string) => {
		return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
	}

	const handleUpdateRole = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!selectedMember) return

		setIsLoading(true)

		const formData = new FormData()
		formData.append('role', newRole)

		try {
			const result = await updateMemberRole(
				workspaceId,
				selectedMember.id,
				formData
			)

			if (result.error) {
				toast({
					variant: 'destructive',
					title: 'Failed to update role',
					description: result.error,
				})
			} else {
				toast({
					title: 'Role updated',
					description: `${selectedMember.user.firstName}'s role has been updated to ${newRole}.`,
				})
				setShowRoleDialog(false)
				router.refresh()
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
				description: 'Please try again later.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleRemoveMember = async () => {
		if (!selectedMember) return

		setIsLoading(true)

		try {
			const result = await removeWorkspaceMember(
				workspaceId,
				selectedMember.id
			)

			if (result.error) {
				toast({
					variant: 'destructive',
					title: 'Failed to remove member',
					description: result.error,
				})
			} else {
				toast({
					title: 'Member removed',
					description: `${selectedMember.user.firstName} has been removed from the workspace.`,
				})
				setShowRemoveDialog(false)
				router.refresh()
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
				description: 'Please try again later.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	if (members.length === 0) {
		return <div className="text-center py-8">No members found</div>
	}

	return (
		<>
			<div className="space-y-4">
				{members.map((member) => (
					<div
						key={member.id}
						className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
					>
						<div className="flex items-center gap-3">
							<Avatar className="h-10 w-10">
								{member.user.avatar ? (
									<img
										src={
											member.user.avatar ||
											'/placeholder.svg'
										}
										alt={`${member.user.firstName} ${member.user.lastName}`}
									/>
								) : (
									<AvatarFallback>
										{getUserInitials(
											member.user.firstName,
											member.user.lastName
										)}
									</AvatarFallback>
								)}
							</Avatar>
							<div>
								<div className="font-medium">
									{member.user.firstName}{' '}
									{member.user.lastName}
								</div>
								<div className="text-sm text-muted-foreground">
									{member.user.email}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant={
									member.role === 'owner'
										? 'default'
										: member.role === 'admin'
										? 'secondary'
										: 'outline'
								}
							>
								{member.role}
							</Badge>
							<div className="text-xs text-muted-foreground">
								Joined{' '}
								{formatDistanceToNow(
									new Date(member.joinedAt),
									{ addSuffix: true }
								)}
							</div>
							{canManageMembers &&
								member.user.id !== 'current-user-id' && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
											>
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">
													Actions
												</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											{isOwner &&
												member.role !== 'owner' && (
													<DropdownMenuItem
														onClick={() => {
															setSelectedMember(
																member
															)
															setNewRole(
																member.role
															)
															setShowRoleDialog(
																true
															)
														}}
													>
														<UserCog className="mr-2 h-4 w-4" />
														Change Role
													</DropdownMenuItem>
												)}
											{(isOwner ||
												(currentUserRole === 'admin' &&
													member.role ===
														'member')) && (
												<DropdownMenuItem
													onClick={() => {
														setSelectedMember(
															member
														)
														setShowRemoveDialog(
															true
														)
													}}
													className="text-destructive focus:text-destructive"
												>
													<UserMinus className="mr-2 h-4 w-4" />
													Remove Member
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								)}
						</div>
					</div>
				))}
			</div>

			{/* Change Role Dialog */}
			<Dialog
				open={showRoleDialog}
				onOpenChange={setShowRoleDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change Member Role</DialogTitle>
						<DialogDescription>
							Change the role for {selectedMember?.user.firstName}{' '}
							{selectedMember?.user.lastName}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleUpdateRole}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select
									value={newRole}
									onValueChange={setNewRole}
									defaultValue={selectedMember?.role}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="member">
											Member
										</SelectItem>
										<SelectItem value="admin">
											Admin
										</SelectItem>
										<SelectItem value="owner">
											Owner
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowRoleDialog(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									'Update Role'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Remove Member Dialog */}
			<Dialog
				open={showRemoveDialog}
				onOpenChange={setShowRemoveDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove Member</DialogTitle>
						<DialogDescription>
							Are you sure you want to remove{' '}
							{selectedMember?.user.firstName}{' '}
							{selectedMember?.user.lastName} from this workspace?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowRemoveDialog(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleRemoveMember}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Removing...
								</>
							) : (
								'Remove Member'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
