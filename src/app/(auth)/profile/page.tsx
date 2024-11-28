import { getUser } from '@/services/auth'
import ProfileForm from './profile-form'
import ProfileInfo from './profile-info'

export default async function ProfilePage() {
	const user = await getUser()

	if (!user) {
		return <div>Loading...</div>
	}

	return (
		<div className="container max-w-3xl py-8">
			<h1 className="text-3xl font-bold mb-8">Profile</h1>
			<ProfileInfo
				name={user.email}
				role={user.role}
				createdAt={user.createdAt ?? new Date()}
				avatar={null}
			/>
			<ProfileForm
				initialData={{
					...user,
					name: user.email,
					avatar: null,
					createdAt: user.createdAt ?? new Date()
				}}
			/>
		</div>
	)
}
