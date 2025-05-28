import { ConnectedAccounts } from '@/modules/authenticatie/ui/connected-accounts';
import { ProfileForm } from '@/modules/authenticatie/ui/profile-form';
import { Separator } from 'ui';


export function ProfileView() {
	return (
		<div className="container mx-auto py-10">
			<div className="space-y-6">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Profile</h2>
				</div>
				<Separator />
				<ProfileForm />
				<ConnectedAccounts />
			</div>
		</div>
	);
}
