'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Icons } from '@/shared/components/ui/icons';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useState, useTransition } from 'react';
import { useAuth } from '../hooks/use-auth';
import { userRepository } from '../repositories/user-repository';

export function ProfileForm() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        if (!user) return;

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const currentPassword = formData.get('current-password') as string;
        const newPassword = formData.get('new-password') as string;

        // Only include password fields if both are provided
        const updateData: any = {
          name,
          email,
        };

        if (currentPassword && newPassword) {
          updateData.currentPassword = currentPassword;
          updateData.newPassword = newPassword;
        }

        await userRepository.update(user.id, updateData);
        setSuccess('Profile updated successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile');
      }
    });
  }

  return (
    <form action={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile information and email settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md dark:bg-green-900/10 dark:text-green-400">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user?.name || ''}
                placeholder="Your name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  name="current-password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  name="new-password"
                  type="password"
                  placeholder="••••••••"
                />
                <p className="text-sm text-muted-foreground">
                  Leave password fields empty to keep your current password
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
