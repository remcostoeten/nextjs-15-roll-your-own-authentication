'use client';
import { toast } from '@/shared/components/toast';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons } from 'ui';
import { inviteUser } from '../server/mutations/invite-user';
import { removeMember } from '../server/mutations/remove-member';
import { updateMemberRole } from '../server/mutations/update-member-role';
import { TWorkspaceMember, TWorkspaceMemberRole, TWorkspaceWithOwner } from '../types';

type TMembersList = {
	members: TWorkspaceMember[];
	workspace: TWorkspaceWithOwner;
	userRole: TWorkspaceMemberRole;
};

export function MembersList({ members, workspace, userRole }: TMembersList) {
	const [isInviting, setIsInviting] = useState(false);
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

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

	const getRoleColor = (role: string) => {
		switch (role) {
			case 'owner':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
			case 'admin':
				return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
			case 'member':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'viewer':
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
			default:
				return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
		}
	};

	return (
		<div className="space-y-6">
			{/* Header with invite button */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-white">
						{members.length} Member{members.length !== 1 ? 's' : ''}
					</h2>
					<p className="text-white/60 text-sm mt-1">
						People who have access to this workspace
					</p>
				</div>
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
				<Card className="bg-[rgb(15,15,15)] border-[rgb(28,28,28)]">
					<CardHeader>
						<CardTitle className="text-white">Invite New Member</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleInviteUser} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-white mb-2">
										Email Address
									</label>
									<input
										type="email"
										value={inviteEmail}
										onChange={(e) => setInviteEmail(e.target.value)}
										placeholder="colleague@company.com"
										className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-white mb-2">
										Role
									</label>
									<select
										value={inviteRole}
										onChange={(e) =>
											setInviteRole(
												e.target.value as 'admin' | 'member' | 'viewer'
											)
										}
										className="w-full px-3 py-2 bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg text-white focus:outline-none focus:border-white/40"
									>
										<option value="viewer">Viewer</option>
										<option value="member">Member</option>
										<option value="admin">Admin</option>
									</select>
								</div>
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
					</CardContent>
				</Card>
			)}

			{/* Members Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{members.map((member) => (
					<Card
						key={member.id}
						className="bg-[rgb(15,15,15)] border-[rgb(28,28,28)] hover:border-[rgb(40,40,40)] transition-colors"
					>
						<CardContent className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center space-x-3">
									<div className="w-12 h-12 bg-[rgb(28,28,28)] rounded-full flex items-center justify-center">
										{member.user.avatar ? (
											<img
												src={member.user.avatar}
												alt={member.user.name}
												className="w-12 h-12 rounded-full"
											/>
										) : (
											<span className="text-white font-medium text-lg">
												{member.user.name.charAt(0).toUpperCase()}
											</span>
										)}
									</div>
									<div>
										<h3 className="font-medium text-white">
											{member.user.name}
										</h3>
										<p className="text-sm text-white/60">{member.user.email}</p>
									</div>
								</div>
								{member.role === 'owner' && (
									<Icons.crown className="h-5 w-5 text-yellow-500" />
								)}
							</div>

							<div className="flex items-center justify-between">
								{/* Role Badge/Selector */}
								{userRole === 'owner' && member.role !== 'owner' ? (
									<select
										value={member.role}
										onChange={(e) =>
											handleUpdateRole(
												member.userId,
												e.target.value as TWorkspaceMemberRole
											)
										}
										className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(
											member.role
										)} bg-transparent`}
										disabled={isPending}
									>
										<option value="viewer">Viewer</option>
										<option value="member">Member</option>
										<option value="admin">Admin</option>
									</select>
								) : (
									<span
										className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleColor(
											member.role
										)}`}
									>
										{member.role.charAt(0).toUpperCase() + member.role.slice(1)}
									</span>
								)}

								{/* Actions */}
								{member.role !== 'owner' &&
									['owner', 'admin'].includes(userRole) && (
										<Button
											onClick={() =>
												handleRemoveMember(member.userId, member.user.name)
											}
											variant="ghost"
											size="sm"
											className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
											disabled={isPending}
										>
											<Icons.trash className="h-4 w-4" />
										</Button>
									)}
							</div>

							{/* Member since */}
							<div className="mt-4 pt-4 border-t border-[rgb(28,28,28)]">
								<p className="text-xs text-white/40">
									Joined {new Date(member.joinedAt).toLocaleDateString()}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Empty state */}
			{members.length === 0 && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4">👥</div>
					<h3 className="text-lg font-medium text-white mb-2">No members yet</h3>
					<p className="text-white/60 mb-6">
						Invite team members to start collaborating on this workspace.
					</p>
					{['owner', 'admin'].includes(userRole) && (
						<Button
							onClick={() => setIsInviting(true)}
							className="bg-white text-black hover:bg-white/90"
						>
							<Icons.plus className="h-4 w-4 mr-2" />
							Invite Your First Member
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
