import { createNotification } from '@/modules/notifications/server/mutations/create-notification';

await createNotification({
  type: 'system',
  title: 'Welcome to the platform!',
  message: 'Thank you for joining. Get started by exploring your dashboard.',
  priority: 'medium',
});