'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { toast } from '@/shared/components/ui/toast';
import { AlertTriangle, Link, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

function useFormStatus() {
	const [pending, setPending] = useState(false);

	const simulateSubmit = () => {
		setPending(true);
		setTimeout(() => setPending(false), 2000);
	};

	return { pending, simulateSubmit };
}

function UpdateButton({ onClick }: { onClick: () => void }) {
	const { pending } = useFormStatus();

	return (
		<Button onClick={onClick} disabled={pending}>
			{pending ? (
				<>
					<Loader2 className="w-4 h-4 mr-2 animate-custom-spin" />
					<span>Updating...</span>
				</>
			) : (
				'Update'
			)}
		</Button>
	);
}

function ProfilePage() {
	const [error, setError] = useState<string>('');
	const formRef = useRef<HTMLFormElement>(null);
	const [showPasswordFields, setShowPasswordFields] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [loadingState, setLoadingState] = useState<
		'loading' | 'authenticated' | 'unauthenticated'
	>('authenticated');
	const { simulateSubmit } = useFormStatus();
	const auth = useAuth();

	if (auth.status === 'loading') {
		return (
			<div className="max-w-2xl mx-auto p-6 animate-pulse">
				<div className="h-8 w-48 bg-gray-200 rounded-md mb-8" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={`profile-skeleton-${i}`}
							className="h-12 bg-gray-200 rounded-md"
						/>
					))}
				</div>
			</div>
		);
	}

	if (auth.status === 'unauthenticated') {
		return (
			<div>
				Please <Link href="/login">log in</Link> to view your profile.
			</div>
		);
	}

	const user = auth.user;

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError('');
		try {
			simulateSubmit();
			setTimeout(() => {
				setShowPasswordFields(false);
				formRef.current?.reset();
			}, 2000);
			toast.success('Profile updated successfully');
		} catch (e) {
			setError('Failed to update profile');
			toast.error('Failed to update profile');
		}
	}

	const handleDeleteAccount = () => {
		simulateSubmit();
		setTimeout(() => {
			setShowDeleteConfirm(false);
			setLoadingState('unauthenticated');
		}, 2000);
	};

	return (
		<div className="min-h-screen  py-12 px-4 sm:px-6">
			<div className="max-w-2xl mx-auto">
				<div className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
					<div className=" px-6 py-4 border-b ">
						<h1 className="text-2xl font-bold ">Profile Settings</h1>
						<p className="text-sm mt-1">Update your personal information</p>
					</div>

					<div className="p-6">
						<form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
							{error && (
								<div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-fadeIn">
									<div className="flex">
										<div className="ml-3">
											<p className="text-sm">{error}</p>
										</div>
									</div>
								</div>
							)}

							<div className="space-y-6">
								<div className="flex items-center space-x-4 mb-6">
									<div className="relative">
										<img
											src={user.avatar ?? '/default-avatar.png'}
											alt="Profile"
											className="w-16 h-16 rounded-full object-cover border-2 border-border transition-all duration-300 "
										/>
										<div className="absolute -bottom-1 -right-1  p-1 rounded-full shadow-md">
											<div className="w-5 h-5  rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition-colors">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="white"
													className="w-3 h-3"
												>
													<path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
													<path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
												</svg>
											</div>
										</div>
									</div>
									<div>
										<h2 className="text-lg font-medium text-gray-900">
											{user.name ?? ''}
										</h2>
										<p className="text-sm text-gray-500">{user.email}</p>
									</div>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Email Address
									</label>
									<input
										id="email"
										type="email"
										name="email"
										defaultValue={user.email}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
									/>
								</div>

								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Name
									</label>
									<input
										id="name"
										type="text"
										name="name"
										defaultValue={user.name ?? ''}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
									/>
								</div>

								<div>
									<label
										htmlFor="avatar"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Avatar URL
									</label>
									<input
										id="avatar"
										type="url"
										name="avatar"
										defaultValue={user.avatar ?? ''}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
									/>
								</div>

								<div className="pt-4">
									<Button
										type="button"
										onClick={() => setShowPasswordFields(!showPasswordFields)}
									>
										{showPasswordFields
											? 'Cancel Password Change'
											: 'Change Password'}
									</Button>
								</div>

								{showPasswordFields && (
									<div className="space-y-4 pt-4 border-t  animate-slideDown">
										<div>
											<Label
												htmlFor="currentPassword"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												Current Password
											</Label>
											<Input
												id="currentPassword"
												type="password"
												name="currentPassword"
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
											/>
										</div>

										<div>
											<label
												htmlFor="newPassword"
												className="block text-sm font-medium text-gray-700 mb-1"
											>
												New Password
											</label>
											<input
												id="newPassword"
												type="password"
												name="newPassword"
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
											/>
											<div className="mt-1">
												<div className="flex items-center mt-2">
													<div className="w-1/4 h-1 rounded-full bg-red-500"></div>
													<div className="w-1/4 h-1 rounded-full bg-gray-200 ml-1"></div>
													<div className="w-1/4 h-1 rounded-full bg-gray-200 ml-1"></div>
													<div className="w-1/4 h-1 rounded-full bg-gray-200 ml-1"></div>
												</div>
												<p className="text-xs text-gray-500 mt-1">
													Password strength: Weak
												</p>
											</div>
										</div>
									</div>
								)}
							</div>

							<div className="pt-6 flex justify-end">
								<UpdateButton
									onClick={() =>
										handleSubmit(
											new Event(
												'submit'
											) as unknown as React.FormEvent<HTMLFormElement>
										)
									}
								/>
							</div>
						</form>

						<div className="mt-12 border-t border-red-200 pt-8">
							<div className="rounded-lg bg-red-50 p-6">
								<h2 className="flex items-center text-lg font-semibold text-red-800 mb-4">
									<AlertTriangle className="w-5 h-5 mr-2" />
									Danger Zone
								</h2>
								<p className="text-sm text-red-600 mb-4">
									Once you delete your account, there is no going back. Please be
									certain.
								</p>

								{!showDeleteConfirm ? (
									<button
										onClick={() => setShowDeleteConfirm(true)}
										className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
									>
										Delete Account
									</button>
								) : (
									<div className="animate-fadeIn">
										<p className="text-sm font-medium text-red-800 mb-3">
											Are you absolutely sure you want to delete your account?
										</p>
										<div className="flex space-x-3">
											<button
												onClick={handleDeleteAccount}
												className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
											>
												Yes, delete my account
											</button>
											<button
												onClick={() => setShowDeleteConfirm(false)}
												className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
											>
												Cancel
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 text-center text-sm text-gray-500">
					Need help?{' '}
					<a href="#" className="text-indigo-600 hover:text-indigo-500">
						Contact support
					</a>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
