'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/toast';
import { Separator } from '@/shared/components/ui/separator';
import { For } from '@/shared/components/for';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { saveNotificationPreferences } from '../server/mutations/save-preferences';

function DebugBar({ metrics }: { metrics: Array<{ label: string; value: string | number }> }) {
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        <For each={metrics} role="list" className="flex flex-wrap gap-4 items-center">
          {(metric, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <Separator orientation="vertical" className="h-4 mx-2 bg-blue-300/30" />}
            <div>
              <span className="text-xs text-blue-200 block">{metric.label}</span>
              <span className="text-sm font-medium text-blue-50">{metric.value}</span>
            </div>
          </div>
          )}
        </For>
      </div>
    </div>
  );
}

export function NotificationSettings() {
  const { toast } = useToast();
  const auth = useAuth();
  const [settings, setSettings] = useState({
    taskUpdates: true,
    projectUpdates: true,
    teamMessages: true,
    securityAlerts: true,
  });
  
  const [debugMetrics, setDebugMetrics] = useState<Array<{ label: string; value: string | number }>>([]);
  
  useEffect(() => {
    // Only collect debug metrics in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      setDebugMetrics([
        { label: 'User Role', value: auth.user?.role || 'Guest' },
        { label: 'Notification Types', value: Object.keys(settings).length },
        { label: 'Environment', value: process.env.NODE_ENV || 'development' }
      ]);
    }
  }, [settings, auth.user]);

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
        toast({
          title: 'Settings saved',
          message: 'Your notification preferences have been updated.',
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          message: result.error || 'Failed to save preferences',
          type: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        message: 'An unexpected error occurred',
        type: 'error',
      });
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
            <h3 className="text-sm font-medium">Notification Types</h3>
            <div className="space-y-3">
              {[
                { id: 'taskUpdates', label: 'Task Updates' },
                { id: 'projectUpdates', label: 'Project Updates' },
                { id: 'teamMessages', label: 'Team Messages' },
                { id: 'securityAlerts', label: 'Security Alerts' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center justify-between">
                  <Label htmlFor={id} className="flex-1">
                    {label}
                  </Label>
                  <Switch
                    id={id}
                    checked={settings[id as keyof typeof settings]}
                    onCheckedChange={() => handleToggle(id as keyof typeof settings)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave}>Save Preferences</Button>
        </CardContent>
      </Card>
    </>
  );
}
