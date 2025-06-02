import { toast } from '@/shared/components/toast';
import { useState, useTransition } from 'react';
import { inviteUser } from '../server/mutations/invite-user';
import { TWorkspaceMember, TWorkspaceMemberRole, TWorkspaceWithOwner } from '../types';
import { Button, Icons } from 'ui';
('use client');

interface WorkspaceSettingsProps {
	workspace: TWorkspaceWithOwner;
	members: TWorkspaceMember[];
	userRole: TWorkspaceMemberRole;
}

export function WorkspaceSettings({ workspace, members, userRole }: WorkspaceSettingsProps) {
	const [activeTab, setActiveTab] = useState<'general' | 'members' | 'danger'>('general');
	const [isInviting, setIsInviting] = useState(false);
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
	const [isPending, startTransition] = useTransition();

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
				} else {
					toast.error(result.error || 'Failed to send invitation');
				}
			} catch (error) {
				toast.error('Failed to send invitation');
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
								onClick={() => setActiveTab(tab.id)}
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
						<div>
							<h3 className="text-lg font-semibold text-white mb-4">
								Workspace Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Workspace Name
									</label>
									<input
										type="text"
										defaultValue={workspace.title}
										className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white"
										disabled
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Emoji
									</label>
									<input
										type="text"
										defaultValue={workspace.emoji}
										className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white"
										disabled
									/>
								</div>
							</div>
							<div className="mt-4">
								<label className="block text-sm font-medium text-white mb-2">
									Description
								</label>
								<textarea
									defaultValue={workspace.description || ''}
									rows={3}
									className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white resize-none"
									disabled
								/>
							</div>
							<p className="text-sm text-white/60 mt-2">
								Workspace editing is coming soon.
							</p>
						</div>
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
										<span className="px-2 py-1 bg-[rgb(28,28,28)] text-white/80 text-xs rounded-full capitalize">
											{member.role}
										</span>
										{member.role === 'owner' && (
											<Icons.crown className="h-4 w-4 text-yellow-500" />
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'danger' && userRole === 'owner' && (
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
							<div className="border border-red-500/20 bg-red-500/5 rounded-lg p-4">
								<h4 className="font-medium text-red-400 mb-2">Delete Workspace</h4>
								<p className="text-white/60 text-sm mb-4">
									Once you delete a workspace, there is no going back. Please be
									certain.
								</p>
								<Button
									variant="destructive"
									className="bg-red-600 hover:bg-red-700 text-white"
									disabled
								>
									Delete Workspace
								</Button>
								<p className="text-xs text-white/40 mt-2">
									Workspace deletion is coming soon.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
