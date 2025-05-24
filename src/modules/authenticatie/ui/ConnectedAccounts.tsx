'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Icons } from '@/shared/components/ui/icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { userRepository } from '../repositories/user-repository';
import { TOAuthAccount } from '../types/oauth';

export function ConnectedAccounts() {
  const { status, user } = useAuth();
  const [accounts, setAccounts] = useState<TOAuthAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAccounts() {
      if (status === 'authenticated' && user) {
        try {
          const userAccounts = await userRepository.findUserOAuthAccounts(user.id);
          setAccounts(userAccounts);
        } catch (error) {
          console.error('Error loading OAuth accounts:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    loadAccounts();
  }, [status, user]);

  const handleUnlink = async (provider: string) => {
    if (!user) return;

    try {
      await userRepository.unlinkOAuthAccount(user.id, provider as any);
      setAccounts(accounts.filter(account => account.provider !== provider));
    } catch (error) {
      console.error('Error unlinking account:', error);
    }
  };

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>
          Manage your connected accounts and login methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email/Password Account */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
              <Icons.user className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Email & Password</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" disabled>
            Primary
          </Button>
        </div>

        {/* GitHub Account */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
              <Icons.gitHub className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">GitHub</p>
              {accounts.find(a => a.provider === 'github') ? (
                <p className="text-sm text-gray-500">Connected</p>
              ) : (
                <p className="text-sm text-gray-500">Not connected</p>
              )}
            </div>
          </div>
          {accounts.find(a => a.provider === 'github') ? (
            <Button
              variant="ghost"
              onClick={() => handleUnlink('github')}
              className="text-red-500 hover:text-red-600"
            >
              Unlink
            </Button>
          ) : (
            <GitHubLoginButton />
          )}
        </div>

        {/* Add more providers here */}
      </CardContent>
    </Card>
  );
}
