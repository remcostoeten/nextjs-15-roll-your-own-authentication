'use client';

import { ConnectedAccounts } from '@/modules/authenticatie/ui/ConnectedAccounts';
import { ProfileForm } from '@/modules/authenticatie/ui/profile-form';
import { Separator } from '@/shared/components/ui/separator';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set your preferences.
          </p>
        </div>
        <Separator />

        {/* Profile Form */}
        <ProfileForm />

        {/* Connected Accounts */}
        <ConnectedAccounts />
      </div>
    </div>
  );
}
