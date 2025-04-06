import { requireAuth } from '@/modules/authentication/utilities/auth'
import { getUserSessionData } from '@/modules/profile/api/queries'
import { UserProfile } from '@/modules/profile/components/user-profile'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'User Profile',
	description: 'Manage your profile settings',
}

export default async function ProfilePage() {
	const user = await requireAuth()
	const sessionData = (await getUserSessionData()) || {
		lastIp: '122.180.178.116',
		signInCount: 3,
		lastSignIn: new Date(),
	}

	return (
		<UserProfile
			user={user}
			sessionData={sessionData}
		/>
	)
}
