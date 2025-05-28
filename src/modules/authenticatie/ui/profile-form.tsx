'use client';

import { toast } from '@/shared/components/toast';
import { TBaseUser } from '@/shared/types/base';
import { useState, useTransition } from 'react';
import { useAuth } from '../hooks/use-auth';
import { updateProfile } from '../server/mutations/update-profile';
import { getCurrentUser } from '../server/queries/get-current-user';

import Link from 'next/link';
import {
	Alert, AlertDescription,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Input,
	Label,
} from 'ui';

import { AlertCircle, CheckCircle, Loader2, User } from 'lucide-react';

export function ProfileForm() {
	const auth = useAuth();
	const [isPending, startTransition] = useTransition();
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState({
		current: false,
		new: false
	});

	if (auth.status !== 'authenticated') {
		return null;
	}

	async function onSubmit(formData: FormData) {
		startTransition(async () => {
			try {
				const result = await updateProfile(formData);

				if (result.success) {
					const updatedUser = await getCurrentUser();
					if (updatedUser) {
						auth.updateUser(updatedUser as TBaseUser);
						toast.success('Profile updated successfully');
					} else {
						toast.error('Failed to refresh user data');
					}
					setShowDeleteConfirmation(false);
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'An error occurred');
			}
		});
	}

	// For now, we'll simulate this function since it's not fully implemented
	async function handleDeleteAccount() {
		startTransition(async () => {
			try {
				// Simulate delete
				setTimeout(() => {
					auth.signOut();
					setShowDeleteConfirmation(false);
					toast.success('Account deleted successfully');
				}, 1500);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : 'An error occurred');
			}
		});
	}

	return (
		<>
			<Card className="border border-border/40 shadow-sm scale-in">
				<CardHeader>
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<User className="h-6 w-6 text-primary" />
						</div>
						<div>
							<CardTitle className="text-xl">Profile Information</CardTitle>
							<CardDescription>Update your personal details</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<form action={onSubmit} className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									defaultValue={auth.user.name || ''}
									disabled={isPending}
									className="transition-all focus:border-primary focus:ring-primary"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									defaultValue={auth.user.email}
									disabled={isPending}
									className="transition-all focus:border-primary focus:ring-primary"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<Alert className="bg-secondary/50 border-secondary">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									Leave the password fields empty if you don't want to change your password.
								</AlertDescription>
							</Alert>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="current-password">Current Password</Label>
									<div className="relative">
										<Input
											id="current-password"
											name="current-password"
											type={passwordVisible.current ? "text" : "password"}
											disabled={isPending}
											className="pr-10 transition-all focus:border-primary focus:ring-primary"
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											onClick={() => setPasswordVisible(prev => ({ ...prev, current: !prev.current }))}
										>
											{passwordVisible.current ? (
												<svg xmlns="http://www.w3.org/2000/svg\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round\" className="h-4 w-4">
													<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
													<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
													<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
													<line x1="2" x2="22" y1="2" y2="22"></line>
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
													<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
													<circle cx="12" cy="12" r="3"></circle>
												</svg>
											)}
										</button>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="new-password">New Password</Label>
									<div className="relative">
										<Input
											id="new-password"
											name="new-password"
											type={passwordVisible.new ? "text" : "password"}
											disabled={isPending}
											className="pr-10 transition-all focus:border-primary focus:ring-primary"
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											onClick={() => setPasswordVisible(prev => ({ ...prev, new: !prev.new }))}
										>
											{passwordVisible.new ? (
												<svg xmlns="http://www.w3.org/2000/svg\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round\" className="h-4 w-4">
													<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
													<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
													<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
													<line x1="2" x2="22" y1="2" y2="22"></line>
												</svg>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
													<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
													<circle cx="12" cy="12" r="3"></circle>
												</svg>
											)}
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={isPending}
								className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Updating...
									</>
								) : (
									<>
										<CheckCircle className="mr-2 h-4 w-4" />
										Update Profile
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col items-start gap-4 border-t bg-muted/10 px-6 py-4">
					<div className="text-sm text-muted-foreground">
						<Link
							href="/dashboard/connected-accounts"
							className="text-primary hover:text-primary/90 transition-colors hover:underline"
						>
							Manage connected accounts
						</Link>
					</div>
					<Button
						variant="destructive"
						onClick={() => setShowDeleteConfirmation(true)}
						disabled={isPending}
						className="bg-transparent border border-destructive text-destructive hover:bg-destructive/10"
					>
						Delete Account
					</Button>
				</CardFooter>
			</Card>

			<Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Delete Account</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete your account? This action cannot be
							undone and all your data will be permanently removed.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								This will permanently delete your account, settings, and all personal data.
							</AlertDescription>
						</Alert>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowDeleteConfirmation(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteAccount}
							disabled={isPending}
						>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Delete Account
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
