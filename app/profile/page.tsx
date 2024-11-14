import { getUserData } from '@/app/server/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
	const user = await getUserData()
	
	if (!user) {
		redirect('/login?callbackUrl=/profile')
	}

	return (
		<div className="container max-w-4xl py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Profile</h1>
				<Button asChild>
					<Link href="/profile/edit">Edit Profile</Link>
				</Button>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<Mail className="h-5 w-5 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Email</p>
								<p className="font-medium">{user.email}</p>
							</div>
						</div>
						{user.bio && (
							<div className="flex items-center gap-4">
								<Phone className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Phone</p>
									<p className="font-medium">{user.phoneNumber}</p>
								</div>
							</div>
						)}
						{user.location && (
							<div className="flex items-center gap-4">
								<MapPin className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Location</p>
									<p className="font-medium">{user.location}</p>
								</div>
							</div>
						)}
						{user.website && (
							<div className="flex items-center gap-4">
								<Globe className="h-5 w-5 text-muted-foreground" />
								<div>
									<p className="text-sm text-muted-foreground">Website</p>
									<p className="font-medium">{user.website}</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
