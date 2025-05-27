import { ProfileView } from '@/views/dashboard/profile';
import { ProfileViewSkeleton } from '@/views/dashboard/profile/skeleton';
import { Suspense } from 'react';

export default function ProfilePage() {
	return (
		<Suspense fallback={<ProfileViewSkeleton />}>
			<ProfileView />
		</Suspense>
	);
}
