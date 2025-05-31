'use client';

import { toast } from '@/shared/components/toast';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, Icons } from 'ui';
import { inviteUser } from '../server/mutations/invite-user';
import { TWorkspaceWithOwner } from '../types';

interface InviteMemberFormProps {
	workspace: TWorkspaceWithOwner;
}

export function InviteMemberForm({ workspace }: InviteMemberFormProps) {
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
	const [isPending, startTransition] = useTransition();
	const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);
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

					// Show the invitation URL in development
					if (result.data?.inviteUrl) {
						setLastInviteUrl(result.data.inviteUrl);
					}

					router.refresh();
				} else {
					toast.error(result.error || 'Failed to send invitation');
				}
			} catch (error) {
				toast.error('Failed to send invitation');
			}
		});
	};

	return (
		<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
			<div className="p-6">
				<h3 className="text-lg font-semibold mb-2">Invite New Member</h3>
				<p className="text-sm text-muted-foreground mb-6">
					Send an invitation to join <strong>{workspace.title}</strong> workspace.
				</p>

				<form onSubmit={handleInviteUser} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							value={inviteEmail}
							onChange={(e) => setInviteEmail(e.target.value)}
							placeholder="colleague@company.com"
							className="w-full px-3 py-2 border border-input bg-background rounded-md"
							required
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="role" className="text-sm font-medium">
							Role
						</label>
						<select
							id="role"
							value={inviteRole}
							onChange={(e) =>
								setInviteRole(e.target.value as 'admin' | 'member' | 'viewer')
							}
							className="w-full px-3 py-2 border border-input bg-background rounded-md"
						>
							<option value="viewer">Viewer - Can view projects and tasks</option>
							<option value="member">Member - Can create and edit projects</option>
							<option value="admin">Admin - Can manage workspace and members</option>
						</select>
					</div>

					<div className="flex items-center space-x-3 pt-4">
						<Button
							type="submit"
							disabled={isPending || !inviteEmail.trim()}
							className="flex items-center"
						>
							{isPending ? (
								<>
									<Icons.spinner className="h-4 w-4 animate-spin mr-2" />
									Sending Invitation...
								</>
							) : (
								<>
									<Icons.plus className="h-4 w-4 mr-2" />
									Send Invitation
								</>
							)}
						</Button>
					</div>
				</form>

				{/* Development: Show invitation link */}
				{lastInviteUrl && (
					<div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
						<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
							🎉 Invitation Created!
						</h4>
						<p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
							Since email service is not configured, here's the invitation link:
						</p>
						<div className="flex items-center gap-2">
							<input
								type="text"
								value={lastInviteUrl}
								readOnly
								className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded"
							/>
							<Button
								type="button"
								size="sm"
								onClick={() => {
									navigator.clipboard.writeText(lastInviteUrl);
									toast.success('Link copied to clipboard!');
								}}
							>
								Copy
							</Button>
						</div>
						<p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
							Share this link with the person you want to invite.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
