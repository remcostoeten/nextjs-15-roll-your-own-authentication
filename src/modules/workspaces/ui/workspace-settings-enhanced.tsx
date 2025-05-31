'use client';
import { toast } from '@/shared/components/toast';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, Icons } from 'ui';
import { deleteWorkspace } from '../server/mutations/delete-workspace';
import { inviteUser } from '../server/mutations/invite-user';
import { leaveWorkspace } from '../server/mutations/leave-workspace';
import { removeMember } from '../server/mutations/remove-member';
import { updateMemberRole } from '../server/mutations/update-member-role';
import { updateWorkspace } from '../server/mutations/update-workspace';
import { TWorkspaceMember, TWorkspaceMemberRole, TWorkspaceWithOwner } from '../types';

type TProps = {
	workspace: TWorkspaceWithOwner;
	members: TWorkspaceMember[];
	userRole: TWorkspaceMemberRole;
};

export function WorkspaceSettingsEnhanced({ workspace, members, userRole }: TProps) {
	const [activeTab, setActiveTab] = useState<'general' | 'members' | 'danger'>('general');
	const [isInviting, setIsInviting] = useState(false);
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
	const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		title: workspace.title,
		emoji: workspace.emoji,
		description: workspace.description || '',
	});
	const router = useRouter();

	// Handle workspace update
	const handleUpdateWorkspace = async (e: React.FormEvent) => {
		e.preventDefault();

		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append('title', editForm.title);
				formData.append('emoji', editForm.emoji);
				formData.append('description', editForm.description);

				const result = await updateWorkspace(workspace.id, formData);

				if (result.success) {
					toast.success('Workspace updated successfully!');
					setIsEditing(false);
					router.refresh();
				} else {
					toast.error(result.error || 'Failed to update workspace');
				}
			} catch (error) {
				toast.error('Failed to update workspace');
			}
		});
	};

	// Handle workspace deletion
	const handleDeleteWorkspace = async () => {
		if (
			!confirm(
				`Are you sure you want to delete "${workspace.title}"? This action cannot be undone.`
			)
		) {
			return;
		}

		startTransition(async () => {
			try {
				const result = await deleteWorkspace(workspace.id);

				if (result.success) {
					toast.success('Workspace deleted successfully');
					router.push('/dashboard');
				} else {
					toast.error(result.error || 'Failed to delete workspace');
				}
			} catch (error) {
				toast.error('Failed to delete workspace');
			}
		});
	};

	// Handle member invitation
	const handleInviteUser = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!inviteEmail.trim()) {
			toast.error('Please enter an email address');
			return;
		}

		startTransition(async () => {
			try {
				const formData = new FormData();
				formData.append('workspaceId', workspace.id);
				formData.append('email', inviteEmail.trim());
				formData.append('role', inviteRole);

				const result = await inviteUser(formData);

				if (result.success) {
					toast.success('Invitation sent successfully!');
					setInviteEmail('');
					setIsInviting(false);

					// Show the invitation URL in development
					if ((result as any).data?.inviteUrl) {
						setLastInviteUrl((result as any).data.inviteUrl);
					}
				} else {
					toast.error(result.error || 'Failed to send invitation');
				}
			} catch (error) {
				toast.error('Failed to send invitation');
			}
		});
	};

	// Handle member removal
	const handleRemoveMember = async (memberId: string, memberName: string) => {
		if (!confirm(`Remove ${memberName} from this workspace?`)) {
			return;
		}

		startTransition(async () => {
			try {
				const result = await removeMember(workspace.id, memberId);

				if (result.success) {
					toast.success('Member removed successfully');
					router.refresh();
				} else {
					toast.error(result.error || 'Failed to remove member');
				}
			} catch (error) {
				toast.error('Failed to remove member');
			}
		});
	};

	// Handle role update
	const handleUpdateRole = async (memberId: string, newRole: TWorkspaceMemberRole) => {
		startTransition(async () => {
			try {
				const result = await updateMemberRole(workspace.id, memberId, newRole);

				if (result.success) {
					toast.success('Member role updated successfully');
					router.refresh();
				} else {
					toast.error(result.error || 'Failed to update member role');
				}
			} catch (error) {
				toast.error('Failed to update member role');
			}
		});
	};

	// Handle leaving workspace
	const handleLeaveWorkspace = async () => {
		if (!confirm('Are you sure you want to leave this workspace?')) {
			return;
		}

		startTransition(async () => {
			try {
				const result = await leaveWorkspace(workspace.id);

				if (result.success) {
					toast.success('Left workspace successfully');
					router.push('/dashboard');
				} else {
					toast.error(result.error || 'Failed to leave workspace');
				}
			} catch (error) {
				toast.error('Failed to leave workspace');
			}
		});
	};

	const tabs = [
		{ id: 'general', name: 'General', icon: Icons.settings },
		{ id: 'members', name: 'Members', icon: Icons.users },
		...(userRole === 'owner'
			? [{ id: 'danger', name: 'Danger Zone', icon: Icons.alertTriangle }]
			: []),
	] as const;

	return (
		<div className="bg-[rgb(15,15,15)] border border-[rgb(28,28,28)] rounded-lg">
			{/* Tab Navigation */}
			<div className="border-b border-[rgb(28,28,28)]">
				<nav className="flex space-x-8 px-6">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() =>
									setActiveTab(tab.id as 'general' | 'members' | 'danger')
								}
								className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
									activeTab === tab.id
										? 'border-white text-white'
										: 'border-transparent text-white/60 hover:text-white'
								}`}
							>
								<Icon className="h-4 w-4" />
								<span>{tab.name}</span>
							</button>
						);
					})}
				</nav>
			</div>

			{/* Tab Content */}
			<div className="p-6">
				{activeTab === 'general' && (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-white">
								Workspace Information
							</h3>
							{['owner', 'admin'].includes(userRole) && (
								<Button
									onClick={() => setIsEditing(!isEditing)}
									variant="ghost"
									className="text-white/60 hover:text-white"
								>
									{isEditing ? (
										<>
											<Icons.close className="h-4 w-4 mr-2" />
											Cancel
										</>
									) : (
										<>
											<Icons.edit className="h-4 w-4 mr-2" />
											Edit
										</>
									)}
								</Button>
							)}
						</div>

						{isEditing ? (
							<form onSubmit={handleUpdateWorkspace} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-white mb-2">
											Workspace Name
										</label>
										<input
											type="text"
											value={editForm.title}
											onChange={(e) =>
												setEditForm((prev) => ({
													...prev,
													title: e.target.value,
												}))
											}
											className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white"
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-white mb-2">
											Emoji
										</label>
										<input
											type="text"
											value={editForm.emoji}
											onChange={(e) =>
												setEditForm((prev) => ({
													...prev,
													emoji: e.target.value,
												}))
											}
											className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white"
											required
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Description
									</label>
									<textarea
										value={editForm.description}
										onChange={(e) =>
											setEditForm((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										rows={3}
										className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white resize-none"
									/>
								</div>
								<div className="flex items-center space-x-3">
									<Button
										type="submit"
										disabled={isPending}
										className="bg-white text-black hover:bg-white/90"
									>
										{isPending ? (
											<>
												<Icons.spinner className="h-4 w-4 animate-spin mr-2" />
												Saving...
											</>
										) : (
											'Save Changes'
										)}
									</Button>
									<Button
										type="button"
										variant="ghost"
										onClick={() => {
											setIsEditing(false);
											setEditForm({
												title: workspace.title,
												emoji: workspace.emoji,
												description: workspace.description || '',
											});
										}}
										className="text-white/60 hover:text-white"
									>
										Cancel
									</Button>
								</div>
							</form>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Workspace Name
									</label>
									<div className="px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white">
										{workspace.title}
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Emoji
									</label>
									<div className="px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white">
										{workspace.emoji}
									</div>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-white mb-2">
										Description
									</label>
									<div className="px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white min-h-[80px]">
										{workspace.description || 'No description provided'}
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				{activeTab === 'members' && (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-white">
								Members ({members.length})
							</h3>
							{['owner', 'admin'].includes(userRole) && (
								<Button
									onClick={() => setIsInviting(true)}
									className="bg-white text-black hover:bg-white/90"
								>
									<Icons.plus className="h-4 w-4 mr-2" />
									Invite Member
								</Button>
							)}
						</div>

						{/* Invite Form */}
						{isInviting && (
							<form
								onSubmit={handleInviteUser}
								className="bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg p-4"
							>
								<h4 className="font-medium text-white mb-4">Invite New Member</h4>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="md:col-span-2">
										<input
											type="email"
											value={inviteEmail}
											onChange={(e) => setInviteEmail(e.target.value)}
											placeholder="Enter email address"
											className="w-full px-3 py-2 bg-[rgb(15,15,15)] border border-[rgb(28,28,28)] rounded-lg text-white placeholder:text-white/40"
											required
										/>
									</div>
									<div>
										<select
											value={inviteRole}
											onChange={(e) => setInviteRole(e.target.value as any)}
											className="w-full px-3 py-2 bg-[rgb(15,15,15)] border border-[rgb(28,28,28)] rounded-lg text-white"
										>
											<option value="viewer">Viewer</option>
											<option value="member">Member</option>
											<option value="admin">Admin</option>
										</select>
									</div>
								</div>
								<div className="flex items-center space-x-3 mt-4">
									<Button
										type="submit"
										disabled={isPending}
										className="bg-white text-black hover:bg-white/90"
									>
										{isPending ? (
											<>
												<Icons.spinner className="h-4 w-4 animate-spin mr-2" />
												Sending...
											</>
										) : (
											'Send Invitation'
										)}
									</Button>
									<Button
										type="button"
										variant="ghost"
										onClick={() => {
											setIsInviting(false);
											setInviteEmail('');
										}}
										className="text-white/60 hover:text-white"
									>
										Cancel
									</Button>
								</div>
							</form>
						)}

						{/* Members List */}
						<div className="space-y-3">
							{members.map((member) => (
								<div
									key={member.id}
									className="flex items-center justify-between p-4 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg"
								>
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-[rgb(28,28,28)] rounded-full flex items-center justify-center">
											{member.user.avatar ? (
												<img
													src={member.user.avatar}
													alt={member.user.name}
													className="w-10 h-10 rounded-full"
												/>
											) : (
												<span className="text-white font-medium">
													{member.user.name.charAt(0).toUpperCase()}
												</span>
											)}
										</div>
										<div>
											<div className="font-medium text-white">
												{member.user.name}
											</div>
											<div className="text-sm text-white/60">
												{member.user.email}
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-3">
										{/* Role Selector */}
										{userRole === 'owner' && member.role !== 'owner' ? (
											<select
												value={member.role}
												onChange={(e) =>
													handleUpdateRole(
														member.userId,
														e.target.value as TWorkspaceMemberRole
													)
												}
												className="px-2 py-1 bg-[rgb(28,28,28)] text-white/80 text-xs rounded border-none"
												disabled={isPending}
											>
												<option value="viewer">Viewer</option>
												<option value="member">Member</option>
												<option value="admin">Admin</option>
											</select>
										) : (
											<span className="px-2 py-1 bg-[rgb(28,28,28)] text-white/80 text-xs rounded-full capitalize">
												{member.role}
											</span>
										)}

										{member.role === 'owner' && (
											<Icons.crown className="h-4 w-4 text-yellow-500" />
										)}

										{/* Actions */}
										{member.role !== 'owner' &&
											['owner', 'admin'].includes(userRole) && (
												<Button
													onClick={() =>
														handleRemoveMember(
															member.userId,
															member.user.name
														)
													}
													variant="ghost"
													size="sm"
													className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
													disabled={isPending}
												>
													<Icons.trash className="h-4 w-4" />
												</Button>
											)}
									</div>
								</div>
							))}
						</div>

						{/* Leave Workspace */}
						{userRole !== 'owner' && (
							<div className="pt-6 border-t border-[rgb(28,28,28)]">
								<Button
									onClick={handleLeaveWorkspace}
									variant="ghost"
									className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
									disabled={isPending}
								>
									<Icons.logOut className="h-4 w-4 mr-2" />
									Leave Workspace
								</Button>
							</div>
						)}
					</div>
				)}

				{activeTab === 'danger' && userRole === 'owner' && (
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
							<div className="border border-red-500/20 bg-red-500/5 rounded-lg p-4">
								<h4 className="font-medium text-red-400 mb-2">Delete Workspace</h4>
								<p className="text-white/60 text-sm mb-4">
									Once you delete a workspace, there is no going back. All data,
									projects, and members will be permanently removed.
								</p>
								<Button
									onClick={handleDeleteWorkspace}
									variant="destructive"
									className="bg-red-600 hover:bg-red-700 text-white"
									disabled={isPending || workspace.isPersonal}
								>
									{isPending ? (
										<>
											<Icons.spinner className="h-4 w-4 animate-spin mr-2" />
											Deleting...
										</>
									) : (
										<>
											<Icons.trash className="h-4 w-4 mr-2" />
											Delete Workspace
										</>
									)}
								</Button>
								{workspace.isPersonal && (
									<p className="text-xs text-white/40 mt-2">
										Personal workspaces cannot be deleted.
									</p>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
