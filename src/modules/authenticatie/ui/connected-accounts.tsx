'use client';

import { toast } from '@/shared/components/toast';
import { useEffect, useState } from 'react';
import { Button, Icons } from 'ui';
import { unlinkOAuthAccount } from '../server/mutations/unlink-oauth-account';
import { getOAuthAccounts } from '../server/queries/get-oauth-accounts';
import { TOAuthAccount } from '../types/oauth';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';

export function ConnectedAccounts() {
	const [accounts, setAccounts] = useState<TOAuthAccount[]>([]);
	const [isLoading, setIsLoading] = useState(true);

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

	const handleUnlink = async (provider: string) => {
		try {
			const result = await unlinkOAuthAccount(provider as any);
			if (result.success) {
				setAccounts(accounts.filter((account) => account.provider !== provider));
				toast.success('Account unlinked successfully');
			} else {
				toast.error(result.error || 'Failed to unlink account');
			}
		} catch (error) {
			toast.error('Failed to unlink account');
			console.error('Error unlinking account:', error);
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Connected Accounts</CardTitle>
					<CardDescription>Manage your connected accounts</CardDescription>
				</CardHeader>
				<CardContent className="flex items-center justify-center py-6">
					<Icons.spinner className="h-6 w-6 animate-spin" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Connected Accounts</CardTitle>
				<CardDescription>Manage your connected accounts</CardDescription>
			</CardHeader>
			<CardContent>
				{accounts.length === 0 ? (
					<p className="text-sm text-muted-foreground">No connected accounts</p>
				) : (
					<div className="space-y-4">
						{accounts.map((account) => (
							<div key={account.id} className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<Icons.gitHub className="h-6 w-6" />
									<div>
										<p className="font-medium">
											{account.provider.charAt(0).toUpperCase() +
												account.provider.slice(1)}
										</p>
										<p className="text-sm text-muted-foreground">
											Connected{' '}
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
					</div>
				)}
			</CardContent>
		</Card>
	);
}
