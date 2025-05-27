'use client';

import { toast } from '@/shared/components/toast';
import { useEffect, useState } from 'react';
import { generateDiscordAuthUrl } from '../server/mutations/discord-login';
import { unlinkOAuthAccount } from '../server/mutations/unlink-oauth-account';
import { getOAuthAccounts } from '../server/queries/get-oauth-accounts';
import { TOAuthAccount, TOAuthProvider } from '../types/oauth';
import { ConnectedAccountsSkeleton } from './connected-accounts-skeleton';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from 'ui';
import { generateGitHubAuthUrl } from '../server/mutations/github-login';
import { generateGoogleAuthUrl } from '../server/mutations/google-login';
import { SetPasswordForm } from './set-password-form';

export function ConnectedAccounts() {
	const [accounts, setAccounts] = useState<TOAuthAccount[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);

	// Available providers
	const availableProviders: TOAuthProvider[] = ['github', 'google', 'discord'];
	const connectedProviders = accounts.map(account => account.provider);
	const unconnectedProviders = availableProviders.filter(provider => !connectedProviders.includes(provider));

	useEffect(() => {
		async function loadAccounts() {
			try {
				const result = await getOAuthAccounts();
				if (result.success && result.accounts) {
					setAccounts(result.accounts);
				} else {
					toast.error(result.error || 'Failed to load accounts');
				}
			} catch (error) {
				toast.error('Failed to load accounts');
				console.error('Error loading OAuth accounts:', error);
			} finally {
				setIsLoading(false);
			}
		}

		loadAccounts();
	}, []);

	async function handleUnlink(provider: TOAuthProvider) {
		try {
			const result = await unlinkOAuthAccount(provider);

			if (result.success) {
				setAccounts(accounts.filter((account) => account.provider !== provider));
				toast.success('Account unlinked successfully');
			} else if (result.requiresPassword) {
				setShowPasswordDialog(true);
			} else {
				toast.error(result.error || 'Failed to unlink account');
			}
		} catch (error) {
			toast.error('Failed to unlink account');
			console.error('Error unlinking account:', error);
		} finally {
			toast.neutral('Unlinking account...');
		}
	}

	async function handleLink(provider: TOAuthProvider) {
		try {
			toast.neutral(`Connecting to ${provider}...`);

			if (provider === 'google') {
				const url = await generateGoogleAuthUrl('/dashboard');
				window.location.href = url;
			} else if (provider === 'github') {
				const url = await generateGitHubAuthUrl('/dashboard');
				window.location.href = url;
			} else if (provider === 'discord') {
				const url = await generateDiscordAuthUrl('/dashboard');
				window.location.href = url;
			} else {
				toast.error(`Unsupported provider: ${provider}`);
			}
		} catch (error) {
			toast.error('Failed to link account');
			console.error('Error linking account:', error);
		}
	}

	function handlePasswordSet() {
		setShowPasswordDialog(false);
		toast.success('Password set successfully. You can now unlink your OAuth account.');
	}

	if (isLoading) {
		return <ConnectedAccountsSkeleton />;
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Connected Accounts</CardTitle>
					<CardDescription>Manage your connected accounts</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Connected Accounts */}
						{accounts.map((account) => (
							<div
								key={account.id}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div className="flex items-center gap-4">
									{account.provider === 'google' && <GoogleIcon />}
									{account.provider === 'github' && <GithubIcon />}
									{account.provider === 'discord' && <DiscordIcon />}
									<div>
										<p className="font-medium capitalize">
											{account.provider}
										</p>
										<p className="text-xs text-muted-foreground">
											Connected on{' '}
											{new Date(account.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleUnlink(account.provider)}
								>
									Unlink
								</Button>
							</div>
						))}

						{/* Available Providers to Connect */}
						{unconnectedProviders.map((provider) => (
							<div
								key={provider}
								className="flex items-center justify-between rounded-lg border p-4 opacity-60"
							>
								<div className="flex items-center gap-4">
									{provider === 'google' && <GoogleIcon />}
									{provider === 'github' && <GithubIcon />}
									{provider === 'discord' && <DiscordIcon />}
									<div>
										<p className="font-medium capitalize">
											{provider}
										</p>
										<p className="text-xs text-muted-foreground">
											Not connected
										</p>
									</div>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleLink(provider)}
								>
									Connect
								</Button>
							</div>
						))}

						{/* Show message if no providers available */}
						{accounts.length === 0 && unconnectedProviders.length === 0 && (
							<p className="text-sm text-muted-foreground">No OAuth providers available</p>
						)}
					</div>
				</CardContent>
			</Card>

			<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Set a Password</DialogTitle>
						<DialogDescription>
							You need to set a password before unlinking your OAuth account to ensure
							you don't lose access to your account.
						</DialogDescription>
					</DialogHeader>
					<SetPasswordForm onSuccess={handlePasswordSet} />
				</DialogContent>
			</Dialog>
		</>
	);
}


interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
	size?: string | number;
	color?: string;
}

const GoogleIcon: React.FC<SvgIconProps> = ({ size = '24', color = 'currentColor', ...props }) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 48 48"
		width={size}
		height={size}
		fill={color}
		{...props}
	>
		<path
			fill="#FFC107"
			d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
		/>
		{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
		<path
			fill="#FF3D00"
			d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
		></path>
		<path
			fill="#4CAF50"
			d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
		/>
		<path
			fill="#1976D2"
			d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
		/>
	</svg>
);

const GithubIcon: React.FC<SvgIconProps> = ({ size = '24', color = 'currentColor', ...props }) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 496 512"
		width={size}
		height={size}
		fill={color}
		{...props}
	>
		<path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
	</svg>
);

const DiscordIcon: React.FC<SvgIconProps> = ({ size = '24', color = 'currentColor', ...props }) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={size}
		height={size}
		fill={color}
		{...props}
	>
		<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
	</svg>
);
