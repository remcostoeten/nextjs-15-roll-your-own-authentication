'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvite } from '../server/mutations/accept-invite';
import { toast } from '@/shared/components/toast';
import { Button, Icons } from 'ui';

interface InviteAcceptanceProps {
	invite: {
		id: string;
		email: string;
		role: string;
		workspace: {
			id: string;
			title: string;
			emoji: string;
			description: string | null;
		};
		inviter: {
			id: string;
			name: string;
			email: string;
		};
	};
	token: string;
}

export function InviteAcceptance({ invite, token }: InviteAcceptanceProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleAccept = () => {
		startTransition(async () => {
			try {
				const result = await acceptInvite(token);

				if (result.success) {
					toast.success('Successfully joined the workspace!');
					router.push(`/dashboard?workspace=${invite.workspace.id}`);
				} else {
					toast.error(result.error || 'Failed to accept invitation');
				}
			} catch (error) {
				toast.error('Failed to accept invitation');
			}
		});
	};

	const handleDecline = () => {
		router.push('/dashboard');
	};

	return (
		<div className="bg-[rgb(15,15,15)] border border-[rgb(28,28,28)] rounded-lg p-6">
			<div className="text-center mb-6">
				<div className="text-4xl mb-4">{invite.workspace.emoji}</div>
				<h1 className="text-2xl font-bold text-white mb-2">You're invited to join</h1>
				<h2 className="text-xl text-white/80 mb-2">{invite.workspace.title}</h2>
				{invite.workspace.description && (
					<p className="text-white/60 text-sm">{invite.workspace.description}</p>
				)}
			</div>

			<div className="bg-[rgb(21,21,21)] border border-[rgb(28,28,28)] rounded-lg p-4 mb-6">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-[rgb(28,28,28)] rounded-full flex items-center justify-center">
						<span className="text-white font-medium">
							{invite.inviter.name.charAt(0).toUpperCase()}
						</span>
					</div>
					<div>
						<div className="text-white font-medium">{invite.inviter.name}</div>
						<div className="text-white/60 text-sm">invited you as a {invite.role}</div>
					</div>
				</div>
			</div>

			<div className="space-y-3">
				<Button
					onClick={handleAccept}
					disabled={isPending}
					className="w-full bg-white text-black hover:bg-white/90"
				>
					{isPending ? (
						<>
							<Icons.spinner className="w-4 h-4 animate-spin mr-2" />
							Accepting...
						</>
					) : (
						<>
							<Icons.check className="w-4 h-4 mr-2" />
							Accept Invitation
						</>
					)}
				</Button>

				<Button
					onClick={handleDecline}
					variant="ghost"
					className="w-full text-white/60 hover:text-white hover:bg-white/5"
					disabled={isPending}
				>
					<Icons.close className="w-4 h-4 mr-2" />
					Decline
				</Button>
			</div>

			<div className="mt-6 pt-4 border-t border-[rgb(28,28,28)]">
				<p className="text-xs text-white/40 text-center">
					This invitation was sent to {invite.email}
				</p>
			</div>
		</div>
	);
}
