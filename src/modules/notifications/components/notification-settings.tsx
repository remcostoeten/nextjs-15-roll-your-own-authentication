'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { For } from '@/shared/components/for';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { getNotificationPreferences } from '../server/queries/get-notification-preferences';
import { toast } from '@/shared/components/toast';
import { TNotificationPreferencesInput } from '../types';
import { saveNotificationPreferences } from '../server/mutations/save-notification-preferences';

type TProps = {
  metrics: Array<{ label: string; value: string | number }>;
};

export function DebugBar({ metrics }: TProps) {
  if (process.env.NODE_ENV === 'production') return null;

  return (
     <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
      <For
        each={metrics}
        keyExtractor={(m) => m.label}
        role="list"
        className="flex flex-wrap gap-4 items-center"
      >
        {(metric, index) => (
          <div className="flex items-center">
            {index > 0 && (
              <Separator orientation="vertical" className="h-4 mx-2 bg-blue-300/30" />
            )}
            <div>
              <span className="text-xs text-blue-200 block">{metric.label}</span>
              <span className="text-sm font-medium text-blue-50">{metric.value}</span>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

export function NotificationSettings() {
  const auth = useAuth();
  const [settings, setSettings] = useState<TNotificationPreferencesInput>({
    taskUpdates: true,
    projectUpdates: true,
    teamMessages: true,
    securityAlerts: true,
    workspaceInvites: true,
    mentions: true,
    comments: true,
    fileShares: true,
    systemNotifications: true,
    emailNotifications: false,
    pushNotifications: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [debugMetrics, setDebugMetrics] = useState<Array<{ label: string; value: string | number }>>([]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferences = await getNotificationPreferences();
        if (preferences) {
          setSettings({
            taskUpdates: preferences.taskUpdates,
            projectUpdates: preferences.projectUpdates,
            teamMessages: preferences.teamMessages,
            securityAlerts: preferences.securityAlerts,
            workspaceInvites: preferences.workspaceInvites,
            mentions: preferences.mentions,
            comments: preferences.comments,
            fileShares: preferences.fileShares,
            systemNotifications: preferences.systemNotifications,
            emailNotifications: preferences.emailNotifications,
            pushNotifications: preferences.pushNotifications,
          });
        }
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setDebugMetrics([
        { label: 'User Role', value: auth.status === 'authenticated' ? auth.user?.role || 'Guest' : 'Guest' },
        { label: 'Notification Types', value: Object.keys(settings).length },
        { label: 'Environment', value: process.env.NODE_ENV || 'development' }
      ]);
    }
  }, [settings, auth]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      const result = await saveNotificationPreferences(settings);

      if (result.success) {
        toast.success('Your notification preferences have been updated.');
      } else {
        toast.error(result.error || 'Failed to save preferences');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <>
      <DebugBar metrics={debugMetrics} />
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Customize when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Workspace Notifications</h3>
            <div className="space-y-3">
              {[
                { id: 'taskUpdates', label: 'Task Updates', description: 'Get notified when tasks are assigned or updated' },
                { id: 'projectUpdates', label: 'Project Updates', description: 'Notifications about project changes' },
                { id: 'teamMessages', label: 'Team Messages', description: 'Direct messages and team communications' },
                { id: 'workspaceInvites', label: 'Workspace Invites', description: 'Invitations to join workspaces' },
                { id: 'mentions', label: 'Mentions', description: 'When someone mentions you' },
                { id: 'comments', label: 'Comments', description: 'Comments on your work or discussions' },
                { id: 'fileShares', label: 'File Shares', description: 'When files are shared with you' },
              ].map(({ id, label, description }) => (
                <div key={id} className="flex items-start justify-between py-2">
                  <div className="flex-1">
                    <Label htmlFor={id} className="text-sm font-medium">
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  </div>
                  <Switch
                    id={id}
                    checked={settings[id as keyof typeof settings] ?? false}
                    onCheckedChange={() => handleToggle(id as keyof typeof settings)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">System & Security</h3>
            <div className="space-y-3">
              {[
                { id: 'securityAlerts', label: 'Security Alerts', description: 'Important security notifications' },
                { id: 'systemNotifications', label: 'System Notifications', description: 'Platform updates and announcements' },
              ].map(({ id, label, description }) => (
                <div key={id} className="flex items-start justify-between py-2">
                  <div className="flex-1">
                    <Label htmlFor={id} className="text-sm font-medium">
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  </div>
                  <Switch
                    id={id}
                    checked={settings[id as keyof typeof settings] ?? false}
                    onCheckedChange={() => handleToggle(id as keyof typeof settings)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Delivery Methods</h3>
            <div className="space-y-3">
              {[
                { id: 'pushNotifications', label: 'Push Notifications', description: 'Browser and mobile push notifications' },
                { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
              ].map(({ id, label, description }) => (
                <div key={id} className="flex items-start justify-between py-2">
                  <div className="flex-1">
                    <Label htmlFor={id} className="text-sm font-medium">
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                  </div>
                  <Switch
                    id={id}
                    checked={settings[id as keyof typeof settings] ?? false}
                    onCheckedChange={() => handleToggle(id as keyof typeof settings)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
