import { redirect } from 'next/navigation';
import { getSession } from '@/modules/authenticatie/helpers/session';
import { db } from 'db';
import { workspaceInvites, workspaces, users } from 'schema';
import { eq, and, isNull } from 'drizzle-orm';
import { InviteAcceptance } from '@/modules/workspaces/ui/invite-acceptance';

interface InvitePageProps {
	params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
	const { token } = await params;
	const session = await getSession();

	// If not logged in, redirect to login with return URL
	if (!session) {
		redirect(`/login?redirect=/invite/${token}`);
	}

	// Get the invite details
	const [invite] = await db
		.select({
			id: workspaceInvites.id,
			email: workspaceInvites.email,
			role: workspaceInvites.role,
			expiresAt: workspaceInvites.expiresAt,
			acceptedAt: workspaceInvites.acceptedAt,
			workspace: {
				id: workspaces.id,
				title: workspaces.title,
				emoji: workspaces.emoji,
				description: workspaces.description,
			},
			inviter: {
				id: users.id,
				name: users.name,
				email: users.email,
			},
		})
		.from(workspaceInvites)
		.innerJoin(workspaces, eq(workspaces.id, workspaceInvites.workspaceId))
		.innerJoin(users, eq(users.id, workspaceInvites.invitedBy))
		.where(eq(workspaceInvites.token, token));

	if (!invite) {
		return (
			<div className="min-h-screen bg-[rgb(8,8,8)] flex items-center justify-center p-4">
				<div className="w-full max-w-md text-center">
					<div className="text-6xl mb-4">❌</div>
					<h1 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h1>
					<p className="text-white/60 mb-6">
						This invitation link is invalid or has been removed.
					</p>
					<a
						href="/dashboard"
						className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
					>
						Go to Dashboard
					</a>
				</div>
			</div>
		);
	}

	// Check if invite has expired
	if (new Date() > invite.expiresAt) {
		return (
			<div className="min-h-screen bg-[rgb(8,8,8)] flex items-center justify-center p-4">
				<div className="w-full max-w-md text-center">
					<div className="text-6xl mb-4">⏰</div>
					<h1 className="text-2xl font-bold text-white mb-2">Invitation Expired</h1>
					<p className="text-white/60 mb-6">
						This invitation has expired. Please ask {invite.inviter.name} to send you a
						new invitation.
					</p>
					<a
						href="/dashboard"
						className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
					>
						Go to Dashboard
					</a>
				</div>
			</div>
		);
	}

	// Check if invite has already been accepted
	if (invite.acceptedAt) {
		return (
			<div className="min-h-screen bg-[rgb(8,8,8)] flex items-center justify-center p-4">
				<div className="w-full max-w-md text-center">
					<div className="text-6xl mb-4">✅</div>
					<h1 className="text-2xl font-bold text-white mb-2">Already Accepted</h1>
					<p className="text-white/60 mb-6">
						You have already accepted this invitation to join {invite.workspace.title}.
					</p>
					<a
						href={`/dashboard?workspace=${invite.workspace.id}`}
						className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
					>
						Go to Workspace
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[rgb(8,8,8)] flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<InviteAcceptance invite={invite} token={token} />
			</div>
		</div>
	);
}
