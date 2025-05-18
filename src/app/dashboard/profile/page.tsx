'use client';

import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { updateProfile } from '@/modules/authenticatie/server/mutations/update-profile';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

function UpdateButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
		>
			{pending ? 'Updating...' : 'Update Profile'}
		</button>
	);
}

export default function ProfilePage() {
	const auth = useAuth();
	const router = useRouter();
	const [error, setError] = useState<string>('');
	const formRef = useRef<HTMLFormElement>(null);
	const [showPasswordFields, setShowPasswordFields] = useState(false);

	useEffect(() => {
		if (auth.status === 'unauthenticated') {
			router.replace('/login');
		}
	}, [auth.status, router]);

	if (auth.status === 'loading') {
		return (
			<div className="max-w-2xl mx-auto p-6 animate-pulse">
				<div className="h-8 w-48 bg-gray-200 rounded mb-8" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={`profile-skeleton-${Date.now()}-${i}`}
							className="h-12 bg-gray-200 rounded"
						/>
					))}
				</div>
			</div>
		);
	}

	if (auth.status !== 'authenticated') {
		return null;
	}

	async function handleSubmit(formData: FormData) {
		setError('');
		try {
			await updateProfile(formData);
			router.refresh();
			setShowPasswordFields(false);
			formRef.current?.reset();
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to update profile');
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-lg shadow-md p-6">
					<h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

					<form ref={formRef} action={handleSubmit} className="space-y-4">
						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
								{error}
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email Address
							</label>
							<input
								type="email"
								name="email"
								defaultValue={auth.user.email}
								className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Name
							</label>
							<input
								type="text"
								name="name"
								defaultValue={auth.user.name as string}
								className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Avatar URL
							</label>
							<input
								type="url"
								name="avatar"
								defaultValue={auth.user.avatar as string}
								className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div className="pt-4">
							<button
								type="button"
								onClick={() => setShowPasswordFields(!showPasswordFields)}
								className="text-blue-600 hover:text-blue-800"
							>
								{showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
							</button>
						</div>

						{showPasswordFields && (
							<div className="space-y-4 pt-4 border-t">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Current Password
									</label>
									<input
										type="password"
										name="currentPassword"
										className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										New Password
									</label>
									<input
										type="password"
										name="newPassword"
										className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
						)}

						<div className="pt-6">
							<UpdateButton />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
